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

    protected lastBreadName: string = "";

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
        this.currentParamsService.currentBlocksGroupName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentBlockName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentWidgetsGroupName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentWidgetName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentGridProjectName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentGridName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentInstanceId.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentProductName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentInvoiceId.subscribe(() => {
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
            case ":product":
                return this.currentParamsService.currentProductNameSnapshot;
            case ":invoice":
                return this.currentParamsService.currentInvoiceIdSnapshot;
            case ":blocko":
                return this.currentParamsService.currentBlockoNameSnapshot;
            case ":code":
                return this.currentParamsService.currentCodeNameSnapshot;
            case ":blocks":
                return this.currentParamsService.currentBlocksGroupNameSnapshot;
            case ":block":
                return this.currentParamsService.currentBlockNameSnapshot;
            case ":widgets":
                return this.currentParamsService.currentWidgetsGroupNameSnapshot;
            case ":widget":
                return this.currentParamsService.currentWidgetNameSnapshot;
            case ":grids":
                return this.currentParamsService.currentGridProjectNameSnapshot;
            case ":grid":
                return this.currentParamsService.currentGridNameSnapshot;
            case ":instance":
                return this.currentParamsService.currentInstanceIdSnapshot;
            case ":last":
                return this.lastBreadName;
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

    public setLastBreadName(last:string) {
        this.lastBreadName = last;
        this.refresh();
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