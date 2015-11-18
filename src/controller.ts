/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * The controller part of the application.
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

import * as backEnd from "./backend";
import * as ng from "angular2/angular2";
import * as ngHttp from "angular2/http";

/**
 * A convenient wrapper around a mapping from projects' IDs to the projects.
 */
class IdToProject {

  /**
   * The mapping from the projects' IDs to the projects themselves.
   */
  idToProject:{[id: string]: backEnd.Project};

  /**
   * Create a new wrapper.
   *
   * @param idToProject the mapping from the projects' IDs to the projects.
   */
  constructor (idToProject:{[id: string]: backEnd.Project}) {
    "use strict";

    this.idToProject = idToProject;
  }

  /**
   * Get an array of the projects' IDs.
   *
   * @returns the IDs.
   */
  getIds():string[] {
    "use strict";

    return Object.keys(this.idToProject);
  }

  /**
   * Get the name of a project.
   *
   * @param id the ID of the project.
   * @returns the name of the project.
   */
  getName(id:string):string {
    "use strict";

    return this.idToProject[id].name;
  }
}

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
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES],
  providers: [BackEndAngular, ngHttp.HTTP_PROVIDERS],
  selector: "view",
  templateUrl: "src/view.html"
})
export class Controller {

  /**
   * A service providing access to the back end.
   */
  public backEnd:BackEndAngular;

  // TODO: persist it once Angular provides an API
  /**
   * An authentication token.
   */
  private authToken = "";

  /**
   * All the projects of the authenticated person.
   */
  public idToProject:IdToProject;

  /**
   * A model of the person registration form.
   */
  public personRegistrationModel:{email:string, password:string};

  /**
   * A message describing the result of the last person registration attempt.
   */
  public personRegistrationMsg:string;

  /**
   * A model of the login form.
   */
  public loginModel:{email:string, password:string};

  /**
   * A message describing the result of the last login attempt.
   */
  public loginMsg:string;

  /**
   * A message describing the result of the last logout attempt.
   */
  public logoutMsg:string;

  /**
   * The ID of a Homer to be registered.
   */
  public homerRegistrationId:string;

  /**
   * A message describing the result of the latest Homer registration attempt.
   */
  public homerRegistrationMsg:string;

  /**
   * A model of the device registration form.
   */
  public deviceRegistrationModel:{id:string, type:string};

  /**
   * A message describing the result of the latest device registration attempt.
   */
  public deviceRegistrationMsg:string;

  /**
   * A model of the project creation form.
   */
  public projectCreationModel:backEnd.Project;

  /**
   * A message describing the result of the last project creation attempt.
   */
  public projectCreationMsg:string;

  /**
   * The ID of a project to be selected.
   */
  public projectSelectionId:string;

  /**
   * A message describing the result of the latest project selection attempt.
   */
  public projectSelectionMsg:string;

  /**
   * Create a new controller.
   *
   * @param backEndAngular a service providing access to the back end at address
   *                       127.0.0.1 and port 9000.
   */
  constructor(backEndAngular:BackEndAngular) {
    "use strict";

    this.backEnd = backEndAngular;
    this.idToProject = new IdToProject({});
    this.personRegistrationModel = {email: "", password: ""};
    this.loginModel = {email: "", password: ""};
    this.projectCreationModel = new backEnd.Project("", "");
    this.deviceRegistrationModel = {id: "", type: ""};
  }

  /**
   * Refresh {@link Controller#idToProject}.
   *
   * Credentials are taken from {@link Controller#authToken}.
   */
  refreshProjects():void {
    "use strict";

    this.backEnd.getProjects(this.authToken)
        .then((idToProject) => this.idToProject = new IdToProject(idToProject))
        .catch((message) => this.idToProject = new IdToProject({}));
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
   * describing the result is stored in {@link Controller#loginMsg}. In case of
   * success, {@link Controller#authToken} is set. Otherwise, it is cleared.
   */
  logIn():void {
    "use strict";

    this.backEnd.logIn(this.loginModel.email, this.loginModel.password)
        .then((token) => {
          this.authToken = token;
          this.loginMsg = "success: " + this.authToken;
        })
        .catch((reason) => {
          this.authToken = "";
          this.loginMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason);
        });
  }

  /**
   * Log a person out.
   *
   * The authentication token is taken from {@link Controller#authToken}. A
   * message describing the result is stored in {@link Controller#logoutMsg}. In
   * case of success, {@link Controller#authToken} is cleared.
   */
  logOut():void {
    "use strict";

    this.backEnd.logOut(this.authToken)
        .then((message) => {
          this.authToken = "";
          this.logoutMsg = "success: " + message;
        })
        .catch((reason) => {
          this.logoutMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason);
        });
  }

  /**
   * Register a new Homer.
   *
   * The properties of the Homer are taken from
   * {@link Controller#homerRegistrationId}. Credentials are taken from
   * {@link Controller#authToken}. A message describing the result is stored in
   * {@link Controller#homerRegistrationMsg}.
   */
  registerHomer():void {
    "use strict";

    this.backEnd.createHomer(this.homerRegistrationId, this.authToken)
        .then((message) => this.homerRegistrationMsg = "success: " + message)
        .catch((reason) => this.homerRegistrationMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

  /**
   * Register a new light.
   *
   * The properties of the light are taken from
   * {@link Controller#lightRegistrationId}. Credentials are taken from
   * {@link Controller#authToken}. A message describing the result is stored in
   * {@link Controller#lightRegistrationMsg}.
   */
  registerDevice():void {
    "use strict";

    this.backEnd.createDevice(this.deviceRegistrationModel.id, this.deviceRegistrationModel.type, this.authToken)
        .then((message) => this.deviceRegistrationMsg = "success: " + message)
        .catch((reason) => this.deviceRegistrationMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

  /**
   * Create a new project.
   *
   * The properties of the project are taken from
   * {@link Controller#projectCreationModel}. Credentials are taken from
   * {@link Controller#authToken}. A message describing the result is stored in
   * {@link Controller#projectCreationMsg}.
   */
  createProject():void {
    "use strict";

    this.backEnd.createProject(this.projectCreationModel, this.authToken)
        .then((message) => this.personRegistrationMsg = "success: " + message)
        .catch((reason) => this.personRegistrationMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

  /**
   * Select a project.
   *
   * The properties of the project are taken from
   * {@link Controller#projectSelectionId}. A message describing the result is
   * stored in {@link Controller#projectSelectionMsg}.
   */
  selectProject():void {
    "use strict";

    this.projectSelectionMsg = this.projectSelectionId;
  }
}
