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

import * as notifications from "./notifications";

@ng.Injectable()
export class Service {
  constructor(notificationsService:notifications.Service) {
    "use strict";

    let socket:WebSocket;
    try {
      socket = new WebSocket("ws://echo.websocket.org/");
    } catch (err) {
      notificationsService.current.push(new notifications.Danger("A communication channel with the back end cannot be created.", err));
      return;
    }
    socket.onerror = event => notificationsService.current.push(new notifications.Danger("The back end reports an error.", event));
    socket.onmessage = event => notificationsService.current.push(new notifications.Info(`The back end has sent a message: ${event}`));
  }
}
