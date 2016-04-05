/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
/**
 * A service providing access to the back end.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Documentation in this file might be outdated and the code might be dirty and
 * flawed since management prefers speed over quality.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

export function composePersonString(person:Person):string {
  "use strict";

  if (person.nick_name) {
    return person.nick_name;
  }

  let nameParts:string[] = [];
  if (person.first_name) {
    nameParts.push(person.first_name);
  }
  if (person.middle_name) {
    nameParts.push(person.middle_name);
  }
  if (person.last_name) {
    nameParts.push(person.last_name);
  }
  if (nameParts) {
    return nameParts.join(" ");
  }

  if (person.mail) {
    return person.mail;
  }

  return null;
}

/**
 * An HTTP request.
 */
export class Request {

  /**
   * The HTTP method.
   */
  method:string;

  url:string;

  /**
   * The HTTP headers.
   */
  headers:{[name: string]: string};

  /**
   * The body of the request as a JSON string.
   */
  body:string;

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
    this.headers["Content-Type"] = "application/json";
    this.body = body ? JSON.stringify(body) : "";
  }
}

/**
 * An HTTP response.
 */
export class Response {

  /**
   * The status code of the response.
   */
  status:number;

  /**
   * The body of the response.
   */
  body:Object;

  /**
   * Create a new response instance.
   *
   * @param status the status code of the response.
   * @param body the response body.
   */
  constructor(status:number, body:Object) {
    "use strict";

    this.status = status;
    this.body = body;
  }
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

  static fromResponse(response:Response):BugFoundError {
    "use strict";

    let content = response.body;
    let message:string;
    if (response.status == 400) {
      content = (<{exception:Object}>response.body).exception;
      message = (<{message:string}>response.body).message;
    }
    return new BugFoundError(`response ${response.status}: ${JSON.stringify(content)}`, message);
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

  static fromResponse(response:Response):UnauthorizedError {
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

  static fromReponse(response:Response):PermissionMissingError {
    "use strict";

    return new PermissionMissingError((<{message:string}>response.body).message);
  }
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Person {

  id:string;

  mail:string;

  nick_name:string;

  first_name:string;

  middle_name:string;

  last_name:string;

  first_title:string;

  last_title:string;

  date_of_birth:number;
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

  project:string;

  m_programs:Application[];

  b_program:string;

  auto_incrementing:boolean;

  b_progam_connected_version:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Application {

  id:string;

  program_name:string;

  program_description:string;

  screen_size_type:string;

  m_code?:string;

  m_code_url:string;

  date_of_create:number;

  last_update:number;

  height_lock:boolean;

  width_lock:boolean;

  qr_token:string;

  websocket_address:string;

  m_project:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Producer {

  id:string;

  name:string;

  description:string;

  type_of_boards:string;
}

export interface FileContent {

  content:string;

  file_name:string;
}

export interface File {

  id:string;

  file_name:string;

  fileContent:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Version {

  id:string;

  version_name:string;

  version_description:string;

  date_of_create:number;

  files:number;

  allFiles:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Library {

  id:string;

  library_name:string;

  description:string;

  versions:string;

  versionsCount:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface LibraryGroup {

  id:string;

  group_name:string;

  description:string;

  versions:string;

  processors:string;

  versionsCount:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Processor {

  id:string;

  processor_name:string;

  processor_code:string;

  description:string;

  speed:number;

  singleLibraries:string;

  libraryGroups:string;

  singleLibrariesCount:number;

  libraryGroupsCount:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface DeviceType {

  id:string;

  name:string;

  producer:string;

  description:string;

  processor:string;

  libraries:string;

  libraryGroups:string;

  boards:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface DeviceProgram {

  id:string;

  program_name:string;

  program_description:string;

  version_objects:Version[];

  dateOfCreate:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Device {

  id:string;

  type_of_board:string;

  isActive:boolean;

  personal_description:any;

  projects:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface StandaloneProgramCategory {

  id:string;

  name:string;

  generalDescription:string;

  blockoBlocks:StandaloneProgram[];

  project:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface StandaloneProgram {

  id:string;

  name:string;

  author:string;

  general_description:string;

  type_of_block:string;

  versions:string;

  countOfversions:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface StandaloneProgramCollectionItem {

  typeOfBlock:StandaloneProgramCategory;

  Blocks:StandaloneProgram[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface StandaloneProgramCollection {

  [type: string]: StandaloneProgramCollectionItem;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsScheme {

  b_program_id:string;

  name:string;

  program_description:string;

  versionObjects:Version[];

  program_state:Object;

  dateOfCreate:number;

  lastUpdate:number;

  project:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsModerator {

  homer_id:string;

  type_of_device:string;

  online:boolean;

  version:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Project {

  id:string;

  project_name:string;

  project_description:string;

  m_projects:string;

  c_programs:string;

  boards:string;

  b_programs:string;

  homers:string;

  owners:string;

  screen_size_types:string;

  type_of_blocks:string;

  count_m_projects:number;

  count_c_programs:number;

  count_Boards:number;

  count_b_programs:number;

  count_Homers:number;

  count_owners:number;

  count_screen_size_types:number;

  count_type_of_blocks:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface IssueType {

  id: string;

  type:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface IssueConfirmation {

  id:string;

  type:string;

  color:string;

  size:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Issue {

  postId:string;

  type:IssueType;

  name:string;

  text_of_post:string;

  author:Person;

  date_of_create:string;

  answers:Answer[];

  comments:Comment[];

  hashTags:string[];

  likes:number;

  linked_answers:IssueLink[];

  type_of_confirms:IssueConfirmation[];

  updated:boolean;

  views:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Answer {

  postId:string;

  text_of_post:string;

  author:Person;

  date_of_create:string;

  comments:Comment[];

  hashTags:string[];

  likes:number;

  updated:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Comment {

  postId:string;

  likes:number;

  date_of_create:string;

  text_of_post:string;

  author:Person;

  hashTags:string[];

  updated:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface IssueLink {

  linkId:string;

  answer:Issue;
}

/**
 * A service providing access to the back end at 127.0.0.1:9000.
 */
export abstract class BackEnd {

  static BASE_URL = "http://127.0.0.1:9000";

  static ANSWER_PATH = "/overflow/answer";

  static APPLICATION_DEVICE_PATH = "/grid/screen_type";

  static APPLICATION_GROUP_PATH = "/grid/m_project";

  static APPLICATION_PATH = "/grid/m_program";

  static COMMENT_PATH = "/overflow/comment";

  static DEVICE_PATH = "/compilation/board";

  static DEVICE_PROGRAM_PATH = "/compilation/c_program";

  static DEVICE_TYPE_PATH = "/compilation/typeOfBoard";

  static INTERACTIONS_MODERATOR_PATH = "/project/homer";

  static INTERACTIONS_SCHEME_PATH = "/project/b_program";

  static ISSUE_CONFIRMATION_PATH = "/overflow/typeOfConfirm";

  static ISSUE_LINK_PATH = "/overflow/link";

  static ISSUE_PATH = "/overflow/post";

  static ISSUE_TAG_PATH = "/overflow/hashTag";

  static ISSUE_TYPE_PATH = "/overflow/typeOfPost";

  static LIBRARY_GROUP_PATH = "/compilation/libraryGroup";

  static LIBRARY_PATH = "/compilation/library";

  /**
   * An absolute path to the person resources.
   */
  static PERSON_PATH = "/coreClient/person/person";

  static PROCESSOR_PATH = "/compilation/processor";

  static PRODUCER_PATH = "/compilation/producer";

  /**
   * An absolute path to the project resources.
   */
  static PROJECT_PATH = "/project/project";

  static STANDALONE_PROGRAM_PATH = "/project/blockoBlock";

  /**
   * An absolute path to the permission resources.
   */
  static TOKEN_PATH = "/coreClient/person/permission";

  tasks = 0;

  /**
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   */
  protected abstract requestGeneral(request:Request):Promise<Response>;

  public requestPath<Response>(method:string, path:string, body?:Object, successes=[200]):Promise<Response> {
    "use strict";

    return this.request(method, BackEnd.BASE_URL + path, body, successes);
  }

  public request<T>(method:string, url:string, body?:Object, successes=[200]):Promise<T> {
    "use strict";

    let request = new Request(method, url, {}, body);
    // TODO: https://github.com/angular/angular/issues/7303
    if (window.localStorage.getItem("authToken")) {
      request.headers["X-AUTH-TOKEN"] = window.localStorage.getItem("authToken");
    }
    this.tasks += 1;
    return this.requestGeneral(request)
        .then(
            response => {
              this.tasks -= 1;
              if (successes.indexOf(response.status) != -1) {
                return response.body;
              }
              switch (response.status) {
                case 401:
                  // TODO: https://github.com/angular/angular/issues/4558
                  return Promise.reject(UnauthorizedError.fromResponse(response));
                case 403:
                  // TODO: https://github.com/angular/angular/issues/4558
                  return Promise.reject(PermissionMissingError.fromResponse(response));
                default:
                  // TODO: https://github.com/angular/angular/issues/4558
                  return Promise.reject(BugFoundError.fromResponse(response));
              }
            },
            reason => {
              this.tasks -= 1;
              // TODO: https://github.com/angular/angular/issues/4558
              return Promise.reject(reason);
            }
        );
  }

  /**
   * Create a new person.
   *
   * @param email their email address.
   * @param password their password.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public createPerson(mail:string, password:string, nick_name:string):Promise<string> {
    "use strict";

    if (!mail || password.length < 8 || nick_name.length < 8) {
      throw "password >= 8 and username >= 8 and email required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-175
    return this.requestPath("POST", BackEnd.PERSON_PATH, {nick_name, mail, password}, [201]).then(JSON.stringify);
  }

  /**
   * Log a person in.
   *
   * If the communication with the back end fails, the rejection reason is an
   * instance of {@link BackEndError}. Any other reason indicates that the login
   * have failed.
   *
   * @param email their email address.
   * @param password their password.
   * @returns a promise that will be resolved with an authentication token, or
   *          rejected with a reason.
   */
  public createToken(mail:string, password:string):Promise<string> {
    "use strict";

    if (!mail || !password) {
      throw "email and password required";
    }

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
    return this.requestPath<{authToken:string}>("POST", `${BackEnd.TOKEN_PATH}/login`, {mail, password}).then((body) => {
      // TODO: https://github.com/angular/angular/issues/7303
      window.localStorage.setItem("authToken", body.authToken);
      return JSON.stringify(body);
    });
  }

  public createFacebookToken(redirectUrl:string):Promise<string> {
    "use strict";

    redirectUrl = encodeURIComponent(redirectUrl);
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
    return this.requestPath<{authToken:string, redirect_url:string}>("GET", `/login/facebook?return_link=${redirectUrl}`).then(body => {
      // TODO: https://github.com/angular/angular/issues/7303
      window.localStorage.setItem("authToken", body.authToken);
      return body.redirect_url;
    });
  }

  public createGitHubToken(redirectUrl:string):Promise<string> {
    "use strict";

    redirectUrl = encodeURIComponent(redirectUrl);
    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
    return this.requestPath<{authToken:string, redirect_url:string}>("GET", `/login/github?return_link=${redirectUrl}`).then(body => {
      // TODO: https://github.com/angular/angular/issues/7303
      window.localStorage.setItem("authToken", body.authToken);
      return body.redirect_url;
    });
  }

  /**
   * Log a person out.
   *
   * If the communication with the back end fails, the rejection reason is an
   * instance of {@link BackEndError}. Any other reason indicates that the
   * logout have failed.
   *
   * @param token their authentication token.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public deleteToken():Promise<string> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.TOKEN_PATH}/logout`, {}).then((body) => {
      // TODO: https://github.com/angular/angular/issues/7303
      window.localStorage.removeItem("authToken");
      return JSON.stringify(body);
    });
  }

  public createApplicationDevice(name:string, width:number, height:number, columns:number, rows:number, project_id:string) {
    "use strict";

    if (!name || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(columns) || !Number.isInteger(rows)) {
      throw "name, integer width, integer height, integer columns and integer rows required";
    }

    return this.requestPath("POST", BackEnd.APPLICATION_DEVICE_PATH, {name, height_lock: false, width_lock: false, touch_screen: false, project_id, landscape_height: width, landscape_width: height, landscape_square_height: columns, landscape_square_width: rows, landscape_max_screens: 10, landscape_min_screens: 1, portrait_height: height, portrait_width: width, portrait_square_height: rows, portrait_square_width: columns, portrait_max_screens: 10, portrait_min_screens: 1}, [201]).then(JSON.stringify);
  }

  public getApplicationDevice(id:string):Promise<ApplicationDevice> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`);
  }

  public getApplicationDevices():Promise<ApplicationDeviceCollection> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_DEVICE_PATH}/all`);
  }

  public updateApplicationDevice(id:string, name:string, width:number, height:number, columns:number, rows:number, width_lock:boolean, height_lock:boolean, portrait_min_screens:number, portrait_max_screens:number, landscape_min_screens:number, landscape_max_screens:number, touch_screen:boolean, project_id:string):Promise<string> {
    "use strict";

    if (!name || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(columns) || !Number.isInteger(rows) || !Number.isInteger(portrait_min_screens) || !Number.isInteger(portrait_max_screens) || !Number.isInteger(landscape_min_screens) || !Number.isInteger(landscape_max_screens)) {
      throw "name, integer width, integer height, integer columns, integer rows and integer screen counts required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-173
    return this.requestPath("PUT", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`, {name, height_lock, width_lock, touch_screen, project_id, landscape_height: width, landscape_width: height, landscape_square_height: columns, landscape_square_width: rows, landscape_max_screens, landscape_min_screens, portrait_height: height, portrait_width: width, portrait_square_height: rows, portrait_square_width: columns, portrait_max_screens, portrait_min_screens}, [200, 201]).then(JSON.stringify);
  }

  public deleteApplicationDevice(id:string):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-173
    return this.requestPath("DELETE", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`, undefined, [200, 201]).then(JSON.stringify);
  }

  public createApplicationGroup(program_name:string, program_description:string, projectId:string):Promise<ApplicationGroup> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.APPLICATION_GROUP_PATH}/${projectId}`, {program_description, program_name}, [201]);
  }

  public getApplicationGroup(id:string):Promise<ApplicationGroup> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_GROUP_PATH}/${id}`);
  }

  public getApplicationGroups():Promise<ApplicationGroup[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_GROUP_PATH}/person`);
  }

  public updateApplicationGroup(id:string, program_name:string, program_description:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.APPLICATION_GROUP_PATH}/${id}`, {program_description, program_name}).then(JSON.stringify);
  }

  public deleteApplicationGroup(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.APPLICATION_GROUP_PATH}/${id}`).then(JSON.stringify);
  }

  public createApplication(program_name:string, program_description:string, screen_type_id:string, m_code:string, groupId:string):Promise<string> {
    "use strict";

    if (program_name.length < 8 || !m_code) {
      throw "name >= 8 and code required";
    }

    return this.requestPath("POST", `${BackEnd.APPLICATION_PATH}/${groupId}`, {screen_type_id, program_name, program_description, m_code, height_lock: false, width_lock: false}, [201]).then(JSON.stringify);
  }

  public getApplication(id:string):Promise<Application> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_PATH}/${id}`);
  }

  public getApplications():Promise<Application[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_PATH}/app/m_programs`);
  }

  public updateApplication(id:string, program_name:string, program_description:string, screen_type_id:string, m_code:string):Promise<string> {
    "use strict";

    if (program_name.length < 8 || !m_code) {
      throw "name >= 8 and code required";
    }

    return this.requestPath("PUT", `${BackEnd.APPLICATION_PATH}/${id}`, {screen_type_id, program_name, program_description, m_code, height_lock: false, width_lock: false}).then(JSON.stringify);
  }

  public deleteApplication(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.APPLICATION_PATH}/${id}`).then(JSON.stringify);
  }

  public createProducer(name:string, description:string):Promise<string> {
    "use strict";

    if (name.length < 8 || description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    return this.requestPath("POST", BackEnd.PRODUCER_PATH, {name, description}, [201]).then(JSON.stringify);
  }

  public getProducer(id:string):Promise<Producer> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PRODUCER_PATH}/${id}`);
  }

  public getProducerDescription(id:string):Promise<string> {
    "use strict";

    // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
    return this.requestPath<{description:string}>("GET", `${BackEnd.PRODUCER_PATH}/description/${id}`).then(result => result.description);
  }

  public getProducers():Promise<Producer[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PRODUCER_PATH}/all`);
  }

  public updateProducer(id:string, name:string, description:string):Promise<string> {
    "use strict";

    if (name.length < 8 || description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    return this.requestPath("PUT", `${BackEnd.PRODUCER_PATH}/${id}`, {name, description}).then(JSON.stringify);
  }

  public deleteProducer(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.PRODUCER_PATH}/${id}`).then(JSON.stringify);
  }

  public createLibrary(library_name:string, description:string):Promise<string> {
    "use strict";

    if (library_name.length < 8 || description.length < 8) {
      throw "name >= 8 and description >= 8 required";
    }

    return this.requestPath("POST", BackEnd.LIBRARY_PATH, {library_name, description}, [201]).then(JSON.stringify);
  }

  public getLibrary(id:string):Promise<Library> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.LIBRARY_PATH}/${id}`);
  }

  public getLibraryVersions(id:string):Promise<Version[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.LIBRARY_PATH}/versions/${id}`);
  }

  public getLibraries():Promise<Library[]> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.LIBRARY_PATH}/filter`, {});
  }

  public updateLibrary(id:string, library_name:string, description:string):Promise<string> {
    "use strict";

    if (library_name.length < 8 || description.length < 8) {
      throw "name >= 8 and description >= 8 required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-173
    return this.requestPath("PUT", `${BackEnd.LIBRARY_PATH}/${id}`, {library_name, description}, [200, 201]).then(JSON.stringify);
  }

  public addVersionToLibrary(version_name:string, version_description:string, id:string):Promise<string> {
    "use strict";

    if (version_name.length < 8 || version_description.length < 8) {
      throw "name >= 8 and description >= 8 required";
    }

    return this.requestPath("POST", `${BackEnd.LIBRARY_PATH}/version/${id}`, {version_name, version_description}, [201]).then(JSON.stringify);
  }

  public updateFileOfLibrary(file:File, version:string, id:string):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-118
    // TODO: https://github.com/angular/angular/issues/2803
    return new Promise((resolve, reject) => {
      let url = `${BackEnd.BASE_URL}/compilation/library/uploud/${id}`;
      if (version) {
        url += `/${version}`;
      }
      let formdata = new FormData();
      formdata.append("file", file);
      let request = new XMLHttpRequest();
      request.addEventListener("load", () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(request.response);
        } else {
          reject(request.response);
        }
      });
      request.addEventListener("error", reject);
      request.open("POST", url);
      // TODO: https://github.com/angular/angular/issues/7303
      request.setRequestHeader("X-AUTH-TOKEN", window.localStorage.getItem("authToken"));
      request.send(formdata);
    });
  }

  public deleteLibrary(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.LIBRARY_PATH}/${id}`).then(JSON.stringify);
  }

  public createLibraryGroup(group_name:string, description:string):Promise<string> {
    "use strict";

    if (!group_name || description.length < 24) {
      throw "description >= 24 and name required";
    }

    return this.requestPath("POST", BackEnd.LIBRARY_GROUP_PATH, {description, group_name}, [201]).then(JSON.stringify);
  }

  public getLibraryGroup(id:string):Promise<LibraryGroup> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`);
  }

  public getLibraryGroups():Promise<LibraryGroup[]> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.LIBRARY_GROUP_PATH}/filter`, {});
  }

  public updateLibraryGroup(id:string, group_name:string, description:string):Promise<string> {
    "use strict";

    if (!group_name || description.length < 24) {
      throw "description >= 24 and name required";
    }

    return this.requestPath("PUT", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`, {description, group_name}, [201]).then(JSON.stringify);
  }

  public deleteLibraryGroup(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`).then(JSON.stringify);
  }

  public createProcessor(processor_name:string, processor_code:string, description:string, speed:number):Promise<string> {
    "use strict";

    if (processor_name.length < 4 || processor_code.length < 4 || description.length < 24 || !Number.isInteger(speed)) {
      throw "name >= 4, code >= 4 and description >= 24 required";
    }

    return this.requestPath("POST", BackEnd.PROCESSOR_PATH, {processor_name, description, processor_code, speed}, [201]).then(JSON.stringify);
  }

  public getProcessor(id:string):Promise<Processor> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROCESSOR_PATH}/${id}`);
  }

  public getProcessors():Promise<Processor[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.PROCESSOR_PATH);
  }

  public updateProcessor(id:string, processor_name:string, processor_code:string, description:string, speed:number):Promise<String> {
    "use strict";

    if (processor_name.length < 4 || processor_code.length < 4 || description.length < 24 || !Number.isInteger(speed)) {
      throw "name >= 4, code >= 4 and description >= 24 required";
    }

    return this.requestPath("PUT", `${BackEnd.PROCESSOR_PATH}/${id}`, {processor_name, description, processor_code, speed}).then(JSON.stringify);
  }

  public deleteProcessor(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.PROCESSOR_PATH}/${id}`).then(JSON.stringify);
  }

  public createDeviceType(name:string, producer_id:string, processor_id:string, description:string):Promise<string> {
    "use strict";

    if (name.length < 8 || !description) {
      throw "name >= 8 and description required";
    }

    return this.requestPath("POST", BackEnd.DEVICE_TYPE_PATH, {name, description, producer_id, processor_id}, [201]).then(JSON.stringify);
  }

  public getDeviceType(id:string):Promise<DeviceType> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.DEVICE_TYPE_PATH}/${id}`);
  }

  public getDeviceTypes():Promise<DeviceType[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.DEVICE_TYPE_PATH}/all`);
  }

  public updateDeviceType(id:string, name:string, producer_id:string, processor_id:string, description:string):Promise<string> {
    "use strict";

    if (name.length < 8 || !description) {
      throw "name >= 8 and description required";
    }

    return this.requestPath("PUT", `${BackEnd.DEVICE_TYPE_PATH}/${id}`, {name, description, producer_id, processor_id}).then(JSON.stringify);
  }

  public deleteDeviceType(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.DEVICE_TYPE_PATH}/${id}`).then(JSON.stringify);
  }

  public createDeviceProgram(program_name:string, program_description:string, projectId:string):Promise<string> {
    "use strict";

    if (program_name.length < 8) {
      throw "name >= 8";
    }

    return this.requestPath("POST", `${BackEnd.DEVICE_PROGRAM_PATH}/${projectId}`, {program_name, program_description}, [201]).then(JSON.stringify);
  }

  public getDeviceProgram(id:string):Promise<DeviceProgram> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.DEVICE_PROGRAM_PATH}/${id}`);
  }

  public getDevicePrograms(projectId:string):Promise<DeviceProgram[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.DEVICE_PROGRAM_PATH}/project/${projectId}`);
  }

  public updateDeviceProgram(id:string, program_name:string, program_description:string):Promise<string> {
    "use strict";

    if (program_name.length < 8) {
      throw "name >= 8";
    }

    return this.requestPath("PUT", `${BackEnd.DEVICE_PROGRAM_PATH}/edit/${id}`, {program_name, program_description}).then(JSON.stringify);
  }

  public addVersionToDeviceProgram(version_name:string, version_description:string, content:string, program:string):Promise<string> {
    "use strict";

    if (!version_name) {
      throw "name >= 8";
    }

    return this.requestPath("PUT", `${BackEnd.DEVICE_PROGRAM_PATH}/update/${program}`, {version_name, version_description, files: [{file_name: "main", content}]}, [201]).then(JSON.stringify);
  }

  public removeVersionFromDeviceProgram(versionId:string, programId:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.DEVICE_PROGRAM_PATH}/version/${programId}/${versionId}`).then(JSON.stringify);
  }

  public deleteDeviceProgram(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.DEVICE_PROGRAM_PATH}/c_program/${id}`).then(JSON.stringify);
  }

  /**
   * Create a new light.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public createDevice(hardware_unique_id:string, type_of_board_id:string):Promise<string> {
    "use strict";

    if (!hardware_unique_id) {
      throw "ID required";
    }

    return this.requestPath("POST", BackEnd.DEVICE_PATH, {type_of_board_id, hardware_unique_id}, [201]).then(JSON.stringify);
  }

  public getDevices():Promise<Device[]> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.DEVICE_PATH}/filter`, {});
  }

  public addProgramToDevice(program:string, device:string):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-128
    return this.requestPath("POST", `${BackEnd.DEVICE_PROGRAM_PATH}/uploud/${program}/${device}`, {}).then(JSON.stringify);
  }

  public getStandaloneProgramCategories():Promise<StandaloneProgramCategory[]> {
    "use strict";

    return this.requestPath("GET", "/project/typeOfBlock");
  }

  public createStandaloneProgram(name:string, type_of_block_id:string, general_description:string):Promise<StandaloneProgram> {
    "use strict";

    if (!name || !general_description) {
      throw "name and description required";
    }

    return this.requestPath("POST", BackEnd.STANDALONE_PROGRAM_PATH, {general_description, name, type_of_block_id}, [201]);
  }

  public getStandaloneProgram(id:string):Promise<StandaloneProgram> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.STANDALONE_PROGRAM_PATH}/${id}`);
  }

  public updateStandaloneProgram(id:string, name:string, general_description:string, type_of_block_id:string):Promise<string> {
    "use strict";

    if (!name || !general_description) {
      throw "name and description required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-173
    return this.requestPath("PUT", `${BackEnd.STANDALONE_PROGRAM_PATH}/${id}`, {general_description, name, type_of_block_id}, [200, 201]).then(JSON.stringify);
  }

  public addVersionToStandaloneProgram(version_name:string, version_description:string, logic_json:string, program:string):Promise<string> {
    "use strict";

    if (!version_name || !version_description || !logic_json) {
      throw "name, description and code required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-173
    return this.requestPath("POST", `${BackEnd.STANDALONE_PROGRAM_PATH}/version/${program}`, {version_name, version_description, design_json: "-", logic_json}, [200, 201]).then(JSON.stringify);
  }

  public deleteStandaloneProgram(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.STANDALONE_PROGRAM_PATH}/${id}`).then(JSON.stringify);
  }

  /**
   * Create a new program.
   *
   * @param program the program details.
   * @param project the ID of the associated project.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public createInteractionsScheme(name:string, program_description:string, projectId:string):Promise<InteractionsScheme> {
    "use strict";

    if (name.length < 8) {
      throw "name >= 8 required";
    }

    return this.requestPath("POST", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${projectId}`, {program_description, name}, [201]);
  }

  public getInteractionsScheme(id:string):Promise<InteractionsScheme> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${id}`);
  }

  public updateInteractionsScheme(id:string, name:string, program_description:string):Promise<string> {
    "use strict";

    if (name.length < 8) {
      throw "name >= 8 required";
    }

    return this.requestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${id}`, {program_description, name}).then(JSON.stringify);
  }

  public addApplicationGroupToInteractionsScheme(group:string, version:string, autoupdate:boolean):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.APPLICATION_GROUP_PATH}/connect/${group}/${version}/${autoupdate}`, {}).then(JSON.stringify);
  }

  public addVersionToInteractionsScheme(version_name:string, version_description:string, program:string, programId:string):Promise<Version> {
    "use strict";

    if (!version_name || !program) {
      throw "name and scheme required";
    }

    return this.requestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/update/${programId}`, {version_name, version_description, program});
  }

  public deleteInteractionsScheme(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${id}`).then(JSON.stringify);
  }

  /**
   * Create a new Homer.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   */
  public createInteractionsModerator(homer_id:string, type_of_device:string):Promise<string> {
    "use strict";

    if (!homer_id) {
      throw "ID required";
    }

    return this.requestPath("POST", BackEnd.INTERACTIONS_MODERATOR_PATH, {homer_id, type_of_device}, [201]).then(JSON.stringify);
  }

  public getInteractionsModerators():Promise<InteractionsModerator[]> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
    return this.requestPath("GET", BackEnd.INTERACTIONS_MODERATOR_PATH);
  }

  public addSchemeToInteractionsModerator(versionId:string, moderatorId:string, schemeId:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/uploadToHomer/${schemeId}/${versionId}/${moderatorId}`, {}).then(JSON.stringify);
  }

  public deleteInteractionsModerator(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.INTERACTIONS_MODERATOR_PATH}/${id}`).then(JSON.stringify);
  }

  /**
   * Create a new project.
   *
   * @param project the project.
   * @param token an authentication token.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public createProject(project_name:string, project_description:string):Promise<Project> {
    "use strict";

    if (project_name.length < 8 || project_description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    return this.requestPath("POST", BackEnd.PROJECT_PATH, {project_name, project_description}, [201]);
  }

  public createDefaultProject():Promise<Project> {
    "use strict";

    return this.createProject("Default project", "An automatically created project. It can be edited or removed like any other project.");
  }

  /**
   * Retrieve details about a project.
   *
   * @param id the ID of the project.
   * @param token an authentication token.
   * @param success a callback called with the project, its Homers' IDs, its
   *                devices' IDs and a mapping from its programs' IDs to the
   *                programs themselves in case of success.
   * @param error a callback called with a message in case of a failure.
   */
  public getProject(id:string):Promise<Project> {
    "use strict";

    return this.requestPath<Project>("GET", `${BackEnd.PROJECT_PATH}/${id}`);
  }

  public getProjectApplicationGroups(id:string):Promise<ApplicationGroup[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_GROUP_PATH}/project/${id}`);
  }

  public getProjectDevicePrograms(id:string):Promise<DeviceProgram[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/c_programs/${id}`);
  }

  public getProjectDevices(id:string):Promise<Device[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/boards/${id}`);
  }

  public getProjectStandaloneProgramCategories(id:string):Promise<StandaloneProgramCategory[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.STANDALONE_PROGRAM_PATH}/project/${id}`);
  }

  public getProjectInteractionsSchemes(id:string):Promise<InteractionsScheme[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/b_programs/${id}`);
  }

  public getProjectInteractionsModerators(id:string):Promise<InteractionsModerator[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/homers/${id}`);
  }

  public getProjectOwners(id:string):Promise<Person[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/owners/${id}`);
  }

  public getProjectApplicationDevices(id:string):Promise<ApplicationDevice[]> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-173
    return this.requestPath("GET", `${BackEnd.APPLICATION_DEVICE_PATH}/project/${id}`, [200, 201]);
  }

  /**
   * Retrieve all the projects of a person.
   *
   * @param token an authentication token of the person.
   * @returns a promise that will be resolved with a mapping from the projects
   *          IDs to the projects themselves, or rejected with a reason.
   */
  public getProjects():Promise<Project[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.PROJECT_PATH);
  }

  public updateProject(id:string, project_name:string, project_description:string):Promise<string> {
    "use strict";

    if (project_name.length < 8 || project_description.length < 24) {
      throw "name >= 8 and description >= 24 required";
    }

    return this.requestPath<Project>("PUT", `${BackEnd.PROJECT_PATH}/${id}`, {project_name, project_description}).then(JSON.stringify);
  }

  /**
   * Add a device to a project.
   *
   * @param device the ID of the device.
   * @param project the ID of the project.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public addDeviceToProject(device:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.DEVICE_PATH}/${device}/${project}`, {}).then(JSON.stringify);
  }

  public removeDeviceFromProject(device:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.DEVICE_PATH}/${device}/${project}`).then(JSON.stringify);
  }

  /**
   * Add a Homer to a project.
   *
   * @param homer the ID of the device.
   * @param project the ID of the project.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public addInteractionsModeratorToProject(moderator:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.INTERACTIONS_MODERATOR_PATH}/${project}/${moderator}`, {}).then(JSON.stringify);
  }

  public removeInteractionsModeratorFromProject(moderator:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.INTERACTIONS_MODERATOR_PATH}/${project}/${moderator}`).then(JSON.stringify);
  }

  public addCollaboratorToProject(collaborator:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.PROJECT_PATH}/shareProject/${project}`, {persons: [collaborator]}).then(JSON.stringify);
  }

  public removeCollaboratorsFromProject(persons:string[], project:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.PROJECT_PATH}/unshareProject/${project}`, {persons}).then(JSON.stringify);
  }

  /**
   * Delete a project.
   *
   * @param project the project.
   * @param token an authentication token.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public deleteProject(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.PROJECT_PATH}/${id}`).then(JSON.stringify);
  }

  public createIssueType(type:string):Promise<string> {
    "use strict";

    if (type.length < 3) {
      throw "name >= 3 required";
    }

    return this.requestPath("POST", BackEnd.ISSUE_TYPE_PATH, {type}, [201]).then(JSON.stringify);
  }

  public getIssueType(id:string):Promise<IssueType> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.ISSUE_TYPE_PATH}/${id}`);
  }

  public getIssueTypes():Promise<IssueType[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.ISSUE_TYPE_PATH}/all`);
  }

  public updateIssueType(id:string, type:string):Promise<string> {
    "use strict";

    if (type.length < 3) {
      throw "name >= 3 required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-173
    return this.requestPath("PUT", `${BackEnd.ISSUE_TYPE_PATH}/${id}`, {type}, [200, 201]).then(JSON.stringify);
  }

  public deleteIssueType(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_TYPE_PATH}/${id}`).then(JSON.stringify);
  }

  public createIssueConfirmation(type:string, color:string, size:number):Promise<string> {
    "use strict";

    if (type.length < 8 || !color || !Number.isInteger(size) || size < 0) {
      throw "name >= 8, color and positive size required";
    }

    return this.requestPath("POST", BackEnd.ISSUE_CONFIRMATION_PATH, {type, color, size}, [201]).then(JSON.stringify);
  }

  public getIssueConfirmation(id:string):Promise<IssueConfirmation> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.ISSUE_CONFIRMATION_PATH}/${id}`);
  }

  public getIssueConfirmations():Promise<IssueConfirmation[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.ISSUE_CONFIRMATION_PATH}/all`);
  }

  public updateIssueConfirmation(id:string, type:string, color:string, size:number):Promise<string> {
    "use strict";

    if (type.length < 8 || !color || !Number.isInteger(size) || size < 0) {
      throw "name >= 8, color and positive size required";
    }

    return this.requestPath("PUT", `${BackEnd.ISSUE_CONFIRMATION_PATH}/${id}`, {type, color, size}).then(JSON.stringify);
  }

  public deleteIssueConfirmation(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_CONFIRMATION_PATH}/${id}`).then(JSON.stringify);
  }

  public createIssue(type_of_post_id:string, name:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    if (!name || !text_of_post) {
      throw "name and body required";
    }

    return this.requestPath("POST", BackEnd.ISSUE_PATH, {name, text_of_post, type_of_post_id, hash_tags}, [201]).then(JSON.stringify);
  }

  public getIssue(id:string):Promise<Issue> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.ISSUE_PATH}/${id}`);
  }

  public getIssues():Promise<Issue[]> {
    "use strict";

    return this.requestPath("POST", "/overflow/postFilter", {});
  }

  public updateIssue(id:string, type_of_post_id:string, name:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    if (!name || !text_of_post) {
      throw "name and body required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-150
    return this.requestPath("PUT", `${BackEnd.ISSUE_PATH}/${id}`, {name, text_of_post, type_of_post_id, hash_tags}).then(JSON.stringify);
  }

  public addOneToPost(id:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `/overflow/likePlus/${id}`, {}).then(JSON.stringify);
  }

  public subtractOneFromPost(id:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `/overflow/likeMinus/${id}`, {}).then(JSON.stringify);
  }

  public addConfirmationToPost(confirmation:string, post:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.ISSUE_CONFIRMATION_PATH}/${post}/${confirmation}`, {}).then(JSON.stringify);
  }

  public removeConfirmationFromPost(confirmation:string, post:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_CONFIRMATION_PATH}/${post}/${confirmation}`).then(JSON.stringify);
  }

  public addTagToPost(tag:string, post:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.ISSUE_TAG_PATH}/${post}/${tag}`, {}).then(JSON.stringify);
  }

  public removeTagFromPost(tag:string, post:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_TAG_PATH}/${post}/${tag}`).then(JSON.stringify);
  }

  public deletePost(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_PATH}/${id}`).then(JSON.stringify);
  }

  public createAnswer(postId:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    if (!text_of_post) {
      throw "body required";
    }

    return this.requestPath("POST", `${BackEnd.ANSWER_PATH}/${postId}`, {text_of_post, hash_tags}).then(JSON.stringify);
  }

  public updateAnswer(id:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    if (!text_of_post) {
      throw "body required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-150
    return this.requestPath("PUT", `${BackEnd.ANSWER_PATH}/${id}`, {text_of_post, hash_tags}).then(JSON.stringify);
  }

  public createComment(postId:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    if (!text_of_post) {
      throw "body required";
    }

    return this.requestPath("POST", `${BackEnd.COMMENT_PATH}/${postId}`, {text_of_post, hash_tags}).then(JSON.stringify);
  }

  public updateComment(id:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    if (!text_of_post) {
      throw "body required";
    }

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-150
    return this.requestPath("PUT", `${BackEnd.ANSWER_PATH}/${id}`, {text_of_post, hash_tags}).then(JSON.stringify);
  }

  public deleteComment(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_PATH}/${id}`).then(JSON.stringify);
  }

  public createIssueLink(issueId:string, linkedId:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.ISSUE_LINK_PATH}/${issueId}/${linkedId}`, {}).then(JSON.stringify);
  }

  public deleteIssueLink(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_LINK_PATH}/${id}`).then(JSON.stringify);
  }
}
