/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import "rxjs/add/observable/fromEventPattern";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

import * as Rx from "rxjs";
import * as ngCore from "@angular/core";
import * as ngHttp from "@angular/http";
import * as ngRouter from "@angular/router-deprecated";

import * as libBackEnd from "../lib-back-end/index";
import * as notifications from "./notifications";

@ngCore.Injectable()
export class Service extends libBackEnd.BackEnd {

  http:ngHttp.Http;

  signing:any[];

  router:ngRouter.Router;

  public constructor(http:ngHttp.Http, @ngCore.Inject("signing") signing:any[], router:ngRouter.Router, notificationsService:notifications.Service) {
    "use strict";

    super();
    this.http = http;
    this.signing = signing;
    this.router = router;
    this.webSocketErrorOccurred.subscribe(error => notificationsService.current.push(new notifications.Danger("Communication with the back end have failed.", error)));
  }

  protected requestRestGeneral(request:libBackEnd.RestRequest):Rx.Observable<libBackEnd.RestResponse> {
    "use strict";

    let optionsArgs:ngHttp.RequestOptionsArgs = {
      method: request.method,
      headers: new ngHttp.Headers(request.headers),
      url: request.url
    };
    let observable:Rx.Observable<libBackEnd.RestResponse>;
    if (request.body) {
      switch(optionsArgs.headers.get("Content-Type")) {
        case "application/json":
          optionsArgs.body = JSON.stringify(request.body);
          break;
        case "multipart/form-data":
          // TODO: https://github.com/angular/http/issues/75
          let formdata = new FormData();
          let body:{[name:string]:any} = request.body;
          for (let name in body) {
            if (body.hasOwnProperty(name)) {
              formdata.append(name, body[name]);
            }
          }

          let xhRequest = new XMLHttpRequest();
          xhRequest.open(request.method, request.url);
          for (let header in request.headers) {
            if (request.headers.hasOwnProperty(header)) {
              xhRequest.setRequestHeader(header, request.headers[header]);
            }
          }
          xhRequest.send(formdata);

          observable = Rx.Observable.fromEventPattern(
              (handler:()=>any) => {
                xhRequest.addEventListener("load", handler);
                xhRequest.addEventListener("error", handler);
              },
              (handler:()=>any) => {
                xhRequest.removeEventListener("load", handler);
                xhRequest.removeEventListener("error", handler);
              },
              () => {
                return new libBackEnd.RestResponse(xhRequest.status, xhRequest.response);
              }
          );
          break;
        default:
          throw "content type not supported";
      }
    }
    if (!observable) {
      observable = this.http.request(new ngHttp.Request(new ngHttp.RequestOptions(optionsArgs)))
          .catch<ngHttp.Response>(ngResponse => Rx.Observable.of(ngResponse))
          .map(ngResponse => new libBackEnd.RestResponse(ngResponse.status, ngResponse.json()));
    }
    return observable
        .map(response => {
          if (response.status == 401) {
            this.router.navigate(this.signing);
          }
          return response;
        });
  }
}
