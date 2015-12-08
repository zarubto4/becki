/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
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
 * A project.
 */
export class Project {

  /**
   * The name of the project.
   */
  name:string;

  /**
   * The description of the project.
   */
  description:string;

  /**
   * Create a new project instance.
   *
   * @param name the name of the project.
   * @param description the description of the project.
   */
  constructor(name:string, description:string) {
    "use strict";

    this.name = name;
    this.description = description;
  }

  /**
   * Test whether this project is equal to another one.
   *
   * @param other the other project.
   */
  equals(other:Project):boolean {
    if (!other) {
      return false;
    }
    return this.name == other.name && this.description == other.description;
  }
}

/**
 * A program.
 */
export class Program {

  /**
   * The name of the program.
   */
  name:string;

  /**
   * The description of the program.
   */
  description:string;

  /**
   * The code of the program.
   */
  code:string;

  /**
   * Create a new program.
   *
   * @param name the name of the program.
   * @param description the description of the program.
   * @param code the code of the program.
   */
  constructor(name:string, description:string, code:string) {
    "use strict";

    this.name = name;
    this.description = description;
    this.code = code;
  }
}

/**
 * An HTTP request.
 */
export class Request {

  /**
   * The HTTP method.
   */
  method:string;

  /**
   * The protocol.
   */
  protocol = "http";

  /**
   * The host name.
   */
  hostname:string;

  /**
   * The port number.
   */
  port:number;

  /**
   * The absolute resource path.
   */
  path:string;

  /**
   * The HTTP headers.
   */
  headers:{[name: string]: string};

  /**
   * The body of the request as a JSON string.
   */
  body:string;

  /**
   * Create a new JSON request instance.
   *
   * @param method the HTTP method.
   * @param hostname the host name.
   * @param port the port number.
   * @param path the absolute resource path.
   * @param headers the HTTP headers.
   * @param body the request body.
   */
  constructor(method:string, hostname:string, port:number, path:string, headers:{[name: string]: string} = {}, body?:Object) {
    "use strict";

    this.method = method;
    this.hostname = hostname;
    this.port = port;
    this.path = path;
    this.headers = {};
    for (let header in headers) {
      if (headers.hasOwnProperty(header)) {
        this.headers[header] = headers[header];
      }
    }
    this.headers["Content-Type"] = "application/json";
    this.body = body ? JSON.stringify(body) : "";
  }

  /**
   * Compose the URL.
   *
   * @returns the URL.
   */
  getUrl():string {
    "use strict";

    return this.protocol + "://" + this.hostname + ":" + this.port + this.path;
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

export class Person {
  mail:string;
  firstName:any;
  lastNAme:any;
  firstTitle:any;
  lastTitle:any;
  dateOfBirth:any;

  static create(mail:string, firstName:any, lastNAme:any):Person {
    return {
      mail,
      firstName,
      lastNAme,
      firstTitle: null,
      lastTitle: null,
      dateOfBirth: null
    };
  }
}

export class Link {
  linkId: string;
  postId: string;
  name: string;
  question: string;
  answers: any[];
}

export class Post {
  postId:string;
  name:string;
  type:string;
  views:number;
  likes:number;
  dateOfCreate:number;
  author:Person;
  textOfPost:string;
  comments:Post[];
  answers:Post[];
  hashTags:string[];
  linkedAnswers:Link[];

  static create(postId:string, name:string, type:string, likes:number, dateOfCreate:number, author:Person, textOfPost:string, comments:Post[], answers:Post[], hashTags:string[], linkedAnswers:Link[]):Post {
    "use strict";
    return {
      postId,
      name,
      type,
      views: 0,
      likes,
      dateOfCreate,
      author,
      textOfPost,
      comments,
      answers,
      hashTags,
      linkedAnswers
    };
  }
}

/**
 * An error describing a problem in communication with the back end.
 */
export class BackEndError extends Error {

  /**
   * Create a new error instance.
   *
   * @param reason a description of the problem.
   */
  constructor(reason:any) {
    "use strict";

    super("communication with the back end failed: " + reason.toString());
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

/**
 * A service providing access to the back end at 127.0.0.1:9000.
 */
export abstract class BackEnd {

  /**
   * An absolute path to the permission resources.
   */
  static PERMISSION_PATH = "/coreClient/person/permission";

  /**
   * An absolute path to the person resources.
   */
  static PERSON_PATH = "/coreClient/person/person";

  /**
   * An absolute path to the project resources.
   */
  static PROJECT_PATH = "/project/project";
  /**
   * An absolute path to the program resources.
   */
  static PROGRAM_PATH:string = "/project/program";

  /**
   * A name of the authentication token HTTP header.
   */
  static TOKEN_HEADER = "X-AUTH-TOKEN";

  /**
   * An authentication token.
   */
  private authToken:string = null;

  /**
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   */
  protected abstract requestGeneral(request:Request):Promise<Response>;

  protected request<T>(method:string, path:string, body?:Object, auth = false):Promise<T> {
    "use strict";

    let request = new Request(
        method,
        "127.0.0.1", 9000, path,
        {},
        body
    );
    if (auth) {
      if (this.authToken === null) {
        throw new AuthenticationError("not authenticated");
      }
      request.headers["X-AUTH-TOKEN"] = this.authToken;
    }
    return this.requestGeneral(request)
        .then((response) => {
          if (response.status == 200) {
            // TODO: Response to a JSON request should always be a JSON.
            return response.body ? JSON.parse(response.body) : {};
          } else {
            // TODO: https://github.com/angular/angular/issues/4558
            return Promise.reject(new Error("error response: " + JSON.stringify(response)));
          }
        });
  }

  isAuth():boolean {
    return !!this.authToken;
  }

  /**
   * Create a new person.
   *
   * @param email their email address.
   * @param password their password.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public createPerson(email:string, password:string):Promise<string> {
    "use strict";

    return this.request("POST",
        BackEnd.PERSON_PATH,
        {mail: email, password: password}).then(JSON.stringify);
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
  public logIn(email:string, password:string):Promise<string> {
    "use strict";

    return this.request<{authToken:string}>("POST",
        BackEnd.PERMISSION_PATH + "/login",
        {email: email, password: password}).then((body) => {
      this.authToken = body.authToken;
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
  public logOut():Promise<string> {
    "use strict";

    return this.request("POST",
        BackEnd.PERMISSION_PATH + "/logout",
        {}, true).then((body) => {
          this.authToken = null;
          return JSON.stringify(body);
        }
    );
  }

  /**
   * Create a new Homer.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   */
  public createHomer(id:string):Promise<string> {
    "use strict";

    return this.request("POST",
        "/project/posthomer",

        {homerId: id, typeOfDevice: "raspberry"}, true).then(JSON.stringify);
  }

  /**
   * Create a new light.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public createDevice(id:string, type:string):Promise<string> {
    "use strict";

    return this.request("POST",
        "/project/postNewDevice",
        {
          biteCode: id,
          typeOfDevice: type,
          parameters: []
        }, true).then(JSON.stringify);
  }

  /**
   * Create a new project.
   *
   * @param project the project.
   * @param token an authentication token.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public createProject(project:Project):Promise<string> {
    "use strict";

    return this.request("POST",
        BackEnd.PROJECT_PATH,
        {
          projectName: project.name,
          projectDescription: project.description
        }, true).then(JSON.stringify);
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
  public getProject(id:string):Promise<{name: string, description: string, homers:string[], devices:{id:string, type:string}[], idToProgram:{[id: string]: Program}, queue:{homerId:string, program:string}[]}> {
    "use strict";

    return this.request<{projectName:string, projectDescription:string, homerDeviceList:{homerId:string}[], databaseDevicesList:{biteCodeName: string, typeOfDevice:string}[], programs:{programId:string, programName:string, programDescription:string, program:string}[], forUploadPrograms:{homerId:string, program:string}[]}>("GET",
        BackEnd.PROJECT_PATH + "/" + id,
        undefined, true).then((body) => {
          let homers:string[] = body.homerDeviceList.map(
              (homer:{homerId:string}) => homer.homerId
          );
          let devices:{id:string, type:string}[] = body.databaseDevicesList.map(
              (device:{biteCodeName:string, typeOfDevice:string}) => ({
                id: device.biteCodeName,
                type: device.typeOfDevice
              })
          );
          let idToProgram:{[id: string]: Program} = {};
          for (let prog of body.programs) {
            idToProgram[prog.programId] = new Program(
                prog.programName, prog.programDescription, prog.program
            );
          }
          return {
            name: body.projectName,
            description: body.projectDescription,
            homers: homers,
            devices: devices,
            idToProgram: idToProgram,
            queue: body.forUploadPrograms
          };
        }
    );
  }

  /**
   * Retrieve all the projects of a person.
   *
   * @param token an authentication token of the person.
   * @returns a promise that will be resolved with a mapping from the projects
   *          IDs to the projects themselves, or rejected with a reason.
   */
  public getProjects():Promise<{[id: string]: Project}> {
    "use strict";

    return this.request<{projectId:string, projectName:string, projectDescription:string}[]>("GET",
        BackEnd.PROJECT_PATH,
        undefined, true).then((body) => {
      let idToProject:{[id: string]: Project} = {};
      for (let project of body) {
        idToProject[project.projectId] = new Project(project.projectName, project.projectDescription);
      }
      return idToProject;
    });
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

    return this.request("PUT",
        "/project/connectHomerWithProject",
        {projectId: project, homerId: homer}, true).then(JSON.stringify);
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

    return this.request("PUT",
        "/project/connectDeviceWithProject",
        {
          projectId: project,
          bitecodesNames: [device]
        }, true).then(JSON.stringify);
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

    return this.request("DELETE",
        BackEnd.PROJECT_PATH + "/" + id, undefined, true).then(JSON.stringify);
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
  public createProgram(program:Program, project:string):Promise<string> {
    "use strict";

    return this.request("POST",
        BackEnd.PROGRAM_PATH,
        {
          programName: program.name,
          programDescription: program.description,
          projectId: project,
          program: program.code
        }, true).then(JSON.stringify);
  }

  public updateProgram(id:string, program:Program, project:string):Promise<string> {
    "use strict";

    return this.request("PUT",
        BackEnd.PROGRAM_PATH + "/" + id,
        {
          programName: program.name,
          programDescription: program.description,
          projectId: project,
          program: program.code
        }, true).then(JSON.stringify);
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
  public updateHomer(id:string, program:string, time?:number):Promise<string> {
    "use strict";

    return this.request("PUT",
        "/project/uploudtohomer",
        {
          homerId: id,
          programId: program,
          // New API
          time
        }, true).then(JSON.stringify);
  }

  public createIssue(type:string, name:string, comment:string, hashTags:string[]):Promise<string> {
    "use strict";

    return this.request("POST",
        "/overflow/post",
        {
          name,
          type,
          hashTags,
          comment
        }, true).then(JSON.stringify);
  }

  public createComment(postId:string, comment:string):Promise<string> {
    "use strict";

    return this.request("POST",
        "/overflow/comment",
        {
          postId,
          type: "comment",
          hashTags: [],
          comment
        }, true).then(JSON.stringify);
  }

  public getPost(id:string):Promise<Post> {
    return this.request("GET", "/overflow/post/" + id, undefined, true);
  }

  public updateIssue(postId:string, type:string, name:string, comment:string, hashTags:string[]):Promise<string> {
    "use strict";

    return this.request("PUT",
        "/overflow/post",
        {
          postId,
          name,
          type,
          hashTags,
          comment
        }, true).then(JSON.stringify);
  }

  public updateAnswer(postId:string, comment:string, hashTags:string[]):Promise<string> {
    "use strict";

    return this.request("PUT",
        "/overflow/answer/" + postId,
        {
          hashTags,
          comment
        }, true).then(JSON.stringify);
  }

  public updateComment(postId:string, comment:string, hashTags:string[]):Promise<string> {
    "use strict";

    return this.request("PUT",
        "/overflow/comment/" + postId,
        {
          hashTags,
          comment
        }, true).then(JSON.stringify);
  }

  public addRelatedToPost(linkId:string, postId:string):Promise<string> {
    "use strict";

    return this.request("POST", "/overflow/link", {postId, linkId}, true).then(JSON.stringify);
  }

  public removeRelated(id:string):Promise<string> {
    "use strict";

    return this.request("DELETE", "/overflow/link/" + id, undefined, true).then(JSON.stringify);
  }

  public addOneToPost(id:string):Promise<string> {
    "use strict";

    return this.request("PUT", "/overflow/likePlus/" + id, {}, true).then(JSON.stringify);
  }

  public subtractOneFromPost(id:string):Promise<string> {
    "use strict";

    return this.request("PUT", "/overflow/likeMinus/" + id, {}, true).then(JSON.stringify);
  }

  public addTagToPost(postId:string, tag:string):Promise<string> {
    "use strict";

    return this.request("POST", "/overflow/hashTag", {postId, hashTags: [tag]}, true).then(JSON.stringify);
  }

  public removeTagFromPost(postId:string, tag:string):Promise<string> {
    "use strict";

    return this.request("PUT", "/overflow/removeHashTag", {postId, hashTags: [tag]}, true).then(JSON.stringify);
  }

  public addConfirmationToPost(postId:string, confirmation:string):Promise<string> {
    "use strict";

    return this.request("POST", "/overflow/confirms/", {postId, confirms: [confirmation]}, true).then(JSON.stringify);
  }

  public removeConfirmationFromPost(postId:string, confirmation:string):Promise<string> {
    "use strict";

    return this.request("PUT", "/overflow/confirms", {confirms: [confirmation]}, true).then(JSON.stringify);
  }

  public addAnswerToPost(postId:string, comment:string):Promise<string> {
    "use strict";

    return this.request("POST", "/overflow/answer", {postId, type: "Answare", hashTags: [], comment}, true).then(JSON.stringify);
  }

  public deleteComment(id:string):Promise<string> {
    "use strict";

    return this.request("DELETE", "/overflow/comment/" + id, undefined, true).then(JSON.stringify);
  }
}
