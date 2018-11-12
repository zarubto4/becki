import { TyrionApiBackend } from '../../backend/BeckiBackend';
import { WebSocketClientTyrion } from './WebSocketClientTyrion';
import { WebSocketClientHardware } from './WebSocketClientHardware';
import { WebSocketClientBlocko } from './WebSocketClientBlocko';
import { WebSocketClientGarfield } from './WebSocketClientGarfield';

export class WebsocketService {

    protected tyrion: WebSocketClientTyrion;
    protected garfield: WebSocketClientGarfield;
    protected hardware: WebSocketClientHardware[] = [];
    protected instances: WebSocketClientBlocko[] = [];

    protected backend: TyrionApiBackend = null;

    public constructor(backend: TyrionApiBackend) {
        this.backend = backend;
    }

    /**
     * Return Tyrion Connection
     */
    public getTyrionConnection(): WebSocketClientTyrion {
        return this.tyrion;
    }

    /**
     * Return Tyrion Connection
     */
    public openTyrionConnection(url: string): void {
        if (!this.tyrion) {
            this.tyrion = new WebSocketClientTyrion(this.backend, url);
        }
        setImmediate(() => this.tyrion.connect());
    }

    // WebSocket Messages From Homer For HArdware Logger:
    public connectDeviceTerminalWebSocket(server_url: string, port: string, callback: (socket: WebSocketClientHardware, error: any) => void) {

        if (server_url === null || port === null) {
            callback(null, 'Missing server_url or port');
            return;
        }

        let url: string = `${this.backend.wsProtocol}://${server_url}:${port}/${TyrionApiBackend.getToken()}`;

        for (let hwSocket in this.hardware) {
            if (this.hardware.hasOwnProperty(hwSocket) && this.hardware[hwSocket].matchUrl(url)) {
                if (!this.hardware[hwSocket].isOpen()) {
                    this.hardware[hwSocket].connect();
                }
                callback(this.hardware[hwSocket], null);
                return;
            }
        }

        let socket: WebSocketClientHardware = new WebSocketClientHardware(url);
        this.hardware.push(socket);
        callback(socket, null);
    }

    // WebSocket Messages From Homer For HArdware Logger:
    public connectBlockoInstanceWebSocket(url: string, instanceId: string, callback: (socket: WebSocketClientBlocko, error: any) => void) {

        const finalUrl = url.replace('#token',  TyrionApiBackend.getToken());

        if (finalUrl === null) {
            callback(null, 'Missing url or port');
            return;
        }

        for (let instanceSocket in this.instances) {
            if (this.instances.hasOwnProperty(instanceSocket) && this.instances[instanceSocket].matchUrl(finalUrl)) {
                if (!this.instances[instanceSocket].isOpen()) {
                    this.instances[instanceSocket].connect();
                }
                callback(this.instances[instanceSocket], null);
                return;
            }
        }

        let socket: WebSocketClientBlocko = new WebSocketClientBlocko(finalUrl, instanceId);
        this.instances.push(socket);
        callback(socket, null);
    }

    public connectGarfieldWebSocket(callback: (socket: WebSocketClientGarfield, error: any) => void) {

        if (this.garfield) {
            callback(this.garfield, null);
            return;
        }

        let socket: WebSocketClientGarfield = new WebSocketClientGarfield(this.tyrion);
        this.garfield = socket;

        callback(socket, null);
    }
}
