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

/**
 * The URL of the home page.
 */
const HOMEPAGE_URL = "http://127.0.0.1:8080/";

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

describe("The Angular based back end", () => {
  "use strict";

  it("creates a new instance with an HTTP service", () => {
    let http:any = {request: "foo"};
    expect(new controller.BackEndAngular(http).http).toEqual(http);
  });
});

describe("The view", () => {
  "use strict";

  // TODO: The way to test templates is not documented yet.
});

describe("The controller", () => {
  "use strict";

  it("renders 'src/view.html' into 'view' elements", () => {
    // TODO: The way to test components is not documented yet.
  });
});

describe("The application bootstrap", () => {
  "use strict";

  // TODO: The way to test bootstrapping is not documented yet.
});

describe("The home page", () => {
  "use strict";

  it("has a title 'Becki'", () => {
    browser.get(HOMEPAGE_URL);
    expect(browser.getTitle()).toEqual("Becki");
  });

  it("displays an indication before the application loads", () => {
    // TODO: https://github.com/angular/protractor/issues/2705
  });

  it("displays an error if scripting is disabled", () => {
    // TODO: https://github.com/angular/protractor/issues/2704
  });

  it("does not display an error if scripting is enabled", () => {
    browser.get(HOMEPAGE_URL);
    expect($("html").getText()).not.toMatch(/Failed! Scripting has to be enabled\./);
  });
});
