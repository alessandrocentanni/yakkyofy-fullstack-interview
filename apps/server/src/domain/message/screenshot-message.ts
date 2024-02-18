import {ScreenshotMessage} from "../interfaces/message/message";
import {RabbitMQMessageBroker} from "../../messageQueue/messageBroker/rabbitMQ/rabbitmq";

export class ScreenshotMessageImpl implements ScreenshotMessage{
    constructor(private messageBroker: RabbitMQMessageBroker) {
    }

    async publishScreenshot(id: string): Promise<any> {
        return this.messageBroker.send('screenshot', id);
    }
}