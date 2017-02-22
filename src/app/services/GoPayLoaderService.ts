/**
 * Created by davidhradek on 22.02.17.
 */

import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export interface GoPay {
    checkout(options: any, callback: (checkoutResult: any) => void): any;
}

declare const _gopay: GoPay;

@Injectable()
export class GoPayLoaderService {

    protected goPaySubject: ReplaySubject<GoPay> = null;
    public goPay: Observable<GoPay> = null;

    constructor() {
        console.info('GoPayLoaderService init');

        this.goPay = this.goPaySubject = new ReplaySubject<GoPay>(1);

        let loaderScript = document.createElement('script');
        loaderScript.type = 'text/javascript';
        // loaderScript.src = 'https://gate.gopay.cz/gp-gw/js/embed.js'; // Production
        loaderScript.src = 'https://gw.sandbox.gopay.com/gp-gw/js/embed.js'; // Sandbox
        loaderScript.addEventListener('load', () => {
            console.info('GoPayLoaderService GoPay loaded');
            this.goPaySubject.next(_gopay);
        });
        document.body.appendChild(loaderScript);
    }

}
