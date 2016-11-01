/**
 * Created by davidhradek on 10.08.16.
 */

import {Injectable, Inject} from "@angular/core";
import {LabeledLink} from "../helpers/LabeledLink";
import {CurrentParamsService} from "./CurrentParamsService";

@Injectable()
export class TabMenuService {

    protected currentMenus: { [menuName: string]: LabeledLink[] } = {};

    constructor(@Inject("tabMenus") protected tabMenus: { [menuName: string]: LabeledLink[] }, protected currentParamsService: CurrentParamsService) {
        console.log("TabMenuService init");
        currentParamsService.currentParams.subscribe(params => {
            this.refresh();
        });
    }

    private resolveLink(link: any[]): any[] {
        if (!link) return null;
        var params = this.currentParamsService.currentParamsSnapshot;
        var outLink: any[] = [];
        link.forEach((part: any) => {
            if (typeof part == "string") {
                for (var k in params) {
                    if (!params.hasOwnProperty(k)) continue;
                    if (part == ":" + k) {
                        part = params[k];
                    }
                }
            }
            outLink.push(part);
        });
        return outLink;
    }

    private resolveOptions(options:{[key: string]: any}):{[key: string]: any} {
        var outOptions:{[key: string]: any} = {};
        for (var key in options) {
            if (!options.hasOwnProperty(key)) continue;
            if (key == "items") {
                outOptions["items"] = [];
                options["items"].forEach((ll:LabeledLink) => {
                    outOptions["items"].push(new LabeledLink(ll.label, this.resolveLink(ll.link), ll.icon, ll.options));
                })
            } else {
                outOptions[key] = options[key];
            }
        }
        return outOptions;
    }

    private refresh() {
        for (var menuName in this.currentMenus) {
            if (!this.currentMenus.hasOwnProperty(menuName)) continue;

            // clean array
            this.currentMenus[menuName].splice(0, this.currentMenus[menuName].length);

            this.tabMenus[menuName].forEach((ll: LabeledLink) => {
                this.currentMenus[menuName].push(new LabeledLink(ll.label, this.resolveLink(ll.link), ll.icon, this.resolveOptions(ll.options)));
            });

        }
    }

    public getMenu(menuName: string): LabeledLink[] {
        if (!menuName) return null;
        if (!this.tabMenus.hasOwnProperty(menuName)) {
            throw "TabMenu with name " + menuName + " not found in tabMenus!";
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