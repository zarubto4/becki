/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import * as Rx from "rxjs";
import * as ngCore from "@angular/core";
import * as ngHttp from "@angular/http";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "../lib-back-end/index";

@ngCore.Injectable()
export class Service extends libBackEnd.BackEnd {

  http:ngHttp.Http;

  signing:any[];

  router:ngRouter.Router;

  notificationsNew:ngCore.EventEmitter<MessageEvent>;

  public constructor(http:ngHttp.Http, @ngCore.Inject("signing") signing:any[], router:ngRouter.Router) {
    "use strict";

    super();
    this.http = http;
    this.signing = signing;
    this.router = router;
    this.notificationsNew = new ngCore.EventEmitter<MessageEvent>();
  }

  protected requestGeneral(request:libBackEnd.Request):Rx.Observable<libBackEnd.Response> {
    "use strict";

    let ngRequest = new ngHttp.Request(new ngHttp.RequestOptions({
      method: request.method,
      headers: new ngHttp.Headers(request.headers),
      body: request.body,
      url: request.url
    }));
    return this.http.request(ngRequest)
        .catch<ngHttp.Response>(ngResponse => Rx.Observable.of(ngResponse))
        .map(ngResponse => {
          if (ngResponse.status == 401) {
            this.router.navigate(this.signing);
          }
          return new libBackEnd.Response(ngResponse.status, ngResponse.json());
        });
  }

  public reregisterNotifications() {
    "use strict";

    super.reregisterNotifications();
    if (this.notifications) {
      this.notifications.addEventListener("message", (event:MessageEvent) => this.notificationsNew.emit(event));
    }
  }
}
