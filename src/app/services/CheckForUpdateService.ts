// To ask the service worker to check if any updates have been deployed to the server.
// Reference: https://angular.io/guide/service-worker-communications#checking-for-updates

import { interval } from 'rxjs';
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class CheckForUpdateService {

    constructor(updates: SwUpdate) {
        interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate());
    }
}
