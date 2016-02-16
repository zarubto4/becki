/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * The code might be dirty and flawed since management prefers speed over quality.
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

import * as ng from "angular2/angular2";

import * as libBootstrapAlerts from "./lib-bootstrap/alerts";

@ng.Injectable()
export class Service {
  constructor(alerts:libBootstrapAlerts.Service) {
    "use strict";

    let socket:WebSocket;
    try {
      socket = new WebSocket("ws://echo.websocket.org/");
    } catch (err) {
      alerts.current.push(new libBootstrapAlerts.Danger(`A communication channel with the back end cannot be created: ${err}`));
      return;
    }
    socket.onerror = event => alerts.current.push(new libBootstrapAlerts.Danger(`The back end reports an error: ${event}`));
    socket.onmessage = event => alerts.current.push(new libBootstrapAlerts.Info(`The back end has sent a message: ${event}`));
  }
}
