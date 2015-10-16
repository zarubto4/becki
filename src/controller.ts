/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * The controller part of the application.
 */

import * as backEnd from "./backend";
import * as ng from "angular2/angular2";
import * as ngHttp from "angular2/http";

/**
 * A service providing access to the back end at 127.0.0.1:9000.
 *
 * It uses Angular to perform HTTP requests.
 */
export class BackEndAngular extends backEnd.BackEnd {

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
  protected request(request:backEnd.Request):Promise<backEnd.Response> {
    "use strict";

    const DICTIONARY:{[name: string]: ngHttp.RequestMethods} = {
      DELETE: ngHttp.RequestMethods.Delete,
      GET: ngHttp.RequestMethods.Get,
      HEAD: ngHttp.RequestMethods.Head,
      OPTIONS: ngHttp.RequestMethods.Options,
      PATCH: ngHttp.RequestMethods.Patch,
      POST: ngHttp.RequestMethods.Post,
      PUT: ngHttp.RequestMethods.Put
    };
    let ngRequest = new ngHttp.Request(new ngHttp.RequestOptions({
      method: DICTIONARY[request.method.toUpperCase()],
      headers: new ngHttp.Headers(request.headers),
      body: request.body,
      url: request.getUrl()
    }));
    return new Promise((resolve, reject) =>
        this.http.request(ngRequest).subscribe(
            (ngResponse:ngHttp.Response) => resolve(new backEnd.Response(ngResponse.status, ngResponse.text())),
            reject
        )
    );
  }
}

/**
 * A "view" directive that renders a view from "src/view.html".
 */
@ng.Component({
  selector: "view"
})
@ng.View({
  templateUrl: "src/view.html"
})
export class Controller {
}
