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

import * as body from "./body";
import * as libBeckiBackEnd from "./lib-becki/back-end";
import * as libBeckiNotifications from "./lib-becki/notifications";
import * as libBeckiWebsocket from "./lib-becki/websocket";

ng.bootstrap(
    body.Component,
    [
      libBeckiBackEnd.Service,
      libBeckiNotifications.Service,
      libBeckiWebsocket.Service,
      ngHttp.HTTP_PROVIDERS,
      ngRouter.ROUTER_PROVIDERS,
      ng.provide(ngRouter.LocationStrategy, {useClass: ngRouter.HashLocationStrategy})
    ]
);
