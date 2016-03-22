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

/**
 * An error representing an problem in authentication against the back end.
 */
export class AuthenticationError extends Error {

  /**
   * The name of the error.
   */
  name = "authentication error";

  /**
   * Create a new error instance.
   *
   * @param message a human-readable description of the error.
   */
  constructor(message?:string) {
    "use strict";

    super(message);
    // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
    this.message = message;
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

  date_of_birth:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface ApplicationDevice {

  id:string;

  name:string;

  height:number;

  width:number;

  height_lock:boolean;

  width_lock:boolean;

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

  date_of_create:string;

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

  date_of_create:string;

  last_update:string;

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

  date_of_create:string;

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
export interface BoardType {

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
export interface BoardProgram {

  id:string;

  program_name:string;

  program_description:string;

  version_objects:Version[];

  dateOfCreate:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Board {

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

  dateOfCreate:string;

  lastUpdate:string;

  project:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Homer {

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

  static BOARD_PATH = "/compilation/board";

  static BOARD_PROGRAM_PATH = "/compilation/c_program";

  static BOARD_TYPE_PATH = "/compilation/typeOfBoard";

  static COMMENT_PATH = "/overflow/comment";

  static HOMER_PATH = "/project/homer";

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

  static STANDALONE_PROGRAM_CATEGORY_PATH = "/project/typeOfBlock";

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

  public requestPath<T>(method:string, path:string, body?:Object):Promise<T> {
    "use strict";

    return this.request(method, BackEnd.BASE_URL + path, body);
  }

  public request<T>(method:string, url:string, body?:Object):Promise<T> {
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
              if (response.status >= 200 && response.status < 300) {
                return response.body;
              } else {
                // TODO: https://github.com/angular/angular/issues/4558
                return Promise.reject(new Error(`error response: ${JSON.stringify(response)}`));
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

    return this.requestPath("POST", BackEnd.PERSON_PATH, {nick_name, mail, password}).then(JSON.stringify);
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

  public createApplicationDevice(name:string, height:number, width:number, project_id:string) {
    "use strict";

    return this.requestPath("POST", BackEnd.APPLICATION_DEVICE_PATH, {name, height, width, height_lock: false, width_lock: false, touch_screen: false, project_id}).then(JSON.stringify);
  }

  public getApplicationDevice(id:string):Promise<ApplicationDevice> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`);
  }

  public getApplicationDevices():Promise<ApplicationDeviceCollection> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_DEVICE_PATH}/all`);
  }

  public updateApplicationDevice(id:string, name:string, height:number, width:number, project_id:string, height_lock:boolean, width_lock:boolean, touch_screen:boolean) {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`, {name, height, width, height_lock, width_lock, touch_screen, project_id}).then(JSON.stringify);
  }

  public deleteApplicationDevice(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.APPLICATION_DEVICE_PATH}/${id}`).then(JSON.stringify);
  }

  public createApplicationGroup(program_name:string, program_description:string, projectId:string):Promise<ApplicationGroup> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.APPLICATION_GROUP_PATH}/${projectId}`, {program_description, program_name});
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

    return this.requestPath("POST", `${BackEnd.APPLICATION_PATH}/${groupId}`, {screen_type_id, program_name, program_description, m_code, height_lock: false, width_lock: false}).then(JSON.stringify);
  }

  public getApplication(id:string):Promise<Application> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_PATH}/${id}`);
  }

  public getApplicationByQrToken(token:string):Promise<Application> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_PATH}/app/token/${token}`);
  }

  public getApplications():Promise<Application[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_PATH}/app/m_programs`);
  }

  public updateApplication(id:string, program_name:string, program_description:string, screen_type_id:string, m_code:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.APPLICATION_PATH}/${id}`, {screen_type_id, program_name, program_description, m_code, height_lock: false, width_lock: false}).then(JSON.stringify);
  }

  public deleteApplication(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.APPLICATION_PATH}/${id}`).then(JSON.stringify);
  }

  public createProducer(name:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.PRODUCER_PATH, {name, description}).then(JSON.stringify);
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

    return this.requestPath("PUT", `${BackEnd.PRODUCER_PATH}/${id}`, {name, description}).then(JSON.stringify);
  }

  public deleteProducer(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.PRODUCER_PATH}/${id}`).then(JSON.stringify);
  }

  public createLibrary(library_name:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.LIBRARY_PATH, {library_name, description}).then(JSON.stringify);
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

    return this.requestPath("PUT", `${BackEnd.LIBRARY_PATH}/${id}`, {library_name, description}).then(JSON.stringify);
  }

  public addVersionToLibrary(version_name:string, version_description:string, id:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.LIBRARY_PATH}/version/${id}`, {version_name, version_description}).then(JSON.stringify);
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

    return this.requestPath("POST", BackEnd.LIBRARY_GROUP_PATH, {description, group_name}).then(JSON.stringify);
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

    return this.requestPath("PUT", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`, {description, group_name}).then(JSON.stringify);
  }

  public deleteLibraryGroup(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`).then(JSON.stringify);
  }

  public createProcessor(processor_name:string, processor_code:string, description:string, speed:number):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.PROCESSOR_PATH, {processor_name, description, processor_code, speed}).then(JSON.stringify);
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

    return this.requestPath("PUT", `${BackEnd.PROCESSOR_PATH}/${id}`, {processor_name, description, processor_code, speed}).then(JSON.stringify);
  }

  public deleteProcessor(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.PROCESSOR_PATH}/${id}`).then(JSON.stringify);
  }

  public createBoardType(name:string, producer_id:string, processor_id:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.BOARD_TYPE_PATH, {name, description, producer_id, processor_id}).then(JSON.stringify);
  }

  public getBoardType(id:string):Promise<BoardType> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.BOARD_TYPE_PATH}/${id}`);
  }

  public getBoardTypes():Promise<BoardType[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.BOARD_TYPE_PATH}/all`);
  }

  public updateBoardType(id:string, name:string, producer_id:string, processor_id:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_TYPE_PATH}/${id}`, {name, description, producer_id, processor_id}).then(JSON.stringify);
  }

  public deleteBoardType(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.BOARD_TYPE_PATH}/${id}`).then(JSON.stringify);
  }

  public createBoardProgram(program_name:string, program_description:string, projectId:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.BOARD_PROGRAM_PATH}/${projectId}`, {program_name, program_description}).then(JSON.stringify);
  }

  public getBoardProgram(id:string):Promise<BoardProgram> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.BOARD_PROGRAM_PATH}/${id}`);
  }

  public getBoardPrograms(projectId:string):Promise<BoardProgram[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.BOARD_PROGRAM_PATH}/project/${projectId}`);
  }

  public updateBoardProgram(id:string, program_name:string, program_description:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_PROGRAM_PATH}/edit/${id}`, {program_name, program_description}).then(JSON.stringify);
  }

  public addVersionToBoardProgram(version_name:string, version_description:string, content:string, program:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_PROGRAM_PATH}/update/${program}`, {version_name, version_description, files: [{file_name: "main", content}]}).then(JSON.stringify);
  }

  public removeVersionFromBoardProgram(versionId:string, programId:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.BOARD_PROGRAM_PATH}/version/${programId}/${versionId}`).then(JSON.stringify);
  }

  public deleteBoardProgram(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.BOARD_PROGRAM_PATH}/c_program/${id}`).then(JSON.stringify);
  }

  /**
   * Create a new light.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public createBoard(hardware_unique_id:string, type_of_board_id:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.BOARD_PATH, {type_of_board_id, hardware_unique_id}).then(JSON.stringify);
  }

  public getBoards():Promise<Board[]> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_PATH}/filter`, {});
  }

  public addProgramToBoard(programId:string, boardId:string):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-128
    return this.requestPath("POST", `${BackEnd.BOARD_PROGRAM_PATH}/uploud/${programId}/${boardId}`, {}).then(JSON.stringify);
  }

  public getStandaloneProgramCategories():Promise<StandaloneProgramCategory[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.STANDALONE_PROGRAM_CATEGORY_PATH);
  }

  public createStandaloneProgram(name:string, type_of_block_id:string, general_description:string):Promise<StandaloneProgram> {
    "use strict";

    return this.requestPath("POST", BackEnd.STANDALONE_PROGRAM_PATH, {general_description, name, type_of_block_id});
  }

  public getStandaloneProgram(id:string):Promise<StandaloneProgram> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.STANDALONE_PROGRAM_PATH}/${id}`);
  }

  public getStandalonePrograms(categoryId:string):Promise<StandaloneProgram[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.STANDALONE_PROGRAM_CATEGORY_PATH}/${categoryId}`);
  }

  public updateStandaloneProgram(id:string, name:string, general_description:string, type_of_block_id:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.STANDALONE_PROGRAM_PATH}/${id}`, {general_description, name, type_of_block_id}).then(JSON.stringify);
  }

  public addVersionToStandaloneProgram(version_name:string, version_description:string, logic_json:string, program:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.STANDALONE_PROGRAM_PATH}/version/${program}`, {version_name, version_description, design_json: "", logic_json}).then(JSON.stringify);
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

    return this.requestPath("POST", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${projectId}`, {program_description, name});
  }

  public getInteractionsScheme(id:string):Promise<InteractionsScheme> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${id}`);
  }

  public updateInteractionsScheme(id:string, name:string, program_description:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/${id}`, {program_description, name}).then(JSON.stringify);
  }

  public addApplicationGroupToInteractionsScheme(group:string, version:string, autoupdate:boolean):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.APPLICATION_GROUP_PATH}/connect/${group}/${version}/${autoupdate}`, {}).then(JSON.stringify);
  }

  public addVersionToInteractionsScheme(version_name:string, version_description:string, program:string, programId:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/update/${programId}`, {version_name, version_description, program}).then(JSON.stringify);
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
  public createHomer(homer_id:string, type_of_device:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.HOMER_PATH, {homer_id, type_of_device}).then(JSON.stringify);
  }

  public getHomers():Promise<Homer[]> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-155
    return this.requestPath("GET", BackEnd.HOMER_PATH);
  }

  public addSchemeToHomer(versionId:string, homerId:string, schemeId:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.INTERACTIONS_SCHEME_PATH}/uploadToHomer/${schemeId}/${versionId}/${homerId}`, {}).then(JSON.stringify);
  }

  public deleteHomer(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.HOMER_PATH}/${id}`).then(JSON.stringify);
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

    return this.requestPath("POST", BackEnd.PROJECT_PATH, {project_name, project_description});
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

  public getProjectBoardPrograms(id:string):Promise<BoardProgram[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/c_programs/${id}`);
  }

  public getProjectBoards(id:string):Promise<Board[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/boards/${id}`);
  }

  public getProjectInteractionsSchemes(id:string):Promise<InteractionsScheme[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/b_programs/${id}`);
  }

  public getProjectHomers(id:string):Promise<Homer[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/homers/${id}`);
  }

  public getProjectOwners(id:string):Promise<Person[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROJECT_PATH}/owners/${id}`);
  }

  public getProjectApplicationDevices(id:string):Promise<ApplicationDevice[]> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.APPLICATION_DEVICE_PATH}/project/${id}`);
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
  public addBoardToProject(board:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_PATH}/${board}/${project}`, {}).then(JSON.stringify);
  }

  public removeBoardFromProject(board:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.BOARD_PATH}/${board}/${project}`).then(JSON.stringify);
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
  public addHomerToProject(homer:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.HOMER_PATH}/${project}/${homer}`, {}).then(JSON.stringify);
  }

  public removeHomerFromProject(homer:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.HOMER_PATH}/${project}/${homer}`).then(JSON.stringify);
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

    return this.requestPath("POST", BackEnd.ISSUE_TYPE_PATH, {type}).then(JSON.stringify);
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

    return this.requestPath("PUT", `${BackEnd.ISSUE_TYPE_PATH}/${id}`, {type}).then(JSON.stringify);
  }

  public deleteIssueType(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_TYPE_PATH}/${id}`).then(JSON.stringify);
  }

  public createIssueConfirmation(type:string, color:string, size:number):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.ISSUE_CONFIRMATION_PATH, {type, color, size}).then(JSON.stringify);
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

    return this.requestPath("PUT", `${BackEnd.ISSUE_CONFIRMATION_PATH}/${id}`, {type, color, size}).then(JSON.stringify);
  }

  public deleteIssueConfirmation(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_CONFIRMATION_PATH}/${id}`).then(JSON.stringify);
  }

  public createIssue(type_of_post_id:string, name:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.ISSUE_PATH, {name, text_of_post, type_of_post_id, hash_tags}).then(JSON.stringify);
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

    return this.requestPath("POST", `${BackEnd.ANSWER_PATH}/${postId}`, {text_of_post, hash_tags}).then(JSON.stringify);
  }

  public updateAnswer(id:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-150
    return this.requestPath("PUT", `${BackEnd.ANSWER_PATH}/${id}`, {text_of_post, hash_tags}).then(JSON.stringify);
  }

  public createComment(postId:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.COMMENT_PATH}/${postId}`, {text_of_post, hash_tags}).then(JSON.stringify);
  }

  public updateComment(id:string, text_of_post:string, hash_tags:string[]):Promise<string> {
    "use strict";

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
