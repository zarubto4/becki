/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import * as _ from "underscore";
import * as _String from "underscore.string";
import * as ng from "angular2/angular2";
import * as ngHttp from "angular2/http";
import * as ngRouter from "angular2/router";

import * as libBackEnd from "../lib-back-end/index";

@ng.Injectable()
export class Service extends libBackEnd.BackEnd {

  http:ngHttp.Http;

  signing:any[];

  router:ngRouter.Router;

  zone:ng.NgZone;

  notificationsNew:ng.EventEmitter;

  public constructor(http:ngHttp.Http, @ng.Inject("signing") signing:any[], router:ngRouter.Router, zone:ng.NgZone) {
    "use strict";

    super();
    this.http = http;
    this.signing = signing;
    this.router = router;
    this.zone = zone;
    this.notificationsNew = new ng.EventEmitter();
  }

  protected requestGeneral(request:libBackEnd.Request):Promise<libBackEnd.Response> {
    "use strict";

    let ngRequest = new ngHttp.Request(new ngHttp.RequestOptions({
      method: _.property(_String.capitalize(request.method.toLowerCase()))(ngHttp.RequestMethods),
      headers: new ngHttp.Headers(request.headers),
      body: request.body,
      url: request.url
    }));
    return new Promise(resolve => this.http.request(ngRequest).subscribe((ngResponse:ngHttp.Response) => {
      if (ngResponse.status == 401) {
        this.router.navigate(this.signing);
      }
      resolve(new libBackEnd.Response(ngResponse.status, ngResponse.json()));
    }));
  }

  public reregisterNotifications() {
    "use strict";

    super.reregisterNotifications();
    if (this.notifications) {
      this.notifications.onmessage = event => this.zone.run(() => this.notificationsNew.next(event));
    }
  }
}
