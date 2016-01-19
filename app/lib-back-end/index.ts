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
  body:string;

  /**
   * Create a new response instance.
   *
   * @param status the status code of the response.
   * @param body the response body.
   */
  constructor(status:number, body:string) {
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

export interface Person {

  mail:string;

  firstName:any;

  lastNAme:any;

  firstTitle:any;

  lastTitle:any;

  dateOfBirth:any;
}

export interface Device {

  hwName:string;

  typeOfDevice:string;

  producer:string;

  parameters:string;

  parametrs:{state: string};
}

export interface HomerProgram {

  programId:string;

  programName:string;

  programDescription:string;

  dateOfCreate:number;

  listOfUploadedHomers:string;

  listOfHomersWaitingForUpload:string;

  programinJson:string;

  projectinJson:string;
}

export interface Homer {

  homerId:string;

  typeOfDevice:string;

  version:any;
}

export interface Project {

  projectId:string;

  projectName:string;

  projectDescription:string;

  homers:string;

  boards:string;

  programs:string;

  countOfBoards:number;

  countOfPrograms:number;

  countOfHomer:number;
}

export interface IssueType {

  id: string;

  type:string;
}

export interface Issue {

  postId:string;

  name:string;

  type:string;

  views:number;

  likes:number;

  dateOfCreate:number;

  textOfPost:string;

  comments:string;

  answers:string;

  linkedAnswers?:string;

  hashTags?:string[];
}

export interface Answer {

  postId:string;

  likes:number;

  dateOfCreate:number;

  textOfPost:string;

  hashTags?:string[];
}

export interface Comment {

  postId:string;

  likes:number;

  dateOfCreate:number;

  textOfPost:string;

  hashTags?:any[];
}

export interface IssueLink {

  linkId:string;

  post:string;

  name:string;

  question:string;

  answers:Answer[];
}

/**
 * A service providing access to the back end at 127.0.0.1:9000.
 */
export abstract class BackEnd {

  static ANSWER_PATH = "/overflow/answer";

  static COMMENT_PATH = "/overflow/comment";

  static CONFIRMATION_PATH = "/overflow/confirms";

  static ISSUE_LINK_PATH = "/overflow/link";

  static ISSUE_PATH = "/overflow/post";

  static ISSUE_TYPE_PATH = "/overflow/typeOfPost";

  /**
   * An absolute path to the person resources.
   */
  static PERSON_PATH = "/coreClient/person/person";

  /**
   * An absolute path to the program resources.
   */
  static PROGRAM_PATH:string = "/project/program";

  /**
   * An absolute path to the project resources.
   */
  static PROJECT_PATH = "/project/project";

  /**
   * An absolute path to the permission resources.
   */
  static TOKEN_PATH = "/coreClient/person/permission";

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

    return this.request(method, `http://127.0.0.1:9000${path}`, body);
  }

  public request<T>(method:string, url:string, body?:Object):Promise<T> {
    "use strict";

    let request = new Request(method, url, {}, body);
    if (window.localStorage.getItem("authToken")) {
      request.headers["X-AUTH-TOKEN"] = window.localStorage.getItem("authToken");
    }
    return this.requestGeneral(request)
        .then((response) => {
          if (response.status == 200) {
            // TODO: Response to a JSON request should always be a JSON.
            return response.body ? JSON.parse(response.body) : {};
          } else {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject(new Error(`error response: ${JSON.stringify(response)}`));
          }
        });
  }

  /**
   * Create a new person.
   *
   * @param email their email address.
   * @param password their password.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public createPerson(mail:string, password:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.PERSON_PATH, {mail, password}).then(JSON.stringify);
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
  public createToken(email:string, password:string):Promise<string> {
    "use strict";

    return this.requestPath<{authToken:string}>("POST", `${BackEnd.TOKEN_PATH}/login`, {email, password}).then((body) => {
      window.localStorage.setItem("authToken", body.authToken);
      window.localStorage.setItem("authEmail", email);
      return JSON.stringify(body);
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
      window.localStorage.removeItem("authToken");
      window.localStorage.removeItem("authEmail");
      return JSON.stringify(body);
    });
  }

  /**
   * Create a new light.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public createDevice(hwName:string, typeOfDevice:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", "/project/iot", {hwName, typeOfDevice, producer: "Byzance", parameters: {}}).then(JSON.stringify);
  }

  public createIndependentProgram(name:string, description:string, logicJson:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", "/project/blockoBlock", {name, description, designJson: {}, logicJson}).then(JSON.stringify);
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
  public createHomerProgram(programName:string, programDescription:string, program:Object, projectId:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.PROGRAM_PATH, {programName, programDescription, projectId, program}).then(JSON.stringify);
  }

  public getHomerProgram(id:string):Promise<HomerProgram> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROGRAM_PATH}/${id}`);
  }

  public updateHomerProgram(programId:string, programName:string, programDescription:string, program:Object, projectId:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.PROGRAM_PATH}/${programId}`, {programName, programDescription, projectId, program}).then(JSON.stringify);
  }

  /**
   * Create a new Homer.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   */
  public createHomer(homerId:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", "/project/homer", {homerId, typeOfDevice: "raspberry"}).then(JSON.stringify);
  }

  /**
   * Update a Homer.
   *
   * @param id the ID of the device.
   * @param program the ID of the program.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public uploadToHomerNow(homerId:string, programId:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", "/project/uploudtohomerImmediately", {homerId, programId}).then(JSON.stringify);
  }

  public uploadToHomerAsap(homerId:string, programId:string, until:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", "/project/uploudtohomerAsSoonAsPossible", {homerId, programId, until}).then(JSON.stringify);
  }

  public uploadToHomerLater(homerId:string, programId:string, when:string, until:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", "/project/uploudtohomerGivenTime", {homerId, programId, when, until}).then(JSON.stringify);
  }

  /**
   * Create a new project.
   *
   * @param project the project.
   * @param token an authentication token.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public createProject(projectName:string, projectDescription:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.PROJECT_PATH, {projectName, projectDescription}).then(JSON.stringify);
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

  public updateProject(id:string, projectName:string, projectDescription:string):Promise<string> {
    "use strict";

    return this.requestPath<Project>("PUT", `${BackEnd.PROJECT_PATH}/${id}`, {projectName, projectDescription}).then(JSON.stringify);
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
  public addDeviceToProject(hwName:string, projectId:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", "/project/connectIoTWithProject", {projectId, hwName: [hwName]}).then(JSON.stringify);
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
  public addHomerToProject(homerId:string, projectId:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", "/project/connectHomerWithProject", {projectId, homerId}).then(JSON.stringify);
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

  public getIssueTypes():Promise<IssueType[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.ISSUE_TYPE_PATH);
  }

  public createIssue(type:string, name:string, comment:string, hashTags:string[]):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.ISSUE_PATH, {name, type, hashTags, comment}).then(JSON.stringify);
  }

  public getIssue(id:string):Promise<Issue> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.ISSUE_PATH}/${id}`);
  }

  public getIssues():Promise<Issue[]> {
    "use strict";

    return this.requestPath("GET", "/overflow/postAll");
  }

  public updateIssue(postId:string, type:string, name:string, comment:string, hashTags:string[]):Promise<string> {
    "use strict";

    return this.requestPath("PUT", BackEnd.ISSUE_PATH, {postId, name, type, hashTags, comment}).then(JSON.stringify);
  }

  public addOneToPost(id:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", "/overflow/likePlus/" + id, {}).then(JSON.stringify);
  }

  public addConfirmationToPost(postId:string, confirmation:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.CONFIRMATION_PATH, {postId, confirms: [confirmation]}).then(JSON.stringify);
  }

  public removeConfirmationFromPost(postId:string, confirmation:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", BackEnd.CONFIRMATION_PATH, {confirms: [confirmation]}).then(JSON.stringify);
  }

  public subtractOneFromPost(id:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", "/overflow/likeMinus/" + id, {}).then(JSON.stringify);
  }

  public deleteIssue(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_PATH}/${id}`).then(JSON.stringify);
  }

  public createAnswer(postId:string, comment:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.ANSWER_PATH, {postId, type: "Answare", hashTags: [], comment}).then(JSON.stringify);
  }

  public updateAnswer(id:string, comment:string, hashTags:string[]):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.ANSWER_PATH}/${id}`, {hashTags, comment}).then(JSON.stringify);
  }

  public deleteAnswer(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ANSWER_PATH}/${id}`).then(JSON.stringify);
  }

  public createComment(postId:string, comment:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.COMMENT_PATH, {postId, type: "comment", hashTags: [], comment}).then(JSON.stringify);
  }

  public updateComment(id:string, comment:string, hashTags:string[]):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.COMMENT_PATH}/${id}`, {hashTags, comment}).then(JSON.stringify);
  }

  public deleteComment(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.COMMENT_PATH}/${id}`).then(JSON.stringify);
  }

  public createIssueLink(postId:string, linkId:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.ISSUE_LINK_PATH, {postId, linkId}).then(JSON.stringify);
  }

  public deleteIssueLink(id:string):Promise<string> {
    "use strict";

    return this.requestPath("DELETE", `${BackEnd.ISSUE_LINK_PATH}/${id}`).then(JSON.stringify);
  }
}
