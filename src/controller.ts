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
@ng.Injectable()
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
 *
 * It expects the the back end to be available at address 127.0.0.1 and port
 * 9000.
 */
@ng.Component({
  directives: [ng.FORM_DIRECTIVES],
  providers: [BackEndAngular, ngHttp.HTTP_PROVIDERS],
  selector: "view",
  templateUrl: "src/view.html"
})
export class Controller {

  /**
   * A service providing access to the back end.
   */
  backEnd:BackEndAngular;

  /**
   * A model of the person registration form.
   */
  personRegistrationModel:{email:string, password:string};

  /**
   * A message describing the result of the last person registration attempt.
   */
  personRegistrationMsg:string;

  /**
   * A model of the login form.
   */
  loginModel:{email:string, password:string};

  /**
   * A message describing the result of the last login attempt.
   */
  loginMsg:string;

  /**
   * Create a new controller.
   *
   * @param backEndAngular a service providing access to the back end at address
   *                       127.0.0.1 and port 9000.
   */
  constructor(backEndAngular:BackEndAngular) {
    "use strict";

    this.backEnd = backEndAngular;
    this.personRegistrationModel = {email: "", password: ""};
    this.loginModel = {email: "", password: ""};
  }

  /**
   * Register a new person.
   *
   * The credentials of the person are taken from
   * {@link Controller#personRegistrationModel}. A message describing the result
   * is stored in {@link Controller#personRegistrationMsg}.
   */
  registerPerson():void {
    "use strict";

    this.backEnd.createPerson(this.personRegistrationModel.email, this.personRegistrationModel.password)
        .then((message) => this.personRegistrationMsg = "success: " + message)
        .catch((reason) => this.personRegistrationMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

  /**
   * Log a person in.
   *
   * The credentials are taken from {@link Controller#loginModel}. A message
   * describing the result is stored in {@link Controller#loginMsg}.
   */
  logIn():void {
    "use strict";

    this.backEnd.logIn(this.loginModel.email, this.loginModel.password)
        .then((token) => this.loginMsg = "success: " + token)
        .catch((reason) => this.loginMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }
}
