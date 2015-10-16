/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A verification of the application components and units.
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
  let instance:BackEndStub;

  beforeEach(() => {
    instance = new BackEndStub();
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
  });

  describe("if not available", () => {
    beforeEach(() => {
      spyOn(instance, "request").and.returnValue(Promise.reject(new Error("not available")));
    });

    it("returns a promise that will be rejected with a reason why an attempt to create a new person have failed", () => {
      expect(support.waitRejection(instance.createPerson(EMAIL, PASSWORD))).toEqual(jasmine.anything());
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

  describe("if not available", () => {
    beforeEach(() => {
      spyOn(httpAngular, "request").and.returnValue({subscribe: (onNext:(item:ngHttp.Response)=>any, onError:(err:any)=>any)=>onError(new Error("not available"))});
    });

    it("returns a promise that will be rejected with a reason why an attempt to create a new person have failed", () => {
      expect(support.waitRejection(instance.createPerson(email, PASSWORD))).toEqual(jasmine.anything());
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
  });

  afterEach(() => {
    support.wait(backEndNodeJs.deletePerson(email));
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
