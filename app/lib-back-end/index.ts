/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

import * as _ from "underscore";
import * as Rx from "rxjs";
import * as uuid from "node-uuid";

export function composeUserString(user:User, showEmail=false):string {
  "use strict";

  return user.nick_name || user.full_name || showEmail && user.mail || null;
}

export class RestRequest {

  method:string;

  url:string;

  headers:{[name: string]: string};

  body:Object;

  constructor(method:string, url:string, headers:{[name: string]: string} = {}, body?:Object) {
    "use strict";

    this.method = method;
    this.url = url;
    this.headers = {};
    for (let header in headers) {
      if (headers.hasOwnProperty(header)) {
        this.headers[header] = headers[header];
      }
    }
    this.headers["Accept"] = "application/json";
    this.body = body;
  }
}

export class RestResponse {

  status:number;

  body:Object;

  constructor(status:number, body:Object) {
    "use strict";

    this.status = status;
    this.body = body;
  }
}

interface WebSocketMessage {

  messageId:string;

  messageChannel:string;

  messageType:string;
}

interface WebSocketErrorMessage extends WebSocketMessage {

  status:string;

  error:string;
}

export class BugFoundError extends Error {

  name = "bug found error";

  adminMessage:string;

  userMessage:string;

  constructor(adminMessage:string, userMessage?:string) {
    "use strict";

    super(BugFoundError.composeMessage(adminMessage));
    // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
    this.message = BugFoundError.composeMessage(adminMessage);
    this.adminMessage = adminMessage;
    this.userMessage = userMessage;
  }

  static fromRestResponse(response:RestResponse):BugFoundError {
    "use strict";

    let content = response.body;
    let message:string;
    if (response.status == 400) {
      content = (<{exception:Object}>response.body).exception;
      message = (<{message:string}>response.body).message;
    }
    return new BugFoundError(`response ${response.status}: ${JSON.stringify(content)}`, message);
  }

  static fromWsResponse(response:WebSocketErrorMessage):BugFoundError {
    "use strict";

    return new BugFoundError(`response ${JSON.stringify(response)}`, response.error);
  }

  static composeMessage(adminMessage:string):string {
    "use strict";

    return `bug found in client or server: ${adminMessage}`;
  }
}

export class UnauthorizedError extends Error {

  name = "request unauthorized error";

  userMessage:string;

  constructor(userMessage:string, message = "authorized authentication token required") {
    "use strict";

    super(message);
    // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
    this.message = message;
    this.userMessage = userMessage;
  }

  static fromRestResponse(response:RestResponse):UnauthorizedError {
    "use strict";

    return new UnauthorizedError((<{message:string}>response.body).message);
  }
}

export class PermissionMissingError extends UnauthorizedError {

  static MESSAGE = "permission required";

  name = "permission missing error";

  userMessage:string;

  constructor(userMessage:string) {
    "use strict";

    super(PermissionMissingError.MESSAGE);
    // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
    this.message = PermissionMissingError.MESSAGE;
    this.userMessage = userMessage;
  }

  static fromRestResponse(response:RestResponse):PermissionMissingError {
    "use strict";

    return new PermissionMissingError((<{message:string}>response.body).message);
  }
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface User {

  id:string;

  mail:string;

  nick_name:string;

  full_name:string;

  last_title:string;

  edit_permission:boolean;

  delete_permission:boolean;
}

export declare class EventSource extends EventTarget {

  constructor(url:string);

  close():void;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Connection {

  connection_id:string;

  // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-217
  created:number;

  access_age:number;

  user_agent:string;

  typeOfConnection:string;

  notification_subscriber:boolean;

  providerUserId:string;

  providerKey:string;

  returnUrl:string;

  social_tokenVerified:boolean;

  read_permission:boolean;

  delete_permission:boolean;
}

export interface Notification {

  created:string;

  level:string;

  text:string;

  read:string;

  confirmation_required:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface MissedNotification {

  id:string;

  created:number;

  level:string;

  message:string;

  read:boolean;

  confirmation_required:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface MissedNotificationsCollection {

  content:MissedNotification[];

  from:number;

  to:number;

  total:number;

  pages:number[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Role {

  id:string;

  name:string;

  description:string;

  person_permissions_id:string[];

  persons_id:string[];

  update_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Permission {

  value:string;

  description:string;

  edit_permission:boolean;

  edit_person_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface RolesAndPermissions {

  roles:Role[];

  permissions:Permission[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface ApplicationDevice {

  id:string;

  name:string;

  portrait_width:number;

  portrait_height:number;

  landscape_width:number;

  landscape_height:number;

  portrait_square_width:number;

  portrait_square_height:number;

  landscape_square_width:number;

  landscape_square_height:number;

  width_lock:boolean;

  height_lock:boolean;

  portrait_min_screens:number;

  portrait_max_screens:number;

  landscape_min_screens:number;

  landscape_max_screens:number;

  touch_screen:boolean;

  edit_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface ApplicationDeviceCollection {

  public_types:ApplicationDevice[];

  private_types:ApplicationDevice[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface ApplicationGroup {

  id:string;

  program_name:string;

  program_description:string;

  date_of_create:number;

  project_id:string;

  m_programs:Application[];

  b_program_id:string;

  auto_incrementing:boolean;

  b_progam_connected_version_id:string;

  edit_permission:boolean;

  update_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Application {

  id:string;

  program_name:string;

  program_description:string;

  screen_size_type_id:string;

  m_code?:string;

  m_code_id:string;

  date_of_create:number;

  last_update:number;

  height_lock:boolean;

  width_lock:boolean;

  qr_token:string;

  websocket_address:string;

  m_project_id:string;

  read_qrToken_permission:boolean;

  edit_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Producer {

  id:string;

  name:string;

  description:string;

  type_of_boards_id:string[];

  edit_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface BackEndFile {

  id:string;

  file_name:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Version {

  id:string;

  version_name:string;

  version_description:string;

  date_of_create:number;

  files:BackEndFile[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Library {

  id:string;

  library_name:string;

  description:string;

  versions_id:string[];

  edit_permission:boolean;

  update_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface LibraryGroup {

  id:string;

  group_name:string;

  description:string;

  versions_id:string;

  processors_id:string[];

  edit_permission:boolean;

  update_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface LibraryGroupCollection {

  content:LibraryGroup[];

  from:number;

  to:number;

  total:number;

  pages:number[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Processor {

  id:string;

  processor_name:string;

  processor_code:string;

  description:string;

  speed:number;

  singleLibraries:string[];

  libraryGroups:string[];

  edit_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface DeviceType {

  id:string;

  name:string;

  producer_id:string;

  description:string;

  processor_id:string;

  connectible_to_internet:boolean;

  edit_permission:boolean;

  register_new_device_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface DeviceProgramVersion {

  version_object:Version;

  virtual_input_output:string;

  compilable:boolean;

  compilation_restored:boolean;

  compilation_in_progress:boolean;

  successfully_compiled:boolean;

  runing_on_board:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface DeviceProgram {

  id:string;

  program_name:string;

  program_description:string;

  program_versions:DeviceProgramVersion[];

  type_of_board_id:string;

  dateOfCreate:number;

  project_id:string;

  edit_permission:boolean;

  update_permission:boolean;

  delete_permission:boolean;
}

export interface DeviceCollection {

  content:Device[];

  from:number;

  to:number;

  total:number;

  pages:number[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Device {

  id:string;

  type_of_board_id:string;

  isActive:boolean;

  status:Object;

  up_to_date:boolean;

  personal_description:any;

  project_id:string;

  read_permission:boolean;

  edit_permission:boolean;

  update_permission:boolean;

  first_connect_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface CompilationServer {


  id:string;

  server_name:string;

  destination_address:string;

  hash_certificate:string;

  server_is_online:boolean;

  edit_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsBlockGroup {

  id:string;

  name:string;

  general_description:string;

  blockoBlocks:InteractionsBlock[];

  project_id:string;

  edit_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsBlock {

  id:string;

  name:string;

  author_id:string;

  general_description:string;

  type_of_block_id:string;

  versions:string[];

  edit_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsSchemeVersion {

  version_Object:Version;

  connected_boards:Object;

  master_board:Object;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsSchemeDeploymentDetails {

  uploaded:boolean;

  online:boolean;

  version_id?:string;

  where?:string;

  cloud?:Object;

  local?:Object;

  online_boards:Device[];

  m_project_id:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsScheme {

  id:string;

  name:string;

  program_description:string;

  program_versions:InteractionsSchemeVersion[];

  program_state:InteractionsSchemeDeploymentDetails;

  dateOfCreate:number;

  lastUpdate:number;

  project_id:string;

  edit_permission:boolean;

  update_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsModerator {

  id:string;

  type_of_device:string;

  online:boolean;

  version:string;

  boards_id:string[];

  project_id:string;

  edit_permission:boolean;

  update_permission:boolean;

  delete_permission:boolean;
}

export interface InteractionsSchemeValues {

  digital:{[hwId:string]:boolean};

  analog:{[hwId:string]:number};

  connector:{[id:string]:{inputs:{[name:string]:number}, outputs:{[name:string]:number}}};
}

export interface InteractionsSchemeValue<T> {

  hwId:string;

  value:T;
}

export interface InteractionsSchemeConnectorValue {

  blockId:string;

  connectorName:string;

  value:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsServer {
  id: string;

  server_name: string;

  hash_certificate: string;

  destination_address: string;

  server_is_online:string;

  edit_permission:boolean;

  delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Project {

  id:string;

  project_name:string;

  project_description:string;

  m_projects_id:string[];

  c_programs_id:string[];

  boards_id:string[];

  b_programs_id:string[];

  homers_id:string[];

  owners_id:string[];

  screen_size_types_id:string[];

  type_of_blocks_id:string[];

  edit_permission:boolean;

  update_permission:boolean;

  share_permission:boolean;

  unshare_permission:boolean;

  delete_permission:boolean;
}

export abstract class BackEnd {

  public static REST_SCHEME = "http";

  public static WS_SCHEME = "ws";

  public static HOST = "127.0.0.1:9000";

  public static APPLICATION_DEVICE_PATH = "/grid/screen_type";

  public static APPLICATION_GROUP_PATH = "/grid/m_project";

  public static APPLICATION_PATH = "/grid/m_program";

  public static COMPILATION_SERVER_PATH = "/compilation/server";

  public static DEVICE_PATH = "/compilation/board";

  public static DEVICE_PROGRAM_PATH = "/compilation/c_program/c_program";

  public static DEVICE_PROGRAM_VERSION_PATH = `/compilation/c_program/version`;

  public static DEVICE_TYPE_PATH = "/compilation/typeOfBoard";

  public static INTERACTIONS_BLOCK_GROUP_PATH = "/project/typeOfBlock";

  public static INTERACTIONS_BLOCK_PATH = "/project/blockoBlock";

  public static INTERACTIONS_MODERATOR_PATH = "/project/homer";

  public static INTERACTIONS_SCHEME_PATH = "/project/b_program";

  public static INTERACTIONS_SERVER_PATH = "/project/blocko/server";

  public static LIBRARY_GROUP_PATH = "/compilation/libraryGroup";

  public static LIBRARY_PATH = "/compilation/library";

  public static NOTIFICATION_PATH = "/notification";

  public static PERMISSION_PATH = "/secure/permission";

  public static PROCESSOR_PATH = "/compilation/processor";

  public static PRODUCER_PATH = "/compilation/producer";

  public static PROJECT_PATH = "/project/project";

  public static ROLE_PATH = "/secure/role";

  public static TOKEN_PATH = "/coreClient/person/permission";

  public static USER_PATH = "/coreClient/person/person";

  public static VALIDATION_PATH = "/coreClient/person/valid";

  public static WS_CHANNEL = "becki";

  private eventSource:EventSource;

  private webSocket:WebSocket;

  private webSocketMessageQueue:WebSocketMessage[];

  private webSocketReconnectTimeout:number;

  public notificationReceived:Rx.Subject<Notification>;

  public webSocketErrorOccurred:Rx.Subject<any>;

  public interactionsOpened:Rx.Subject<void>;

  public interactionsSchemeSubscribed:Rx.Subject<void>;

  public interactionsSchemeValuesReceived:Rx.Subject<InteractionsSchemeValues>;

  public interactionsSchemeAnalogValueReceived:Rx.Subject<InteractionsSchemeValue<number>>;

  public interactionsSchemeDigitalValueReceived:Rx.Subject<InteractionsSchemeValue<boolean>>;

  public interactionsSchemeInputConnectorValueReceived:Rx.Subject<InteractionsSchemeConnectorValue>;

  public interactionsSchemeOutputConnectorValueReceived:Rx.Subject<InteractionsSchemeConnectorValue>;

  public tasks:number;

  public constructor() {
    "use strict";

    this.eventSource = null;
    this.webSocketMessageQueue = [];
    this.webSocketReconnectTimeout = null;
    this.notificationReceived = new Rx.Subject<Notification>();
    this.webSocketErrorOccurred = new Rx.Subject<any>();
    this.interactionsOpened = new Rx.Subject<void>();
    this.interactionsSchemeSubscribed = new Rx.Subject<void>();
    this.interactionsSchemeValuesReceived = new Rx.Subject<InteractionsSchemeValues>();
    this.interactionsSchemeAnalogValueReceived = new Rx.Subject<InteractionsSchemeValue<number>>();
    this.interactionsSchemeDigitalValueReceived = new Rx.Subject<InteractionsSchemeValue<boolean>>();
    this.interactionsSchemeInputConnectorValueReceived = new Rx.Subject<InteractionsSchemeConnectorValue>();
    this.interactionsSchemeOutputConnectorValueReceived = new Rx.Subject<InteractionsSchemeConnectorValue>();
    this.tasks = 0;
    this.reconnectEventSource();
    this.reconnectWebSocket();
  }

  private setToken(token:string):void {
    "use strict";

    window.localStorage.setItem("authToken", token);
    this.reconnectEventSource();
    this.reconnectWebSocket();
  }

  private unsetToken():void {
    "use strict";

    window.localStorage.removeItem("authToken");
    this.reconnectEventSource();
    this.reconnectWebSocket();
  }

  private findEnqueuedWebSocketMessage(original:WebSocketMessage, ...keys:string[]):WebSocketMessage {
    "use strict";

    return this.webSocketMessageQueue.find(message => _.isMatch(message, _.pick(original, keys)));
  }

  protected abstract requestRestGeneral(request:RestRequest):Rx.Observable<RestResponse>;

  public requestRestPath<T>(method:string, path:string, body?:Object, success:number|number[]=200, contentType="application/json"):Promise<T> {
    "use strict";

    return this.requestRest(method, `${BackEnd.REST_SCHEME}://${BackEnd.HOST}${path}`, body, success, contentType).toPromise();
  }

  public requestRest<T>(method:string, url:string, body?:Object, success:number|number[]=200, contentType="application/json"):Rx.Observable<T> {
    "use strict";

    let request = new RestRequest(method, url, {"Content-Type": contentType}, body);
    // TODO: https://github.com/angular/angular/issues/7303
    if (window.localStorage.getItem("authToken")) {
      request.headers["X-AUTH-TOKEN"] = window.localStorage.getItem("authToken");
    }
    let successes = success instanceof Array ? success : [success];
    this.tasks += 1;
    return this.requestRestGeneral(request)
        .map(response => {
          if (successes.indexOf(response.status) != -1) {
            return response.body;
          }
          switch (response.status) {
            case 401:
              throw UnauthorizedError.fromRestResponse(response);
            case 403:
              throw PermissionMissingError.fromRestResponse(response);
            default:
              throw BugFoundError.fromRestResponse(response);
          }
        })
        .finally<T>(() => {
          this.tasks -= 1;
        });
  }

  private sendWebSocketMessageQueue():void {
    "use strict";

    this.webSocketMessageQueue.splice(0).forEach(message => {
      try {
        this.webSocket.send(JSON.stringify(message));
      } catch (err) {
        if (err.code == DOMException.INVALID_STATE_ERR) {
          this.webSocketMessageQueue.push(message);
        }
      }
    });
  }

  public sendWebSocketMessage(message:WebSocketMessage):void {
    "use strict";

    this.webSocketMessageQueue.push(message);
    this.sendWebSocketMessageQueue();
  }

  private reconnectEventSource():void {
    "use strict";

    if (this.eventSource) {
      this.eventSource.close();
    }
    this.eventSource = null;
    if (window.localStorage.getItem("authToken")) {
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-177
      this.eventSource = new EventSource(`${BackEnd.REST_SCHEME}://${BackEnd.HOST}${BackEnd.NOTIFICATION_PATH}/connection/${window.localStorage.getItem("authToken")}`);

      Rx.Observable
          .fromEvent<MessageEvent>(this.eventSource, "message")
          .map(event => JSON.parse(event.data))
          .subscribe(this.notificationReceived);
    }
  }

  private reconnectWebSocket():void {
    "use strict";

    clearTimeout(this.webSocketReconnectTimeout);
    this.webSocketReconnectTimeout = null;

    let setReconnectionTimeout = () => {
      if (this.webSocketReconnectTimeout == null) {
        this.webSocketReconnectTimeout = setTimeout(() => this.reconnectWebSocket(), 5000);
      }
    };

    if (this.webSocket) {
      this.webSocket.removeEventListener("close", setReconnectionTimeout);
      this.webSocket.close();
    }
    this.webSocket = null;
    if (window.localStorage.getItem("authToken")) {
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-260
      this.webSocket = new WebSocket(`${BackEnd.WS_SCHEME}://${BackEnd.HOST}/websocket/becki/${window.localStorage.getItem("authToken")}`);
      this.webSocket.addEventListener("close", setReconnectionTimeout);

      let opened = Rx.Observable
          .fromEvent<void>(this.webSocket, "open");
      let channelReceived = Rx.Observable
          .fromEvent<MessageEvent>(this.webSocket, "message")
          .map(event => JSON.parse(event.data))
          .filter(message => message.messageChannel == BackEnd.WS_CHANNEL);
      let errorOccurred = Rx.Observable
          .fromEvent(this.webSocket, "error");

      opened
          .subscribe(() => this.sendWebSocketMessageQueue());
      opened
          .subscribe(this.interactionsOpened);
      channelReceived
          .filter(message => message.status == "error")
          .map(message => BugFoundError.fromWsResponse(message))
          .subscribe(this.webSocketErrorOccurred);
      channelReceived
          .filter(message => message.messageType == "subscribe_instace" && message.status == "success")
          .subscribe(this.interactionsSchemeSubscribed);
      channelReceived
          .filter(message => message.messageType == "getValues" && message.status == "success")
          .subscribe(this.interactionsSchemeValuesReceived);
      channelReceived
          .filter(message => message.messageType == "newAnalogValue")
          .subscribe(this.interactionsSchemeAnalogValueReceived);
      channelReceived
          .filter(message => message.messageType == "newDigitalValue")
          .subscribe(this.interactionsSchemeDigitalValueReceived);
      channelReceived
          .filter(message => message.messageType == "newInputConnectorValue")
          .subscribe(this.interactionsSchemeInputConnectorValueReceived);
      channelReceived
          .filter(message => message.messageType == "newOutputConnectorValue")
          .subscribe(this.interactionsSchemeOutputConnectorValueReceived);
      errorOccurred
          .subscribe(this.webSocketErrorOccurred);
    }
  }

  public createUser(mail:string, password:string, nick_name:string):Promise<string> {
    "use strict";

    if (!mail || password.length < 8 || nick_name.length < 8) {
      throw "password >= 8 and username >= 8 and email required";
    }

    return this.requestRestPath("POST", BackEnd.USER_PATH, {nick_name, mail, password}, 201).then(JSON.stringify);
  }

  public getUser(id:string):Promise<User> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.USER_PATH}/${id}`);
  }

  public getUserEmailUsed(email:string):Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-187
    return this.requestRestPath<{code:number}>("GET", `${BackEnd.VALIDATION_PATH}/mail/${email}`).then(body => body.code == 200);
  }

  public getUsernameUsed(username:string):Promise<boolean> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-187
    return this.requestRestPath<{code:number}>("GET", `${BackEnd.VALIDATION_PATH}/nicknamewe/${username}`).then(body => body.code == 200);
  }

  public getUserRolesAndPermissions(id:string):Promise<RolesAndPermissions> {
    "use strict";

    return this.requestRestPath("GET", `/secure/person/system_acces/${id}`);
  }

  public getSignedUser():Promise<User> {
    "use strict";

    return this.requestRestPath<{person:User}>("GET", "/login/person").then(result => result.person);
  }

  public getUsers():Promise<User[]> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.USER_PATH}/all`);
  }

  public updateUser(id:string, full_name:string, nick_name:string, first_title:string, last_title:string):Promise<string> {
    "use strict";

    if (!full_name || !nick_name) {
      throw "name and username required";
    }

    return this.requestRestPath("PUT", `${BackEnd.USER_PATH}/${id}`, {nick_name, full_name, first_title, last_title}).then(JSON.stringify);
  }

  public addRoleToUser(role:string, user:string):Promise<string> {
    "use strict";

    return this.requestRestPath("PUT", `${BackEnd.ROLE_PATH}/person/${user}/${role}`, {}).then(JSON.stringify);
  }

  public removeRoleFromUser(role:string, user:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.ROLE_PATH}/person/${user}/${role}`).then(JSON.stringify);
  }

  public addPermissionToUser(permission:string, user:string):Promise<string> {
    "use strict";

    return this.requestRestPath("PUT", `${BackEnd.PERMISSION_PATH}/person/${user}/${permission}`, {}).then(JSON.stringify);
  }

  public removePermissionFromUser(permission:string, user:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.PERMISSION_PATH}/person/${user}/${permission}`).then(JSON.stringify);
  }

  public deleteUser(user:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.USER_PATH}/${user}`).then(JSON.stringify);
  }

  public createToken(mail:string, password:string):Promise<string> {
    "use strict";

    if (!mail || !password) {
      throw "email and password required";
    }

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-274
    return this.requestRestPath<{authToken:string}>("POST", `${BackEnd.TOKEN_PATH}/login`, {mail, password}).then((body) => {
      // TODO: https://github.com/angular/angular/issues/7303
      this.setToken(body.authToken);
      return JSON.stringify(body);
    });
  }

  public createFacebookToken(redirectUrl:string):Promise<string> {
    "use strict";

    redirectUrl = encodeURIComponent(redirectUrl);
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
    return this.requestRestPath<{authToken:string, redirect_url:string}>("GET", `/login/facebook?return_link=${redirectUrl}`).then(body => {
      // TODO: https://github.com/angular/angular/issues/7303
      this.setToken(body.authToken);
      return body.redirect_url;
    });
  }

  public createGitHubToken(redirectUrl:string):Promise<string> {
    "use strict";

    redirectUrl = encodeURIComponent(redirectUrl);
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
    return this.requestRestPath<{authToken:string, redirect_url:string}>("GET", `/login/github?return_link=${redirectUrl}`).then(body => {
      // TODO: https://github.com/angular/angular/issues/7303
      this.setToken(body.authToken);
      return body.redirect_url;
    });
  }

  public deleteToken():Promise<string> {
    "use strict";

    return this.requestRestPath("POST", `${BackEnd.TOKEN_PATH}/logout`, {}).then((body) => {
      // TODO: https://github.com/angular/angular/issues/7303
      this.unsetToken();
      return JSON.stringify(body);
    });
  }

  public getConnections():Promise<Connection[]> {
    "use strict";

    return this.requestRestPath("GET", "/coreClient/connections");
  }

  public removeConnection(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `/coreClient/connection/${id}`).then(JSON.stringify);
  }

  public getNotifications(page:number):Promise<MissedNotificationsCollection> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.NOTIFICATION_PATH}/list/${page}`);
  }

  public getRoles():Promise<Role[]> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.ROLE_PATH}/all`);
  }

  public getPermissions():Promise<Permission[]> {
    "use strict";

    return this.requestRestPath("GET", BackEnd.PERMISSION_PATH);
  }

  public createApplicationDevice(name:string, width:number, height:number, columns:number, rows:number, project_id:string) {
    "use strict";

    if (name.length < 3 || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(columns) || !Number.isInteger(rows)) {
      throw "name >= 3, integer width, integer height, integer columns and integer rows required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-220
    return this.requestRestPath("POST", BackEnd.APPLICATION_DEVICE_PATH, {name, height_lock: false, width_lock: false, touch_screen: false, project_id, landscape_height: width, landscape_width: height, landscape_square_height: columns, landscape_square_width: rows, landscape_max_screens: 10, landscape_min_screens: 1, portrait_height: height, portrait_width: width, portrait_square_height: rows, portrait_square_width: columns, portrait_max_screens: 10, portrait_min_screens: 1}, 201).then(JSON.stringify);
  }

  public getApplicationDevice(id:string):Promise<ApplicationDevice> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`);
  }

  public getApplicationDevices():Promise<ApplicationDeviceCollection> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", `${BackEnd.APPLICATION_DEVICE_PATH}/all`);
  }

  public updateApplicationDevice(id:string, name:string, width:number, height:number, columns:number, rows:number, width_lock:boolean, height_lock:boolean, portrait_min_screens:number, portrait_max_screens:number, landscape_min_screens:number, landscape_max_screens:number, touch_screen:boolean, project_id:string):Promise<string> {
    "use strict";

    if (name.length < 3 || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(columns) || !Number.isInteger(rows) || !Number.isInteger(portrait_min_screens) || !Number.isInteger(portrait_max_screens) || !Number.isInteger(landscape_min_screens) || !Number.isInteger(landscape_max_screens)) {
      throw "name >= 3, integer width, integer height, integer columns, integer rows and integer screen counts required";
    }

    return this.requestRestPath("PUT", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`, {name, height_lock, width_lock, touch_screen, project_id, landscape_height: width, landscape_width: height, landscape_square_height: columns, landscape_square_width: rows, landscape_max_screens, landscape_min_screens, portrait_height: height, portrait_width: width, portrait_square_height: rows, portrait_square_width: columns, portrait_max_screens, portrait_min_screens}).then(JSON.stringify);
  }

  public deleteApplicationDevice(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`).then(JSON.stringify);
  }

  public createApplicationGroup(program_name:string, program_description:string, projectId:string):Promise<ApplicationGroup> {
    "use strict";

    if (program_name.length < 4) {
      throw "name >= 4 required";
    }

    return this.requestRestPath("POST", `${BackEnd.APPLICATION_GROUP_PATH}/${projectId}`, {program_description, program_name}, 201);
  }

  public getApplicationGroup(id:string):Promise<ApplicationGroup> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", `${BackEnd.APPLICATION_GROUP_PATH}/${id}`);
  }

  public updateApplicationGroup(id:string, program_name:string, program_description:string):Promise<string> {
    "use strict";

    if (program_name.length < 4) {
      throw "name >= 4 required";
    }

    return this.requestRestPath("PUT", `${BackEnd.APPLICATION_GROUP_PATH}/${id}`, {program_description, program_name}).then(JSON.stringify);
  }

  public deleteApplicationGroup(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.APPLICATION_GROUP_PATH}/${id}`).then(JSON.stringify);
  }

  public createApplication(program_name:string, program_description:string, screen_type_id:string, m_code:string, groupId:string):Promise<string> {
    "use strict";

    if (program_name.length < 8 || !m_code) {
      throw "name >= 8 and code required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-220
    return this.requestRestPath("POST", `${BackEnd.APPLICATION_PATH}/${groupId}`, {screen_type_id, program_name, program_description, m_code, height_lock: false, width_lock: false}, 201).then(JSON.stringify);
  }

  public getApplication(id:string):Promise<Application> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-279
    return this.requestRestPath("GET", `${BackEnd.APPLICATION_PATH}/${id}`);
  }

  public getApplications():Promise<Application[]> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.APPLICATION_PATH}/app/m_programs`);
  }

  public updateApplication(id:string, program_name:string, program_description:string, screen_type_id:string, m_code:string):Promise<string> {
    "use strict";

    if (program_name.length < 8 || !m_code) {
      throw "name >= 8 and code required";
    }

    return this.requestRestPath("PUT", `${BackEnd.APPLICATION_PATH}/${id}`, {screen_type_id, program_name, program_description, m_code, height_lock: false, width_lock: false}).then(JSON.stringify);
  }

  public deleteApplication(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.APPLICATION_PATH}/${id}`).then(JSON.stringify);
  }

  public createProducer(name:string, description:string):Promise<string> {
    "use strict";

    if (name.length < 4 || description.length < 8) {
      throw "name >= 4 and description >= 8 required";
    }

    return this.requestRestPath("POST", BackEnd.PRODUCER_PATH, {name, description}, 201).then(JSON.stringify);
  }

  public getProducer(id:string):Promise<Producer> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.PRODUCER_PATH}/${id}`);
  }

  public getProducers():Promise<Producer[]> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.PRODUCER_PATH}/all`);
  }

  public updateProducer(id:string, name:string, description:string):Promise<string> {
    "use strict";

    if (name.length < 8 || description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    return this.requestRestPath("PUT", `${BackEnd.PRODUCER_PATH}/${id}`, {name, description}).then(JSON.stringify);
  }

  public deleteProducer(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.PRODUCER_PATH}/${id}`).then(JSON.stringify);
  }

  public getFile(id:string):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-252
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-277
    return this.requestRestPath("GET", `/file/fileRecord/${id}`);
  }

  public createLibrary(library_name:string, description:string):Promise<string> {
    "use strict";

    if (library_name.length < 8 || description.length < 8) {
      throw "name >= 8 and description >= 8 required";
    }

    return this.requestRestPath("POST", BackEnd.LIBRARY_PATH, {library_name, description}, 201).then(JSON.stringify);
  }

  public getLibrary(id:string):Promise<Library> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.LIBRARY_PATH}/${id}`);
  }

  public getLibraries(page:number):Promise<Library[]> {
    "use strict";

    if (page < 1) {
      throw "page >= 1 required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-276
    return this.requestRestPath("PUT", `${BackEnd.LIBRARY_PATH}/filter/${page}`, {});
  }

  public updateLibrary(id:string, library_name:string, description:string):Promise<string> {
    "use strict";

    if (library_name.length < 8 || description.length < 8) {
      throw "name >= 8 and description >= 8 required";
    }

    return this.requestRestPath("PUT", `${BackEnd.LIBRARY_PATH}/${id}`, {library_name, description}).then(JSON.stringify);
  }

  public addVersionToLibrary(version_name:string, version_description:string, id:string):Promise<Version> {
    "use strict";

    if (version_name.length < 8 || version_description.length < 8) {
      throw "name >= 8 and description >= 8 required";
    }

    return this.requestRestPath("POST", `${BackEnd.LIBRARY_PATH}/version/${id}`, {version_name, version_description}, 201);
  }

  public updateFileOfLibrary(file:File, version:string, id:string):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-118
    return this.requestRestPath("POST", `${BackEnd.LIBRARY_PATH}/uploud/${id}/${version}`, {file}, undefined, "multipart/form-data").then(JSON.stringify);
  }

  public deleteLibrary(id:string):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-282
    return this.requestRestPath("DELETE", `${BackEnd.LIBRARY_PATH}/${id}`).then(JSON.stringify);
  }

  public createLibraryGroup(group_name:string, description:string):Promise<string> {
    "use strict";

    if (!group_name || description.length < 24) {
      throw "description >= 24 and name required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-283
    return this.requestRestPath("POST", BackEnd.LIBRARY_GROUP_PATH, {description, group_name}, 201).then(JSON.stringify);
  }

  public getLibraryGroup(id:string):Promise<LibraryGroup> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`);
  }

  public getLibraryGroups(page:number):Promise<LibraryGroupCollection> {
    "use strict";

    if (page < 1) {
      throw "page >= 1 required";
    }

    return this.requestRestPath("PUT", `${BackEnd.LIBRARY_GROUP_PATH}/filter/${page}`, {});
  }

  public updateLibraryGroup(id:string, group_name:string, description:string):Promise<string> {
    "use strict";

    if (!group_name || description.length < 24) {
      throw "description >= 24 and name required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-283
    return this.requestRestPath("PUT", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`, {description, group_name}, 200).then(JSON.stringify);
  }

  public deleteLibraryGroup(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`).then(JSON.stringify);
  }

  public createProcessor(processor_name:string, processor_code:string, description:string, speed:number):Promise<string> {
    "use strict";

    if (processor_name.length < 4 || processor_code.length < 4 || description.length < 24 || !Number.isInteger(speed)) {
      throw "name >= 4, code >= 4 and description >= 24 required";
    }

    return this.requestRestPath("POST", BackEnd.PROCESSOR_PATH, {processor_name, description, processor_code, speed}, 201).then(JSON.stringify);
  }

  public getProcessor(id:string):Promise<Processor> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.PROCESSOR_PATH}/${id}`);
  }

  public getProcessors():Promise<Processor[]> {
    "use strict";

    return this.requestRestPath("GET", BackEnd.PROCESSOR_PATH);
  }

  public updateProcessor(id:string, processor_name:string, processor_code:string, description:string, speed:number):Promise<String> {
    "use strict";

    if (processor_name.length < 4 || processor_code.length < 4 || description.length < 24 || !Number.isInteger(speed)) {
      throw "name >= 4, code >= 4 and description >= 24 required";
    }

    return this.requestRestPath("PUT", `${BackEnd.PROCESSOR_PATH}/${id}`, {processor_name, description, processor_code, speed}).then(JSON.stringify);
  }

  public deleteProcessor(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.PROCESSOR_PATH}/${id}`).then(JSON.stringify);
  }

  public createDeviceType(name:string, producer_id:string, processor_id:string, connectible_to_internet:boolean, description:string):Promise<string> {
    "use strict";

    if (name.length < 8 || description.length < 10) {
      throw "name >= 8 and description >= 10 required";
    }

    return this.requestRestPath("POST", BackEnd.DEVICE_TYPE_PATH, {name, description, producer_id, processor_id, connectible_to_internet}, 201).then(JSON.stringify);
  }

  public getDeviceType(id:string):Promise<DeviceType> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.DEVICE_TYPE_PATH}/${id}`);
  }

  public getDeviceTypes():Promise<DeviceType[]> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.DEVICE_TYPE_PATH}/all`);
  }

  public updateDeviceType(id:string, name:string, producer_id:string, processor_id:string, connectible_to_internet:boolean, description:string):Promise<string> {
    "use strict";

    if (name.length < 8 || description.length < 10) {
      throw "name >= 8 and description >= 10 required";
    }

    return this.requestRestPath("PUT", `${BackEnd.DEVICE_TYPE_PATH}/${id}`, {name, description, producer_id, processor_id, connectible_to_internet}).then(JSON.stringify);
  }

  public deleteDeviceType(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.DEVICE_TYPE_PATH}/${id}`).then(JSON.stringify);
  }

  public createDeviceProgram(program_name:string, program_description:string, type_of_board_id:string, projectId:string):Promise<DeviceProgram> {
    "use strict";

    if (program_name.length < 8 || !type_of_board_id) {
      throw "name >= 8 and device type required";
    }

    return this.requestRestPath("POST", `${BackEnd.DEVICE_PROGRAM_PATH}/${projectId}`, {program_name, program_description, type_of_board_id}, 201);
  }

  public getDeviceProgram(id:string):Promise<DeviceProgram> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", `${BackEnd.DEVICE_PROGRAM_PATH}/${id}`);
  }

  public updateDeviceProgram(id:string, program_name:string, program_description:string, type_of_board_id:string):Promise<string> {
    "use strict";

    if (program_name.length < 8 || !type_of_board_id) {
      throw "name >= 8 and device type required";
    }

    return this.requestRestPath("PUT", `${BackEnd.DEVICE_PROGRAM_PATH}/${id}`, {program_name, program_description, type_of_board_id}).then(JSON.stringify);
  }

  public addVersionToDeviceProgram(code:string, program:string):Promise<string> {
    "use strict";

    if (!code) {
      throw "code required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-275
    return this.requestRestPath("POST", `${BackEnd.DEVICE_PROGRAM_VERSION_PATH}/create/${program}`, {code}, [200, 201]).then(JSON.stringify);
  }

  public deleteDeviceProgram(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.DEVICE_PROGRAM_PATH}/${id}`).then(JSON.stringify);
  }

  public createDeviceBinary(programVersionId:string):Promise<string> {
    "use strict";

    // TODO: http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-257
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-280
    return this.requestRestPath("PUT", `${BackEnd.DEVICE_PROGRAM_VERSION_PATH}/compile/${programVersionId}`, {}, undefined, "multipart/form-data").then(JSON.stringify);
  }

  public createDevice(id:string, type_of_board_id:string):Promise<string> {
    "use strict";

    if (!/^[0-9a-f]{8}$/.test(id)) {
      throw "ID = 8 hex chars required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-201
    return this.requestRestPath("POST", BackEnd.DEVICE_PATH, {type_of_board_id, hardware_unique_ids: [id]}, 201).then(JSON.stringify);
  }

  public getDevice(id:string):Promise<Device> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", `${BackEnd.DEVICE_PATH}/${id}`);
  }

  public getDevices(page:number):Promise<DeviceCollection> {
    "use strict";

    if (page < 1) {
      throw "page >= 1 required";
    }

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("PUT", `${BackEnd.DEVICE_PATH}/filter/${page}`, {});
  }

  public addBinaryToDevice(programVersionId:string, board_id:string[]):Promise<string> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-258
    //return this.requestRestPath("POST", `${BackEnd.DEVICE_PROGRAM_VERSION_PATH}/uploud/${programVersionId}`, {board_id}).then(JSON.stringify);
    return Promise.reject<string>("issue/TYRION-258");
  }

  public createCompilationServer(server_name:string):Promise<string> {
    "use strict";

    if (!server_name) {
      throw "name required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-268
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-287
    return this.requestRestPath("POST", BackEnd.COMPILATION_SERVER_PATH,{server_name}, 201).then(JSON.stringify);
  }

  public getCompilationServers():Promise<CompilationServer[]> {
    "use strict";
    return this.requestRestPath("GET", BackEnd.COMPILATION_SERVER_PATH);
  }

  public editCompilationServer(id:string,server_name:string):Promise<string> {
    "use strict";

    if (!server_name) {
      throw "name required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-287
    return this.requestRestPath("PUT", `${BackEnd.COMPILATION_SERVER_PATH}/${id}`,{server_name}).then(JSON.stringify);
  }

  public deleteCompilationServer(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.COMPILATION_SERVER_PATH}/${id}`).then(JSON.stringify);
  }

  public getInteractionsBlockGroup(id:string):Promise<InteractionsBlockGroup> {
    "use strict";

    return this.requestRestPath("GET", `${BackEnd.INTERACTIONS_BLOCK_GROUP_PATH}/${id}`);
  }

  public getInteractionsBlockGroups():Promise<InteractionsBlockGroup[]> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-235
    return this.requestRestPath("GET", BackEnd.INTERACTIONS_BLOCK_GROUP_PATH);
  }

  public createInteractionsBlock(name:string, type_of_block_id:string, general_description:string):Promise<InteractionsBlock> {
    "use strict";

    if (name.length < 8 || general_description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-220
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-251
    return this.requestRestPath("POST", BackEnd.INTERACTIONS_BLOCK_PATH, {general_description, name, type_of_block_id}, 201);
  }

  public getInteractionsBlock(id:string):Promise<InteractionsBlock> {
    "use strict";

    // TODO: http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", `${BackEnd.INTERACTIONS_BLOCK_PATH}/${id}`);
  }

  public updateInteractionsBlock(id:string, name:string, general_description:string, type_of_block_id:string):Promise<string> {
    "use strict";

    if (name.length < 8 || general_description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    return this.requestRestPath("PUT", `${BackEnd.INTERACTIONS_BLOCK_PATH}/${id}`, {general_description, name, type_of_block_id}).then(JSON.stringify);
  }

  public addVersionToInteractionsBlock(version_name:string, version_description:string, logic_json:string, program:string):Promise<string> {
    "use strict";

    if (!version_name || !version_description || !logic_json) {
      throw "name, description and code required";
    }

    return this.requestRestPath("POST", `${BackEnd.INTERACTIONS_BLOCK_PATH}/version/${program}`, {version_name, version_description, design_json: "-", logic_json}, 201).then(JSON.stringify);
  }

  public deleteInteractionsBlock(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.INTERACTIONS_BLOCK_PATH}/${id}`).then(JSON.stringify);
  }

  public createInteractionsScheme(name:string, program_description:string, projectId:string):Promise<InteractionsScheme> {
    "use strict";

    if (name.length < 8) {
      throw "name >= 8 required";
    }

    return this.requestRestPath("POST", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${projectId}`, {program_description, name}, 201);
  }

  public getInteractionsScheme(id:string):Promise<InteractionsScheme> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${id}`);
  }

  public subscribeInteractionsScheme(version_id:string):void {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-262
    let message = {messageId: uuid.v4(), messageChannel: BackEnd.WS_CHANNEL, messageType: "subscribe_instace", version_id};
    if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType', 'version_id')) {
      this.sendWebSocketMessage(message);
    }
  }

  public requestInteractionsSchemeValues(version_id:string):void {
    "use strict";

    let message = {messageId: uuid.v4(), messageChannel: BackEnd.WS_CHANNEL, messageType: "getValues", version_id};
    if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType', 'version_id')) {
      this.sendWebSocketMessage(message);
    }
  }

  public updateInteractionsScheme(id:string, name:string, program_description:string):Promise<string> {
    "use strict";

    if (name.length < 8) {
      throw "name >= 8 required";
    }

    return this.requestRestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${id}`, {program_description, name}).then(JSON.stringify);
  }

  public addApplicationGroupToInteractionsScheme(group:string, version:string, autoupdate:boolean):Promise<string> {
    "use strict";

    return this.requestRestPath("PUT", `${BackEnd.APPLICATION_GROUP_PATH}/connect/${group}/${version}/${autoupdate}`, {}).then(JSON.stringify);
  }

  public addVersionToInteractionsScheme(version_name:string, version_description:string, program:string, boards:{board_id:string, c_program_version_id:string}[], main_board:{board_id:string, c_program_version_id:string}, programId:string):Promise<InteractionsSchemeVersion> {
    "use strict";

    if (!version_name || !program || !main_board) {
      throw "name, scheme and gateway required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-284
    return this.requestRestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/update/${programId}`, {version_name, version_description, program, main_board, boards});
  }

  public deleteInteractionsScheme(id:string):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-185
    return this.requestRestPath("DELETE", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${id}`).then(JSON.stringify);
  }

  public createInteractionsModerator(homer_id:string, type_of_device:string):Promise<string> {
    "use strict";

    if (!homer_id) {
      throw "ID required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-285
    return this.requestRestPath("POST", BackEnd.INTERACTIONS_MODERATOR_PATH, {homer_id, type_of_device}, 201).then(JSON.stringify);
  }

  public getInteractionsModerator(id:string):Promise<InteractionsModerator> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", `${BackEnd.INTERACTIONS_MODERATOR_PATH}/${id}`);
  }

  public addSchemeToInteractionsModerator(versionId:string, moderatorId:string, schemeId:string):Promise<string> {
    "use strict";

    return this.requestRestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/uploadToHomer/${schemeId}/${versionId}/${moderatorId}`, {}).then(JSON.stringify);
  }

  public deleteInteractionsModerator(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.INTERACTIONS_MODERATOR_PATH}/${id}`).then(JSON.stringify);
  }

  public createInteractionsServer(server_name:string):Promise<string> {
    "use strict";

    if (!server_name) {
      throw "name required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-220
    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-288
    return this.requestRestPath("POST", BackEnd.INTERACTIONS_SERVER_PATH,{server_name}, 201).then(JSON.stringify);
  }

  public getInteractionsServers():Promise<InteractionsServer[]>{
    "use strict";
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath("GET", BackEnd.INTERACTIONS_SERVER_PATH);
  }

  public editInteractionsServer(id:string,server_name:string):Promise<string> {
    "use strict";

    if (!server_name) {
      throw "name required";
    }

    return this.requestRestPath("PUT", `${BackEnd.INTERACTIONS_SERVER_PATH}/${id}`,{server_name}).then(JSON.stringify);
  }

  public deleteInteractionsServer(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.INTERACTIONS_SERVER_PATH}/${id}`).then(JSON.stringify);
  }

  public createProject(project_name:string, project_description:string):Promise<Project> {
    "use strict";

    if (project_name.length < 8 || project_description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    return this.requestRestPath("POST", BackEnd.PROJECT_PATH, {project_name, project_description}, 201);
  }

  public createDefaultProject():Promise<Project> {
    "use strict";

    return this.createProject("Default project", "An automatically created project. It can be edited or removed like any other project.");
  }

  public getProject(id:string):Promise<Project> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
    return this.requestRestPath<Project>("GET", `${BackEnd.PROJECT_PATH}/${id}`);
  }

  public getProjects():Promise<Project[]> {
    "use strict";

    return this.requestRestPath("GET", BackEnd.PROJECT_PATH);
  }

  public updateProject(id:string, project_name:string, project_description:string):Promise<string> {
    "use strict";

    if (project_name.length < 8 || project_description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    return this.requestRestPath<Project>("PUT", `${BackEnd.PROJECT_PATH}/${id}`, {project_name, project_description}).then(JSON.stringify);
  }

  public addDeviceToProject(device:string, project:string):Promise<string> {
    "use strict";

    return this.requestRestPath("PUT", `${BackEnd.DEVICE_PATH}/${device}/${project}`, {}).then(JSON.stringify);
  }

  public removeDeviceFromProject(device:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.DEVICE_PATH}/${device}`).then(JSON.stringify);
  }

  public addInteractionsModeratorToProject(moderator:string, project:string):Promise<string> {
    "use strict";

    return this.requestRestPath("PUT", `${BackEnd.INTERACTIONS_MODERATOR_PATH}/${project}/${moderator}`, {}).then(JSON.stringify);
  }

  public removeInteractionsModeratorFromProject(moderator:string, project:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.INTERACTIONS_MODERATOR_PATH}/${project}/${moderator}`).then(JSON.stringify);
  }

  public addCollaboratorToProject(collaborator:string, project:string):Promise<string> {
    "use strict";

    return this.requestRestPath("PUT", `${BackEnd.PROJECT_PATH}/shareProject/${project}`, {persons: [collaborator]}).then(JSON.stringify);
  }

  public removeCollaboratorsFromProject(persons:string[], project:string):Promise<string> {
    "use strict";

    return this.requestRestPath("PUT", `${BackEnd.PROJECT_PATH}/unshareProject/${project}`, {persons}).then(JSON.stringify);
  }

  public deleteProject(id:string):Promise<string> {
    "use strict";

    return this.requestRestPath("DELETE", `${BackEnd.PROJECT_PATH}/${id}`).then(JSON.stringify);
  }
}
