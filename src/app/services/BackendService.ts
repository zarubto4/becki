/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TyrionApiBackend } from '../backend/BeckiBackend';
import { TranslationService } from './TranslationService';
import { RestRequest, RestResponse } from './_backend_class/Responses';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';

@Injectable()
export class TyrionBackendService extends TyrionApiBackend {

    public changeDetectionEmitter: EventEmitter<{}> = new EventEmitter<{}>();

    constructor(protected http: HttpClient, protected router: Router, private translationService: TranslationService) {
        super();
        // console.info('TyrionBackendService init');
        this.refreshPersonInfo();
    }

    protected requestRestGeneral(request: RestRequest): Promise<RestResponse> {
        let optionsArgs = {
            headers: new HttpHeaders(request.headers),
            body: '',
            observe: <HttpObserve>'response'
        };
        if (request.body) {
            switch (optionsArgs.headers.get('Content-Type')) {
                case 'application/json':
                    optionsArgs.body = JSON.stringify(request.body);
                    break;
                default: {
                    throw new Error(this.translationService.translate('error_content_not_supported', this, null));
                }
            }
        }

        return new Promise<RestResponse>((resolve, reject) => {
            this.http.request(request.method, request.url, optionsArgs).toPromise()
                .then((ngResponse: HttpResponse<Object>) => {

                    if (ngResponse.status === 401) {
                        this.unsetToken();
                        this.router.navigate(['/login']);
                    }

                    resolve(new RestResponse(ngResponse.status, ngResponse.body));
                })
                .catch((ngResponseOrError: HttpResponse<any>|any) => {

                    console.warn('TyrionBackendService:catch::Response from Server: ngResponse', ngResponseOrError);
                    console.warn('TyrionBackendService:catch::Response from Server: status', ngResponseOrError.status);
                    console.warn('TyrionBackendService:catch::Response from Server: error', ngResponseOrError['error']);

                    if (ngResponseOrError['error']) {
                        return resolve(new RestResponse(ngResponseOrError.status, ngResponseOrError['error']));
                    }

                    console.warn('TyrionBackendService:catch::Response not contains Error Json');

                    if (ngResponseOrError instanceof HttpResponse) {

                        console.error('TyrionBackendService:catch:: Instance of response is HttpResponse::', ngResponseOrError);

                        if (ngResponseOrError.status === 401) {
                            this.unsetToken();
                            this.router.navigate(['/login']);
                        }


                        console.warn('Error on new Promise<RestResponse>: Error Status:: ', ngResponseOrError.status);
                        resolve(new RestResponse(ngResponseOrError.status, ngResponseOrError.body));

                    } else {

                        console.error('TyrionBackendService:catch:: its not instance of http response!!! This is a critical Error:: Response::', ngResponseOrError);
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

    public request(request: RestRequest): Promise<Object> {
        let optionsArgs = {
            headers: new HttpHeaders(request.headers),
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

        return this.http.request(request.method, request.url, optionsArgs).toPromise();
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
