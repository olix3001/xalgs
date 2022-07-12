import math
import shutil
import pika
import json
import psycopg2
from dotenv import load_dotenv
import os

from python_processor import PythonProcessor

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

def add_result(submissionid, tid, success, time, memory, error=""):
    S = 'TRUE' if success else 'FALSE'
    QUERY = f'''INSERT INTO "TestResult" ("testId", "submissionId", success, "errorMessage", "executionTime", memory) VALUES ({str(tid)}, {str(submissionid)}, {S}, '{error}', {str(math.floor(time))}, {str(math.floor(memory))});'''
    cursor = conn.cursor()
    cursor.execute(QUERY)
    conn.commit()
    cursor.close()
    print('   > Test result has been added to the database')

def get_submission_data(id):
    cursor = conn.cursor()
    cursor.execute('SELECT code, lang, "taskId" FROM "Submission" WHERE id='+str(id))
    d = cursor.fetchone()
    cursor.close()
    return {
        'sourcecode': d[0],
        'lang': d[1],
        'taskid': d[2]
    }

def fetch_tests(id, datadir):
    cursor = conn.cursor()
    cursor.execute('SELECT id, "isGenerator", "generatorLang", "generatorCode", content, "expectedOut" FROM "Test" WHERE "taskId"='+str(id))
    d = cursor.fetchall()
    cursor.close()
    i=0
    idmap = {}
    for t in d:
        idmap[i] = t[0]
        with open(f'{datadir}/test-{i}.desc', 'w') as f:
            f.write(json.dumps({'isGen': t[1], 'genLang': t[2], 'genCode': t[3]}))
        with open(f'{datadir}/test-{i}.i', 'w') as f:
            f.write(t[4])
        with open(f'{datadir}/test-{i}.eo', 'w') as f:
            f.write(t[5])
        i += 1
    return (len(d), idmap)

def set_tested(submissionId, success):
    cursor = conn.cursor()
    cursor.execute(f'UPDATE "Submission" SET "isSuccess" = {"TRUE" if success else "FALSE"}, "isTested" = TRUE WHERE id={str(submissionId)}')
    conn.commit()
    cursor.close()

# ----< LANGUAGE DEFINITIONS >---- #
LANGS = {
    'Python': PythonProcessor(add_result),
}
# ----< LANGUAGE DEFINITIONS >---- #

def callback(ch, method, properties, body):
    data = json.loads(body)
    timeLimit = int(data['timeLimit'])
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

    (tc, idmap) = fetch_tests(int(submission['taskid']), datadir)
    
    if not submission['lang'] in LANGS:
        print(" > Could not find language")
        return
    fullTestResult = LANGS[submission['lang']].process(int(data['submissionId']), tc, timeLimit, idmap)

    print(" > Code has been processed. Cleaning up")
    shutil.rmtree(datadir)
    set_tested(int(data['submissionId']), fullTestResult)
    print(" > Waiting for next submission")


channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='task_submission',
                      auto_ack=True,
                      on_message_callback=callback)

print("Worker is now online")
channel.start_consuming()