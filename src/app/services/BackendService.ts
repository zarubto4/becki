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

@Injectable()
export class BackendService extends BeckiBackend {

    public gravatarIcon: string = '';

    constructor(protected http: Http, protected router: Router) {
        super();
        console.info('BackendService init');
        this.personInfo.subscribe(pi => {
            if (pi) {
                // TODO!
                // var email = this.personInfoSnapshot.mail || '';
                // var md5 = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
                // this.gravatarIcon = 'https://www.gravatar.com/avatar/' + md5 + '?d=retro'; //TODO Tyrion poskytuje vlastní ikonky, můžeme přejít z gravatara na ně
            } else {
                this.gravatarIcon = '';
            }
        });
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
                    throw new Error('content type not supported');
            }
        }

        return new Promise<RestResponse>((resolve, reject) => {
            this.http.request(request.url, optionsArgs).toPromise()
                .then((ngResponse: Response) => {
                    if (ngResponse.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    resolve(new RestResponse(ngResponse.status, ngResponse.json()));
                })
                .catch((ngResponseOrError: Response|any) => {
                    if (ngResponseOrError instanceof Response) {
                        if (ngResponseOrError.status === 401) {
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

}
