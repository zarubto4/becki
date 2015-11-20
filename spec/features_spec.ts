/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A documentation and a verification of the application features.
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

import * as backEnd from "../src/backend";
import * as support from "./support";

/**
 * Register a new person.
 *
 * It is expected that the current page is the home page. It schedules the
 * request with Protractor.
 *
 * @param email their email address.
 * @param password their password.
 * @returns a promise that will be resolved once the person is registered.
 */
export function registerPerson(email:string, password:string):webdriver.promise.Promise<any> {
  "use strict";

  let form = $$("form").get(0);
  support.sendKeys(form.element(by.cssContainingText("label", "Email address:")).$("input"), email);
  support.sendKeys(form.element(by.cssContainingText("label", "Password:")).$("input"), password);
  form.submit();
  return support.waitBrowser(protractor.until.elementTextMatches(form.$(".result"), /^Result: .*: .+/));
}

/**
 * Log a person in.
 *
 * It is expected that the person is registered already and that current page is
 * the home page. It schedules the request with Protractor.
 *
 * @param email their email address.
 * @param password their password.
 * @returns a promise that will be resolved once the person is logged in.
 */
export function logIn(email:string, password:string):webdriver.promise.Promise<any> {
  "use strict";

  let form = $$("form").get(1);
  support.sendKeys(form.element(by.cssContainingText("label", "Email address:")).$("input"), email);
  support.sendKeys(form.element(by.cssContainingText("label", "Password:")).$("input"), password);
  form.submit();
  return support.waitBrowser(protractor.until.elementTextMatches(form.$(".result"), /^Result: .*: .+/));
}

/**
 * Log a person out.
 *
 * It is expected that the person is logged in already and that the current page
 * is the home page. It schedules the request with Protractor.
 *
 * @returns a promise that will be resolved once the person is logged out.
 */
export function logOut():webdriver.promise.Promise<any> {
  "use strict";

  let form = $$("form").get(2);
  form.submit();
  return support.waitBrowser(protractor.until.elementTextMatches(form.$(".result"), /^Result: .*: .+/));
}

/**
 * Create a new project.
 *
 * It is expected that a person is logged in already and that the current page
 * is the home page. It schedules the request with Protractor.
 *
 * @param name a name of the project.
 * @param description a description of the project.
 * @returns a promise that will be resolved once the the project is created.
 */
export function createProject(name:string, description:string):webdriver.promise.Promise<any> {
  "use strict";

  let form = $$("form").get(3);
  support.sendKeys(form.element(by.cssContainingText("label", "Name:")).$("input"), name);
  support.sendKeys(form.element(by.cssContainingText("label", "Description:")).$("input"), description);
  form.submit();
  return support.waitBrowser(protractor.until.elementTextMatches(form.$(".result"), /^Result: .*: .+/));
}

describe("Registration of a person", () => {
  "use strict";

  const PASSWORD = "testing";
  let backEndNodeJs:support.BackEndNodeJs;
  let email:string;

  beforeEach(() => {
    backEndNodeJs = new support.BackEndNodeJs();
    support.wait(backEndNodeJs.findNonExistentPerson().then((email2) =>
        email = email2
    ));
    browser.get(support.HOMEPAGE_URL);
  });

  it("registers the new person", () => {
    registerPerson(email, PASSWORD);
    expect(support.call(() => backEndNodeJs.existCredentials(email, PASSWORD))).toBeTruthy();
  });

  afterEach(() => {
    support.wait(backEndNodeJs.deletePerson(email));
  });
});

describe("Login of a person", () => {
  "use strict";

  const PASSWORD = "testing";
  let backEndNodeJs:support.BackEndNodeJs;
  let email:string;

  beforeEach(() => {
    backEndNodeJs = new support.BackEndNodeJs();
    support.wait(backEndNodeJs.findNonExistentPerson().then((email2) =>
        email = email2
    ));
    support.call(() => backEndNodeJs.createPerson(email, PASSWORD));
    browser.get(support.HOMEPAGE_URL);
  });

  it("logs the person in", () => {
    logIn(email, PASSWORD);
    // TODO: There is no way to test whether a login was successful yet.
  });

  afterEach(() => {
    logOut();
    support.wait(backEndNodeJs.deletePerson(email));
  });
});

describe("Logout of a person", () => {
  "use strict";

  const PASSWORD = "testing";
  let backEndNodeJs:support.BackEndNodeJs;
  let email:string;

  beforeEach(() => {
    backEndNodeJs = new support.BackEndNodeJs();
    support.wait(backEndNodeJs.findNonExistentPerson().then((email2) =>
        email = email2
    ));
    support.call(() => backEndNodeJs.createPerson(email, PASSWORD));
    browser.get(support.HOMEPAGE_URL);
    browser.call(() => logIn(email, PASSWORD));
  });

  it("logs the person in", () => {
    logOut();
    // TODO: There is no way to test whether a logout was successful yet.
  });

  afterEach(() => {
    support.wait(backEndNodeJs.deletePerson(email));
  });
});

describe("Creation of a project", () => {
  "use strict";

  const PASSWORD = "testing";
  const DESCRIPTION = "A testing project.";
  let backEndNodeJs:support.BackEndNodeJs;
  let email:string;
  let name:string;

  beforeEach(() => {
    backEndNodeJs = new support.BackEndNodeJs();
    support.wait(backEndNodeJs.findNonExistentPerson().then((email2) =>
        email = email2
    ));
    support.call(() => backEndNodeJs.createPerson(email, PASSWORD));
    support.call(() => backEndNodeJs.logIn(email, PASSWORD).then((token) =>
        backEndNodeJs.findNonExistentProject(token)
            .then((name2) => name = name2)
            .then(() => backEndNodeJs.logOut(token))
    ));
    browser.get(support.HOMEPAGE_URL);
    browser.call(() => logIn(email, PASSWORD));
  });

  it("creates the new project", () => {
    createProject(name, DESCRIPTION);
    browser.call(() => logOut());
    expect(support.call(() => backEndNodeJs.logIn(email, PASSWORD)
        .then((token) => backEndNodeJs.existsProject(new backEnd.Project(name, DESCRIPTION), token)
            .then((exists) => backEndNodeJs.logOut(token)
                .then(() => exists)
            )
        )
    ))
        .toBeTruthy();
  });

  afterEach(() => {
    support.wait(backEndNodeJs.logIn(email, PASSWORD).then((token) =>
        backEndNodeJs.deleteProject(new backEnd.Project(name, DESCRIPTION), token)
            .then(() => backEndNodeJs.logOut(token))
    ));
    support.call(() => backEndNodeJs.deletePerson(email));
  });
});
