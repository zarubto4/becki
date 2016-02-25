/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
/**
 * Start the application with the correct component at the application root.
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

import * as ng from "angular2/angular2";
import * as ngHttp from "angular2/http";
import * as ngRouter from "angular2/router";

import * as backEnd from "./back-end";
import * as body from "./body";
import * as libPatternFlyNotifications from "./lib-patternfly/notifications";
import * as websocket from "./websocket";

ng.bootstrap(
    body.Component,
    [
      backEnd.Service,
      libPatternFlyNotifications.Service,
      ngHttp.HTTP_PROVIDERS,
      ngRouter.ROUTER_PROVIDERS,
      websocket.Service,
      ng.provide(ngRouter.LocationStrategy, {useClass: ngRouter.HashLocationStrategy}),
      ng.provide("appName", {useValue: "IOThub"})
    ]
);
