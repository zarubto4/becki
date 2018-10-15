/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Component, DoCheck, NgZone, isDevMode } from '@angular/core';
import { CurrentParamsService } from './services/CurrentParamsService';
import { NavigationExtras, Router } from '@angular/router';
import { TranslationService } from './services/TranslationService';

@Component({
    selector: 'bk-app',
    template: `<bk-block-ui></bk-block-ui><bk-modal></bk-modal><router-outlet></router-outlet>`
})
export class AppComponent implements DoCheck {

    protected doCheckCounterCount = 0;
    protected doCheckCounter = () => {};

    // need inject CurrentParamsService here for init first in app
    constructor(protected currentParamsService: CurrentParamsService, protected zone: NgZone, protected router: Router, protected translationService: TranslationService) {
        if (isDevMode()) {
            this.enableDoCheckCounter();
        }

        this.initLocalStorageTranslate();

        (<any>window)['ngNavigate'] = (commands: any[], extras?: NavigationExtras) => {
            this.router.navigate(commands, extras);
        };
    }

    enableDoCheckCounter(treshhold = 200) {
        this.zone.runOutsideAngular(() => {
            this.doCheckCounter = () => {
                this.doCheckCounterCount++;
            };

            setInterval( () => {
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

    initLocalStorageTranslate() {

        let refresh = () => {
            let translation = window.localStorage.getItem('translation');
            if (translation) {
                try {
                    translation = JSON.parse(translation);
                } catch (e) {
                    console.error(e);
                } finally {
                    this.translationService.translation = <any>translation;
                }
            }

            let translationTables = window.localStorage.getItem('translationTables');
            if (translationTables) {
                try {
                    translationTables = JSON.parse(translationTables);
                } catch (e) {
                    console.error(e);
                } finally {
                    this.translationService.translationTables = <any>translationTables;
                }
            }
        };

        (<any>window)['translationSaveToStorage'] = () => {
            window.localStorage.setItem('translation', JSON.stringify(this.translationService.translation, null, '\t'));
            window.localStorage.setItem('translationTables', JSON.stringify(this.translationService.translationTables, null, '\t'));
            this.zone.run(() => {});
        };

        (<any>window)['translationLoadFromStorage'] = () => {
            refresh();
        };

        refresh();
    }
}
