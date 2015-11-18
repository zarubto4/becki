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
 * A service providing access to the back end at 127.0.0.1:9000.
 */
export abstract class BackEnd {

  /**
   * A hostname of the back end.
   */
  static HOSTNAME = "127.0.0.1";

  /**
   * A port number of the back end.
   */
  static PORT = 9000;

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
   * A name of the authentication token HTTP header.
   */
  static TOKEN_HEADER = "X-AUTH-TOKEN";

  /**
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   */
  protected abstract request(request:Request):Promise<Response>;

  /**
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with an instance of {@link BackEndError}.
   */
  protected requestWrapped(request:Request):Promise<Response> {
    return this.request(request).catch((reason) => {
      throw new BackEndError(reason);
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
  public createPerson(email:string, password:string):Promise<string> {
    "use strict";

    let request = new Request(
        "POST",
        BackEnd.HOSTNAME, BackEnd.PORT, BackEnd.PERSON_PATH,
        {},
        {mail: email, password: password}
    );
    return this.requestWrapped(request).then(JSON.stringify);
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

    let request = new Request(
        "POST",
        BackEnd.HOSTNAME, BackEnd.PORT, BackEnd.PERMISSION_PATH + "/login",
        {},
        {email: email, password: password}
    );
    return this.requestWrapped(request).then((response) => {
      if (response.status == 200) {
        return JSON.parse(response.body).token;
      } else {
        throw new Error("login failed");
      }
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
  public logOut(token:string):Promise<string> {
    "use strict";

    let request = new Request(
        "POST",
        BackEnd.HOSTNAME, BackEnd.PORT, BackEnd.PERMISSION_PATH + "/logout",
        {[BackEnd.TOKEN_HEADER]: token},
        {}
    );
    return this.requestWrapped(request).then((response) => {
      if (response.status == 200) {
        return JSON.stringify(response);
      } else {
        throw new Error("logout failed");
      }
    });
  }

  /**
   * Create a new Homer.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   */
  public createHomer(id:string, token:string):Promise<string> {
    "use strict";

    let request = new Request(
        "POST",
        BackEnd.HOSTNAME, BackEnd.PORT, "/project/posthomer",
        {[BackEnd.TOKEN_HEADER]: token},
        {homerId: id, typeOfDevice: "raspberry"}
    );
    return this.requestWrapped(request).then(JSON.stringify);
  }

  /**
   * Create a new light.
   *
   * @param id the ID of the device.
   * @param token an authentication token.
   * @param callback a callback called with an indicator and a message
   *                 describing the result.
   */
  public createDevice(id:string, type:string, token:string):Promise<string> {
    "use strict";

    let request = new Request(
        "POST",
        BackEnd.HOSTNAME, BackEnd.PORT, "/project/postNewDevice",
        {[BackEnd.TOKEN_HEADER]: token},
        {biteCode: id, typeOfDevice: type, parameters: []}
    );
    return this.requestWrapped(request).then(JSON.stringify);
  }

  /**
   * Create a new project.
   *
   * @param project the project.
   * @param token an authentication token.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public createProject(project:Project, token:string):Promise<string> {
    "use strict";

    let request = new Request(
        "POST",
        BackEnd.HOSTNAME, BackEnd.PORT, BackEnd.PROJECT_PATH,
        {[BackEnd.TOKEN_HEADER]: token},
        {projectName: project.name, projectDescription: project.description}
    );
    return this.requestWrapped(request).then(JSON.stringify);
  }

  /**
   * Retrieve all the projects of a person.
   *
   * @param token an authentication token of the person.
   * @returns a promise that will be resolved with a mapping from the projects
   *          IDs to the projects themselves, or rejected with a reason.
   */
  public getProjects(token:string):Promise<{[id: string]: Project}> {
    "use strict";

    let request = new Request(
        "GET",
        BackEnd.HOSTNAME, BackEnd.PORT, BackEnd.PROJECT_PATH,
        {[BackEnd.TOKEN_HEADER]: token}
    );
    return this.requestWrapped(request).then((response) => {
      if (response.status == 200) {
        let idToProject:{[id: string]: Project} = {};
        for (let project of JSON.parse(response.body)) {
          idToProject[project.projectId] = new Project(project.projectName, project.projectDescription);
        }
        return idToProject;
      } else {
        throw JSON.stringify(response);
      }
    });
  }
}
