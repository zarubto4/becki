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

  support.sendKeys(element(by.cssContainingText("label", "Email address:")).$("input"), email);
  support.sendKeys(element(by.cssContainingText("label", "Password:")).$("input"), password);
  $("form").submit();
  return support.waitBrowser(protractor.until.elementTextMatches($(".result"), /^Result: .*: .+/));
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
