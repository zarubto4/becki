/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as ng from "angular2/angular2";
import * as ngHttp from "angular2/http";
import * as ngRouter from "angular2/router";

import * as body from "./body";

ng.bootstrap(
    body.Component,
    [
      ngHttp.HTTP_PROVIDERS,
      ngRouter.ROUTER_PROVIDERS,
      ng.provide(ngRouter.LocationStrategy, {useClass: ngRouter.HashLocationStrategy})
    ]
);
