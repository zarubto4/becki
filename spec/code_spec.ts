/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A verification of the application components and units.
 */

/**
 * The URL of the home page.
 */
const HOMEPAGE_URL = "http://127.0.0.1:8080/";

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
