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
import * as ngRouter from "angular2/router";
import * as blocko from "../node_modules/blocko/js/index";


class OnlyAuthenticated implements ng.OnInit, ng.OnDestroy {
  backEnd:BackEndAngular;
  router:ngRouter.Router;
  exists = false;

  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router) {
    "use strict";
    this.backEnd = backEndAngular;
    this.router = router;
    backEndAngular.userChanged.toRx().subscribe(() => this.redirect());
  }

  onInit():void {
    "use strict";
    this.exists = true;
    this.redirect();
  }

  onDestroy():void {
    "use strict";
    this.exists = false;
  }

  redirect():void {
    "use strict";
    if (this.exists && this.backEnd.userEmail === null) {
      this.router.navigate(['/Login']);
    }
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

  public registered:ng.EventEmitter;

  public userChanged:ng.EventEmitter;

  userEmail:string = null;

  projectChanged:ng.EventEmitter;

  programChanged:ng.EventEmitter;

  /**
   * Create a new service instance.
   *
   * @param http a service that is able to perform HTTP requests.
   */
  public constructor(http:ngHttp.Http) {
    "use strict";

    super();
    this.http = http;
    this.registered = new ng.EventEmitter();
    this.userChanged = new ng.EventEmitter();
    this.projectChanged = new ng.EventEmitter();
    this.programChanged = new ng.EventEmitter();
  }

  /**
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   */
  protected requestGeneral(request:backEnd.Request):Promise<backEnd.Response> {
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

    return super.createPerson(email, password).then((message) => {
      this.registered.next(null);
      return message;
    });
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

    return super.logIn(email, password).then((message) => {
      this.userEmail = email;
      this.userChanged.next(this.userEmail);
      return message;
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

    return super.logOut().then((message) => {
          this.userEmail = null;
          this.userChanged.next(this.userEmail);
          return message;
        }
    );
  }

  /**
   * Create a new project.
   *
   * @param project the project.
   * @param token an authentication token.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public createProject(project:backEnd.Project):Promise<string> {
    "use strict";

    return super.createProject(project).then((message) => {
      this.projectChanged.next(null);
      return message;
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

    return super.addHomerToProject(homer, project).then((message) => {
      this.projectChanged.next(project);
      return message;
    });
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

    return super.addDeviceToProject(device, project).then((message) => {
      this.projectChanged.next(project);
      return message;
    });
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

    return super.deleteProject(id).then((message) => {
      this.projectChanged.next(id);
      return message;
    });
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
  public createProgram(program:backEnd.Program, project:string):Promise<string> {
    "use strict";

    return super.createProgram(program, project).then((message) => {
      this.projectChanged.next(project);
      return message;
    });
  }

  public updateProgram(id:string, program:backEnd.Program, project:string):Promise<string> {
    "use strict";

    return super.updateProgram(id, program, project).then((message) => {
      this.programChanged.next(program);
      return message;
    });
  }
}

@ng.Component({
  directives: [ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  templateUrl: "src/person-registration.html"
})
class PersonRegistration {

  /**
   * A service providing access to the back end.
   */
  public backEnd:BackEndAngular;

  public router:ngRouter.Router;

  /**
   * A model of the person registration form.
   */
  public person:{email:string, password:string};

  /**
   * A message describing the result of the last person registration attempt.
   */
  public message:string;

  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router) {
    "use strict";

    this.backEnd = backEndAngular;
    this.router = router;
    this.person = {email: "", password: ""};
  }

  /**
   * Register a new person.
   *
   * The credentials of the person are taken from
   * {@link Controller#personRegistrationModel}. A message describing the result
   * is stored in {@link Controller#personRegistrationMsg}.
   */
  submit():void {
    "use strict";

    this.backEnd.createPerson(this.person.email, this.person.password)
        .then((message) => {
          this.router.navigate(['/Login']);
          this.message = "success: " + message;
        })
        .catch((reason) => this.message = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }
}

@ng.Component({
  directives: [ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  templateUrl: "src/login.html"
})
class Login {

  /**
   * A service providing access to the back end.
   */
  public backEnd:BackEndAngular;

  public router:ngRouter.Router;

  /**
   * A model of the login form.
   */
  public credentials:{email:string, password:string};

  /**
   * A message describing the result of the last login attempt.
   */
  public message:string;

  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router) {
    "use strict";

    this.backEnd = backEndAngular;
    this.router = router;
    this.credentials = {email: "", password: ""};
  }

  /**
   * Log a person in.
   *
   * The credentials are taken from {@link Controller#loginModel}. A message
   * describing the result is stored in {@link Controller#loginMsg}. In case of
   * success, {@link Controller#authToken} is set. Otherwise, it is cleared.
   */
  submit():void {
    "use strict";

    this.backEnd.logIn(this.credentials.email, this.credentials.password)
        .then((msg) => {
          this.message = "success: " + msg;
          this.router.navigate(['/Devices']);
        })
        .catch((reason) => {
          this.message = "failure: " + reason.toString() + ": " + JSON.stringify(reason);
        });
  }
}

@ng.Component({
  directives: [ngRouter.ROUTER_DIRECTIVES],
  selector: ".main-header",
  templateUrl: "src/main-header.html"
})
export class MainHeader {
  backEnd:BackEndAngular;

  email = "";
  /**
   * A message describing the result of the last logout attempt.
   */
  public logoutMsg:string;

  constructor(backEndAngular:BackEndAngular) {
    "use strict";

    this.backEnd = backEndAngular;
    this.email = this.backEnd.userEmail;
    this.backEnd.userChanged.toRx().subscribe((email:string) => this.email = email === null ? "" : email);
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

    this.backEnd.logOut()
        .then((message) => {
          this.logoutMsg = "success: " + message;
        })
        .catch((reason) => {
          this.logoutMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason);
        });
  }
}

@ng.Component({
  directives: [ng.FORM_DIRECTIVES],
  selector: ".content",
  templateUrl: "src/devices.html"
})
class DevicesTables extends OnlyAuthenticated {
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


  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router) {
    "use strict";
    super(backEndAngular, router);
    this.deviceRegistrationModel = {id: "", type: ""};
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

    this.backEnd.createHomer(this.homerRegistrationId)
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

    this.backEnd.createDevice(this.deviceRegistrationModel.id, this.deviceRegistrationModel.type)
        .then((message) => this.deviceRegistrationMsg = "success: " + message)
        .catch((reason) => this.deviceRegistrationMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }
}

@ng.Component({
  directives: [MainHeader, DevicesTables, ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES],
  templateUrl: "src/wrapper.html"
})
class Devices {
  heading = "Devices";
  breadcrumbs = [{route: ["/Devices"], human: "home"}, {
    route: ["/Devices"],
    human: "devices"
  }];
}

@ng.Component({
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES],
  selector: ".content",
  templateUrl: "src/project.html"
})
class ProjectOverview extends OnlyAuthenticated {

  id:string;

  project:backEnd.Project;

  homers:string[];

  devices:{id:string, type:string}[] = [];

  programs:{route:any[], program:backEnd.Program}[] = [];

  queue:{homerId:string, program:string}[] = [];

  /**
   * The ID of the Homer to be added.
   */
  public homerAdditionId:string;

  /**
   * A message describing the result of the latest Homer-to-project addition.
   */
  public homerAdditionMsg:string;

  /**
   * The ID of the device to be added.
   */
  public deviceAdditionId:string;

  /**
   * A message describing the result of the latest device-to-project addition.
   */
  public deviceAdditionMsg:string;

  deletingMsg:string;

  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router, params:ngRouter.RouteParams) {
    "use strict";
    super(backEndAngular, router);
    this.id = params.get("project");
    this.project = new backEnd.Project("", "");
    this.backEnd.userChanged.toRx().subscribe(() => this.refresh());
    this.backEnd.projectChanged.toRx().subscribe((id:string) => {
      if (id == this.id) {
        this.refresh();
      }
    });
    this.backEnd.programChanged.toRx().subscribe(() => this.refresh());
  }

  onInit():void {
    "use strict";
    super.onInit();
    this.refresh();
  }

  /**
   * Refresh {@link Controller#idToProject}.
   *
   * Credentials are taken from {@link Controller#authToken}.
   */
  refresh():void {
    "use strict";

    try {
      this.backEnd.getProject(this.id)
          .then((x:{name:string, description:string, homers:string[], devices:{id:string, type:string}[], idToProgram:{[id: string]: backEnd.Program}, queue:{homerId:string, program:string}[]}) => {
            const DICTIONARY:{[type:string]: string} = {
              lightnormaldevice: "light",
              switchdevice: "switch"
            };

            this.project = new backEnd.Project(x.name, x.description);
            this.homers = x.homers;
            this.devices = x.devices.map((device) => ({
              id: device.id,
              type: DICTIONARY[device.type]
            }));
            this.programs = Object.keys(x.idToProgram).map((id) => ({
              route: ['/Program', {
                project: this.id,
                program: id
              }], program: x.idToProgram[id]
            }));
            this.queue = x.queue;
          })
          .catch((message) => {
            this.project = new backEnd.Project("", "");
            this.homers = [];
            this.devices = [];
            this.programs = [];
            this.queue = [];
            this.router.navigate(["/Projects"]);
          });
    } catch (error) {
      if (error instanceof backEnd.AuthenticationError) {
        this.project = new backEnd.Project("", "");
        this.homers = [];
        this.devices = [];
        this.programs = [];
        this.queue = [];
        this.redirect();
      } else {
        throw error;
      }
    }
  }

  /**
   * Add a Homer to a project.
   *
   * The properties of the Homer are taken from
   * {@link Controller#homerProjectAdditionId} and the properties of the project
   * are taken from {@link Controller#project}. Credentials are taken from
   * {@link Controller#authToken}. A message describing the result is stored in
   * {@link Controller#homerProjectAdditionMsg}.
   */
  addHomer():void {
    "use strict";

    this.backEnd.addHomerToProject(this.homerAdditionId, this.id)
        .then((message) => {
          this.homerAdditionMsg = "success: " + message;
        })
        .catch((reason) => this.homerAdditionMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

  /**
   * Add a device to a project.
   *
   * The properties of the device are taken from
   * {@link Controller#deviceProjectAdditionId} and the properties of the
   * project are taken from {@link Controller#project}. Credentials are taken
   * from {@link Controller#authToken}. A message describing the result is
   * stored in {@link Controller#deviceProjectAdditionMsg}.
   */
  addDevice():void {
    "use strict";

    this.backEnd.addDeviceToProject(this.deviceAdditionId, this.id)
        .then((message) => this.deviceAdditionMsg = "success: " + message)
        .catch((reason) => this.deviceAdditionMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

  deleteProject():void {
    "use strict";

    this.backEnd.deleteProject(this.id)
        .then((message) => this.deletingMsg = "success: " + message)
        .catch((reason) => this.deletingMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

}

@ng.Component({
  directives: [MainHeader, ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES, ProjectOverview],
  templateUrl: "src/wrapper.html"
})
class Project {
  heading:string;
  breadcrumbs:{route:any, human:string}[];

  constructor(params:ngRouter.RouteParams) {
    this.heading = "Project " + params.get("project");
    this.breadcrumbs = [{
      route: ["/Devices"],
      human: "home"
    }, {
      route: ["/Projects"],
      human: "projects"
    }, {
      route: ["/Project", {project: params.get("project")}],
      human: "project " + params.get("project").toString()
    }];
  }
}


@ng.Component({
  directives: [ng.CORE_DIRECTIVES],
  inputs: ["code"],
  selector: ".blocko",
  templateUrl: "src/blocko.html"
})
class BlockoCmp implements ng.OnDestroy {
  @ng.Output()
  codeChange = new ng.EventEmitter();
  @ng.Output()
  configRequest = new ng.EventEmitter();

  private controller:blocko.BlockoCore.Controller;

  blocks = [
    [
      {computer: 'switch', human: 'switch'},
      {computer: 'pushButton', human: 'button'},
      {computer: 'light', human: 'light'}
    ],
    [
      {computer: 'analogInput', human: 'input'},
      {computer: 'analogOutput', human: 'output'}
    ],
    [
      {computer: 'and', human: 'and'},
      {computer: 'or', human: 'or'},
      {computer: 'xor', human: 'xor'},
      {computer: 'not', human: 'not'}
    ],
    [
      {computer: 'flipFlop', human: 'flipFlop'},
      {computer: 'delayTimer', human: 'delay'},
      {computer: 'asyncGenerator', human: 'async'}
    ],
    [
      {computer: 'analogRange', human: 'range'}
    ],
    [
      {computer: 'jsBlock', human: 'custom'}
    ]
  ];

  constructor() {
    "use strict";
    let renderer = new blocko.BlockoSnapRenderer.RendererController(document.getElementById("editor"));
    renderer.registerOpenConfigCallback((block) => this.configRequest.next(block));
    this.controller = blocko.BlockoCore.Controller.getInstance();
    this.controller.registerFactoryBlockRendererCallback((block) =>
        new blocko.BlockoSnapRenderer.BlockRenderer(renderer, block)
    );
    this.controller.registerFactoryConnectionRendererCallback((connection) =>
        new blocko.BlockoSnapRenderer.ConnectionRenderer(renderer, connection)
    );
    this.controller.registerBlocks(blocko.BlockoBasicBlocks.Manager.getAllBlocks());
  }

  get code():string {
    "use strict";
    return this.controller.getDataJson();
  }

  set code(code:string) {
    "use strict";
    this.controller.setDataJson(code);
    // TODO
    this.codeChange.next(this.code);
  }

  onDestroy():void {
    // TODO - the rendered should do that - also the renderer should be removed
    let node = document.getElementById("editor");
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
  }

  addBlock(type:any) {
    "use strict";
    let cls = this.controller.getBlockClassByVisutalType(type);
    this.controller.addBlock(new cls(this.controller.getFreeBlockId()));
    // TODO
    this.codeChange.next(this.code);
  }

  clearEditor() {
    "use strict";
    this.controller.removeAllBlocks();
    // TODO
    this.codeChange.next(this.code);
  }
}


@ng.Component({
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, BlockoCmp],
  selector: ".blocko-config",
  templateUrl: "src/blocko-config.html"

})
class BlockoConfig implements ng.OnChanges {
  @ng.Input()
  block:blocko.BlockoCore.Block = null;
  @ng.Output()
  saveDone = new ng.EventEmitter();
  @ng.Output()
  close = new ng.EventEmitter();

  id = "";

  properties:{displayName:string, value:any, id:string}[] = [];

  onChanges(changes:{[propName: string]: ng.SimpleChange}):void {
    "use strict";
    if (changes["block"]) {
      if (changes["block"].currentValue) {
        this.id = changes["block"].currentValue.id;
        this.properties = changes["block"].currentValue.getConfigProperties().map((property:blocko.BlockoCore.ConfigProperty) => ({
              displayName: property.displayName,
              value: property.value.toString(),
              id: property.id
            })
        );
      } else {
        this.id = "";
        this.properties = [];
      }
    }
  }

  save() {
    "use strict";
    this.properties.forEach((property) => {
      let property2 = this.block.getConfigPropertyById(property.id);
      let value:any = property.value;
      switch (property2.type) {
        case blocko.BlockoCore.ConfigPropertyType.Integer:
          value = parseInt(value, 10);
          break;
        case blocko.BlockoCore.ConfigPropertyType.Float:
          value = parseFloat(value);
          break;
        case blocko.BlockoCore.ConfigPropertyType.Boolean:
          value = value.toLowerCase() == "true";
          break;
        default:
      }
      property2.value = value;
    });
    this.block.emitConfigsChanged();
    this.saveDone.next(null);
  }
}

@ng.Component({
  directives: [ng.CORE_DIRECTIVES, ng.FORM_DIRECTIVES, BlockoCmp, BlockoConfig],
  selector: ".content",
  templateUrl: "src/program.html"
})
class ProgramOverview extends OnlyAuthenticated {

  project:string;

  id:string;

  program:backEnd.Program;

  homers:string[];

  message:string;

  /**
   * A model of the Homer updating form.
   */
  public homerUpdatingModelId:string;

  /**
   * A message describing the result of the latest Homer updating attempt.
   */
  public homerUpdatingMsg:string;

  public homerUpdatingModelNew:{id:string, date:string, time:string, when:string};

  public homerUpdatingNewMsg:string;

  config:blocko.BlockoCore.Block = null;

  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router, params:ngRouter.RouteParams) {
    "use strict";
    super(backEndAngular, router);
    this.project = params.get("project");
    this.id = params.get("program");
    this.program = new backEnd.Program("", "", "");
    this.initializeModel();
    this.backEnd.userChanged.toRx().subscribe(() => this.refresh());
    this.backEnd.projectChanged.toRx().subscribe((id:string) => {
      if (id == this.project) {
        this.refresh();
      }
    });
    this.backEnd.programChanged.toRx().subscribe((id:string) => {
      if (id == this.id) {
        this.refresh();
      }
    });
  }

  initializeModel() {
    let now = new Date();
    this.homerUpdatingModelNew = {
      id: "",
      date: "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate(),
      time: "" + now.getHours() + ":" + now.getMinutes(),
      when: "-1"
    };
  }

  onInit():void {
    "use strict";
    super.onInit();
    this.refresh();
  }

  /**
   * Refresh {@link Controller#idToProject}.
   *
   * Credentials are taken from {@link Controller#authToken}.
   */
  refresh():void {
    "use strict";

    try {
      this.backEnd.getProject(this.project)
          .then((x:{homers:string[], idToProgram:{[id: string]: backEnd.Program}}) => {
            this.homers = x.homers;
            this.program = x.idToProgram[this.id];
            this.config = null;
            if (this.homers) {
              this.homerUpdatingModelId = this.homers[0];
              this.homerUpdatingModelNew.id = this.homers[0];
            } else {
              this.homerUpdatingModelId = null;
              this.homerUpdatingModelNew.id = null;
            }
          })
          .catch((message) => {
            this.homers = [];
            this.homerUpdatingModelId = null;
            this.program = new backEnd.Program("", "", "");
            this.config = null;
            this.initializeModel();
            this.router.navigate(["/Project", {project: this.project}]);
          });
    } catch (error) {
      if (error instanceof backEnd.AuthenticationError) {
        this.homers = [];
        this.homerUpdatingModelId = null;
        this.program = new backEnd.Program("", "", "");
        this.config = null;
        this.initializeModel();
        this.redirect();
      } else {
        throw error;
      }
    }
  }

  update():void {
    // TODO we miss changes in movement, new connections, config chagnes...
    this.backEnd.updateProgram(this.id, this.program, this.project)
        .then((message) => this.message = "success: " + message)
        .catch((reason) => this.message = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

  /**
   * Update a Homer.
   *
   * The properties of the Homer are taken from
   * {@link Controller#homerUpdatingModel}. Credentials are taken from
   * {@link Controller#authToken}. A message describing the result is stored in
   * {@link Controller#homerUpdatingMsg}.
   */
  updateHomer():void {
    "use strict";

    this.backEnd.updateHomer(this.homerUpdatingModelId, this.id)
        .then((message) => this.homerUpdatingMsg = "success: " + message)
        .catch((reason) => this.homerUpdatingMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }

  updateHomerNew():void {
    "use strict";
    let time = parseInt(this.homerUpdatingModelNew.when, 10);
    if (time > 0) {
      let ds = this.homerUpdatingModelNew.date.split("-");
      let ts = this.homerUpdatingModelNew.time.split(":");
      let date = new Date(parseInt(ds[0], 10), parseInt(ds[1], 10), parseInt(ds[2], 10), parseInt(ts[0], 10), parseInt(ts[1], 10));
      time = date.getTime();
    }
    this.backEnd.updateHomer(this.homerUpdatingModelNew.id, this.id, time)
        .then((message) => this.homerUpdatingNewMsg = "success: " + message)
        .catch((reason) => this.homerUpdatingNewMsg = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }
}

@ng.Component({
  directives: [MainHeader, ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES, ProgramOverview],
  templateUrl: "src/wrapper.html"
})
class Program {
  heading:string;
  breadcrumbs:{route:any, human:string}[];

  constructor(params:ngRouter.RouteParams) {
    this.heading = "Program " + params.get("program") + " (Project " + params.get("project") + ")";
    this.breadcrumbs = [{
      route: ["/Devices"],
      human: "home"
    }, {
      route: ["/Projects"],
      human: "projects"
    }, {
      route: ["/Project", {project: params.get("project")}],
      human: "project " + params.get("project").toString()
    },
      {
        route: ["/Program", {
          project: params.get("project"),
          program: params.get("program")
        }], human: "program " + params.get("program")
      }];
  }
}

@ng.Component({
  directives: [ng.FORM_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES],
  selector: ".content",
  templateUrl: "src/projects.html"
})
class ProjectsTable extends OnlyAuthenticated {
  projects:{route:any[], project:backEnd.Project}[] = [];

  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router) {
    "use strict";
    super(backEndAngular, router);
    this.backEnd.userChanged.toRx().subscribe(() => this.refresh());
    this.backEnd.projectChanged.toRx().subscribe(() => this.refresh());
  }

  onInit():void {
    "use strict";
    super.onInit();
    this.refresh();
  }

  /**
   * Refresh {@link Controller#idToProject}.
   *
   * Credentials are taken from {@link Controller#authToken}.
   */
  refresh():void {
    "use strict";

    try {
      this.backEnd.getProjects()
          .then((idToProject) => this.projects = Object.keys(idToProject).map((id) => ({
            route: ['/Project', {project: id}],
            project: idToProject[id]
          })))
          .catch((message) => this.projects = []);
    } catch (error) {
      if (error instanceof backEnd.AuthenticationError) {
        this.projects = [];
        this.redirect();
      } else {
        throw error;
      }
    }
  }
}

@ng.Component({
  directives: [MainHeader, ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES, ProjectsTable],
  templateUrl: "src/wrapper.html"
})
class Projects {
  heading = "Projects";
  breadcrumbs = [{route: ["/Devices"], human: "home"}, {
    route: ["/Projects"],
    human: "projects"
  }];
}

@ng.Component({
  directives: [ng.FORM_DIRECTIVES, BlockoCmp, BlockoConfig],
  selector: ".content",
  templateUrl: "src/new-program.html"
})
class NewProgramForm extends OnlyAuthenticated {
  project:string;

  /**
   * A model of the program creation form.
   */
  public program:backEnd.Program;

  /**
   * A message describing the result of the latest program creation attempt.
   */
  public message:string;

  config:blocko.BlockoCore.Block = null;

  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router, params:ngRouter.RouteParams) {
    "use strict";
    super(backEndAngular, router);
    this.project = params.get("project");
    this.program = new backEnd.Program("", "", "");
  }

  /**
   * Create a new program.
   *
   * The properties of the program are taken from
   * {@link Controller#programCreationModel} and the properties of the project
   * are taken from {@link Controller#project}. Credentials are taken from
   * {@link Controller#authToken}. A message describing the result is stored in
   * {@link Controller#programCreationMsg}.
   */
  create():void {
    "use strict";

    this.backEnd.createProgram(this.program, this.project)
        .then((message) => {
          this.message = "success: " + message;
          this.router.navigate(['/Project', {project: this.project}]);
        })
        .catch((reason) => this.message = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }
}

@ng.Component({
  directives: [MainHeader, ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES, NewProgramForm],
  templateUrl: "src/wrapper.html"
})
class NewProgram {
  heading:string;
  breadcrumbs:{route:any, human:string}[];

  constructor(params:ngRouter.RouteParams) {
    this.heading = "New Program (Project " + params.get("project") + ")";
    this.breadcrumbs = [
      {route: ["/Devices"], human: "home"}, {
        route: ["/Projects"],
        human: "projects"
      }, {
        route: ["/Project", {project: params.get("project")}],
        human: "project " + params.get("project").toString()
      },
      {
        route: ["/NewProgram", {project: params.get("project")}],
        human: "new program"
      }];
  }
}

@ng.Component({
  directives: [ng.FORM_DIRECTIVES],
  selector: ".content",
  templateUrl: "src/new-project.html"
})
class NewProjectForm extends OnlyAuthenticated {
  /**
   * A model of the project creation form.
   */
  public project:backEnd.Project;

  /**
   * A message describing the result of the last project creation attempt.
   */
  public message:string;

  constructor(backEndAngular:BackEndAngular, router:ngRouter.Router) {
    "use strict";
    super(backEndAngular, router);
    this.project = new backEnd.Project("", "");
  }

  /**
   * Create a new project.
   *
   * The properties of the project are taken from
   * {@link Controller#projectCreationModel}. Credentials are taken from
   * {@link Controller#authToken}. A message describing the result is stored in
   * {@link Controller#projectCreationMsg}.
   */
  create():void {
    "use strict";

    this.backEnd.createProject(this.project)
        .then((message) => {
          this.message = "success: " + message;
          this.router.navigate(['/Projects']);
        })
        .catch((reason) => this.message = "failure: " + reason.toString() + ": " + JSON.stringify(reason));
  }
}

@ng.Component({
  directives: [MainHeader, ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES, NewProjectForm],
  templateUrl: "src/wrapper.html"
})
class NewProject {
  heading = "New Project";
  breadcrumbs = [{route: ["/Devices"], human: "home"}, {
    route: ["/Projects"],
    human: "projects"
  }, {route: ["/NewProject"], human: "new"}];
}

/**
 * A "view" directive that renders a view from "src/view.html".
 *
 * It expects the the back end to be available at address 127.0.0.1 and port
 * 9000.
 */
@ng.Component({
  directives: [ngRouter.ROUTER_DIRECTIVES],
  selector: "view",
  templateUrl: "src/view.html"
})
@ngRouter.RouteConfig([
  {path: '/', redirectTo: '/devices'},
  {path: '/login', component: Login, as: "Login"},
  {path: '/devices', component: Devices, as: 'Devices'},
  {path: '/project/:project', component: Project, as: 'Project'},
  {
    path: '/project/:project/program/:program',
    component: Program,
    as: 'Program'
  },
  {
    path: '/project/:project/programs/new',
    component: NewProgram,
    as: 'NewProgram'
  },
  {path: '/projects', component: Projects, as: 'Projects'},
  {path: '/projects/new', component: NewProject, as: 'NewProject'},
  {path: '/registration', component: PersonRegistration, as: "Registration"}
])
export class Controller {
}
