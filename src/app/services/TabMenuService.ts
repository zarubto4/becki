/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Injectable, Inject } from '@angular/core';
import { LabeledLink } from '../helpers/LabeledLink';
import { CurrentParamsService } from './CurrentParamsService';
import { TranslationService } from './TranslationService';


@Injectable()
export class TabMenuService {

    protected currentMenus: { [menuName: string]: LabeledLink[] } = {};

    constructor( @Inject('tabMenus') protected tabMenus: { [menuName: string]: LabeledLink[] }, protected currentParamsService: CurrentParamsService, private translationService: TranslationService) {
        console.info('TabMenuService init');
        currentParamsService.currentParams.subscribe(params => {
            this.refresh();
        });
    }

    private resolveLink(link: any[]): any[] {
        if (!link) {
            return null;
        }
        let params = this.currentParamsService.currentParamsSnapshot;
        let outLink: any[] = [];
        link.forEach((part: any) => {
            if (typeof part === 'string') {
                for (let k in params) {
                    if (!params.hasOwnProperty(k)) {
                        continue;
                    }
                    if (part === ':' + k) {
                        part = params[k];
                    }
                }
            }
            outLink.push(part);
        });
        return outLink;
    }

    private resolveOptions(options: { [key: string]: any }): { [key: string]: any } {
        let outOptions: { [key: string]: any } = {};
        for (let key in options) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }
            if (key === 'items') {
                outOptions['items'] = [];
                options['items'].forEach((ll: LabeledLink) => {
                    outOptions['items'].push(new LabeledLink(ll.label, this.resolveLink(ll.link), ll.icon, ll.options));
                });
            } else {
                outOptions[key] = options[key];
            }
        }
        return outOptions;
    }

    private refresh() {
        for (let menuName in this.currentMenus) {
            if (!this.currentMenus.hasOwnProperty(menuName)) {
                continue;
            }

            // clean array
            this.currentMenus[menuName].splice(0, this.currentMenus[menuName].length);

            this.tabMenus[menuName].forEach((ll: LabeledLink) => {
                this.currentMenus[menuName].push(new LabeledLink(ll.label, this.resolveLink(ll.link), ll.icon, this.resolveOptions(ll.options)));
            });

        }
    }

    public getMenu(menuName: string): LabeledLink[] {
        if (!menuName) {
            return null;
        }
        if (!this.tabMenus.hasOwnProperty(menuName)) {

            throw new Error(this.translationService.translate('label_tab_menu_not_found', this, null, [menuName]));
        }
        if (!this.currentMenus[menuName]) {
            this.currentMenus[menuName] = [];
            this.tabMenus[menuName].forEach((ll: LabeledLink) => {
                this.currentMenus[menuName].push(new LabeledLink(ll.label, this.resolveLink(ll.link), ll.icon, this.resolveOptions(ll.options)));
            });
        }
        return this.currentMenus[menuName];
    }

}
