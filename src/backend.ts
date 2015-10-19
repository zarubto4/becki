/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A service providing access to the back end.
 */

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
}
