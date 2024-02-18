export interface MessageBroker {
    send(queue: string, message: string): Promise<void>;
}