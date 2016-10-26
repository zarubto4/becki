/**
 * Created by davidhradek on 09.08.16.
 */

import {Injectable, Inject} from "@angular/core";
import {Route, Routes, Router, ActivatedRouteSnapshot, NavigationEnd} from "@angular/router";
import {BackendService} from "./BackendService";
import {LabeledLink} from "../helpers/LabeledLink";
import {CurrentParamsService} from "./CurrentParamsService";


@Injectable()
export class BreadcrumbsService {

    protected breadcrumbs: LabeledLink[] = [];

    protected breadNameCache: { [key: string]: string } = {};

    constructor(@Inject("routes") protected routes: Routes, protected router: Router, protected currentParamsService: CurrentParamsService, protected backendService: BackendService) {
        console.log("BreadcrumbsService init");

        this.refresh();

        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.refresh();
            }
        });


        // refresh when got new names:
        this.currentParamsService.currentProjectName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentBlockoName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentCodeName.subscribe(() => {
            this.refresh();
        });
    }

    protected findRouteByPath(path: string): Route {
        for (var i = 0; i < this.routes.length; i++) {
            if (this.routes[i].path == path) return this.routes[i];
        }
        return null;
    }

    protected resolveBreadName(breadName: string): string {
        switch (breadName) {
            case ":project":
                return this.currentParamsService.currentProjectNameSnapshot;
            case ":blocko":
                return this.currentParamsService.currentBlockoNameSnapshot;
            case ":code":
                return this.currentParamsService.currentCodeNameSnapshot;
            default:
                return breadName;
        }
    }

    private resolveLink(link: any[]): any[] {
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

    protected refresh() {

        var currentActivatedRoute: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;

        while (currentActivatedRoute.firstChild) {
            currentActivatedRoute = currentActivatedRoute.firstChild
        }

        var breadcrumbsArray: LabeledLink[] = [];

        var currentRoute = currentActivatedRoute.routeConfig;
        if (!currentRoute || !currentRoute.path) return;
        var currentPathComponents = currentRoute.path.split("/");

        var componentsCount = currentPathComponents.length;

        var path = "";

        for (var index = 0; index < componentsCount; index++) {
            path += currentPathComponents[index];
            var route = this.findRouteByPath(path);
            if (route && route.path && route.data && route.data["breadName"]) {

                var routePath = ["/"].concat(route.path.split("/"));

                var ll = new LabeledLink(this.resolveBreadName(route.data["breadName"]), this.resolveLink(routePath));
                breadcrumbsArray.push(ll);

            }
            path += "/";
        }

        this.breadcrumbs = breadcrumbsArray;
    }

}