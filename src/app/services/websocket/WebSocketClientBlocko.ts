import { WebSocketClient } from './WebSocketClient';
import { IWebSocketMessage, WebSocketMessage } from './WebSocketMessage';

export class WebSocketClientBlocko extends WebSocketClient {

    public static readonly CHANNEL: string = 'becki';

    protected instanceId: string;

    constructor(url: string, instanceId: string) {
        super(WebSocketClientBlocko.CHANNEL, url);
        this.instanceId = instanceId;
        this.connect();
    }

    protected onMessage(message: WebSocketMessage) {
    }

    protected onOpen(event): void {
        super.onOpen(event);
        this.requestGetValues(this.instanceId);
        this.requestGetLogs(this.instanceId);
    }

    public requestGetValues(instance_id: string): void {
        this.send(new IWebSocketGetValues(instance_id));
    }

    public requestGetLogs(instance_id: string): void {
        this.send(new IWebSocketGetLogs(instance_id));
    }

    public requestBProgramSubscribe(instance_id: string): Promise<IWebSocketMessage> {
        return this.sendWithResponse(new IWebSocketSubscribeInstance(instance_id));
    }
}

export class IWebSocketGetValues extends WebSocketMessage {
    constructor(instance_id: string) {
        super('get_values');
        this.setData('instance_id', instance_id);
    }
}

export class IWebSocketGetLogs extends WebSocketMessage {
    constructor(instance_id: string) {
        super('get_logs');
        this.setData('instance_id', instance_id);
    }
}


export class IWebSocketSubscribeInstance extends WebSocketMessage {
    constructor(instance_id: string) {
        super('subscribe_instance');
        this.setData('instance_id', instance_id);
    }
}
