import { IndividualWebSocketOutComingMessage, WebsocketClientAbstract } from './Websocket_Client_Abstract';
import { WebsocketMessage } from './WebsocketMessage';
import { IHardwareNewSettingsResultConfiguration } from '../../backend/TyrionAPI';
import { WebsocketClientTyrion } from './Websocket_Client_Tyrion';


export class WebsocketClientGardfield  extends WebsocketClientAbstract {

    public tyrion: WebsocketClientTyrion;

    public constructor(tyrion: WebsocketClientTyrion) {
        super(null);
        this.tyrion = tyrion;
    }

    /**
     *
     * Set callback to on message event, "m" is parsed message as object
     *
     */
    public set onMessageCallback(callback: ((m: any) => void)) {
        this.tyrion.onMessageGarfieldCallback(callback);
    }

    public requestSubscribe(callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketSubscribe();
        this.tyrion.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestUnSubscribe(callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketUnsubscribe();
        this.tyrion.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestKeepAlive(callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketKeepAlive();
        this.tyrion.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 2000, 0, 3, callback);
    }

    public requestBackupProcess(callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketBackupProcess();
        this.tyrion.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 30000, 0, 3, callback);
    }

    public requestDeviceConfigure(configuration: IHardwareNewSettingsResultConfiguration, callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketDeviceConfiguration();
        message.configuration = configuration;
        this.tyrion.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 60000, 0, 3, callback);
    }

    public requestProductionFirmwareProcess(url: string, type: string, callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketProductionFirmware();
        message.url = url;
        message.type = type;
        this.tyrion.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 60000, 0, 3, callback);
    }

    public requestTestConfiguration(test_config: string,  callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketDeviceTest();
        message.test_config = test_config;
        this.tyrion.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 60000, 0, 3, callback);
    }

    public requestGetDeviceID( callback: (response_message: WebsocketMessage, error: any) => void) {

        let message = new IWebSocketGetDeviceId();
        this.tyrion.send_with_callback(WebsocketMessage.fromOutComingMessage(message), 60000, 0, 3, callback);
    }

    public respondOnSubscribe(message_id: string) {
        this.tyrion.send_without_callback(WebsocketMessage.fromJson({ message_id: message_id, status: 'success', message_type: 'subscribe_garfield', message_channel: 'garfield' }));
    }
}





/***********************************************************************************************************************
 * Messages
 *
 */

export class IWebSocketUnsubscribe extends IndividualWebSocketOutComingMessage {

    getType(): string {
        return 'unsubscribe_garfield';
    }

    getChannel(): string {
        return WebsocketClientAbstract.GARFIELD_CHANNEL_NAME;
    }
}

export class IWebSocketSubscribe extends IndividualWebSocketOutComingMessage {

    getType(): string {
        return 'subscribe_garfield';
    }

    getChannel(): string {
        return WebsocketClientAbstract.GARFIELD_CHANNEL_NAME;
    }
}

export class IWebSocketKeepAlive extends IndividualWebSocketOutComingMessage {

    getType(): string {
        return 'keepalive';
    }

    getChannel(): string {
        return WebsocketClientAbstract.GARFIELD_CHANNEL_NAME;
    }
}


export class IWebSocketBackupProcess extends IndividualWebSocketOutComingMessage {

    getType(): string {
        return 'device_backup';
    }

    getChannel(): string {
        return WebsocketClientAbstract.GARFIELD_CHANNEL_NAME;
    }
}

export class IWebSocketDeviceConfiguration extends IndividualWebSocketOutComingMessage {

    configuration: IHardwareNewSettingsResultConfiguration;

    getType(): string {
        return 'device_configure';
    }

    getChannel(): string {
        return WebsocketClientAbstract.GARFIELD_CHANNEL_NAME;
    }
}

export class IWebSocketProductionFirmware extends IndividualWebSocketOutComingMessage {

    url: string;
    type: string;

    getType(): string {
        return 'device_binary';
    }

    getChannel(): string {
        return WebsocketClientAbstract.GARFIELD_CHANNEL_NAME;
    }
}

export class IWebSocketDeviceTest extends IndividualWebSocketOutComingMessage {

    test_config: string;

    getType(): string {
        return 'device_test';
    }

    getChannel(): string {
        return WebsocketClientAbstract.GARFIELD_CHANNEL_NAME;
    }
}

export class IWebSocketGetDeviceId extends IndividualWebSocketOutComingMessage {

    test_config: string;

    getType(): string {
        return 'device_id';
    }

    getChannel(): string {
        return WebsocketClientAbstract.GARFIELD_CHANNEL_NAME;
    }
}

