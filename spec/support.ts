/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * A support for the application test suite.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * Documentation in this file might be outdated and the code might be dirty and
 * flawed since management prefers speed over quality.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

import * as backEnd from "../src/backend";
import * as http from "http";
import * as webdriver from "selenium-webdriver";

/**
 * The URL of the home page.
 */
export const HOMEPAGE_URL = "http://127.0.0.1:8080/";

/**
 * Generate a pseudo random string.
 *
 * @returns the string.
 */
function randomString():string {
  "use strict";

  return Date.now().toString() + Math.floor(Math.random() * 100000000000000000);
}

/**
 * Convert a promise to a corresponding Webdriver promise.
 *
 * @param promise the original promise.
 * @returns the converted promise.
 * @template T
 */
function promiseToWebdriver<T>(promise:Promise<T>):webdriver.promise.Promise<T> {
  "use strict";

  // TODO: https://github.com/angular/angular/issues/5337
  return new (<any>webdriver.promise.Promise)((onFulfilled:(value:T)=>void, onRejected:(reason:any)=>void) => promise.then(onFulfilled, onRejected));
}

// TODO: https://github.com/angular/angular/issues/5337
/**
 * Wait for a condition to hold.
 *
 * @param condition the condition to wait on.
 * @returns a promise that will be resolved with the value of the condition.
 * @template T
 */
export function waitBrowser<T>(condition:webdriver.promise.Promise<T>|webdriver.until.Condition<T>|(()=>T)):webdriver.promise.Promise<T> {
  "use strict";

  return (<any>browser.wait)(condition);
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

  return waitBrowser(promiseToWebdriver(promise));
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
   * Perform an HTTP request.
   *
   * @param request the details of the request.
   * @returns a promise that will be resolved with the response, or rejected
   *          with a reason.
   */
  protected requestGeneral(request:backEnd.Request):Promise<backEnd.Response> {
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
    return null;
  }

  /**
   * Find an email address which is not registered yet.
   *
   * @returns a promise that will be resolved with the address, or rejected with
   *          a reason.
   */
  public findNonExistentPerson():Promise<string> {
    "use strict";

    let email = "foo@test" + randomString() + ".com";
    return this.request("GET",
        BackEndNodeJs.PERSON_PATH + "/" + email).then((response) =>
        this.findNonExistentPerson());
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

    return this.request("DELETE",
        BackEndNodeJs.PERSON_PATH + "/" + email).then(JSON.stringify);
  }
}
