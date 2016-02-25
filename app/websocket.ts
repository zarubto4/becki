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

import * as libPatternFlyNotifications from "./lib-patternfly/notifications";

@ng.Injectable()
export class Service {
  constructor(notifications:libPatternFlyNotifications.Service) {
    "use strict";

    let socket:WebSocket;
    try {
      socket = new WebSocket("ws://echo.websocket.org/");
    } catch (err) {
      notifications.current.push(new libPatternFlyNotifications.Danger(`A communication channel with the back end cannot be created: ${err}`));
      return;
    }
    socket.onerror = event => notifications.current.push(new libPatternFlyNotifications.Danger(`The back end reports an error: ${event}`));
    socket.onmessage = event => notifications.current.push(new libPatternFlyNotifications.Info(`The back end has sent a message: ${event}`));
  }
}
