import { IndividualWebSocketOutComingMessage, WebsocketClientAbstract } from './Websocket_Client_Abstract';
import { ModelChangeStatus, OnlineChangeStatus, TyrionApiBackend } from '../../backend/BeckiBackend';
import { WebsocketMessage } from './WebsocketMessage';
import { INotification, IWebSocketToken } from '../../backend/TyrionAPI';


export class WebsocketClientTyrion extends WebsocketClientAbstract {

    public constructor(protected backend: TyrionApiBackend, public websocketUrl: string, public wss: boolean = false) {

        super(websocketUrl, wss);

        super.onMessageCallback = (m: WebsocketMessage) => this.onMessageReceive(m);
        super.onOpenCallback = (e) => {
            this.requestNotificationsSubscribe( (response: WebsocketMessage, error: any) => {

                if (response && response.status === 'success') {
                    // Nothing
                }else {
                    console.error('WebsocketClientTyrion: requestNotificationsSubscribe:: ERRTOR: ',  error);
                }

            });
        };

        super.onError = (e: any) => this.onErrorOrClose(e);
    }

    public onReady() {
        console.log('WebsocketClientTyrion: onReady:: ');
        this.backend.websocketGetAccessToken()
            .then((webSocketToken: IWebSocketToken) => {
                console.log('WebsocketClientTyrion: websocketGetAccessToken:: token:', webSocketToken.websocket_token);
                this.url = this.websocketUrl + webSocketToken.websocket_token;
                console.log('WebsocketClientTyrion: websocketGetAccessToken:: total URL:', this.url);
                this.connectWs();
            });
    }

    public onErrorOrClose(e: any) {
        console.error('WebsocketClientTyrion: onErrorOrClose:: ', e);
        this.backend.websocketGetAccessToken()
            .then((webSocketToken: IWebSocketToken) => {
                this.url = this.websocketUrl + webSocketToken.websocket_token;
                this.connectWs();
            });
    }


    /***** ON MESSAGES *******/
    onMessageReceive(m: WebsocketMessage) {

        console.log('WebsocketClientTyrion:: onMessageReceive:: ', m);
        if (m.message_type === 'ping') {
            let message = new IWebSocketPingResponse();
            message.message_id = m.message_id;
            this.send_without_callback(WebsocketMessage.fromOutComingMessage(message));
        }

        if (m.message_type === 'online_status_change') {

            let status: OnlineChangeStatus = {
                model: m.data['model'],
                model_id: m.data['model_id'],
                online_state: m.data['online_state']
            };

            this.backend.onlineStatus.next(status);
        }

        if (m.message_type === 'becki_object_update') {

            let status: ModelChangeStatus = {
                model: m.data['model'],
                model_id: m.data['model_id'],
            };

            this.backend.objectUpdateTyrionEcho.next(status);

        }

        if (m.message_type === 'notification') {

            let notification: IWebSocketNotification = m.data as IWebSocketNotification;
            this.backend.notificationReceived.next(notification);
        }

    }

    /***** Requests *******/

    public requestNotificationsSubscribe(callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketSubscribeNotification();
        this.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestNotificationsUnsubscribe( callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketUNSubscribeNotification();
        this.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

}


/***********************************************************************************************************************
 * Messages
 *
 */

export class IWebSocketSubscribeNotification extends IndividualWebSocketOutComingMessage {
    version_id: string;

    getType(): string {
        return 'subscribe_notification';
    }

    getChannel(): string {
        return WebsocketClientAbstract.BECKI_CHANNEL_NAME;
    }
}

export class IWebSocketUNSubscribeNotification extends IndividualWebSocketOutComingMessage {
    version_id: string;

    getType(): string {
        return 'unsubscribe_notification';
    }

    getChannel(): string {
        return WebsocketClientAbstract.BECKI_CHANNEL_NAME;
    }
}

export class IWebSocketPingResponse extends IndividualWebSocketOutComingMessage {
    message_id: string;
    status: string  = 'success';

    getType(): string {
        return 'ping';
    }

    getChannel(): string {
        return WebsocketClientAbstract.BECKI_CHANNEL_NAME;
    }
}

/***********************************************************************************************************************
 * Incoming Messages
 *
 */

export interface IWebSocketErrorMessage {
    status: string;
    error: string;
}

export interface IWebSocketNotification extends INotification, IndividualWebSocketOutComingMessage {
    state: ('CREATED' | 'UPDATED' | 'CONFIRMED' | 'DELETED');
}
