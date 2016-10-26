/**
 * Created by davidhradek on 03.08.16.
 */

import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {FlashMessagesService, FlashMessageError} from "./FlashMessagesService";
import {Injectable} from "@angular/core";
import {Http, RequestOptionsArgs, Headers, Response} from "@angular/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {MD5} from "crypto-js";
import {BeckiBackend, RestRequest, RestResponse} from "../backend/BeckiBackend";

@Injectable()
export class BackendService extends BeckiBackend {

    public gravatarIcon: string = "";

    constructor(protected http: Http, protected router: Router, protected flashMessagesService: FlashMessagesService) {
        super();
        console.log("BackendService init");
        this.webSocketErrorOccurred.subscribe(error => flashMessagesService.addFlashMessage(new FlashMessageError("Communication with the back end have failed.", error)));
        this.personInfo.subscribe(pi => {
            if (pi) {
                var email = this.personInfoSnapshot.mail || "";
                var md5 = MD5(email.trim().toLowerCase());
                this.gravatarIcon = "https://www.gravatar.com/avatar/" + md5 + "?d=retro"; //TODO Tyrion poskytuje vlastní ikonky, můžeme přejít z gravatara na ně
            } else {
                this.gravatarIcon = "";
            }
        });
        this.refreshPersonInfo();
    }

    protected requestRestGeneral(request: RestRequest): Observable<RestResponse> {
        let optionsArgs: RequestOptionsArgs = {
            method: request.method,
            headers: new Headers(request.headers),
            body: ""
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
        return this.http.request(request.url, optionsArgs)
            .catch<Response>(ngResponse => Observable.of(ngResponse))
            .map((ngResponse: Response) => {
                if (ngResponse.status == 401) {
                    this.router.navigate(["/login"]);
                }
                return new RestResponse(ngResponse.status, ngResponse.json());
            });
    }

    public isLoggedIn(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (!this.personInfoSnapshotDirty) {
                resolve(!!this.personInfoSnapshot);
            } else {
                var loggedInSubscribe = this.personInfo.subscribe(pi => {
                    resolve(!!pi);
                    loggedInSubscribe.unsubscribe();
                });
            }
        });
    }

}
