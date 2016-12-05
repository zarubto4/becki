/**
 * Created by davidhradek on 08.09.16.
 */

import {TyrionAPI, INotification, IPerson, ILoginResult, IWebSocketToken} from "./TyrionAPI";
import * as _ from "underscore";
import * as Rx from "rxjs";
import * as uuid from "node-uuid";

// INTERFACES

export interface IBProgramValues {
    digital: {[hwId: string]: boolean};
    analog: {[hwId: string]: number};
    connector: {[id: string]: {inputs: {[name: string]: number}, outputs: {[name: string]: number}}};
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
    messageId: string;
    messageChannel: string;
    messageType: string;
}

export interface IWebSocketErrorMessage extends IWebSocketMessage {
    status: string;
    error: string;
}

export interface IWebSocketNotification extends INotification, IWebSocketMessage {
    state: ("created"|"updated"|"confirmed"|"deleted");
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

    headers: {[name: string]: string};

    body: Object;

    constructor(method: string, url: string, headers: {[name: string]: string} = {}, body?: Object) {
        this.method = method;
        this.url = url;
        this.headers = {};
        for (let header in headers) {
            if (headers.hasOwnProperty(header)) {
                this.headers[header] = headers[header];
            }
        }
        this.headers["Accept"] = "application/json";
        this.headers["Content-Type"] = "application/json";
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

export class BugFoundError extends Error {

    name = "bug found error";

    adminMessage: string;

    userMessage: string;

    constructor(adminMessage: string, userMessage?: string) {
        super(BugFoundError.composeMessage(adminMessage));
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = BugFoundError.composeMessage(adminMessage);
        this.adminMessage = adminMessage;
        this.userMessage = userMessage;
    }

    static fromRestResponse(response: RestResponse): BugFoundError {
        let content = response.body;
        let message: string;
        if (response.status == 400) {
            content = (<{exception: Object}>response.body).exception;
            message = (<{message: string}>response.body).message;
            if (!message) {
                message = (<{error: string}>response.body).error;
            }
        }
        return new BugFoundError(`response ${response.status}: ${JSON.stringify(content)}`, message);
    }

    static fromWsResponse(response: IWebSocketErrorMessage): BugFoundError {
        return new BugFoundError(`response ${JSON.stringify(response)}`, response.error);
    }

    static composeMessage(adminMessage: string): string {
        return `bug found in client or server: ${adminMessage}`;
    }
}

export class CodeError extends Error {

    constructor(msg: string) {
        super(msg);
        this.message = msg;
    }

    static fromRestResponse(response: RestResponse): CodeError {
        let content = response.body;
        if (response.status == 477) {
            return new CodeError(`External server is offline: ${JSON.stringify(content)}`);
        }
        if (response.status == 478) {
            return new CodeError(`External server side error: ${JSON.stringify(content)}`);
        }
        return new CodeError("Unknown error");
    }

}

export class CodeCompileError extends Error {

    errors: ICodeCompileErrorMessage[] = [];

    constructor(msg: string) {
        super(msg);
        this.message = msg;
    }

    static fromRestResponse(response: RestResponse): CodeCompileError {
        var cce = new CodeCompileError(`Compile error.`);
        if (Array.isArray(response.body)) {
            cce.errors = <ICodeCompileErrorMessage[]>response.body;
        }
        return cce;


    }

}

export class UnauthorizedError extends Error {

    name = "request unauthorized error";

    userMessage: string;

    constructor(userMessage: string, message = "authorized authentication token required") {
        super(message);
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = message;
        this.userMessage = userMessage;
    }

    static fromRestResponse(response: RestResponse): UnauthorizedError {
        return new UnauthorizedError((<{message: string}>response.body).message);
    }
}

export class PermissionMissingError extends UnauthorizedError {

    static MESSAGE = "permission required";

    name = "permission missing error";

    userMessage: string;

    constructor(userMessage: string) {
        super(PermissionMissingError.MESSAGE);
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = PermissionMissingError.MESSAGE;
        this.userMessage = userMessage;
    }

    static fromRestResponse(response: RestResponse): PermissionMissingError {
        return new PermissionMissingError((<{message: string}>response.body).message);
    }
}

// BECKI BACKEND

export abstract class BeckiBackend extends TyrionAPI {

    public static REST_SCHEME = "http";

    public static WS_SCHEME = "ws";

    public static WS_CHANNEL = "becki";

    public host = "127.0.0.1:9000";

    private webSocket: WebSocket = null;

    private webSocketMessageQueue: IWebSocketMessage[] = [];

    private webSocketReconnectTimeout: any = null;

    public notificationReceived: Rx.Subject<IWebSocketNotification> = new Rx.Subject<IWebSocketNotification>();

    public webSocketErrorOccurred: Rx.Subject<any> = new Rx.Subject<any>();

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
    public personInfo: Rx.Subject<IPerson> = new Rx.Subject<IPerson>();

    // CONSTRUCTOR

    public constructor() {
        super();
        // TODO: make better environment detection
        if (location && location.hostname) {
            this.host = location.hostname + ":9000";
        }
    }

    // GENERIC REQUESTS

    protected abstract requestRestGeneral(request: RestRequest): Rx.Observable<RestResponse>;

    public requestRestPath<T>(method: string, path: string, body: Object, success: number[]): Promise<T> {
        return this.requestRest(method, `${BeckiBackend.REST_SCHEME}://${this.host}${path}`, body, success).toPromise();
    }

    public requestRest<T>(method: string, url: string, body: Object, success: number[]): Rx.Observable<T> {
        let request: RestRequest = new RestRequest(method, url, {}, body);
        // TODO: https://github.com/angular/angular/issues/7438
        if (this.tokenExist()) {
            request.headers["X-AUTH-TOKEN"] = this.getToken();
        }
        this.tasks += 1;
        return this.requestRestGeneral(request)
            .map((response: RestResponse) => {
                if (success.indexOf(response.status) > -1) {
                    return <T>response.body;
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
                    default:
                        throw BugFoundError.fromRestResponse(response);
                }
            })
            .finally(() => {
                this.tasks -= 1;
            });
    }

    // TOKEN MANIPULATIONS

    private getToken(): string {
        return window.localStorage.getItem("authToken");
    }

    private setToken(token: string): void {
        window.localStorage.setItem("authToken", token);
        this.refreshPersonInfo();
    }

    public tokenExist(): boolean {
        return window.localStorage.getItem("authToken") ? true : false;
    }

    private unsetToken(): void {
        window.localStorage.removeItem("authToken");
        this.refreshPersonInfo();
    }

    // LOGIN / LOGOUT

    public login(mail: string, password: string): Promise<any> {
        if (!mail || !password) {
            throw "email and password required";
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
            })
    }

    public loginFacebook(redirectUrl: string): Promise<string> {
        return this.__loginFacebook(redirectUrl)
            .then(body => {
                this.setToken(body.authToken);
                return body.redirect_url;
            });
    }

    public loginGitHub(redirectUrl: string): Promise<string> {
        return this.__loginGitHub(redirectUrl)
            .then(body => {
                this.setToken(body.authToken);
                return body.redirect_url;
            });
    }

    public logout(): Promise<any> {
        return new Promise<any>((resolve, reject)=> {
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

    protected refreshPersonInfo(): void {
        this.personInfoSnapshotDirty = true;
        if (this.tokenExist()) {
            this.getLoggedInPerson()
                .then((lr: ILoginResult) => {
                    this.personInfoSnapshotDirty = false;
                    this.personInfoSnapshot = lr.person;
                    this.personInfo.next(this.personInfoSnapshot);
                    this.connectWebSocket();
                })
                .catch((error) => {
                    console.log(error);
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
        return this.webSocketMessageQueue.find(message => _.isMatch(message, _.pick(original, keys)));
    }

    private sendWebSocketMessageQueue(): void {
        if (this.webSocket) {
            this.webSocketMessageQueue.slice().forEach(message => {
                try {
                    this.webSocket.send(JSON.stringify(message));
                    var i = this.webSocketMessageQueue.indexOf(message);
                    if (i > -1) {
                        this.webSocketMessageQueue.splice(i);
                    }
                } catch (err) {
                    console.log("ERR" + err);
                }
            });
        }
    }

    public sendWebSocketMessage(message: IWebSocketMessage): void {
        this.webSocketMessageQueue.push(message);
        this.sendWebSocketMessageQueue();
    }

    // define function as property is needed to can set it as event listener (class methods is called with wrong this)
    protected reconnectWebSocketAfterTimeout = () => {
        console.log("reconnectWebSocketAfterTimeout()");
        clearTimeout(this.webSocketReconnectTimeout);
        this.webSocketReconnectTimeout = setTimeout(() => {
            this.connectWebSocket()
        }, 5000);
    };

    protected disconnectWebSocket(): void {
        console.log("disconnectWebSocket()");
        if (this.webSocket) {
            this.webSocket.removeEventListener("close", this.reconnectWebSocketAfterTimeout);
            this.webSocket.close();
        }
        this.webSocket = null;
    }

    protected connectWebSocket(): void {
        if (!this.tokenExist()) {
            console.log("connectWebSocket() :: cannot connect now, user token doesn't exists.");
            return;
        }
        this.disconnectWebSocket();

        this.getWebsocketAccessToken()
            .then((webSocketToken: IWebSocketToken) => {

                console.log("connectWebSocket() :: webSocketToken = " + webSocketToken.websocket_token);

                this.webSocket = new WebSocket(`${BeckiBackend.WS_SCHEME}://${this.host}/websocket/becki/${webSocketToken.websocket_token}`);
                this.webSocket.addEventListener("close", this.reconnectWebSocketAfterTimeout);

                let opened = Rx.Observable
                    .fromEvent<void>(this.webSocket, "open");
                let channelReceived = Rx.Observable
                    .fromEvent<MessageEvent>(this.webSocket, "message")
                    .map(event => { //TODO: think why is this triggered 8 times (for 8 subscribes)
                        try {
                            return JSON.parse(event.data);
                        } catch (e) {
                            console.log("parse: " + e);
                        }
                        return null;
                    })
                    .filter(message => (message && message.messageChannel == BeckiBackend.WS_CHANNEL));
                let errorOccurred = Rx.Observable
                    .fromEvent(this.webSocket, "error");

                opened.subscribe(() => {
                    this.requestNotificationsSubscribe();
                });
                opened
                    .subscribe(() => this.sendWebSocketMessageQueue());
                opened
                    .subscribe(this.interactionsOpened);

                channelReceived
                    .filter(message => message.messageType == "ping")
                    .subscribe((msg) => {
                        if (this.webSocket.readyState == WebSocket.OPEN) {
                            this.webSocket.send(JSON.stringify({
                                messageType: "ping",
                                messageId: msg.messageId,
                                messageChannel: msg.messageChannel,
                                status: "success"
                            }));
                        }
                    });

                channelReceived
                    .filter(message => message.status == "error")
                    .map(message => BugFoundError.fromWsResponse(message))
                    .subscribe(this.webSocketErrorOccurred);
                channelReceived
                    .filter(message => message.messageType == "subscribe_instace" && message.status == "success")
                    .subscribe(this.interactionsSchemeSubscribed);
                channelReceived
                    .filter(message => message.messageType == "subscribe_notification" || message.messageType == "unsubscribe_notification" || message.messageType == "notification")
                    .subscribe(this.notificationReceived);
                channelReceived
                    .filter(message => message.messageType == "getValues" && message.status == "success")
                    .subscribe(this.BProgramValuesReceived);
                channelReceived
                    .filter(message => message.messageType == "newAnalogValue")
                    .subscribe(this.BProgramAnalogValueReceived);
                channelReceived
                    .filter(message => message.messageType == "newDigitalValue")
                    .subscribe(this.BProgramDigitalValueReceived);
                channelReceived
                    .filter(message => message.messageType == "newInputConnectorValue")
                    .subscribe(this.BProgramInputConnectorValueReceived);
                channelReceived
                    .filter(message => message.messageType == "newOutputConnectorValue")
                    .subscribe(this.BProgramOutputConnectorValueReceived);
                errorOccurred
                    .subscribe(this.webSocketErrorOccurred);

            })
            .catch((error) => {
                this.webSocketErrorOccurred.next(error);
            });
    }

    // WebSocket Messages:

    public requestNotificationsSubscribe(): void {
        let message = {
            messageId: uuid.v4(),
            messageChannel: BeckiBackend.WS_CHANNEL,
            messageType: "subscribe_notification"
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType')) {
            this.sendWebSocketMessage(message);
        }
    }

    public requestNotificationsUnsubscribe(): void {
        let message = {
            messageId: uuid.v4(),
            messageChannel: BeckiBackend.WS_CHANNEL,
            messageType: "unsubscribe_notification"
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType')) {
            this.sendWebSocketMessage(message);
        }
    }

    public  requestBProgramSubscribe(version_id: string): void {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-262
        let message = {
            messageId: uuid.v4(),
            messageChannel: BeckiBackend.WS_CHANNEL,
            messageType: "subscribe_instace",
            version_id
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType', 'version_id')) {
            this.sendWebSocketMessage(message);
        }
    }

    public requestBProgramValues(version_id: string): void {
        let message = {
            messageId: uuid.v4(),
            messageChannel: BeckiBackend.WS_CHANNEL,
            messageType: "getValues",
            version_id
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType', 'version_id')) {
            this.sendWebSocketMessage(message);
        }
    }

}
