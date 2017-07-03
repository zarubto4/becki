/**
 * Created by davidhradek on 03.08.16.
 */

import { Component, DoCheck, NgZone, isDevMode } from '@angular/core';
import { CurrentParamsService } from './services/CurrentParamsService';
import { NavigationExtras, Router } from '@angular/router';

@Component({
    selector: 'bk-app',
    template: '<bk-block-ui></bk-block-ui><bk-modal></bk-modal><router-outlet></router-outlet>'
})
export class AppComponent implements DoCheck {

    protected doCheckCounterCount = 0;
    protected doCheckCounter = () => {};

    // need inject CurrentParamsService here for init first in app
    constructor(protected currentParamsService: CurrentParamsService, protected zone: NgZone, protected router: Router) {
        if (isDevMode()) {
            this.enableDoCheckCounter();
        }

        (<any>window)["ngNavigate"] = (commands: any[], extras?: NavigationExtras) => {
            this.router.navigate(commands, extras)
        }
    }

    enableDoCheckCounter(treshhold = 200) {
        this.zone.runOutsideAngular(() => {
            this.doCheckCounter = () => {
                this.doCheckCounterCount++;
            };

            setInterval(() => {
                if (this.doCheckCounterCount > treshhold) {
                    console.warn(`To many change detection cycles (over ${treshhold}) in last second!`);
                }
                this.doCheckCounterCount = 0;
            }, 1000);
        });
    }

    ngDoCheck() {
       // console.log('ngDoCheck');
        this.doCheckCounter();
    }
}
