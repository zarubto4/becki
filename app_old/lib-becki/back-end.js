/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
var Rx = require("rxjs");
var ngCore = require("@angular/core");
var ngHttp = require("@angular/http");
var ngRouter = require("@angular/router");
var libBackEnd = require("../lib-back-end/index");
var notifications = require("./notifications");
var Service = (function (_super) {
    __extends(Service, _super);
    function Service(http, router, notificationsService) {
        "use strict";
        _super.call(this);
        this.http = http;
        this.router = router;
        this.webSocketErrorOccurred.subscribe(function (error) { return notificationsService.current.push(new notifications.Danger("Communication with the back end have failed.", error)); });
    }
    Service.prototype.requestRestGeneral = function (request) {
        "use strict";
        var _this = this;
        var optionsArgs = {
            method: request.method,
            headers: new ngHttp.Headers(request.headers),
            url: request.url
        };
        if (request.body) {
            switch (optionsArgs.headers.get("Content-Type")) {
                case "application/json":
                    optionsArgs.body = JSON.stringify(request.body);
                    break;
                default:
                    throw "content type not supported";
            }
        }
        return this.http.request(new ngHttp.Request(new ngHttp.RequestOptions(optionsArgs)))
            .catch(function (ngResponse) { return Rx.Observable.of(ngResponse); })
            .map(function (ngResponse) {
            if (ngResponse.status == 401) {
                _this.router.navigate(_this.signing);
            }
            return new libBackEnd.RestResponse(ngResponse.status, ngResponse.json());
        });
    };
    Service = __decorate([
        ngCore.Injectable(), 
        __metadata('design:paramtypes', [ngHttp.Http, ngRouter.Router, notifications.Service])
    ], Service);
    return Service;
}(libBackEnd.BackEnd));
exports.Service = Service;
//# sourceMappingURL=back-end.js.map