import { WebSocketClient } from './WebSocketClient';
import { IWebSocketMessage, WebSocketMessage } from './WebSocketMessage';
import { ModelChangeStatus, OnlineChangeStatus, TyrionApiBackend } from '../../backend/BeckiBackend';
import { INotification, IWebSocketToken } from '../../backend/TyrionAPI';

export class WebSocketClientTyrion extends WebSocketClient {

    public static readonly CHANNEL: string = 'becki';

    protected backend: TyrionApiBackend;
    protected baseUrl: string;

    protected pingInterval;

    constructor(backend: TyrionApiBackend, url: string) {
        super(WebSocketClientTyrion.CHANNEL, '');
        this.baseUrl = url;
        this.backend = backend;
    }

    public connect(): void {
        this.backend.websocketGetAccessToken()
            .then((token: IWebSocketToken) => {
                this.url = this.baseUrl + token.websocket_token;
                super.connect();
            })
            .catch((reason) => {
                console.error(reason);
                this.reconnectAfterTimeout();
            });
    }

    public disconnect(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        super.disconnect();
    }

    protected onOpen(event): void {
        super.onOpen(event);
        this.requestNotificationsSubscribe()
            .then((message: IWebSocketMessage) => {
                if (!message.isSuccessful()) {
                    console.error('WebSocketClientTyrion::onOpen - notification subscription failed');
                }
            })
            .catch((reason) => {
                // TODO maybe reconnect?
            });

        this.pingInterval = setInterval(() => {
            this.ping();
        }, 25000);
    }

    protected onClose(event): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
        }
        super.onClose(event);
    }

    protected onMessage(message: WebSocketMessage): void {

        if (message.message_type === 'ping') {
            message.status = 'success';
            this.send(message);
        }

        if (message.message_type === 'online_status_change') {

            let status: OnlineChangeStatus = {
                model: message.data['model'],
                model_id: message.data['model_id'],
                online_state: message.data['online_state']
            };

            this.backend.onlineStatus.next(status);
        }

        if (message.message_type === 'becki_object_update') {

            let status: ModelChangeStatus = {
                model: message.data['model'],
                model_id: message.data['model_id'],
            };

            this.backend.objectUpdateTyrionEcho.next(status);

        }

        if (message.message_type === 'notification') {

            let notification: IWebSocketNotification = message.data as IWebSocketNotification;
            this.backend.notificationReceived.next(notification);
        }
    }

    /********************************************
     *                                          *
     *  PREDEFINED REQUESTS                     *
     *                                          *
     ********************************************/

    public requestNotificationsSubscribe(): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new WSMessageSubscribeNotification(), { timeout: 5000 });
    }

    public requestNotificationsUnsubscribe(): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new WSMessageUnsubscribeNotification(), { timeout: 5000 });
    }
}

/********************************************
 *                                          *
 *  PREDEFINED MESSAGES                     *
 *                                          *
 ********************************************/

export interface IWebSocketNotification extends WebSocketMessage, INotification {
    state: ('CREATED' | 'UPDATED' | 'CONFIRMED' | 'DELETED');
}

export class WSMessageSubscribeNotification extends WebSocketMessage {
    constructor() {
        super('subscribe_notification');
    }
}

export class WSMessageUnsubscribeNotification extends WebSocketMessage {
    constructor() {
        super('unsubscribe_notification');
    }
}
