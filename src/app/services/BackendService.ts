/**
 * Created by davidhradek on 03.08.16.
 */

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { NotificationService, FlashMessageError } from './NotificationService';
import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BeckiBackend, RestRequest, RestResponse } from '../backend/BeckiBackend';
import { TranslationService } from '../services/TranslationService';

@Injectable()
export class BackendService extends BeckiBackend {

    constructor(protected http: Http, protected router: Router, private translationService: TranslationService) {
        super();
        console.info('BackendService init');
        this.refreshPersonInfo();
    }

    protected requestRestGeneral(request: RestRequest): Promise<RestResponse> {
        let optionsArgs: RequestOptionsArgs = {
            method: request.method,
            headers: new Headers(request.headers),
            body: ''
        };
        if (request.body) {
            switch (optionsArgs.headers.get('Content-Type')) {
                case 'application/json':
                    optionsArgs.body = JSON.stringify(request.body);
                    break;
                default:
                    throw new Error(this.translationService.translate('error_content_not_supported', this, null));
            }
        }

        return new Promise<RestResponse>((resolve, reject) => {
            this.http.request(request.url, optionsArgs).toPromise()
                .then((ngResponse: Response) => {
                    if (ngResponse.status === 401) {
                        this.unsetToken();
                        this.router.navigate(['/login']);
                    }
                    resolve(new RestResponse(ngResponse.status, ngResponse.json()));
                })
                .catch((ngResponseOrError: Response|any) => {
                    if (ngResponseOrError instanceof Response) {
                        if (ngResponseOrError.status === 401) {
                            this.unsetToken();
                            this.router.navigate(['/login']);
                        }
                        resolve(new RestResponse(ngResponseOrError.status, ngResponseOrError.json()));
                    } else {
                        reject(ngResponseOrError);
                    }
                });
        });
    }

    public isLoggedIn(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (!this.personInfoSnapshotDirty) {
                resolve(!!this.personInfoSnapshot);
            } else {
                let loggedInSubscribe = this.personInfo.subscribe(pi => {
                    resolve(!!pi);
                    loggedInSubscribe.unsubscribe();
                });
            }
        });
    }

    public request(request: RestRequest): Promise<Response> {
        let optionsArgs: RequestOptionsArgs = {
            method: request.method,
            headers: new Headers(request.headers),
            body: ''
        };
        if (request.body) {
            switch (optionsArgs.headers.get('Content-Type')) {
                case 'application/json':
                    optionsArgs.body = JSON.stringify(request.body);
                    break;
                default:
                    throw new Error(this.translationService.translate('error_content_not_supported', this, null));
            }
        }

        return this.http.request(request.url, optionsArgs).toPromise();
    }
}
