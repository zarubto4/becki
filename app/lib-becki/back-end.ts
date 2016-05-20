/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import 'rxjs/add/operator/toPromise';

import * as ngCore from "@angular/core";
import * as ngHttp from "@angular/http";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "../lib-back-end/index";

@ngCore.Injectable()
export class Service extends libBackEnd.BackEnd {

  http:ngHttp.Http;

  signing:any[];

  router:ngRouter.Router;

  zone:ngCore.NgZone;

  notificationsNew:ngCore.EventEmitter<MessageEvent>;

  public constructor(http:ngHttp.Http, @ngCore.Inject("signing") signing:any[], router:ngRouter.Router, zone:ngCore.NgZone) {
    "use strict";

    super();
    this.http = http;
    this.signing = signing;
    this.router = router;
    this.zone = zone;
    this.notificationsNew = new ngCore.EventEmitter<MessageEvent>();
  }

  protected requestGeneral(request:libBackEnd.Request):Promise<libBackEnd.Response> {
    "use strict";

    let ngRequest = new ngHttp.Request(new ngHttp.RequestOptions({
      method: request.method,
      headers: new ngHttp.Headers(request.headers),
      body: request.body,
      url: request.url
    }));
    return this.http.request(ngRequest)
        .toPromise()
        .catch(ngResponse => ngResponse)
        .then(ngResponse => {
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
      this.notifications.onmessage = event => this.zone.run(() => this.notificationsNew.next(event));
    }
  }
}
