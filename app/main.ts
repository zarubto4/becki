/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ngForms from "@angular/forms";
import * as ngHttp from "@angular/http";
import * as ngPlatformBrowserDynamic from "@angular/platform-browser-dynamic";
import * as ngRouter from "@angular/router-deprecated";

import * as body from "./body";

ngPlatformBrowserDynamic.bootstrap(
    body.Component,
    [
      ngForms.disableDeprecatedForms(),
      ngForms.provideForms(),
      ngHttp.HTTP_PROVIDERS,
      ngRouter.ROUTER_PROVIDERS
    ]
);
