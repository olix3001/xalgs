import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib/callback_api';

const QUEUE_NAME = 'task_submission';

@Injectable()
export class TaskQueueService implements OnModuleInit, OnModuleDestroy {
  private channel;
  private connection;

  onModuleInit(): void {
    // create new MQTT queue
    amqp.connect(
      `amqp://${process.env.MQTT_USER}:${process.env.MQTT_PASS}@${process.env.MQTT_HOST}:${process.env.MQTT_PORT}/`,
      (error0, connection) => {
        if (error0) {
          throw error0;
        }

        this.connection = connection;

        // create communication channel
        connection.createChannel((error1, channel) => {
          if (error1) {
            throw error1;
          }

          channel.assertQueue(QUEUE_NAME, {
            durable: false,
          });

          this.channel = channel;
        });
      },
    );
  }

  onModuleDestroy(): void {
    this.connection.close();
  }

  //registerQueues() {}

  submitTask(taskId: number, submissionId: number): boolean {
    try {
      this.channel.sendToQueue(
        QUEUE_NAME,
        Buffer.from(
          JSON.stringify({
            taskId,
            submissionId,
          }),
        ),
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
