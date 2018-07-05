/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { TyrionAPI, IPerson, ILoginResult, ISocialNetworkLogin } from './TyrionAPI';
import * as Rx from 'rxjs';
import {
    BadRequest, BugFoundError, CodeCompileError,
    CodeError, InternalServerError, InvalidBody, LostConnectionError, ObjectNotFound, PermissionMissingError,
    RestRequest, RestResponse,
    UnauthorizedError, UnsupportedException, UserNotValidatedError
} from '../services/_backend_class/Responses';
import { WebsocketService } from '../services/websocket/WebsocketService';
import { IWebSocketNotification, WebsocketClientTyrion } from '../services/websocket/Websocket_Client_Tyrion';

declare const BECKI_VERSION: string;
// INTERFACES

// REQUEST CLASSES
export interface OnlineChangeStatus {
    model: ('Hardware' | 'Instance' | 'HomerServer' | 'CompilationServer');
    model_id: 'uuid';
    online_state: ('NOT_YET_FIRST_CONNECTED'|'FREEZED'|'SHUT_DOWN'|'SYNCHRONIZATION_IN_PROGRESS'|'OFFLINE'|'ONLINE'|'UNKNOWN_LOST_CONNECTION_WITH_SERVER');
}

export interface ModelChangeStatus {
    model: ('ProjectsRefreshAfterInvite' | 'Instance' | 'Project' | 'HomerServer' | 'Hardware' | 'CProgram' | 'MProgram' | 'BProgram' | 'ActualizationProcedure' | 'CProgramUpdatePlan');
    model_id: 'uuid';
}

// BECKI BACKEND

export abstract class TyrionApiBackend extends TyrionAPI {

    public static host = '127.0.0.1:9000';
    public static protocol = 'http';

    public requestProxyServerUrl = 'http://127.0.0.1:4000/fetch/';

    private beckiBeta: boolean = true; // Show Beta - next to logo

    public notificationReceived: Rx.Subject<IWebSocketNotification> = new Rx.Subject<IWebSocketNotification>();
    public webSocketErrorOccurred: Rx.Subject<any> = new Rx.Subject<any>();

    // Subscribers on Websocket for change online state or update object
    public onlineStatus: Rx.Subject<OnlineChangeStatus> = new Rx.Subject<OnlineChangeStatus>();
    public objectUpdateTyrionEcho: Rx.Subject<ModelChangeStatus> = new Rx.Subject<ModelChangeStatus>();

    // Task counter for list of requests
    public tasks: number = 0;

    protected personInfoSnapshotDirty: boolean = true;
    public personInfoSnapshot: IPerson = null;
    public personPermissions: string[] = null;
    public personInfo: Rx.Subject<IPerson> = new Rx.Subject<IPerson>();

    protected websocketService: WebsocketService = null;

    protected websocketErrorShown: boolean = false;

    protected abstract increaseTasks();
    protected abstract decreaseTasks();

    // CONSTRUCTOR
    public constructor() {
        super();


        if (location && location.hostname) {
            if (location.hostname.indexOf('portal.') === 0) {
                TyrionApiBackend.host = location.hostname.replace('portal.', 'tyrion.');
            } else {
                TyrionApiBackend.host = location.hostname + ':9000';
            }
        }

        if (location && location.protocol) {
            if (location.protocol === 'https:') {
                TyrionApiBackend.protocol = 'https';
            }
        }

        if (location.hostname.indexOf('portal.stage.') === 0) {
            this.requestProxyServerUrl = 'https://request.stage.byzance.cz/fetch/';
        }

        // Mac mini
        if (location && location.hostname.indexOf('test.byzance.dev') > -1) {
            this.requestProxyServerUrl = 'http://test.byzance.dev:4000/fetch/';
        }

        // Create WebSocket Connection
        this.websocketService = new WebsocketService(this);

        // Open Websocket to Tyrion
        this.websocketService.openTyrionWebsocketConnection(TyrionApiBackend.host + '/websocket/portal/');
    }



    /********************************************************************************************************************
     * GENERIC REQUESTS
     *
     * - Also support Homer Api
     */
    protected abstract requestRestGeneral(request: RestRequest): Promise<RestResponse>;

    public requestRestPath<T>(method: string, path: string, body: Object, success: number[]): Promise<T> {
        // console.info('requestRestPath:: method', method, 'path: ', path);

        // If path contains http on beginning! or first char is "/" its on 100% api path from TyrionAPI
        // For example /login or /get_projects:{all}
        // But if contains https - for example https://homer.server.cz/get_something - it didnt used ${this.protocol}://${this.host}${path}
        if (path.charAt(0) === '/') {
            // console.info('Its a Tyrion API');
            return this.requestRest(method, `${TyrionApiBackend.protocol}://${TyrionApiBackend.host}${path}`, body, success);
        } else {
            console.info('Its a External outside API');
            return this.requestRest(method, path, body, success);
        }
    }

    public requestRest<T>(method: string, url: string, body: Object, success: number[]): Promise<T> {
        // Create Request
        let request: RestRequest = new RestRequest(method, url, {}, body);

        // Set Token if Exist
        if (TyrionApiBackend.tokenExist()) {
            request.headers['X-Auth-Token'] = TyrionApiBackend.getToken();
        }
        // Set Becki Headers to Request
        request.headers['Becki-Version'] = BECKI_VERSION;

        // Set Task - New Try
        this.increaseTasks();
        return this.requestRestGeneral(request)
            .then((response: RestResponse) => {
                if (success.indexOf(response.status) > -1) {
                    this.decreaseTasks();
                    let res = response.body;
                    Object.defineProperty(res, '_code_', {
                        value: response.status,
                        enumerable: false,
                        writable: false
                    });
                    return <T>res;
                }
                switch (response.status) {
                    case 400: {

                        if (response.body['state'] === 'error') {
                            throw BadRequest.fromRestResponse(response);
                        } else if (response.body['state'] === 'invalid_body') {
                            throw InvalidBody.fromRestResponse(response);
                        } else if (response.body['state'] === 'unsupported_exception') {
                            throw UnsupportedException.fromRestResponse(response);
                        }

                        console.error('Incoming response.status: 400: state not recognize - ERROR 500: Incoming Response:: ', response);
                        // If there is not a state - Make a Critical error for sure
                        throw InternalServerError.fromRestResponse(response);
                    }
                    case 401:
                        throw UnauthorizedError.fromRestResponse(response);
                    case 403:
                        throw PermissionMissingError.fromRestResponse(response);
                    case 404:
                        throw ObjectNotFound.fromRestResponse(response);
                    case 422:
                        throw CodeCompileError.fromRestResponse(response);
                    case 477:
                        throw CodeError.fromRestResponse(response);
                    case 478:
                        throw CodeError.fromRestResponse(response);
                    case 500:
                        throw InternalServerError.fromRestResponse(response);
                    case 705:
                        throw UserNotValidatedError.fromRestResponse(response);
                    case 0:
                        throw new LostConnectionError();
                    default:
                        throw BugFoundError.fromRestResponse(response);
                }
            })
            .catch((e: any) => {
                console.error('Error from Response', e);
                this.decreaseTasks();
                throw e;
            });
    }

    // TOKEN MANIPULATIONS
    /* tslint:disable */
    public static getToken(): string {
        return window.localStorage.getItem('auth_token');
    }

    public static tokenExist(): boolean {
        return !!window.localStorage.getItem('auth_token');
    }
    /* tslint:enable */

    public getBeckiBeta(): boolean {
        return this.beckiBeta;
    }

    private setToken(token: string, withRefreshPersonalInfo = true): void {
        console.info('set_token');
        window.localStorage.setItem('auth_token', token);
        if (withRefreshPersonalInfo) {
            this.refreshPersonInfo();
        }
    }

    /**
     * Remove Token from Becki Memmory (Browser Memmory)
     */
    protected unsetToken(): void {
        window.localStorage.removeItem('auth_token');
        this.refreshPersonInfo();
    }


    /********************************************************************************************************************
     * LOGIN / LOGOUT
     *
     * Github
     * Facebook
     * Get Person Info by token
     */
    public login(email: string, password: string): Promise<any> {
        if (!email || !password) {
            throw new Error('email and password required');
        }

        return this.__login({
            email: email,
            password: password
        }).then((body) => {
            this.setToken(body.auth_token);
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
                this.setToken(body.auth_token);
                return body.redirect_url;
            });
    }

    public loginGitHub(redirectUrl: string): Promise<string> {
        return this.gitHubLogin(<ISocialNetworkLogin>{
            redirect_url: redirectUrl
        })
            .then(body => {
                this.setToken(body.auth_token, false);
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
        // console.info('refreshPersonInfo');
        this.personInfoSnapshotDirty = true;
        if (TyrionApiBackend.tokenExist()) {
            this.getTyrionWebsocketConnection().onReady();
            this.personGetByToken()
                .then((lr: ILoginResult) => {
                    console.info(lr);
                    this.personPermissions = lr.permissions;
                    this.personInfoSnapshotDirty = false;
                    this.personInfoSnapshot = lr.person;
                    this.personInfo.next(this.personInfoSnapshot);


                    // https://app.inlinemanual.com/ - its used for Guidelines - also very important is User tracking data sets in backend - like user id..etc  - You can find this comment on another places
                    window['inlineManualTracking'] = {
                        uid: lr.person.id, // Only this field is mandatory
                        email: lr.person.email,
                        username: lr.person.nick_name,
                        name: lr.person.first_name + ' ' + lr.person.last_name,
                        first_name: lr.person.first_name,
                        last_name: lr.person.last_name,
                        created: lr.person.created,
                        updated: lr.person.updated,
                        roles: lr.roles.map(x => x.name),
                        plan: 'Not Defined'
                    };

                    // line_manual_player.setOptions({hide_trigger: true});

                    // Language for Inline Manual
                    window['InlineManualOptions'] = {
                        language: 'en'
                    };

                    // "a5e626bda2d1636e3c6b147fa55fbba0d6f193a96029bb830966c223e6f40bca"
                    // "a5e626bda2d1636e3c6b147fa55fbba0d6f193a96029bb830966c223e6f40bca"
                    // "a5e626bda2d1636e3c6b147fa55fbba0d6f193a96029bb830966c223e6f40bca"

                    console.info('hmac: ', lr.hmac);

                    window['intercomSettings'] = {
                        app_id: 'cnrrdzsk',
                        id: lr.person.id,
                        user_id: lr.person.id,
                        name: lr.person.first_name + ' ' + lr.person.last_name, // Full name
                        email: lr.person.email, // Email address
                        user_hash: lr.hmac,
                        created_at: lr.person.created, // Signup Date
                        alignment: 'left',
                        horizontal_padding: 20,
                        vertical_padding: 40
                    };

                })
                .catch((error) => {
                    console.error(error);
                    this.unsetToken(); // TODO: maybe check error type before force logout user
                    this.personInfoSnapshotDirty = false;
                    this.personInfoSnapshot = null;
                    this.personInfo.next(this.personInfoSnapshot);
                });
        } else {
            this.personInfoSnapshotDirty = false;
            this.personInfoSnapshot = null;
            this.personInfo.next(this.personInfoSnapshot);
        }
    }


    /********************************************************************************************************************
     * Websocket
     *
     * Github
     * Facebook
     * Get Person Info by token
     */

    public getWebsocketService(): WebsocketService {
        return this.websocketService;
    }

    public getTyrionWebsocketConnection(): WebsocketClientTyrion {
        return this.websocketService.getTyrionWebsocketConnection();
    }

    /* tslint:disable */
    public static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line:no-bitwise
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    /* tslint:enable */

}
