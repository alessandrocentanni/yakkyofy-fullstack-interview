import {MessageBroker} from "../../interfaces/message-broker";
import {MessageBrokerWrapper} from "../../interfaces/message-broker-wrapper";


export class RabbitMQMessageBroker implements MessageBroker {
    private publisher: MessageBrokerWrapper;
    constructor(publisher: MessageBrokerWrapper){
        this.publisher = publisher;
    }

    async send(queue: string, message: string): Promise<void> {
        let data = await this.publisher.send(queue, message);
        console.log("Data posted ", data);
    }
}