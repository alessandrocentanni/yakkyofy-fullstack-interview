export interface MessageBrokerWrapper{
    send(queue: string, message: string): void;
}