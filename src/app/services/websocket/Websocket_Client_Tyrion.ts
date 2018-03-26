import { IndividualWebSocketOutComingMessage, WebsocketClientAbstract } from './Websocket_Client_Abstract';
import { ModelChangeStatus, OnlineChangeStatus, TyrionApiBackend } from '../../backend/BeckiBackend';
import { WebsocketMessage } from './WebsocketMessage';
import { INotification, IWebSocketToken } from '../../backend/TyrionAPI';


export class WebsocketClientTyrion extends WebsocketClientAbstract {

    protected pingTimeout;
    protected _onMessageGarfieldCallback: ((m: WebsocketMessage) => void);

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

    protected ping() {
        this._websocket.send(JSON.stringify({
            message_channel: WebsocketClientAbstract.BECKI_CHANNEL_NAME,
            message_type: 'ping',
            message_id : WebsocketMessage.getUUID()
        }));
    }

    public onReady() {

        if (!this.pingTimeout) {
            this.pingTimeout = setInterval( this.ping.bind(this), 5000);
        }
        this.backend.websocketGetAccessToken()
            .then((webSocketToken: IWebSocketToken) => {
                // console.log('WebsocketClientTyrion: websocketGetAccessToken:: token:', webSocketToken.websocket_token);
                this.url = this.websocketUrl + webSocketToken.websocket_token;
                // console.log('WebsocketClientTyrion: websocketGetAccessToken:: total URL:', this.url);
                this.connectWs();
            });
    }

    public onErrorOrClose(e: any) {
        clearTimeout(this.pingTimeout);
        this.pingTimeout = null;
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

        if (m.message_channel === WebsocketClientAbstract.GARFIELD_CHANNEL_NAME) {
            if (this._onMessageGarfieldCallback) {
                this._onMessageGarfieldCallback(m);
            }
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

    /**
     *
     * Set callback to on message event, "m" is parsed message as object
     *
     */
    public set onMessageGarfieldCallback(callback: ((m: any) => void)) {
        this._onMessageGarfieldCallback = callback;
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
