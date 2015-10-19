/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A documentation and a verification of the application features.
 */

import * as support from "./support";

/**
 * Register a person.
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
 * It is expected that the current page is the home page. It schedules the
 * request with Protractor.
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
    support.wait(backEndNodeJs.deletePerson(email));
  });
});
