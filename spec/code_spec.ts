/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A verification of the application components and units.
 */

describe("The home page", () => {
  "use strict";

  it("has a title 'Becki'", () => {
    browser.driver.get("http://127.0.0.1:8080/");
    expect(browser.driver.getTitle()).toEqual("Becki");
  });
});
