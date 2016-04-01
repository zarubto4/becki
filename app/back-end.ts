/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Documentation in this file might be outdated and the code might be dirty and
 * flawed since management prefers speed over quality.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

import * as _ from "underscore";
import * as _String from "underscore.string";
import * as ng from "angular2/angular2";
import * as ngHttp from "angular2/http";

import * as libBackEnd from "./lib-back-end/index";

@ng.Injectable()
export class Service extends libBackEnd.BackEnd {

  /**
   * A service that is able to perform HTTP requests.
   */
  http:ngHttp.Http;

  /**
   * Create a new service instance.
   *
   * @param http a service that is able to perform HTTP requests.
   */
  public constructor(http:ngHttp.Http) {
    "use strict";

    super();
    this.http = http;
  }

  /**
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   */
  protected requestGeneral(request:libBackEnd.Request):Promise<libBackEnd.Response> {
    "use strict";

    let ngRequest = new ngHttp.Request(new ngHttp.RequestOptions({
      method: _.property(_String.capitalize(request.method.toLowerCase()))(ngHttp.RequestMethods),
      headers: new ngHttp.Headers(request.headers),
      body: request.body,
      url: request.url
    }));
    return new Promise(resolve => this.http.request(ngRequest).subscribe((ngResponse:ngHttp.Response) => resolve(new libBackEnd.Response(ngResponse.status, ngResponse.json()))));
  }
}
