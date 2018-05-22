import { TyrionApiBackend } from '../../backend/BeckiBackend';
import { WebsocketClientTyrion } from './Websocket_Client_Tyrion';
import { WebsocketClientHardwareLogger } from './Websocket_Client_HardwareLogger';
import { WebsocketClientBlockoView } from './Websocket_Client_BlockoView';
import { WebsocketClientGardfield } from './Websocket_Client_Gardfield';

export class WebsocketService {

    // List of Websockets to Homer servers
    private hardwareTerminalwebSockets: WebsocketClientHardwareLogger[] = [];
    private blockoInstancewebSockets: WebsocketClientBlockoView[] = [];
    private tyrionWebSocketConnection: WebsocketClientTyrion = null;
    private garfieldWebSocketConnection: WebsocketClientGardfield = null;

    private backend: TyrionApiBackend = null;

    public constructor(backend: TyrionApiBackend) {
        this.backend = backend;
    }

    /**
     * Return Tyrion Connection
     */
    public getTyrionWebsocketConnection(): WebsocketClientTyrion {
        return this.tyrionWebSocketConnection;
    }

    /**
     * Return Tyrion Connection
     */
    public openTyrionWebsocketConnection(url: string): void {
        this.tyrionWebSocketConnection = new WebsocketClientTyrion(this.backend, url);
    }

    // WebSocket Messages From Homer For HArdware Logger:
    public connectDeviceTerminalWebSocket(server_url: string, port: string, callback: (socket: WebsocketClientHardwareLogger, error: any) => void) {

        /* tslint:disable */
        // console.log('Server URL:', server_url);
        // console.log('Server Port:', port);
        /* tslint:enable */

        if (server_url === null || port === null) {
            return callback(null, 'Missing server_url or port');
        }

        for (let ws in this.hardwareTerminalwebSockets) {

            if (!this.hardwareTerminalwebSockets.hasOwnProperty(ws)) {
                continue;
            }

            if (this.hardwareTerminalwebSockets[ws].url.includes(server_url + ':' + port + '/'  + TyrionApiBackend.getToken())) {
                return callback(this.hardwareTerminalwebSockets[ws], null);
            }
        }

        let socket: WebsocketClientHardwareLogger = new WebsocketClientHardwareLogger(server_url + ':' + port + '/'  + TyrionApiBackend.getToken());
        if (!socket.isWebSocketOpen()) {
            console.info('connectDeviceTerminalWebSocket:: !socket.isWebSocketOpen() Není Open - Callback');
            socket.onOpenCallback = (e) => {
                // console.log('connectDeviceTerminalWebSocket:: Connected - return socket');
                this.hardwareTerminalwebSockets.push(socket);
                return callback(socket, null);
            };
        } else {
            // console.log('connectDeviceTerminalWebSocket:: socket.isWebSocketOpen() JE Open - Callback');
            this.hardwareTerminalwebSockets.push(socket);
            return callback(socket, null);
        }



    }

    // WebSocket Messages From Homer For HArdware Logger:
    public connectBlockoInstanceWebSocket(server_url: string, callback: (socket: WebsocketClientBlockoView, error: any) => void) {
        /* tslint:disable */

        console.log('Server URL:', server_url);

        const finalUrl = server_url.replace('#token',  TyrionApiBackend.getToken());

        /* tslint:enable */

        if (finalUrl === null) {
            return callback(null, 'Missing server_url or port');
        }

        for (let ws in this.blockoInstancewebSockets) {

            if (!this.blockoInstancewebSockets.hasOwnProperty(ws)) {
                continue;
            }

            if (this.blockoInstancewebSockets[ws].url.includes(finalUrl)) {
                return callback(this.blockoInstancewebSockets[ws], null);
            }
        }

        let socket: WebsocketClientBlockoView = new WebsocketClientBlockoView(finalUrl);

        this.blockoInstancewebSockets.push(socket);

        return callback(socket, null);

    }

    // WebSocket Messages From Homer For HArdware Logger:
    public connectGarfieldWebSocket(callback: (socket: WebsocketClientGardfield, error: any) => void) {

        if (this.garfieldWebSocketConnection) {
            return callback(this.garfieldWebSocketConnection, null);
        }

        let socket: WebsocketClientGardfield = new WebsocketClientGardfield(this.tyrionWebSocketConnection);
        this.garfieldWebSocketConnection = socket;

        return callback(socket, null);

    }

}







