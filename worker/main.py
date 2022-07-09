import pika
import json
import time
import psycopg2
from dotenv import load_dotenv
import os

def process_py(code, tests):
    print(code)

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
    cursor.execute('SELECT * FROM "Submission" WHERE id='+str(id))
    d = cursor.fetchone()
    return {
        'sourcecode': d[3],
        'lang': d[4]
    }

def callback(ch, method, properties, body):
    data = json.loads(body)
    print(f" [x] Processing submission with id {data['submissionId']}")

    print(f" > Fetching data from database")
    submission = get_submission_data(data['submissionId'])
    print(f" > Processing code in {submission['lang']}")
    time.sleep(10)
    print(" > Code has been processed")


channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='task_submission',
                      auto_ack=True,
                      on_message_callback=callback)

print("Worker is now online")
channel.start_consuming()