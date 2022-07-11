import pika
import json
import time
import psycopg2
from dotenv import load_dotenv
import os

def process_py(tid, tc, tl):
    print(f' > Generating python processor')
    c=f'''
mkdir -p ./results
ti=0
while [ $ti -lt {str(tc)} ]
do 
   ts=$(date +%s.%6N)
   timeout {tl} python3 ./data/code.f < ./data/test-$ti.i > ./results/test-$ti.o
   STATUS=$?
   te=$(date +%s.%6N)
   if test $STATUS -eq 143
   then
	   echo "+TIMEOUT-$1" >> ./results/test-$ti.o
   fi
   elapsed=$(echo "scale=6; $te - $ts" | bc)
   echo "+$elapsed" >> ./results/test-$ti.o
   true $(( ti++ ))
done
'''
    with open(f'{str(tid)}.sh', 'w') as f:
        f.write(c)
    print(c)
    print(' > Testing...')
    os.system(f'sh createJail.sh {str(tid)}')

    # temporary
    l_files = os.listdir('./' + str(tid) + '-results')
    print(list(l_files))
    for cf in list(l_files):
        with open('./' + str(tid) + f'-results/{cf}', 'r') as f:
            print(cf + ':')
            print(f.read())



LANGS = {
    'Python': process_py
}

load_dotenv()
credentials = pika.PlainCredentials(os.environ["MQTT_USER"], os.environ['MQTT_PASS'])
connection = pika.BlockingConnection(pika.ConnectionParameters(os.environ['MQTT_HOST'], os.environ['MQTT_PORT'], '/', credentials))
channel = connection.channel()

channel.queue_declare(queue='task_submission')

conn = psycopg2.connect(database="xalgs",
                        host=os.environ["DB_HOST"],
                        user=os.environ["DB_USER"],
                        password=os.environ["DB_PASS"],
                        port=os.environ["DB_PORT"])

def get_submission_data(id):
    cursor = conn.cursor()
    cursor.execute('SELECT code, lang, "taskId" FROM "Submission" WHERE id='+str(id))
    d = cursor.fetchone()
    return {
        'sourcecode': d[0],
        'lang': d[1],
        'taskid': d[2]
    }

def fetch_tests(id, datadir):
    cursor = conn.cursor()
    cursor.execute('SELECT id, "isGenerator", "generatorLang", "generatorCode", content, "expectedOut" FROM "Test" WHERE "taskId"='+str(id))
    d = cursor.fetchall()
    i=0
    for t in d:
        with open(f'{datadir}/test-{i}.desc', 'w') as f:
            f.write(json.dumps({'isGen': t[1], 'genLang': t[2], 'genCode': t[3]}))
        with open(f'{datadir}/test-{i}.i', 'w') as f:
            f.write(t[4])
        with open(f'{datadir}/test-{i}.eo', 'w') as f:
            f.write(t[5])
        i += 1
    return len(d)

def callback(ch, method, properties, body):
    data = json.loads(body)
    timeLimit = data['timeLimit']
    print(f" [x] Processing submission with id {data['submissionId']}")

    print(f" > Fetching data from database")
    submission = get_submission_data(data['submissionId'])
    print(f" > Processing code in {submission['lang']}")

    # create data directory
    datadir = f'./{data["submissionId"]}-data'
    os.mkdir(datadir)
    # create source code file
    with open(f'{datadir}/code.f', 'w') as f:
        f.write(submission['sourcecode'])

    tc = fetch_tests(int(submission['taskid']), datadir)
    
    LANGS[submission['lang']](int(data['submissionId']), tc, timeLimit)

    print(" > Code has been processed")


channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='task_submission',
                      auto_ack=True,
                      on_message_callback=callback)

print("Worker is now online")
channel.start_consuming()