/**
 * Created by davidhradek on 08.09.16.
 */

import { TyrionAPI, INotification, IPerson, ILoginResult, IWebSocketToken, ISocialNetworkLogin } from './TyrionAPI';
import * as Rx from 'rxjs';
import { ConsoleLogType } from '../components/ConsoleLogComponent';

declare const BECKI_VERSION: string;

// INTERFACES

export interface IBProgramValues {
    digital: { [hwId: string]: boolean };
    analog: { [hwId: string]: number };
    connector: { [id: string]: { inputs: { [name: string]: number }, outputs: { [name: string]: number } } };
}

export interface IBProgramValue<T> {
    hwId: string;
    value: T;
}

export interface IBProgramConnectorValue {
    blockId: string;
    connectorName: string;
    value: number;
}

export interface IWebSocketMessage {
    message_id: string;
    message_channel: string;
    message_type: string;

    websocketURL?: string;
}

export interface ITerminalWebsocketMessage extends IWebSocketMessage {
    hardware_id: string;
    level: ConsoleLogType;
    message: string;

}

export interface IWebSocketSuccessMessage extends IWebSocketMessage {
    status: string;
}

export interface IWebSocketErrorMessage extends IWebSocketMessage {
    status: string;
    error: string;
}

export interface IWebSocketGarfieldDeviceConnect extends IWebSocketMessage {
    device_id: string;
}

export interface IWebSocketGarfieldDeviceConfigure extends IWebSocketMessage {
    configuration: any;
}

export interface IWebSocketGarfieldDeviceTest extends IWebSocketMessage {
    test_config: any;
}

export interface IWebSocketGarfieldDeviceTestResult extends IWebSocketSuccessMessage {
    errors: string[];
}

export interface IWebSocketGarfieldDeviceBinary extends IWebSocketMessage {
    url: string;
    type: ('bootloader' | 'firmware');
}

export interface IWebSocketGarfieldDeviceBinaryResult extends IWebSocketSuccessMessage {
    type: ('bootloader' | 'firmware');
}

export interface IWebSocketNotification extends INotification, IWebSocketMessage {
    state: ('created' | 'updated' | 'confirmed' | 'deleted');
}

export interface IWebsocketTerminalState {
    websocketUrl: string;
    isConnected: boolean;
    reason: string;
}

export interface ICodeCompileErrorMessage {
    filename: string;
    type: string;
    text: string;
    codeWhitespace: string;
    code: string;

    line: number;
    column: number;
    adjustedColumn: number;
    startIndex: number;
    endIndex: number;
}

// REQUEST CLASSES

export class RestRequest {

    method: string;

    url: string;

    headers: { [name: string]: string };

    body: Object;

    constructor(method: string, url: string, headers: { [name: string]: string } = {}, body?: Object) {
        this.method = method;
        this.url = url;
        this.headers = {};
        for (let header in headers) {
            if (headers.hasOwnProperty(header)) {
                this.headers[header] = headers[header];
            }
        }
        this.headers['Accept'] = 'application/json';
        this.headers['Content-Type'] = 'application/json';
        this.body = body;
    }
}

export class RestResponse {

    status: number;

    body: Object;

    constructor(status: number, body: Object) {
        this.status = status;
        this.body = body;
    }
}

// ERROR CLASSES

export class GenericError extends Error {
    state: string;
    code: number;
    message: string;
}

export class BugFoundError extends GenericError {


    name = 'bug found error';

    adminMessage: string;

    userMessage: string;

    body: any;

    static fromRestResponse(response: RestResponse): BugFoundError {
        let content = response.body;
        let message: string;
        if (response.status === 400) {
            content = (<{ exception: Object }>response.body).exception;
            message = (<{ message: string }>response.body).message;
            if (!message) {
                message = (<{ error: string }>response.body).error;
            }
        }
        return new BugFoundError(response.body, `response ${response.status}: ${JSON.stringify(content)}`, message);
    }

    static fromWsResponse(response: IWebSocketErrorMessage): BugFoundError {
        return new BugFoundError(null, `response ${JSON.stringify(response)}`, response.error);
    }

    static composeMessage(adminMessage: string): string {
        return `bug found in client or server: ${adminMessage}`;
    }

    constructor(body: any, adminMessage: string, userMessage?: string) {
        super(BugFoundError.composeMessage(adminMessage));
        this.name = 'BugFoundError';
        this.message = BugFoundError.composeMessage(adminMessage);
        this.adminMessage = adminMessage;
        this.userMessage = userMessage;
        this.body = body;

        Object.setPrototypeOf(this, BugFoundError.prototype);
    }
}

export class CodeError extends Error {

    static fromRestResponse(response: RestResponse): CodeError {
        let content = response.body;
        if ((<any>content).message) {
            return new CodeError((<any>content).message);
        }
        if (response.status === 477) {
            return new CodeError(`External server is offline: ${JSON.stringify(content)}`);
        }
        if (response.status === 478) {
            return new CodeError(`External server side error: ${JSON.stringify(content)}`);
        }
        return new CodeError('Unknown error');
    }

    constructor(msg: string) {
        super(msg);
        this.name = 'CodeError';
        this.message = msg;

        Object.setPrototypeOf(this, CodeError.prototype);
    }

}

export class CodeCompileError extends Error {

    errors: ICodeCompileErrorMessage[] = [];

    static fromRestResponse(response: RestResponse): CodeCompileError {
        let cce = new CodeCompileError(`Compile error.`);
        if (Array.isArray(response.body)) {
            cce.errors = <ICodeCompileErrorMessage[]>response.body;
        }
        return cce;
    }

    constructor(msg: string) {
        super(msg);
        this.name = 'CodeCompileError';
        this.message = msg;

        Object.setPrototypeOf(this, CodeCompileError.prototype);
    }

}

export class UserNotValidatedError extends Error {

    static MESSAGE = 'Validation required';

    name = 'User not validated error';

    userMessage: string;

    static fromRestResponse(response: RestResponse): UserNotValidatedError {
        return new UserNotValidatedError((<{ message: string }>response.body).message);
    }

    constructor(userMessage: string) {
        super(UserNotValidatedError.MESSAGE);
        this.name = 'UserNotValidatedError';
        this.message = UserNotValidatedError.MESSAGE;
        this.userMessage = userMessage;

        Object.setPrototypeOf(this, UserNotValidatedError.prototype);
    }

}

export class UnauthorizedError extends Error {

    name = 'request unauthorized error';

    userMessage: string;

    static fromRestResponse(response: RestResponse): UnauthorizedError {
        return new UnauthorizedError((<{ message: string }>response.body).message);
    }

    constructor(userMessage: string, message = 'authorized authentication token required') {
        super(message);
        this.name = 'UnauthorizedError';
        this.message = message;
        this.userMessage = userMessage;

        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

}

export class PermissionMissingError extends UnauthorizedError {

    static MESSAGE = 'permission required';

    name = 'permission missing error';

    userMessage: string;

    static fromRestResponse(response: RestResponse): PermissionMissingError {
        return new PermissionMissingError((<{ message: string }>response.body).message);
    }

    constructor(userMessage: string) {
        super(PermissionMissingError.MESSAGE);
        this.name = 'PermissionMissingError';
        this.message = PermissionMissingError.MESSAGE;
        this.userMessage = userMessage;

        Object.setPrototypeOf(this, PermissionMissingError.prototype);
    }

}

export class RequestError extends Error {

    constructor(public readonly userMessage: string) {
        super('Request failed');
        this.message = 'Request failed';
        this.name = 'RequestError';

        Object.setPrototypeOf(this, RequestError.prototype);
    }

}

export interface OnlineChangeStatus {
    model: ('Board' | 'HomerInstance' | 'HomerServer' | 'CompilationServer');
    model_id: 'string';
    online_status: ('not_yet_first_connected' | 'synchronization_in_progress' | 'offline' | 'online' | 'unknown_lost_connection_with_server');
}

export interface ModelChangeStatus {
    model: ('ProjectsRefreshAfterInvite' | 'Project' | 'Board' | 'CProgram' | 'MProgram' | 'BProgram' | 'ActualizationProcedure' | 'CProgramUpdatePlan');
    model_id: 'string';
}

// BECKI BACKEND

export abstract class BeckiBackend extends TyrionAPI {

    public static WS_CHANNEL = 'becki';

    public static WS_CHANNEL_GARFIELD = 'garfield';

    public host = '127.0.0.1:9000';

    public protocol = 'http';

    public wsProtocol = 'ws';

    public requestProxyServerUrl = 'http://127.0.0.1:4000/fetch/';

    private webSocket: WebSocket = null;

    private webSocketMessageQueue: IWebSocketMessage[] = [];

    private webSocketTerminalMessageQueue: IWebSocketMessage[] = [];

    private webSocketReconnectTimeout: any = null;

    private beckiBeta: boolean = true; // TODO BETA

    public notificationReceived: Rx.Subject<IWebSocketNotification> = new Rx.Subject<IWebSocketNotification>();

    public webSocketErrorOccurred: Rx.Subject<any> = new Rx.Subject<any>();

    public garfieldRecived: Rx.Subject<any> = new Rx.Subject<any>();

    private hardwareTerminalwebSockets: WebSocket[] = [];

    private TerminalwebSocketReconnectTimeout: any = null;

    public hardwareTerminal: Rx.Subject<ITerminalWebsocketMessage> = new Rx.Subject<ITerminalWebsocketMessage>();
    public hardwareTerminalState: Rx.Subject<IWebsocketTerminalState> = new Rx.Subject<IWebsocketTerminalState>();

    public onlineStatus: Rx.Subject<OnlineChangeStatus> = new Rx.Subject<OnlineChangeStatus>();
    public objectUpdateTyrionEcho: Rx.Subject<ModelChangeStatus> = new Rx.Subject<ModelChangeStatus>();

    public interactionsOpened: Rx.Subject<void> = new Rx.Subject<void>();
    public interactionsSchemeSubscribed: Rx.Subject<void> = new Rx.Subject<void>();

    public BProgramValuesReceived: Rx.Subject<IBProgramValues> = new Rx.Subject<IBProgramValues>();
    public BProgramAnalogValueReceived: Rx.Subject<IBProgramValue<number>> = new Rx.Subject<IBProgramValue<number>>();
    public BProgramDigitalValueReceived: Rx.Subject<IBProgramValue<boolean>> = new Rx.Subject<IBProgramValue<boolean>>();
    public BProgramInputConnectorValueReceived: Rx.Subject<IBProgramConnectorValue> = new Rx.Subject<IBProgramConnectorValue>();
    public BProgramOutputConnectorValueReceived: Rx.Subject<IBProgramConnectorValue> = new Rx.Subject<IBProgramConnectorValue>();

    public tasks: number = 0;

    protected personInfoSnapshotDirty: boolean = true;
    public personInfoSnapshot: IPerson = null;
    public personPermissions: string[] = null;
    public personInfo: Rx.Subject<IPerson> = new Rx.Subject<IPerson>();

    protected websocketErrorShown: boolean = false;

    // CONSTRUCTOR

    public constructor() {
        super();
        // TODO: make better environment detection
        if (location && location.hostname) {
            if (location.hostname.indexOf('portal.') === 0) {
                this.host = location.hostname.replace('portal.', 'tyrion.');
            } else {
                this.host = location.hostname + ':9000';
            }
        }

        if (location && location.protocol) {
            if (location.protocol === 'https:') {
                this.protocol = 'https';
                this.wsProtocol = 'wss';
            }
        }

        // TODO: better!!! (from Tyrion maybe) [DH]
        if (location.hostname.indexOf('portal.stage.') === 0) {
            this.requestProxyServerUrl = 'https://request.stage.byzance.cz/fetch/';
        }

        // Mac mini
        if (location && location.hostname.indexOf('test.byzance.dev') > -1) {
            this.requestProxyServerUrl = 'http://test.byzance.dev:4000/fetch/';
        }

        // Linux
        if (location && location.hostname.indexOf('test2.byzance.dev') > -1) {
            this.requestProxyServerUrl = 'http://test2.byzance.dev:4000/fetch/';
        }

        // David 1 IP
        // this.host = "192.168.65.30:9000";
        // this.host = "192.168.65.137:9000";

    }

    // GENERIC REQUESTS



    protected abstract requestRestGeneral(request: RestRequest): Promise<RestResponse>;

    public requestRestPath<T>(method: string, path: string, body: Object, success: number[]): Promise<T> {
        return this.requestRest(method, `${this.protocol}://${this.host}${path}`, body, success);
    }

    public requestRest<T>(method: string, url: string, body: Object, success: number[]): Promise<T> {
        let request: RestRequest = new RestRequest(method, url, {}, body);
        // TODO: https://github.com/angular/angular/issues/7438
        if (this.tokenExist()) {
            request.headers['X-Auth-Token'] = this.getToken();
        }
        request.headers['Becki-Version'] = BECKI_VERSION;
        this.tasks += 1;
        return this.requestRestGeneral(request)
            .then((response: RestResponse) => {
                if (success.indexOf(response.status) > -1) {
                    this.tasks -= 1;
                    let res = response.body;
                    Object.defineProperty(res, '_code_', {
                        value: response.status,
                        enumerable: false,
                        writable: false
                    });
                    return <T>res;
                }
                switch (response.status) {
                    case 401:
                        throw UnauthorizedError.fromRestResponse(response);
                    case 403:
                        throw PermissionMissingError.fromRestResponse(response);
                    case 422:
                        throw CodeCompileError.fromRestResponse(response);
                    case 477:
                        throw CodeError.fromRestResponse(response);
                    case 478:
                        throw CodeError.fromRestResponse(response);
                    case 705:
                        throw UserNotValidatedError.fromRestResponse(response);
                    case 0:
                        throw new RequestError('Request failed, please check your internet connection.');
                    default:
                        throw BugFoundError.fromRestResponse(response);
                }
            })
            .catch((e: any) => {
                this.tasks -= 1;
                throw e;
            });
    }

    // TOKEN MANIPULATIONS

    public getToken(): string {
        return window.localStorage.getItem('authToken');
    }

    public getBeckiBeta(): boolean {
        return this.beckiBeta;
    }

    private setToken(token: string, withRefreshPersonalInfo = true): void {
        window.localStorage.setItem('authToken', token);
        if (withRefreshPersonalInfo) {
            this.refreshPersonInfo();
        }
    }

    public tokenExist(): boolean {
        return window.localStorage.getItem('authToken') ? true : false;
    }

    protected unsetToken(): void {
        window.localStorage.removeItem('authToken');
        this.refreshPersonInfo();
    }

    // LOGIN / LOGOUT

    public login(mail: string, password: string): Promise<any> {
        if (!mail || !password) {
            throw new Error('email and password required');
        }

        return this.__login({
            mail: mail,
            password: password
        })
            .then((body) => {
                this.setToken(body.authToken);
                return body;
            }).then(body => {
                return JSON.stringify(body);
            });
    }

    public loginFacebook(redirectUrl: string): Promise<string> {
        return this.facebookLogin(<ISocialNetworkLogin>{
            redirect_url: redirectUrl
        })
            .then(body => {
                this.setToken(body.authToken);
                return body.redirect_url;
            });
    }

    public loginGitHub(redirectUrl: string): Promise<string> {
        return this.gitHubLogin(<ISocialNetworkLogin>{
            redirect_url: redirectUrl
        })
            .then(body => {
                this.setToken(body.authToken, false);
                return body.redirect_url;
            });
    }

    public logout(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.__logout()
                .then((body) => {
                    this.unsetToken();
                    resolve(body);
                })
                .catch((err) => {
                    this.unsetToken();
                    reject(err);
                });
        });
    }

    // PERSON INFO

    public refreshPersonInfo(): void {
        this.personInfoSnapshotDirty = true;
        if (this.tokenExist()) {
            this.personGetByToken()
                .then((lr: ILoginResult) => {
                    this.personPermissions = lr.permissions;
                    this.personInfoSnapshotDirty = false;
                    this.personInfoSnapshot = lr.person;
                    this.personInfo.next(this.personInfoSnapshot);
                    this.connectWebSocket();
                })
                .catch((error) => {
                    console.error(error);
                    this.unsetToken(); // TODO: maybe check error type before force logout user
                    this.personInfoSnapshotDirty = false;
                    this.personInfoSnapshot = null;
                    this.personInfo.next(this.personInfoSnapshot);
                    this.disconnectWebSocket();
                });
        } else {
            this.personInfoSnapshotDirty = false;
            this.personInfoSnapshot = null;
            this.personInfo.next(this.personInfoSnapshot);
            this.disconnectWebSocket();
        }
    }

    // WEBSOCKET METHODS

    private findEnqueuedWebSocketMessage(original: IWebSocketMessage, ...keys: string[]): IWebSocketMessage {
        return this.webSocketMessageQueue.find(message => {
            let match = true;
            keys.forEach(key => {
                if (!(<any>message)[key] || !(<any>original)[key] || (<any>original)[key] !== (<any>message)[key]) {
                    match = false;
                }
            });
            return match;
        });
    }

    private sendWebSocketMessageQueue(): void {
        if (this.webSocket) {
            this.webSocketMessageQueue.slice().forEach(message => {
                try {
                    this.webSocket.send(JSON.stringify(message));
                    let i = this.webSocketMessageQueue.indexOf(message);
                    if (i > -1) {
                        this.webSocketMessageQueue.splice(i, 1);
                    }
                } catch (err) {
                    console.error('ERR', err);
                }
            });
        }
    }

    public sendWebSocketMessage(message: IWebSocketMessage): void {
        this.webSocketMessageQueue.push(message);
        this.sendWebSocketMessageQueue();
    }



    public sendWebSocketTerminalMessage(message: IWebSocketMessage): void {
        this.webSocketTerminalMessageQueue.push(message);
        this.sendWebSocketTerminalMessageQueue();
    }


    private sendWebSocketTerminalMessageQueue(): void {

        this.webSocketTerminalMessageQueue.slice().forEach(message => {

            let websocket = this.hardwareTerminalwebSockets.find(ws => {

                if (ws.url.indexOf(message.websocketURL) !== -1) {
                    return true;
                }


            });

            if (!websocket) {
                return;
            }

            // delete message.websocketURL;


            if (websocket.readyState) {
                try {
                    websocket.send(JSON.stringify(message));
                    let i = this.webSocketTerminalMessageQueue.indexOf(message);
                    if (i > -1) {
                        this.webSocketTerminalMessageQueue.splice(i, 1);
                    }
                } catch (err) {
                    console.error('ERR', err);
                }
            }
        });
    }





    // define function as property is needed to can set it as event listener (class methods is called with wrong this)
    protected reconnectWebSocketAfterTimeout = () => {
        // console.log('reconnectWebSocketAfterTimeout()');
        clearTimeout(this.webSocketReconnectTimeout);
        this.webSocketReconnectTimeout = setTimeout(() => {
            this.connectWebSocket();
        }, 5000);
    }

    // define function as property is needed to can set it as event listener (class methods is called with wrong this)
    protected reconnectTerminalWebSocketAfterTimeout = () => {
        // console.log('reconnectWebSocketAfterTimeout()');


        clearTimeout(this.TerminalwebSocketReconnectTimeout);
        this.TerminalwebSocketReconnectTimeout = setTimeout(() => {
            this.connectWebSocket();
        }, 5000);
    }

    protected disconnectWebSocket(): void {
        // console.log('disconnectWebSocket()');
        if (this.webSocket) {
            this.webSocket.removeEventListener('close', this.reconnectWebSocketAfterTimeout);
            this.webSocket.close();
        }
        this.webSocket = null;
    }

    public connectDeviceTerminalWebSocket(server: string, port: string): void {

        if (!(server !== null) && !(port !== null)) {

            let websocket: WebSocket = null;

            let wsPosition: number = this.hardwareTerminalwebSockets.findIndex(ws => {
                if (ws.url.includes(server + ':' + port)) {
                    websocket = ws;
                    return true;
                }
            });

            if (websocket) {
                this.closeHardwareTerminalWebsocket(websocket.url);
            }

            websocket = new WebSocket(`${this.wsProtocol}://${server}:${port}/${this.getToken()}`);

            websocket.addEventListener('close', ws => {
                this.reconnectTerminalWebSocketAfterTimeout();
                this.hardwareTerminalState.next({ 'websocketUrl': websocket.url, 'isConnected': false, 'reason': 'conectionFailed'});
            });

            websocket.addEventListener('open', ws => {
                this.reconnectTerminalWebSocketAfterTimeout();
                this.hardwareTerminalState.next({ 'websocketUrl': websocket.url, 'isConnected': true, 'reason': 'connected' });
            });


            let opened = Rx.Observable
                .fromEvent<void>(websocket, 'open');
            let channelReceived = Rx.Observable
                .fromEvent<MessageEvent>(websocket, 'message')
                .map(event => {
                    try {
                        return JSON.parse(event.data);
                    } catch (e) {
                        console.error('Parse error: ', e);
                    }
                    return null;
                });
            channelReceived
                .filter(message => message.message_channel === 'hardware-logger')
                .subscribe(this.hardwareTerminal);


            opened.subscribe(open => this.sendWebSocketTerminalMessageQueue());

            if (wsPosition > -1) {

                this.hardwareTerminalwebSockets[wsPosition] = websocket;
                console.log("close", this.hardwareTerminalwebSockets);
            } else {

                this.hardwareTerminalwebSockets.push(websocket);
                console.log("close", this.hardwareTerminalwebSockets);
            }
        } else {
            this.hardwareTerminalState.next({ websocketUrl: null, isConnected: null, 'reason': 'cantConnect' });
            return;
        }
    }



    /*if(this.terminalConnection.find(connection => connection.id == deviceId)){
        return
}*/

    public closeHardwareTerminalWebsocket(websocketURL: string) {
        if (websocketURL === 'all') {
            this.hardwareTerminalwebSockets.forEach(websocket => {
                websocket.removeEventListener('close');
                websocket.removeEventListener('open');
                websocket.close();
            });
            this.hardwareTerminalwebSockets = [];
            return;
        }

        let websocket = this.hardwareTerminalwebSockets.find(ws => {
            if (ws.url.includes(websocketURL)) {
                console.warn("nenalezen websocket");

                return true;
            }
        });
        if (websocket) {

            this.hardwareTerminalState.next({ 'websocketUrl': websocket.url, 'isConnected': false, 'reason': 'dissconected' });

            websocket.removeEventListener('close');
            websocket.removeEventListener('open');
            websocket.close();
        }
        websocket = null;
    }

    protected connectWebSocket(): void {
        // console.log('connectWebSocket()');
        if (!this.tokenExist()) {
            // console.log('connectWebSocket() :: cannot connect now, user token doesn\'t exists.');
            return;
        }
        this.disconnectWebSocket();

        this.websocketGetAccessToken()
            .then((webSocketToken: IWebSocketToken) => {

                this.websocketErrorShown = false;

                this.webSocket = new WebSocket(`${this.wsProtocol}://${this.host}/websocket/becki/${webSocketToken.websocket_token}`);
                this.webSocket.addEventListener('close', this.reconnectWebSocketAfterTimeout);
                let opened = Rx.Observable
                    .fromEvent<void>(this.webSocket, 'open');
                let channelReceived = Rx.Observable
                    .fromEvent<MessageEvent>(this.webSocket, 'message')
                    .map(event => { // TODO: think why is this triggered 8 times (for 8 subscribes)
                        try {
                            return JSON.parse(event.data);
                        } catch (e) {
                            console.error('Parse error: ', e);
                        }
                        return null;
                    })
                    .filter(message => (message && message.message_channel === BeckiBackend.WS_CHANNEL));
                let channelGarfieldReceived = Rx.Observable
                    .fromEvent<MessageEvent>(this.webSocket, 'message')
                    .map(event => {
                        try {
                            return JSON.parse(event.data);
                        } catch (e) {
                            console.error('Parse error: ', e);
                        }
                        return null;
                    })
                    .filter(message => (message && message.message_channel === BeckiBackend.WS_CHANNEL_GARFIELD));
                let errorOccurred = Rx.Observable
                    .fromEvent(this.webSocket, 'error');

                opened.subscribe(() => {
                    this.requestNotificationsSubscribe();
                });
                opened
                    .subscribe(() => this.sendWebSocketMessageQueue());
                opened
                    .subscribe(this.interactionsOpened);

                channelGarfieldReceived
                    .subscribe(this.garfieldRecived);

                channelReceived
                    .filter(message => message.message_type === 'ping')
                    .subscribe((msg) => {
                        if (this.webSocket.readyState === WebSocket.OPEN) {
                            this.webSocket.send(JSON.stringify({
                                message_type: 'ping',
                                message_id: msg.message_id,
                                message_channel: msg.message_channel,
                                status: 'success'
                            }));
                        }
                    });

                channelReceived
                    .filter(message => message.status === 'error')
                    .map(message => BugFoundError.fromWsResponse(message))
                    .subscribe(this.webSocketErrorOccurred);
                channelReceived
                    .filter(message => message.message_type === 'subscribe_instace' && message.status === 'success')
                    .subscribe(this.interactionsSchemeSubscribed);
                channelReceived
                    .filter(message =>
                        message.message_type === 'subscribe_notification'
                        || message.message_type === 'unsubscribe_notification'
                        || message.message_type === 'notification'
                    )
                    .subscribe(this.notificationReceived);
                channelReceived
                    .filter(message => message.message_type === 'getValues' && message.status === 'success')
                    .subscribe(this.BProgramValuesReceived);
                channelReceived
                    .filter(message => message.message_type === 'newAnalogValue')
                    .subscribe(this.BProgramAnalogValueReceived);
                channelReceived
                    .filter(message => message.message_type === 'newDigitalValue')
                    .subscribe(this.BProgramDigitalValueReceived);
                channelReceived
                    .filter(message => message.message_type === 'newInputConnectorValue')
                    .subscribe(this.BProgramInputConnectorValueReceived);
                channelReceived
                    .filter(message => message.message_type === 'online_status_change')
                    .subscribe(this.onlineStatus);
                channelReceived
                    .filter(message => message.message_type === 'becki_object_update')
                    .subscribe(this.objectUpdateTyrionEcho);
                channelReceived
                    .filter(message => message.message_type === 'newOutputConnectorValue')
                    .subscribe(this.BProgramOutputConnectorValueReceived);
                errorOccurred
                    .subscribe(this.webSocketErrorOccurred);

            })
            .catch((error) => {
                if (!this.websocketErrorShown) {
                    this.websocketErrorShown = true;
                    this.webSocketErrorOccurred.next(error);
                }
                this.reconnectWebSocketAfterTimeout();
            });
    }

    // WebSocket Messages:


    public requestDeviceTerminalSubcribe(deviceId: string, webSocketURL: string, logLevel: string): void {
        if (this.hardwareTerminalwebSockets) {

            let message = {
                message_id: this.uuid(),
                message_type: 'subscribe_hardware',
                hardware_ids: [deviceId],
                message_channel: 'hardware-logger',
                log_level: logLevel,
                websocketURL: webSocketURL,
            };

            this.sendWebSocketTerminalMessage(message);
        }
    }

    public requestDeviceTerminalUnsubcribe(deviceId: string, webSocketURL: string): void {

        if (this.hardwareTerminalwebSockets) {

            let message = {
                message_id: this.uuid(),
                message_type: 'unsubscribe_hardware',
                hardware_ids: [deviceId],
                message_channel: 'hardware-logger',
                websocketURL: webSocketURL,

            };

            this.sendWebSocketTerminalMessage(message);
        }
    }

    public requestNotificationsSubscribe(): void {
        let message = {
            message_id: this.uuid(),
            message_channel: BeckiBackend.WS_CHANNEL,
            message_type: 'subscribe_notification'
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'message_channel', 'message_type')) {
            this.sendWebSocketMessage(message);
        }
    }

    public requestNotificationsUnsubscribe(): void {
        let message = {
            message_id: this.uuid(),
            message_channel: BeckiBackend.WS_CHANNEL,
            message_type: 'unsubscribe_notification'
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'message_channel', 'message_type')) {
            this.sendWebSocketMessage(message);
        }
    }

    public requestBProgramSubscribe(version_id: string): void {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-262
        let message = {
            message_id: this.uuid(),
            message_channel: BeckiBackend.WS_CHANNEL,
            message_type: 'subscribe_instace',
            version_id
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'message_channel', 'message_type', 'version_id')) {
            this.sendWebSocketMessage(message);
        }
    }

    public requestBProgramValues(version_id: string): void {
        let message = {
            message_id: this.uuid(),
            message_channel: BeckiBackend.WS_CHANNEL,
            message_type: 'getValues',
            version_id
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'message_channel', 'message_type', 'version_id')) {
            this.sendWebSocketMessage(message);
        }
    }

    public uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}
