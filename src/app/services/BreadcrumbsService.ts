/**
 * Created by davidhradek on 09.08.16.
 */

import { Injectable, Inject } from '@angular/core';
import { Route, Routes, Router, ActivatedRouteSnapshot, NavigationEnd, NavigationCancel } from '@angular/router';
import { BackendService } from './BackendService';
import { LabeledLink } from '../helpers/LabeledLink';
import { CurrentParamsService } from './CurrentParamsService';


@Injectable()
export class BreadcrumbsService {

    breadcrumbs: LabeledLink[] = [];

    protected lastBreadName: string = '';

    protected breadNameCache: { [key: string]: string } = {};

    constructor(
        @Inject('routes') protected routes: Routes,
        protected router: Router,
        protected currentParamsService: CurrentParamsService,
        protected backendService: BackendService
    ) {
        console.info('BreadcrumbsService init');

        this.refresh();

        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.refresh();
            }
            if (event instanceof NavigationCancel) {
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
        this.currentParamsService.currentInvoiceNumber.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentLibraryName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentGarfieldName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentTariffName.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentBugSummary.subscribe(() => {
            this.refresh();
        });
        this.currentParamsService.currentGarfieldName.subscribe(() => {
            this.refresh();
        });
    }

    protected findRouteByPath(path: string): Route {
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].path === path) {
                return this.routes[i];
            }
        }
        return null;
    }

    protected resolveBreadName(breadName: string): string {
        switch (breadName) {
            case ':project':
                return this.currentParamsService.currentProjectNameSnapshot;
            case ':product':
                return this.currentParamsService.currentProductNameSnapshot;
            case ':invoice':
                return this.currentParamsService.currentInvoiceNumberSnapshot;
            case ':blocko':
                return this.currentParamsService.currentBlockoNameSnapshot;
            case ':code':
                return this.currentParamsService.currentCodeNameSnapshot;
            case ':blocks':
                return this.currentParamsService.currentBlocksGroupNameSnapshot;
            case ':block':
                return this.currentParamsService.currentBlockNameSnapshot;
            case ':widgets':
                return this.currentParamsService.currentWidgetsGroupNameSnapshot;
            case ':widget':
                return this.currentParamsService.currentWidgetNameSnapshot;
            case ':grids':
                return this.currentParamsService.currentGridProjectNameSnapshot;
            case ':grid':
                return this.currentParamsService.currentGridNameSnapshot;
            case ':instance':
                return this.currentParamsService.currentInstanceIdSnapshot;
            case ':library':
                return this.currentParamsService.currentLibraryNameSnapshot;
            case ':group':
                return this.currentParamsService.currentGroupNameSnapshot;
            case ':garfield':
                return this.currentParamsService.currentGarfieldNameSnapshot;
            case ':tariff':
                return this.currentParamsService.currentTariffNameSnapshot;
            case ':homer_server':
                return this.currentParamsService.currentHomerServerNameSnapshot;
            case ':code_server':
                return this.currentParamsService.currentCodeServerNameSnapshot;
            case ':bug':
                return this.currentParamsService.currentBugSummarySnapshot;
            case ':garfield':
                return this.currentParamsService.currentGarfieldNameSnapshot;
            case ':last':
                return this.lastBreadName;
            default:
                return breadName;
        }
    }

    private resolveLink(link: any[]): any[] {
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

    public setLastBreadName(last: string) {
        this.lastBreadName = last;
        this.refresh();
    }

    protected refresh() {

        let currentActivatedRoute: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;

        while (currentActivatedRoute.firstChild) {
            currentActivatedRoute = currentActivatedRoute.firstChild;
        }

        let breadcrumbsArray: LabeledLink[] = [];

        let currentRoute = currentActivatedRoute.routeConfig;
        if (!currentRoute || !currentRoute.path) {
            return;
        }


        let currentPathComponents = currentRoute.path.split('/');

        let componentsCount = currentPathComponents.length;

        let path = '';

        for (let index = 0; index < componentsCount; index++) {
            path += currentPathComponents[index];
            let route = this.findRouteByPath(path);
            if (route && route.path && route.data && route.data['breadName']) {

                let routePath = ['/'].concat(route.path.split('/'));

                let ll = new LabeledLink(this.resolveBreadName(route.data['breadName']), this.resolveLink(routePath));
                breadcrumbsArray.push(ll);

            }
            path += '/';
        }

        this.breadcrumbs = breadcrumbsArray;
    }

}
