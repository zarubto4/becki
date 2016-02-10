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

  if (person.nickName) {
    return person.nickName;
  }

  let nameParts:string[] = [];
  if (person.firstName) {
    nameParts.push(person.firstName);
  }
  if (person.middleName) {
    nameParts.push(person.middleName);
  }
  if (person.lastName) {
    nameParts.push(person.lastName);
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

  id:string;

  mail:string;

  nickName:string;

  firstName:string;

  middleName:string;

  lastName:string;

  firstTitle:any;

  lastTitle:any;

  dateOfBirth:any;
}

export interface Producer {

  id:string;

  name:string;

  description:string;

  typeOfBoards:string;
}

export interface Version {

  id:string;

  version:number;

  allFiles:string;

  dateOfCreate:number;

  versionName:string;

  versionDescription:any;

  files:number;
}

export interface Library {

  id:string;

  libraryName:string;

  description:string;

  versions:string;

  versionsCount:number;

  lastVersion:number;
}

export interface LibraryReference {

  libraryId:string;

  libraryVersion:string;
}

export interface LibraryGroup {

  id:string;

  groupName:string;

  description:string;

  azurePrimaryUrl:any;

  azureSecondaryUrl:any;

  lastVersion:number;

  versions:string;

  processors:any;

  versionsCount:number;

  lastLibraries:string;
}

export interface LibraryGroupReference {

  groupId:string;

  libraryVersion:string;
}

export interface Processor {

  id:string;

  processorName:string;

  processorCode:string;

  description:string;

  speed:number;

  singleLibraries:string;

  libraryGroups:string;

  singleLibrariesCount:number;

  libraryGroupsCount:number;
}

export interface BoardType {

  id:string;

  name:string;

  description:string;

  procesor:string;

  libraries:string;

  libraryGroups:string;

  boards:string;
}

export interface BoardProgram {

  id:string;

  programName:string;

  programDescription:string;

  versions:Version[];
}

export interface Board {

  id:string;

  typeOfBoard:string;

  isActive:boolean;

  userDescription:string;

  projects:string;
}

export interface HomerProgram {

  programId:string;

  programName:string;

  programDescription:string;

  dateOfCreate:number;

  listOfUploadedHomers:string;

  listOfHomersWaitingForUpload:string;

  programinJson:string;

  project:string;
}

export interface Homer {

  homerId:string;

  typeOfDevice:string;

  version:any;

  uploudedProgram:any[];
}

export interface Project {

  projectId:string;

  projectName:string;

  projectDescription:string;

  c_programs:string;

  boards:string;

  b_programs:string;

  homers:string;

  owners:string;

  m_programs:string;

  countOfBoards:number;

  countOfPrograms:number;

  countOfHomer:number;

  countOfOwners:number;
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

  comments:string;

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

  static BASE_URL = "http://127.0.0.1:9000";

  static ANSWER_PATH = "/overflow/answer";

  static BOARD_PROGRAM_PATH = "/compilation/c_program";

  static BOARD_TYPE_PATH = "/compilation/typeOfBoard";

  static COMMENT_PATH = "/overflow/comment";

  static CONFIRMATION_PATH = "/overflow/confirms";

  static HOMER_PATH = "/project/homer";

  static ISSUE_LINK_PATH = "/overflow/link";

  static ISSUE_PATH = "/overflow/post";

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
   * An absolute path to the program resources.
   */
  static PROGRAM_PATH = "/project/b_program";

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

    return this.request(method, BackEnd.BASE_URL + path, body);
  }

  public request<T>(method:string, url:string, body?:Object):Promise<T> {
    "use strict";

    let request = new Request(method, url, {}, body);
    if (window.localStorage.getItem("authToken")) {
      request.headers["X-AUTH-TOKEN"] = window.localStorage.getItem("authToken");
    }
    return this.requestGeneral(request)
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
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
  public createPerson(mail:string, password:string, nickName:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.PERSON_PATH, {mail, password, nickName}).then(JSON.stringify);
  }

  public getSignedInPerson():Promise<Person> {
    "use strict";

    return this.requestPath<{person:Person}>("GET", "/login/person").then(result => result.person);
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
      return JSON.stringify(body);
    });
  }

  public createFacebookToken():Promise<string> {
    "use strict";

    return this.requestPath<{authToken:string, url:string}>("GET", "/login/facebook").then(body => {
      // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-51
      window.localStorage.setItem("authToken", body.authToken);
      return body.url;
    });
  }

  public createGitHubToken():Promise<string> {
    "use strict";

    return this.requestPath<{authToken:string, url:string}>("GET", "/login/github").then(body => {
      window.localStorage.setItem("authToken", body.authToken);
      return body.url;
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
      return JSON.stringify(body);
    });
  }

  public createProducer(name:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.PRODUCER_PATH, {name, description}).then(JSON.stringify);
  }

  public getProducer(id:string):Promise<Producer> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PRODUCER_PATH}/${id}`);
  }

  public getProducers():Promise<Producer[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.PRODUCER_PATH);
  }

  public updateProducer(id:string, name:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.PRODUCER_PATH}/${id}`, {name, description}).then(JSON.stringify);
  }

  public createLibrary(libraryName:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.LIBRARY_PATH, {libraryName, description}).then(JSON.stringify);
  }

  public getLibrary(id:string):Promise<Library> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.LIBRARY_PATH}/${id}`);
  }

  public getLibraries():Promise<Library[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.LIBRARY_PATH);
  }

  public updateLibrary(id:string, libraryName:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.LIBRARY_PATH}/${id}`, {libraryName, description}).then(JSON.stringify);
  }

  public addVersionToLibrary(version:number, versionName:string, description:string, id:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.LIBRARY_PATH}/version/${id}`, {versionName, description, version}).then(JSON.stringify);
  }

  public updateFileOfLibrary(file:File, version:string, id:string):Promise<string> {
    "use strict";

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
      request.setRequestHeader("X-AUTH-TOKEN", window.localStorage.getItem("authToken"));
      request.send(formdata);
    });
  }

  public createLibraryGroup(groupName:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.LIBRARY_GROUP_PATH, {groupName, description}).then(JSON.stringify);
  }

  public getLibraryGroup(id:string):Promise<LibraryGroup> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`);
  }

  public getLibraryGroups():Promise<LibraryGroup[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.LIBRARY_GROUP_PATH);
  }

  public updateLibraryGroup(id:string, groupName:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`, {groupName, description}).then(JSON.stringify);
  }

  public createProcessor(processorName:string, processorCode:string, description:string, speed:number, libraryGroups:string[]):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.PROCESSOR_PATH, {processorName, description, processorCode, speed, libraryGroups}).then(JSON.stringify);
  }

  public getProcessor(id:string):Promise<Processor> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.PROCESSOR_PATH}/${id}`);
  }

  public getProcessors():Promise<Processor[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.PROCESSOR_PATH);
  }

  public updateProcessor(id:string, processorName:string, processorCode:string, description:string, speed:number, libraryGroups:string[]):Promise<String> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.PROCESSOR_PATH}/${id}`, {processorName, description, processorCode, speed, libraryGroups}).then(JSON.stringify);
  }

  public createBoardType(name:string, producerId:string, processorId:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.BOARD_TYPE_PATH, {name, description, processorId, producerId}).then(JSON.stringify);
  }

  public getBoardType(id:string):Promise<BoardType> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.BOARD_TYPE_PATH}/${id}`);
  }

  public getBoardTypes():Promise<BoardType[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.BOARD_TYPE_PATH);
  }

  public updateBoardType(id:string, name:string, description:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_TYPE_PATH}/${id}`, {name, description}).then(JSON.stringify);
  }

  public createBoardProgramVersion(program:string, version:string, versionName:string, versionDescription:string, libraries:LibraryReference[], groupOfLibraries:LibraryGroupReference[], content:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_PROGRAM_PATH}/newVersion/${program}`, {version, versionName, versionDescription, files: [{fileName: "main", content}], groupOfLibraries, libraries}).then(JSON.stringify);
  }

  public updateBoardProgramVersion(id:string, versionName:string, versionDescription:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_PROGRAM_PATH}/version/${id}`, {versionName, versionDescription}).then(JSON.stringify);
  }

  public createBoardProgram(programName:string, programDescription:string, libraries:LibraryReference[], groupOfLibraries:LibraryGroupReference[], content:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.BOARD_PROGRAM_PATH, {programName, programDescription, project, files: [{fileName: "main", content}], groupOfLibraries, libraries}).then(JSON.stringify);
  }

  public getBoardProgram(id:string):Promise<BoardProgram> {
    "use strict";

    return this.requestPath("GET", `${BackEnd.BOARD_PROGRAM_PATH}/${id}`);
  }

  public updateBoardProgram(id:string, programName:string, programDescription:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.BOARD_PROGRAM_PATH}/update/${id}`, {programName, programDescription}).then(JSON.stringify);
  }

  /**
   * Create a new light.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public createBoard(hwName:string, typeOfBoard:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", "/compilation/board", {hwName, typeOfBoard}).then(JSON.stringify);
  }

  public addProgramToBoard(programId:string, boardId:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", `${BackEnd.BOARD_PROGRAM_PATH}/uploud/${programId}/${boardId}`, {}).then(JSON.stringify);
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
  public createHomer(homerId:string, typeOfDevice:string):Promise<string> {
    "use strict";

    return this.requestPath("POST", BackEnd.HOMER_PATH, {homerId, typeOfDevice}).then(JSON.stringify);
  }

  public getHomers():Promise<Homer[]> {
    "use strict";

    return this.requestPath("GET", BackEnd.HOMER_PATH);
  }

  public addProgramToHomer(programId:string, homerId:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `${BackEnd.PROGRAM_PATH}/uploud`, {homerId, programId}).then(JSON.stringify);
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
  public addBoardToProject(board:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `/compilation/board/connect/${board}/${project}`, {}).then(JSON.stringify);
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

  public addCollaboratorToProject(collaborator:string, project:string):Promise<string> {
    "use strict";

    return this.requestPath("PUT", `/project/project/shareProject/${project}`, {persons: [collaborator]}).then(JSON.stringify);
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
