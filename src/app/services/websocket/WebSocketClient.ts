import { IWebSocketMessage, WebSocketMessage } from './WebSocketMessage';
import { WebSocketRequest, WebSocketRequestOptions } from './WebSocketRequest';
import * as Rx from 'rxjs';

export abstract class WebSocketClient {

    protected channel: string;
    protected url: string;
    protected webSocket: WebSocket;
    protected messageBuffer: { [id: string]: WebSocketRequest } = {};
    protected reconnectTimeout;

    public messages: Rx.Subject<IWebSocketMessage>;

    public onOpened: () => void;

    protected constructor(channel: string, url: string) {
        this.channel = channel;
        this.url = url;
        this.messages = new Rx.Subject<IWebSocketMessage>();
    }

    public matchUrl(url: string): boolean {
        return this.url.includes(url);
    }

    public connect(): void {
        this.webSocket = new WebSocket(this.url);
        this.webSocket.addEventListener('open', (e) => this.onOpen(e));
        this.webSocket.addEventListener('close', (e) => this.onClose(e));
        this.webSocket.addEventListener('error', (e) => this.onError(e));
        this.webSocket.addEventListener('message', (e) => this.dispatch(e));
    }

    public disconnect(): void {

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.webSocket) {
            this.webSocket.removeEventListener('open', (e) => this.onOpen(e));
            this.webSocket.removeEventListener('close', (e) => this.onClose(e));
            this.webSocket.removeEventListener('error', (e) => this.onError(e));
            this.webSocket.removeEventListener('message', (e) => this.dispatch(e));

            this.webSocket.close();
        }
    }

    public ping(channel?: string): void {
        let message: WSMessagePing = new WSMessagePing();
        message.message_channel = channel || this.channel;
        this.send(message);
    }

    public send(message: IWebSocketMessage): void {
        if (this.isOpen()) {
            if (!message.message_channel) {
                message.message_channel = this.channel;
            }
            this.webSocket.send(message.stringify());
        } else {
            console.warn('WebSocketClient::send - Attempt to send data to closed WebSocket');
        }
    }

    public sendWithResponse(message: IWebSocketMessage, options?: WebSocketRequestOptions): Promise<WebSocketMessage> {
        let request: WebSocketRequest = new WebSocketRequest(this, message, options);
        this.messageBuffer[message.message_id] = request;
        request.onCompleted((id: string) => {
            delete this.messageBuffer[message.message_id];
        });
        return request.send();
    }

    public isOpen(): boolean {
        return this.webSocket && this.webSocket.readyState === WebSocket.OPEN;
    }

    protected onOpen(event) {
        if (this.onOpened) {
            this.onOpened();
        }
    }

    protected onError(event) {}

    protected onClose(event) {
        this.reconnectAfterTimeout();
    }

    protected dispatch(event): void {
        try {
            let message: WebSocketMessage = new WebSocketMessage(JSON.parse(event.data));

            if (this.messageBuffer.hasOwnProperty(message.message_id)) {
                this.messageBuffer[message.message_id].resolve(message);
            } else {
                this.onMessage(message);
                this.messages.next(message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    protected reconnectAfterTimeout(): void {

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        this.reconnectTimeout = setTimeout(() => {
            this.connect();
        }, 5000);
    }

    protected abstract onMessage(message: WebSocketMessage);
}

export class WSMessagePing extends WebSocketMessage {
    constructor() {
        super('ping');
    }
}
