import { IndividualWebSocketOutComingMessage, WebsocketClientAbstract } from './Websocket_Client_Abstract';
import {ModelChangeStatus, OnlineChangeStatus, TyrionApiBackend} from '../../backend/BeckiBackend';
import { WebsocketMessage } from './WebsocketMessage';
import { INotification, IWebSocketToken } from '../../backend/TyrionAPI';


export class WebsocketClientTyrion extends WebsocketClientAbstract {

    private websocket: WebsocketClientAbstract = null;

    public constructor(protected backend: TyrionApiBackend, public websocketUrl: string, public wss: boolean = false) {

        super(websocketUrl, wss);
        console.log('WebsocketClientTyrion- GET WebSocket Token for Connection');
        backend.websocketGetAccessToken()
            .then((webSocketToken: IWebSocketToken) => {
                this.websocket.url += webSocketToken.websocket_token;
                this.connectWs();
            });

        super.onMessageCallback = (m: WebsocketMessage) => this.onMessageReceive(m);
        super.onOpenCallback = (e) => {
            // Do something
        };
    }


    /***** ON MESSAGES *******/
    onMessageReceive(m: WebsocketMessage) {

        if (m.message_type === 'ping') {
            let message = new IWebSocketPingResponse();
            message.message_id = m.message_id;
            this.websocket.send_without_callback(WebsocketMessage.fromOutComingMessage(message));
        }

        if (m.message_type === 'online_status_change') {

            let status: OnlineChangeStatus = {
                model: m['model'],
                model_id: m['model_id'],
                online_state: m['online_state']
            };

            this.backend.onlineStatus.next(status);
        }

        if (m.message_type === 'becki_object_update') {

            let status: ModelChangeStatus = {
                model: m['model'],
                model_id: m['model_id'],
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
        this.websocket.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestNotificationsUnsubscribe( callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketUNSubscribeNotification();
        this.websocket.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
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
        return WebsocketClientAbstract.TYRION_CHANNEL_NAME;
    }
}

export class IWebSocketUNSubscribeNotification extends IndividualWebSocketOutComingMessage {
    version_id: string;

    getType(): string {
        return 'unsubscribe_notification';
    }

    getChannel(): string {
        return WebsocketClientAbstract.TYRION_CHANNEL_NAME;
    }
}

export class IWebSocketPingResponse extends IndividualWebSocketOutComingMessage {
    message_id: string;
    status: string  = 'success';

    getType(): string {
        return 'ping';
    }

    getChannel(): string {
        return WebsocketClientAbstract.TYRION_CHANNEL_NAME;
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
