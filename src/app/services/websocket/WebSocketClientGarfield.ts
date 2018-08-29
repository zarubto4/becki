import { WebSocketClientTyrion } from './WebSocketClientTyrion';
import * as Rx from 'rxjs';
import { IWebSocketMessage, WebSocketMessage } from './WebSocketMessage';
import { WebSocketRequestOptions } from './WebSocketRequest';
import { IHardwareNewSettingsResultConfiguration } from '../../backend/TyrionAPI';

export class WebSocketClientGarfield {

    public static readonly CHANNEL: string = 'garfield';

    protected tyrion: WebSocketClientTyrion;

    public messages: Rx.Subject<IWebSocketMessage>;

    protected subscription: Rx.Subscription;

    constructor(tyrion: WebSocketClientTyrion) {
        this.tyrion = tyrion;
        this.messages = new Rx.Subject<IWebSocketMessage>();
        this.subscription = this.tyrion.messages
            .filter(m => m.message_channel === WebSocketClientGarfield.CHANNEL)
            .subscribe(this.messages);
    }

    public disconnect(): void {
        this.subscription.unsubscribe();
    }

    public send(message: IWebSocketMessage): void {
        this.tyrion.send(message);
    }

    public sendWithResponse(message: IWebSocketMessage, options?: WebSocketRequestOptions): Promise<IWebSocketMessage> {
        return this.tyrion.sendWithResponse(message, options);
    }

    public requestSubscribe(): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketSubscribe());
    }

    public requestUnsubscribe(): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketUnsubscribe());
    }

    public requestKeepAlive(): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketKeepAlive());
    }

    public requestBackupProcess(): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketBackupProcess(), { timeout: 30000 });
    }

    public requestDeviceConfigure(configuration: IHardwareNewSettingsResultConfiguration): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketDeviceConfiguration(configuration), { timeout: 60000 });
    }

    public requestProductionFirmwareProcess(url: string, type: string): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketProductionFirmware(url, type), { timeout: 60000 });
    }

    public requestTestConfiguration(test_config: string): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketDeviceTest(test_config), { timeout: 60000 });
    }

    public requestGetDeviceID(): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketGetDeviceId(), { timeout: 30000 });
    }

    public respondOnSubscribe(message_id: string) {
        this.send(new WebSocketMessage({ message_id: message_id, status: 'success', message_type: 'subscribe_garfield', message_channel: 'garfield' }));
    }
}

export class IWebSocketSubscribe extends WebSocketMessage {
    constructor() {
        super('subscribe_garfield');
    }
}

export class IWebSocketUnsubscribe extends WebSocketMessage {
    constructor() {
        super('unsubscribe_garfield');
    }
}

export class IWebSocketKeepAlive extends WebSocketMessage {
    constructor() {
        super('keepalive');
    }
}


export class IWebSocketBackupProcess extends WebSocketMessage {
    constructor() {
        super('device_backup');
    }
}

export class IWebSocketDeviceConfiguration extends WebSocketMessage {
    constructor(configuration: IHardwareNewSettingsResultConfiguration) {
        super('device_configure');
        this.setData('configuration', configuration);
    }
}

export class IWebSocketProductionFirmware extends WebSocketMessage {
    constructor(url: string, type: string) {
        super('device_binary');
        this.setData('url', url);
        this.setData('type', type);
    }
}

export class IWebSocketDeviceTest extends WebSocketMessage {
    constructor(test_config: string) {
        super('device_test');
        this.setData('test_config', test_config);
    }
}

export class IWebSocketGetDeviceId extends WebSocketMessage {
    constructor() {
        super('device_id');
    }
}

