import datetime
import math
import shutil
import pika
import json
import psycopg2
from dotenv import load_dotenv
import os

def compare(baseline, newestFile):
    af = open(baseline)
    bf = open(newestFile)

    lines1 = list(map(lambda e: e.replace('\n', ''), af.readlines()))
    lines2 = list(map(lambda e: e.replace('\n', ''), bf.readlines()))

    af.close()
    bf.close()
    return lines1 == lines2

def process_py(sid, tc, tl, idmap):
    # for each test
    for ti in range(tc):
        tid = str(sid) + "-" + str(ti)
        datadir = f'./{str(sid)}-data'
        print(f'  > Running test {ti}')
        # copy input
        print(f'   > Copying test input and code')
        os.mkdir(f'{tid}-files')
        os.rename(f'{datadir}/test-{str(ti)}.i', f'./{tid}-files/test.i')

        shutil.copyfile(f'{datadir}/code.f', f'./{tid}-files/code.py')
        # run test
        print(f'   > Running program')
        os.system(f'sh ./createJail.sh {tid}')
        starttime = datetime.datetime.now()
        os.system(f'cd jail-submission-{tid} && timeout {str(tl)} python3 code.py < ./test.i > ./test.o')
        endtime = datetime.datetime.now()
        os.system(f'sh ./exitJail.sh {tid}')

        exec_time = (endtime - starttime).total_seconds() * 1000
        if exec_time >= tl*1000:
            print(f'   > test {str(ti)} timeout after {exec_time}ms')
            add_result(sid, idmap[ti], False, exec_time, 0, "TIMEOUT")
            continue

        if compare(f'./test-{tid}.o', f'{datadir}/test-{str(ti)}.eo'):
            print(f'   > test {str(ti)} passed successfully in {exec_time}ms')
            add_result(sid, idmap[ti], True, exec_time, 0)
        else:
            print(f'   > test {str(ti)} failed after {exec_time}ms')
            add_result(sid, idmap[ti], False, exec_time, 0, "WRONG ANSWER")


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
    
    LANGS[submission['lang']](int(data['submissionId']), tc, timeLimit, idmap)

    print(" > Code has been processed")


channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='task_submission',
                      auto_ack=True,
                      on_message_callback=callback)

print("Worker is now online")
channel.start_consuming()