import { WebSocketClient } from './WebSocketClient';
import { IWebSocketMessage, WebSocketMessage } from './WebSocketMessage';
import { ConsoleLogType } from '../../components/ConsoleLogComponent';

export class WebSocketClientHardware extends WebSocketClient {

    public static readonly CHANNEL: string = 'hardware-logger';

    constructor(url: string) {
        super(WebSocketClientHardware.CHANNEL, url);
        this.connect();
    }

    protected onMessage(message: WebSocketMessage) {
    }

    public requestDeviceTerminalSubscribe(deviceId: string, logLevel: ('error' | 'warn' | 'info' | 'debug' | 'trace')): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new WSMessageSubscribeHardware(logLevel, [deviceId]));
    }

    public requestDeviceTerminalUnsubscribe(deviceId: string): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new WSMessageUnsubscribeHardware([deviceId]));
    }
}

export class WSMessageSubscribeHardware extends WebSocketMessage {
    constructor(level: string, ids: Array<string>) {
        super('subscribe_hardware');
        this.setData('log_level', level);
        this.setData('hardware_ids', ids);
    }
}

export class WSMessageUnsubscribeHardware extends WebSocketMessage {
    constructor(ids: Array<string>) {
        super('unsubscribe_hardware');
        this.setData('hardware_ids', ids);
    }
}

export class ITerminalWebsocketMessage {
    hardware_id: string;
    level: ConsoleLogType;
    message: string;
}

export class ITerminalWebsocketOnlineStateMessage {
    hardware_id: string;
    online: boolean;
}
