import { IndividualWebSocketOutComingMessage, WebsocketClientAbstract } from './Websocket_Client_Abstract';
import { TyrionApiBackend } from '../../backend/BeckiBackend';
import { WebsocketMessage } from './WebsocketMessage';
import { ConsoleLogType } from '../../components/ConsoleLogComponent';
import { IWebSocketPingResponse } from './Websocket_Client_Tyrion';


export class WebsocketClientHardwareLogger extends  WebsocketClientAbstract {

    private _onlogsCallback: ((m: ITerminalWebsocketMessage) => void);

    public constructor(public websocketUrl: string) {
        super(websocketUrl);
        this.connectWs();

        super.onMessageCallback = (m: WebsocketMessage) => this.onMessageReceive(m);
        super.onOpenCallback = (e) => {
            console.info('WebsocketClientHardwareLogger:: Port Open');
        };

        super.onError = (e: any) => this.reconnectWebSocketAfterTimeout(e);
    }


    /***** ON MESSAGES *******/
    private onMessageReceive(m: WebsocketMessage) {

        // console.log('WebsocketClientHardwareLogger:: onMessageReceive', m);

        if (m.message_type === 'message_log') {

            let log: ITerminalWebsocketMessage = new ITerminalWebsocketMessage();

            log.hardware_id = m.data['hardware_id'];
            log.level = m.data['level'];
            log.message = m.data['message'];

            if (log) {
                if (this._onlogsCallback) {
                    this._onlogsCallback(log);
                }
            }

            let message = new IWebSocketPingResponse();
            message.message_id = m.message_id;
        }

    }

    public set onLogsCallback(callback: ((log: ITerminalWebsocketMessage) => void)) {
        this._onlogsCallback = callback;
    }



    /***** Requests *******/

    public requestDeviceTerminalSubcribe(deviceId: string, logLevel: ('error' | 'warn' | 'info' | 'debug' | 'trace'), callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketSubscribeHardware();
        message.hardware_ids = [deviceId];
        message.log_level = logLevel;

        super.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestDeviceTerminalUnSubcribe(deviceId: string, callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketUnSubscribeHardware();
        message.hardware_ids = [deviceId];

        super.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    // define function as property is needed to can set it as event listener (class methods is called with wrong this)
    protected reconnectWebSocketAfterTimeout = (e) => {

        /* tslint:disable */
        console.log('WebsocketClientHardwareLogger::reconnectWebSocketAfterTimeout()');
        console.log(e);
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

export class IWebSocketSubscribeHardware extends IndividualWebSocketOutComingMessage {
    hardware_ids: string[];
    log_level: string;

    getType(): string {
        return 'subscribe_hardware';
    }

    getChannel(): string {
        return WebsocketClientAbstract.HOMER_HARDWARE_SUBSCRIBER;
    }
}

export class IWebSocketUnSubscribeHardware extends IndividualWebSocketOutComingMessage {
    hardware_ids: string[];

    getType(): string {
        return 'unsubscribe_hardware';
    }

    getChannel(): string {
        return WebsocketClientAbstract.HOMER_HARDWARE_SUBSCRIBER;
    }
}

export class ITerminalWebsocketMessage {
    hardware_id: string;
    level: ConsoleLogType;
    message: string;
}

