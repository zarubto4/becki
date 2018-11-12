// To notify the user of a pending update or to refresh their pages when the code they are running is out of date.
// Reference: https://angular.io/guide/service-worker-communications#available-and-activated-updates

import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class LogUpdateService {

    constructor(updates: SwUpdate) {
        updates.available.subscribe(event => {
            console.info('current version is', event.current);
            console.info('available version is', event.available);
        });
        updates.activated.subscribe(event => {
            console.info('old version was', event.previous);
            console.info('new version is', event.current);
        });
    }
}
