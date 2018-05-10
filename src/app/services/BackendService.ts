/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ApplicationRef, EventEmitter, Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { TyrionApiBackend } from '../backend/BeckiBackend';
import { TranslationService } from './TranslationService';
import { RestRequest, RestResponse } from './_backend_class/Responses';

@Injectable()
export class TyrionBackendService extends TyrionApiBackend {

    public changeDetectionEmitter: EventEmitter<{}> = new EventEmitter<{}>();

    constructor(protected http: Http, protected router: Router, private translationService: TranslationService) {
        super();
        // console.info('TyrionBackendService init');
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

    public increaseTasks() {
        this.tasks++;
        this.changeDetectionEmitter.emit({});
    }

    public decreaseTasks() {
        this.tasks--;
        this.changeDetectionEmitter.emit({});
    }
}
