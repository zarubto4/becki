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
 * A service providing access to the back end at 127.0.0.1:9000.
 */
export abstract class BackEnd {

  /**
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   */
  protected abstract request(request:Request):Promise<Response>;
}
