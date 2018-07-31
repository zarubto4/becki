import { IWebSocketMessage, WebSocketMessage } from './WebSocketMessage';
import { WebSocketClient } from './WebSocketClient';

export interface WebSocketRequestOptions {
    delay?: number;
    tries?: number;
    timeout?: number;
}

export class WebSocketRequest {

    protected client: WebSocketClient;
    protected message: IWebSocketMessage;

    protected delay: number = 0;
    protected tries: number = 3;
    protected timeout: number = 5000;

    protected resolveCallback: (message: WebSocketMessage) => void;
    protected catchCallback: (reason) => void;
    protected completedCallback: (id: string) => void;

    protected timeoutTimer;

    constructor(client: WebSocketClient, message: IWebSocketMessage, options?: WebSocketRequestOptions) {
        this.client = client;
        this.message = message;

        if (options) {
            if (options.delay) {
                this.delay = options.delay;
            }

            if (options.tries) {
                this.tries = options.tries;
            }

            if (options.timeout) {
                this.timeout = options.timeout;
            }
        }
    }

    public onCompleted(callback: (id: string) => void): void {
        this.completedCallback = callback;
    }

    public send(): Promise<WebSocketMessage> {
        return new Promise<WebSocketMessage>((resolve1, reject1) => {
            this.resolveCallback = resolve1;
            this.catchCallback = reject1;

            if (this.delay > 0) {
                setTimeout(() => {
                    this.doSend();
                }, this.delay);
            } else {
                this.doSend();
            }
        });
    }

    public resolve(response: WebSocketMessage) {
        if (this.completedCallback) {
            this.completedCallback(this.message.message_id);
        }
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }
        if (this.resolveCallback) {
            this.resolveCallback(response);
        }
    }

    public reject(reason) {
        if (this.completedCallback) {
            this.completedCallback(this.message.message_id);
        }
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }
        if (this.catchCallback) {
            this.catchCallback(reason);
        }
    }

    protected doSend() {
        if (this.tries > 0) {
            this.tries--;

            this.timeoutTimer = setTimeout(() => {
                this.doSend();
            }, this.timeout);

            this.client.send(this.message);
        } else {
            this.reject('timeout');
        }
    }
}
