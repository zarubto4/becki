/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A support for the application test suite.
 */

import * as backEnd from "../src/backend";
import * as http from "http";
import * as webdriver from "selenium-webdriver";

/**
 * The URL of the home page.
 */
export const HOMEPAGE_URL = "http://127.0.0.1:8080/";

/**
 * Convert a promise to a corresponding Webdriver promise.
 *
 * @param promise the original promise.
 * @returns the converted promise.
 * @template T
 */
function promiseToWebdriver<T>(promise:Promise<T>):webdriver.promise.Promise<T> {
  "use strict";

  return new webdriver.promise.Promise((onFulfilled, onRejected) => promise.then(onFulfilled, onRejected));
}

/**
 * Wait for a promise to be fulfilled or rejected.
 *
 * @param promise the promise.
 * @returns a promise that will be resolved with the value from the original
 *          promise, or rejected with the reason from the original promise.
 * @template T
 */
export function wait<T>(promise:Promise<T>):webdriver.promise.Promise<T> {
  "use strict";

  return browser.wait(promiseToWebdriver(promise));
}

// TODO: https://github.com/angular/jasminewd/issues/36
/**
 * Wait for a rejection of a promise.
 *
 * @param promise the promise.
 * @returns a promise that will be resolved with the rejection reason from the
 *          original promise, or rejected with the value from the original
 *          promise.
 */
export function waitRejection(promise:Promise<any>):webdriver.promise.Promise<any> {
  "use strict";

  return wait(promise.then(
      (value) => {
        throw value;
      },
      (reason) => reason));
}

/**
 * Schedule a command to execute a function.
 *
 * @param fn the function.
 * @returns a promise that will be resolved with the value from the original
 *          promise, or rejected with the reason from the original promise.
 * @template T
 */
export function call<T>(fn:()=>Promise<T>):webdriver.promise.Promise<T> {
  "use strict";

  return browser.call(() => promiseToWebdriver(fn()));
}

/**
 * Type a text into an element.
 *
 * @param element the element to be filed.
 * @param text the text to be filed.
 */
export function sendKeys(element:protractor.ElementFinder, text:string):void {
  "use strict";

  element.clear();
  // TODO: https://github.com/angular/protractor/issues/2019
  for (let i = 0; i < text.length; i++) {
    element.sendKeys(text.charAt(i));
  }
}

/**
 * A service providing access to the back end at 127.0.0.1:9000.
 *
 * It uses Node.js to perform HTTP requests.
 */
export class BackEndNodeJs extends backEnd.BackEnd {

  /**
   * An absolute path to the permission resources.
   */
  static PERMISSION_PATH = "/coreClient/person/permission";

  /**
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   */
  protected request(request:backEnd.Request):Promise<backEnd.Response> {
    "use strict";

    return new Promise((resolve, reject) => {
      let nodeRequest = http.request(
          {
            protocol: request.protocol + ":",
            hostname: request.hostname,
            port: request.port,
            method: request.method,
            path: request.path,
            headers: request.headers
          },
          (nodeResponse) => {
            let body = "";
            nodeResponse.on("data", (data:string) => body += data);
            nodeResponse.on("end", () => resolve(new backEnd.Response(nodeResponse.statusCode, body)));
          }
      );
      nodeRequest.on("error", reject);
      nodeRequest.end(request.body);
    });
  }

  /**
   * Test whether credentials work.
   *
   * @param email the email address.
   * @param password the password.
   * @returns a promise that will be resolved with the test result, or rejected
   *          with a reason.
   */
  public existCredentials(email:string, password:string):Promise<boolean> {
    "use strict";

    let loginRequest = new backEnd.Request(
        "POST",
        BackEndNodeJs.HOSTNAME, BackEndNodeJs.PORT, BackEndNodeJs.PERMISSION_PATH + "/login",
        {},
        {email: email, password: password}
    );
    return this.request(loginRequest).then((response) => {
      if (response.status == 200) {
        let logoutRequest = new backEnd.Request(
            "POST",
            BackEndNodeJs.HOSTNAME, BackEndNodeJs.PORT, BackEndNodeJs.PERMISSION_PATH + "/logout",
            {"X-AUTH-TOKEN": JSON.parse(response.body).token},
            {}
        );
        return this.request(logoutRequest).then(() => true);
      } else {
        return false;
      }
    });
  }

  /**
   * Find an email address which is not registered yet.
   *
   * @returns a promise that will be resolved with the address, or rejected with
   *          a reason.
   */
  public findNonExistentPerson():Promise<string> {
    "use strict";

    let random = Date.now().toString() + Math.floor(Math.random() * 1000000000);
    let email = "foo@test" + random + ".com";
    let request = new backEnd.Request(
        "GET",
        BackEndNodeJs.HOSTNAME, BackEndNodeJs.PORT, BackEndNodeJs.PERSON_PATH + "/" + email
    );
    return this.request(request).then((response) =>
        response.status == 200 ? this.findNonExistentPerson() : email);
  }

  /**
   * Delete a person.
   *
   * @param email their email address.
   * @returns a promise that will be resolved with a message describing the
   *          result, or rejected with a reason.
   */
  public deletePerson(email:string):Promise<string> {
    "use strict";

    let request = new backEnd.Request(
        "DELETE",
        BackEndNodeJs.HOSTNAME, BackEndNodeJs.PORT, BackEndNodeJs.PERSON_PATH + "/" + email
    );
    return this.request(request).then(JSON.stringify);
  }
}
