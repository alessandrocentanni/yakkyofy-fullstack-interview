import { Connection } from 'rabbitmq-client';
import config from './config';

const rabbit = new Connection(config.RABBIT_MQ);

rabbit.on('error', err => console.error('RabbitMQ connection error', err));
rabbit.on('connection', () => console.info('RabbitMQ Connection successfully (re)established consumer'));

// @ts-ignore
export function createRabbitMQConsumer(callback) {
    const subscriber = rabbit.createConsumer({
        queue: 'screenshot',
        queueOptions: { durable: true },
    }, callback);

    subscriber.on('error', err => console.error('consumer error (saturation)', err));

    return subscriber;
}

export async function closeRabbitMQConnection() {
    await rabbit.close();
    console.info("RabbitMQ connection closed");
}