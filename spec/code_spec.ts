/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A verification of the application components and units.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Documentation and tests in this file might be outdated and the code might be
 * dirty and flawed since management prefers speed over quality.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

// TODO: https://github.com/angular/angular/issues/5306
import "reflect-metadata";
import * as backEnd from "../src/backend";
import * as controller from "../src/controller";
import * as http from "http";
import * as ngHttp from "angular2/http";
import * as support from "./support";
import * as url from "url";

/**
 * A testing subclass of {@link backEnd.BackEnd}.
 */
class BackEndStub extends backEnd.BackEnd {

  /**
   * Perform an HTTP request.
   *
   * Actually, it always throws an error since it is expected that a test
   * fixture will overwrite it.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   * @throws {Error} always.
   */
  public request(request:backEnd.Request):any {
    "use strict";

    throw new Error("not implemented yet");
  }
}

/**
 * A replacement for Angular's Http injectable.
 */
class Http {

  /**
   * Perform an HTTP request.
   *
   * @param request the request.
   * @returns a promise that will return the response, or fail.
   */
  request(request:ngHttp.Request):{subscribe:(onNext:(item:ngHttp.Response)=>any, onError:(err:any)=>any)=>any} {
    "use strict";

    let options = url.parse(request.url);
    let method:string;
    switch (request.method) {
      case ngHttp.RequestMethods.Delete:
        method = "DELETE";
        break;
      case ngHttp.RequestMethods.Get:
        method = "GET";
        break;
      case ngHttp.RequestMethods.Head:
        method = "HEAD";
        break;
      case ngHttp.RequestMethods.Options:
        method = "OPTIONS";
        break;
      case ngHttp.RequestMethods.Patch:
        method = "PATCH";
        break;
      case ngHttp.RequestMethods.Post:
        method = "POST";
        break;
      case ngHttp.RequestMethods.Put:
        method = "PUT";
        break;
      default:
        method = null;
    }
    let headers:{[name: string]: string} = {};
    for (let name of request.headers.keys()) {
      headers[name] = request.headers.get(name);
    }
    return {
      subscribe: (onNext, onError) => {
        let nodeRequest = http.request(
            {
              protocol: options.protocol,
              hostname: options.hostname,
              port: options.port,
              method: method,
              path: options.path,
              headers: headers
            },
            (nodeResponse) => {
              let body = "";
              nodeResponse.on("data", (data:string) => body += data);
              nodeResponse.on("end", () =>
                  onNext(new ngHttp.Response(new ngHttp.ResponseOptions({
                    body: body,
                    status: nodeResponse.statusCode
                  }))));
            }
        );
        nodeRequest.on("error", onError);
        nodeRequest.end(request.text());
      }
    };
  }
}

describe("The project", () => {
  "use strict";

  it("creates a new instance with a name", () => {
    expect(new backEnd.Project("test", "A testing project.").name).toEqual("test");
  });

  it("creates a new instance with a description", () => {
    expect(new backEnd.Project("test", "A testing project.").description).toEqual("A testing project.");
  });

  it("recognizes equal projects", () => {
    expect(new backEnd.Project("test", "A testing project.").equals(new backEnd.Project("test", "A testing project."))).toBeTruthy();
  });

  it("is not equal to null", () => {
    expect(new backEnd.Project("test", "A testing project.").equals(null)).toBeFalsy();
  });

  it('is not equal to a project with a different name', () => {
    expect(new backEnd.Project("test", "A testing project.").equals(new backEnd.Project("different", "A testing project."))).toBeFalsy();
  });

  it('is not equal to a project with a different description', () => {
    expect(new backEnd.Project("test", "A testing project.").equals(new backEnd.Project("test", "different"))).toBeFalsy();
  });
});

describe("The request", () => {
  "use strict";

  let request:backEnd.Request;

  beforeAll(() => {
    request = new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person");
  });

  it("creates a new instance with an HTTP method", () => {
    expect(new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person").method).toEqual("GET");
  });

  it("creates a new instance with a host name", () => {
    expect(new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person").hostname).toEqual("127.0.0.1");
  });

  it("creates a new instance with a port number", () => {
    expect(new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person").port).toEqual(9000);
  });

  it("creates a new instance with an absolute resource path", () => {
    expect(new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person").path).toEqual("/coreClient/person/person");
  });

  it("creates a new instance with HTTP headers", () => {
    expect(new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person", {foo: "bar"}).headers).toEqual({
      foo: "bar",
      "Content-Type": "application/json"
    });
  });

  it("creates a new instance with overwritten Content-Type HTTP header", () => {
    expect(new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person", {"Content-Type": "text/plain"}).headers).toEqual({"Content-Type": "application/json"});
  });

  it("creates a new instance with no body", () => {
    expect(new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person").body).toEqual("");
  });

  it("creates a new instance with a JSON body", () => {
    expect(new backEnd.Request("GET", "127.0.0.1", 9000, "/coreClient/person/person", {}, {foo: 123}).body).toEqual("{\"foo\":123}");
  });

  it("composes the URL", () => {
    expect(request.getUrl()).toEqual("http://127.0.0.1:9000/coreClient/person/person");
  });
});

describe("The response", () => {
  "use strict";

  it("creates a new instance with a status code", () => {
    expect(new backEnd.Response(200, "{}").status).toEqual(200);
  });

  it("creates a new instance with a body", () => {
    expect(new backEnd.Response(200, "{}").body).toEqual("{}");
  });
});

describe("The back end", () => {
  "use strict";

  const EMAIL = "test@example.com";
  const PASSWORD = "testing";
  let TOKEN = "3d7e6a76-4ed3-416c-8b36-f298f57d5614";
  let instance:BackEndStub;
  let project:backEnd.Project;

  beforeEach(() => {
    instance = new BackEndStub();
    project = new backEnd.Project("test", "A testing project.");
  });

  describe("if available", () => {
    beforeEach(() => {
      spyOn(instance, "request").and.returnValue(Promise.resolve(new backEnd.Response(200, "{}")));
    });

    it("performs a correct HTTP request to create a new person", () => {
      instance.createPerson(EMAIL, PASSWORD);
      expect(instance.request).toHaveBeenCalledWith(new backEnd.Request(
          "POST",
          "127.0.0.1", 9000, "/coreClient/person/person",
          {},
          {mail: EMAIL, password: PASSWORD}
      ));
    });

    it("returns a promise that will be resolved with a response to an attempt to create a new person", () => {
      expect(support.wait(instance.createPerson(EMAIL, PASSWORD))).toMatch(/.+/);
    });

    it("performs a correct HTTP request to log a person in", () => {
      instance.logIn(EMAIL, PASSWORD);
      expect(instance.request).toHaveBeenCalledWith(new backEnd.Request(
          "POST",
          "127.0.0.1", 9000, "/coreClient/person/permission/login",
          {},
          {email: EMAIL, password: PASSWORD}
      ));
    });

    it("performs a correct HTTP request to log a person out", () => {
      instance.logOut(TOKEN);
      expect(instance.request).toHaveBeenCalledWith(new backEnd.Request(
          "POST",
          "127.0.0.1", 9000, "/coreClient/person/permission/logout",
          {"X-AUTH-TOKEN": TOKEN},
          {}
      ));
    });

    it("returns a promise that will be resolved with a response to an attempt to log a person out", () => {
      expect(support.wait(instance.logOut(TOKEN))).toMatch(/.+/);
    });

    it("performs a correct HTTP request to create a new project", () => {
      instance.createProject(project, TOKEN);
      expect(instance.request).toHaveBeenCalledWith(new backEnd.Request(
          "POST",
          "127.0.0.1", 9000, "/project/project",
          {"X-AUTH-TOKEN": TOKEN},
          {projectName: project.name, projectDescription: project.description}
      ));
    });

    it("returns a promise that will be resolved with a response to an attempt to create a new project", () => {
      expect(support.wait(instance.createProject(project, TOKEN))).toMatch(/.+/);
    });
  });

  describe("if available and if credentials are correct", () => {
    beforeEach(() => {
      spyOn(instance, "request").and.returnValue(Promise.resolve(new backEnd.Response(200, "{\"token\": \"" + TOKEN + "\"}")));
    });

    it("returns a promise that will be resolved with an authentication token after an attempt to log a person in", () => {
      expect(support.wait(instance.logIn(EMAIL, PASSWORD))).toEqual(TOKEN);
    });
  });

  describe("if available and if credentials are not correct", () => {
    beforeEach(() => {
      spyOn(instance, "request").and.returnValue(Promise.resolve(new backEnd.Response(400, "{}")));
    });

    it("returns a promise that will be rejected with something else than a back end error because an attempt to log a person in have failed", () => {
      expect(support.waitRejection(instance.logIn(EMAIL, PASSWORD))).not.toEqual(jasmine.any(backEnd.BackEndError));
    });

    it("returns a promise that will be rejected with something else than a back end error because an attempt to log a person out have failed", () => {
      expect(support.waitRejection(instance.logOut(TOKEN))).not.toEqual(jasmine.any(backEnd.BackEndError));
    });
  });

  describe("if not available", () => {
    beforeEach(() => {
      spyOn(instance, "request").and.returnValue(Promise.reject(new Error("not available")));
    });

    it("returns a promise that will be rejected with a reason why an attempt to create a new person have failed", () => {
      expect(support.waitRejection(instance.createPerson(EMAIL, PASSWORD))).toEqual(jasmine.anything());
    });

    it("returns a promise that will be rejected with a back end error because an attempt to log a person in have failed", () => {
      expect(support.waitRejection(instance.logIn(EMAIL, PASSWORD))).toEqual(jasmine.any(backEnd.BackEndError));
    });

    it("returns a promise that will be rejected with a back end error because an attempt to log a person out have failed", () => {
      expect(support.waitRejection(instance.logOut(TOKEN))).toEqual(jasmine.any(backEnd.BackEndError));
    });

    it("returns a promise that will be rejected with a reason why an attempt to create a new project have failed", () => {
      expect(support.waitRejection(instance.createProject(project, TOKEN))).toEqual(jasmine.anything());
    });
  });
});

describe("The Angular based back end", () => {
  "use strict";

  const PASSWORD = "testing";
  let httpAngular:ngHttp.Http;
  let instance:controller.BackEndAngular;
  let backEndNodeJs:support.BackEndNodeJs;
  let email:string;

  beforeEach(() => {
    // TODO: The way to instantiate Http is not documented yet.
    httpAngular = <any>new Http();
    instance = new controller.BackEndAngular(httpAngular);
    backEndNodeJs = new support.BackEndNodeJs();
    support.wait(backEndNodeJs.findNonExistentPerson().then((email2) => {
      email = email2;
    }));
  });

  it("creates a new instance with an HTTP service", () => {
    expect(new controller.BackEndAngular(httpAngular).http).toEqual(httpAngular);
  });

  describe("if available", () => {
    it("creates a new person", () => {
      support.wait(instance.createPerson(email, PASSWORD));
      expect(support.call(() => backEndNodeJs.existCredentials(email, PASSWORD))).toBeTruthy();
    });

    it("returns a promise that will be resolved with a response to an attempt to create a new person", () => {
      expect(support.wait(instance.createPerson(email, PASSWORD))).toMatch(/.+/);
    });
  });

  describe("if available and if credentials are correct", () => {
    beforeEach(() => {
      support.wait(backEndNodeJs.createPerson(email, PASSWORD));
    });

    it("logs a person in", () => {
      // TODO: There is no way to test whether a person is logged in yet.
    });

    it("returns a promise that will be resolved with an authentication token after an attempt to log a person in", () => {
      expect(support.wait(instance.logIn(email, PASSWORD).then((token) => backEndNodeJs.logOut(token)))).toBeDefined();
    });
  });

  describe("if available and if an authentication token is correct", () => {
    let token:string;
    let project:backEnd.Project;

    beforeEach(() => {
      support.wait(backEndNodeJs.createPerson(email, PASSWORD));
      support.call(() => backEndNodeJs.logIn(email, PASSWORD).then((token2) => {
        token = token2;
      }));
      support.call(() => backEndNodeJs.findNonExistentProject(token).then((name) => {
        project = new backEnd.Project(name, "A testing project.");
      }));
    });

    it("logs a person out", () => {
      // TODO: There is no way to test whether a person is logged out yet.
    });

    it("returns a promise that will be resolved with a response to an attempt to log a person out", () => {
      expect(support.wait(instance.logOut(token))).toMatch(/.+/);
    });

    it("creates a new project", () => {
      support.wait(instance.createProject(project, token));
      expect(support.call(() => backEndNodeJs.existsProject(project, token))).toBeTruthy();
    });

    it("returns a promise that will be resolved with a response to an attempt to create a new project", () => {
      expect(support.wait(instance.createProject(project, token))).toMatch(/.+/);
    });

    afterEach(() => {
      support.wait(backEndNodeJs.deleteProject(project, token));
      support.call(() => backEndNodeJs.logOut(token));
    });
  });

  describe("if available and if credentials are not correct", () => {
    it("returns a promise that will be rejected with something else than a back end error because an attempt to log a person in have failed", () => {
      expect(support.waitRejection(instance.logIn(email, PASSWORD))).not.toEqual(jasmine.any(backEnd.BackEndError));
    });
  });

  describe("if available and if an authentication token is not correct", () => {
    it("returns a promise that will be rejected with something else than a back end error because an attempt to log a person out have failed", () => {
      expect(support.waitRejection(instance.logOut("incorrect"))).not.toEqual(jasmine.any(backEnd.BackEndError));
    });
  });

  describe("if not available", () => {
    beforeEach(() => {
      spyOn(httpAngular, "request").and.returnValue({subscribe: (onNext:(item:ngHttp.Response)=>any, onError:(err:any)=>any)=>onError(new Error("not available"))});
    });

    it("returns a promise that will be rejected with a reason why an attempt to create a new person have failed", () => {
      expect(support.waitRejection(instance.createPerson(email, PASSWORD))).toEqual(jasmine.anything());
    });

    it("returns a promise that will be rejected with a back end error because an attempt to log a person in have failed", () => {
      expect(support.waitRejection(instance.logIn(email, PASSWORD))).toEqual(jasmine.any(backEnd.BackEndError));
    });

    it("returns a promise that will be rejected with a back end error because an attempt to log a person out have failed", () => {
      expect(support.waitRejection(instance.logOut("3d7e6a76-4ed3-416c-8b36-f298f57d5614"))).toEqual(jasmine.any(backEnd.BackEndError));
    });

    it("returns a promise that will be rejected with a reason why an attempt to create a new project have failed", () => {
      expect(support.waitRejection(instance.createProject(new backEnd.Project("test", "A testing project."), "3d7e6a76-4ed3-416c-8b36-f298f57d5614"))).toEqual(jasmine.anything());
    });
  });

  it("is injectable", () => {
    // TODO: The way to test injectables is not documented yet.
  });

  afterEach(() => {
    support.wait(backEndNodeJs.deletePerson(email));
  });
});

describe("The view", () => {
  "use strict";

  // TODO: The way to test templates is not documented yet.
});

describe("The controller", () => {
  "use strict";

  const PASSWORD = "testing";
  let backEndAngular:controller.BackEndAngular;
  let instance:controller.Controller;
  let backEndNodeJs:support.BackEndNodeJs;
  let email:string;

  beforeEach(() => {
    // TODO: The way to instantiate Http is not documented yet.
    backEndAngular = new controller.BackEndAngular(<any>new Http());
    instance = new controller.Controller(backEndAngular);
    backEndNodeJs = new support.BackEndNodeJs();
    support.wait(backEndNodeJs.findNonExistentPerson().then((email2) => {
      email = email2;
    }));
  });

  it("creates a new instance with a back end service", () => {
    expect(new controller.Controller(backEndAngular).backEnd).toEqual(backEndAngular);
  });

  it("renders 'src/view.html' into 'view' elements", () => {
    // TODO: The way to test components is not documented yet.
  });

  describe("if the back end is available", () => {
    it("creates a new person", () => {
      instance.personRegistrationModel.email = email;
      instance.personRegistrationModel.password = PASSWORD;
      instance.registerPerson();
      support.waitBrowser(() => instance.personRegistrationMsg);
      expect(support.call(() => backEndNodeJs.existCredentials(email, PASSWORD))).toBeTruthy();
    });

    it("describes the result of an attempt to register a new person", () => {
      instance.personRegistrationModel.email = email;
      instance.personRegistrationModel.password = PASSWORD;
      instance.registerPerson();
      expect(support.waitBrowser(() => instance.personRegistrationMsg)).toBeTruthy();
    });

    it("logs a person in", () => {
      instance.loginModel.email = email;
      instance.loginModel.password = PASSWORD;
      instance.logIn();
      // TODO: There is no way to test whether the login was successful yet.
    });

    it("describes the result of an attempt to log a person in", () => {
      instance.loginModel.email = email;
      instance.loginModel.password = PASSWORD;
      instance.logIn();
      expect(support.waitBrowser(() => instance.loginMsg)).toBeTruthy();
    });
  });

  describe("if the back end is available and if a person is logged in", () => {
    let project:backEnd.Project;

    beforeEach(() => {
      support.wait(backEndNodeJs.createPerson(email, PASSWORD));
      support.call(() => backEndNodeJs.logIn(email, PASSWORD).then((token) =>
          backEndNodeJs.findNonExistentProject(token)
              .then((name) => project = new backEnd.Project(name, "A testing project."))
              .then(() => backEndNodeJs.logOut(token))
      ));
      instance.loginModel.email = email;
      instance.loginModel.password = PASSWORD;
      instance.logIn();
      support.waitBrowser(() => instance.loginMsg);
    });

    it("logs a person out", () => {
      instance.logOut();
      // TODO: There is no way to test whether the logout was successful yet.
    });

    it("describes the result of an attempt to log a person out", () => {
      instance.logOut();
      expect(support.waitBrowser(() => instance.logoutMsg)).toBeTruthy();
    });

    it("creates a new projct", () => {
      instance.projectCreationModel.name = project.name;
      instance.projectCreationModel.description = project.description;
      instance.createProject();
      support.waitBrowser(() => instance.projectCreationMsg);
      instance.logOut();
      support.waitBrowser(() => instance.logoutMsg);
      expect(support.call(() => backEndNodeJs.logIn(email, PASSWORD)
          .then((token) => backEndNodeJs.existsProject(project, token)
              .then((exists) => backEndNodeJs.logOut(token)
                  .then(() => exists)
              )
          )
      ))
          .toBeTruthy();
    });

    it("describes the result of an attempt to create a new project", () => {
      instance.projectCreationModel.name = project.name;
      instance.projectCreationModel.description = project.description;
      instance.createProject();
      expect(support.waitBrowser(() => instance.projectCreationMsg)).toBeTruthy();
    });

    afterEach(() => {
      instance.logOut();
      support.waitBrowser(() => instance.logoutMsg);
      support.call(() => backEndNodeJs.logIn(email, PASSWORD)
          .then((token) => backEndNodeJs.deleteProject(project, token)
              .then(() => backEndNodeJs.logOut(token))
          )
      );
    });
  });

  describe("if the back end is not available", () => {
    beforeEach(() => {
      let httpAngular = <any>new Http();
      spyOn(httpAngular, "request").and.returnValue({subscribe: (onNext:(item:ngHttp.Response)=>any, onError:(err:any)=>any)=>onError(new Error("not available"))});
      backEndAngular = new controller.BackEndAngular(httpAngular);
    });

    it("describes the result of an attempt to register a new person", () => {
      instance.personRegistrationModel.email = email;
      instance.personRegistrationModel.password = PASSWORD;
      instance.registerPerson();
      expect(support.waitBrowser(() => instance.personRegistrationMsg)).toBeTruthy();
    });

    it("describes the result of an attempt to log a person in", () => {
      instance.loginModel.email = email;
      instance.loginModel.password = PASSWORD;
      instance.logIn();
      expect(support.waitBrowser(() => instance.loginMsg)).toBeTruthy();
    });
  });

  describe("if the back end is not available and if a person is logged in", () => {
    beforeEach(() => {
      let httpAngular = <any>new Http();
      spyOn(httpAngular, "request").and.returnValue({subscribe: (onNext:(item:ngHttp.Response)=>any, onError:(err:any)=>any)=>onError(new Error("not available"))});
      backEndAngular = new controller.BackEndAngular(httpAngular);
      support.wait(backEndNodeJs.createPerson(email, PASSWORD));
      instance.loginModel.email = email;
      instance.loginModel.password = PASSWORD;
      instance.logIn();
      support.waitBrowser(() => instance.loginMsg);
    });

    it("describes the result of an attempt to log a person out", () => {
      instance.logOut();
      expect(support.waitBrowser(() => instance.logoutMsg)).toBeTruthy();
    });

    it("describes the result of an attempt to create a new project", () => {
      instance.projectCreationModel.name = "test";
      instance.projectCreationModel.description = "A testing project.";
      instance.createProject();
      expect(support.waitBrowser(() => instance.projectCreationMsg)).toBeTruthy();
    });
  });

  afterEach(() => {
    instance.logOut();
    support.call(() => backEndNodeJs.deletePerson(email));
  });
});

describe("The application bootstrap", () => {
  "use strict";

  // TODO: The way to test bootstrapping is not documented yet.
});

describe("The home page", () => {
  "use strict";

  it("has a title 'Becki'", () => {
    browser.get(support.HOMEPAGE_URL);
    expect(browser.getTitle()).toEqual("Becki");
  });

  it("displays an indication before the application loads", () => {
    // TODO: https://github.com/angular/protractor/issues/2705
  });

  it("displays an error if scripting is disabled", () => {
    // TODO: https://github.com/angular/protractor/issues/2704
  });

  it("does not display an error if scripting is enabled", () => {
    browser.get(support.HOMEPAGE_URL);
    expect($("html").getText()).not.toMatch(/Failed! Scripting has to be enabled\./);
  });
});
