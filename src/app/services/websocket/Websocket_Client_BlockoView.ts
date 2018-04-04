import { IndividualWebSocketOutComingMessage, WebsocketClientAbstract } from './Websocket_Client_Abstract';
import { TyrionApiBackend } from '../../backend/BeckiBackend';
import { WebsocketMessage } from './WebsocketMessage';


export class WebsocketClientBlockoView extends  WebsocketClientAbstract {

    public constructor(public websocketUrl: string) {
        super(websocketUrl);
        this.connectWs();

        console.info('WebsocketClientBlockoView connection URL: ', websocketUrl);
        super.onError = (e: any) => this.reconnectWebSocketAfterTimeout(e);
    }

    /***** Requests *******/

    public requestGetValues(instance_id: string, callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketGetValues();
        message.instance_id = instance_id;

        super.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestGetLogs(instance_id: string, callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketGetLogs();
        message.instance_id = instance_id;

        super.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestBProgramSubscribe(instance_id: string, callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketSubscribeInstance();
        message.instance_id = instance_id;


        super.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestBProgramValues(version_id: string, callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketGetBProgramValues();
        message.version_id = version_id;

        super.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }


    // define function as property is needed to can set it as event listener (class methods is called with wrong this)


    protected reconnectWebSocketAfterTimeout = (e) => {

        /* tslint:disable */
        console.info('WebsocketClientBlockoView::reconnectWebSocketAfterTimeout()');
        console.info(e);
        /* tslint:enable */

        clearTimeout( this._webSocketReconnectTimeout );
        this._webSocketReconnectTimeout = setTimeout(() => {
            this.connectWs();
        }, this._websocketReconnectTime);
    }

}

/***********************************************************************************************************************
 * Messages
 *
 */

export class IWebSocketGetValues extends IndividualWebSocketOutComingMessage {
    instance_id: string;

    getType(): string {
        return 'get_values';
    }

    getChannel(): string {
        return WebsocketClientAbstract.HOMER_CHANNEL_NAME;
    }
}

export class IWebSocketGetLogs extends IndividualWebSocketOutComingMessage {
    instance_id: string;

    getType(): string {
        return 'get_logs';
    }

    getChannel(): string {
        return WebsocketClientAbstract.HOMER_CHANNEL_NAME;
    }
}


export class IWebSocketSubscribeInstance extends IndividualWebSocketOutComingMessage {
    instance_id: string;

    getType(): string {
        return 'subscribe_instace';
    }

    getChannel(): string {
        return WebsocketClientAbstract.HOMER_CHANNEL_NAME;
    }
}

export class IWebSocketGetBProgramValues extends IndividualWebSocketOutComingMessage {
    version_id: string;

    getType(): string {
        return 'getValues';
    }

    getChannel(): string {
        return WebsocketClientAbstract.HOMER_CHANNEL_NAME;
    }
}


