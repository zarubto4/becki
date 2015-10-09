/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A verification of the application components and units.
 */

// see https://github.com/Microsoft/TypeScript/issues/3612
import fileUrl = require("file-url");
import * as path from "path";

describe("The home page", () => {
  "use strict";

  it("has a title 'Becki'", () => {
    browser.driver.get(fileUrl(path.join(__dirname, "..", "index.html")));
    expect(browser.driver.getTitle()).toEqual("Becki");
  });
});
