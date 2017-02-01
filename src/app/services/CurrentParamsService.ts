/**
 * Created by davidhradek on 16.08.16.
 */

import { Injectable } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRouteSnapshot, Params } from '@angular/router';
import { BackendService } from './BackendService';
import { Observable, Subject } from 'rxjs/Rx';
import { IProject, IBProgram, ICProgram } from '../backend/TyrionAPI';

@Injectable()
export class CurrentParamsService {

    public currentParams: Observable<{ [key: string]: string }> = null;
    protected currentParamsSubject: Subject<{ [key: string]: string }> = null;
    public currentParamsSnapshot: { [key: string]: string } = {};

    public currentProjectName: Observable<string> = null;
    protected currentProjectNameSubject: Subject<string> = null;
    public currentProjectNameSnapshot: string = null;

    public currentProjectDescription: Observable<string> = null;
    protected currentProjectDescriptionSubject: Subject<string> = null;
    public currentProjectDescriptionSnapshot: string = null;

    public currentBlockoName: Observable<string> = null;
    protected currentBlockoNameSubject: Subject<string> = null;
    public currentBlockoNameSnapshot: string = null;

    public currentCodeName: Observable<string> = null;
    protected currentCodeNameSubject: Subject<string> = null;
    public currentCodeNameSnapshot: string = null;

    public currentBlocksGroupName: Observable<string> = null;
    protected currentBlocksGroupNameSubject: Subject<string> = null;
    public currentBlocksGroupNameSnapshot: string = null;

    public currentBlockName: Observable<string> = null;
    protected currentBlockNameSubject: Subject<string> = null;
    public currentBlockNameSnapshot: string = null;

    public currentWidgetsGroupName: Observable<string> = null;
    protected currentWidgetsGroupNameSubject: Subject<string> = null;
    public currentWidgetsGroupNameSnapshot: string = null;

    public currentWidgetName: Observable<string> = null;
    protected currentWidgetNameSubject: Subject<string> = null;
    public currentWidgetNameSnapshot: string = null;

    public currentGridProjectName: Observable<string> = null;
    protected currentGridProjectNameSubject: Subject<string> = null;
    public currentGridProjectNameSnapshot: string = null;

    public currentProductName: Observable<string> = null;
    protected currentProductNameSubject: Subject<string> = null;
    public currentProductNameSnapshot: string = null;

    public currentInvoiceId: Observable<string> = null;
    protected currentInvoiceIdSubject: Subject<string> = null;
    public currentInvoiceIdSnapshot: string = null;

    public currentGridName: Observable<string> = null;
    protected currentGridNameSubject: Subject<string> = null;
    public currentGridNameSnapshot: string = null;

    public currentInstanceId: Observable<string> = null;
    protected currentInstanceIdSubject: Subject<string> = null;
    public currentInstanceIdSnapshot: string = null;

    constructor(protected router: Router, protected backendService: BackendService) {
        console.info('BreadcrumbsService init');

        this.currentParams = this.currentParamsSubject = new Subject<{ [key: string]: string }>();
        this.currentProjectName = this.currentProjectNameSubject = new Subject<string>();
        this.currentProjectDescription = this.currentProjectDescriptionSubject = new Subject<string>();
        this.currentBlockoName = this.currentBlockoNameSubject = new Subject<string>();
        this.currentCodeName = this.currentCodeNameSubject = new Subject<string>();
        this.currentBlocksGroupName = this.currentBlocksGroupNameSubject = new Subject<string>();
        this.currentBlockName = this.currentBlockNameSubject = new Subject<string>();
        this.currentWidgetsGroupName = this.currentWidgetsGroupNameSubject = new Subject<string>();
        this.currentWidgetName = this.currentWidgetNameSubject = new Subject<string>();
        this.currentGridProjectName = this.currentGridProjectNameSubject = new Subject<string>();
        this.currentGridName = this.currentGridNameSubject = new Subject<string>();
        this.currentInstanceId = this.currentInstanceIdSubject = new Subject<string>();
        this.currentProductName = this.currentProductNameSubject = new Subject<string>();
        this.currentInvoiceId = this.currentInvoiceIdSubject = new Subject<string>();

        router.events.subscribe(event => {
            if (event instanceof RoutesRecognized) {
                let e = <RoutesRecognized>event;
                if (e.state && e.state.root) {
                    this.newParams(this.getParamsRecursive(e.state.root));
                }
            }
        });
    }

    protected getParamsRecursive(activatedRouteSnapshot: ActivatedRouteSnapshot): { [key: string]: string } {
        let p: { [key: string]: string } = {};
        if (activatedRouteSnapshot.params) {
            for (let k in activatedRouteSnapshot.params) {
                if (activatedRouteSnapshot.params.hasOwnProperty(k)) {
                    p[k] = '' + activatedRouteSnapshot.params[k];
                }
            }
        }
        if (activatedRouteSnapshot.children) {
            activatedRouteSnapshot.children.forEach((ars) => {
                let pp = this.getParamsRecursive(ars);
                for (let k in pp) {
                    if (pp.hasOwnProperty(k)) {
                        p[k] = '' + pp[k];
                    }
                }
            });
        }
        return p;
    }

    protected newParams(params: { [key: string]: string }) {

        if (this.currentParamsSnapshot['project'] !== params['project']) {

            if (!params['project']) {
                this.currentProjectNameSnapshot = null;
                this.currentProjectNameSubject.next(this.currentProjectNameSnapshot);
                this.currentProjectDescriptionSnapshot = null;
                this.currentProjectDescriptionSubject.next(this.currentProjectDescriptionSnapshot);
            } else {
                this.backendService.getProject(params['project']).then((project) => {
                    this.currentProjectNameSnapshot = project.name;
                    this.currentProjectNameSubject.next(this.currentProjectNameSnapshot);
                    this.currentProjectDescriptionSnapshot = project.description;
                    this.currentProjectDescriptionSubject.next(this.currentProjectDescriptionSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['product'] !== params['product']) {

            if (!params['product']) {
                this.currentProductNameSnapshot = null;
                this.currentProductNameSubject.next(this.currentProductNameSnapshot);
            } else {
                this.backendService.getAllProducts().then((products) => {
                    let p = products.find(product => params['product'] === '' + product.id); // TODO: make product id string in Tyrion!!! [DH]
                    if (p) {
                        this.currentProductNameSnapshot = p.product_individual_name;
                        this.currentProductNameSubject.next(this.currentProductNameSnapshot);
                    }
                });
            }

        }

        if (this.currentParamsSnapshot['invoice'] !== params['invoice']) {

            if (!params['invoice']) {
                this.currentInstanceIdSnapshot = null;
                this.currentInstanceIdSubject.next(this.currentInstanceIdSnapshot);
            } else {
                // TODO: remove parseInt after make invoice id string in Tyrion!!! [DH]
                this.backendService.getInvoice(params['invoice']).then((invoice) => {
                    this.currentInstanceIdSnapshot = invoice.invoice.date_of_create;
                    this.currentInstanceIdSubject.next(this.currentInstanceIdSnapshot);
                });
            }

        }




        if (this.currentParamsSnapshot['blocko'] !== params['blocko']) {

            if (!params['blocko']) {
                this.currentBlockoNameSnapshot = null;
                this.currentBlockoNameSubject.next(this.currentBlockoNameSnapshot);
            } else {
                this.backendService.getBProgram(params['blocko']).then((blocko) => {
                    this.currentBlockoNameSnapshot = blocko.name;
                    this.currentBlockoNameSubject.next(this.currentBlockoNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['code'] !== params['code']) {

            if (!params['code']) {
                this.currentCodeNameSnapshot = null;
                this.currentCodeNameSubject.next(this.currentCodeNameSnapshot);
            } else {
                this.backendService.getCProgram(params['code']).then((code) => {
                    this.currentCodeNameSnapshot = code.name;
                    this.currentCodeNameSubject.next(this.currentCodeNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['blocks'] !== params['blocks']) {

            if (!params['blocks']) {
                this.currentBlocksGroupNameSnapshot = null;
                this.currentBlocksGroupNameSubject.next(this.currentBlocksGroupNameSnapshot);
            } else {
                this.backendService.getTypeOfBlock(params['blocks']).then((blocks) => {
                    this.currentBlocksGroupNameSnapshot = blocks.name;
                    this.currentBlocksGroupNameSubject.next(this.currentBlocksGroupNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['block'] !== params['block']) {

            if (!params['block']) {
                this.currentBlockNameSnapshot = null;
                this.currentBlockNameSubject.next(this.currentBlockNameSnapshot);
            } else {
                this.backendService.getBlockoBlock(params['block']).then((block) => {
                    this.currentBlockNameSnapshot = block.name;
                    this.currentBlockNameSubject.next(this.currentBlockNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['widgets'] !== params['widgets']) {

            if (!params['widgets']) {
                this.currentWidgetsGroupNameSnapshot = null;
                this.currentWidgetsGroupNameSubject.next(this.currentWidgetsGroupNameSnapshot);
            } else {
                this.backendService.getTypeOfWidget(params['widgets']).then((widgets) => {
                    this.currentWidgetsGroupNameSnapshot = widgets.name;
                    this.currentWidgetsGroupNameSubject.next(this.currentWidgetsGroupNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['widget'] !== params['widget']) {

            if (!params['widget']) {
                this.currentWidgetNameSnapshot = null;
                this.currentWidgetNameSubject.next(this.currentWidgetNameSnapshot);
            } else {
                this.backendService.getWidget(params['widget']).then((widget) => {
                    this.currentWidgetNameSnapshot = widget.name;
                    this.currentWidgetNameSubject.next(this.currentWidgetNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['grids'] !== params['grids']) {

            if (!params['grids']) {
                this.currentGridProjectNameSnapshot = null;
                this.currentGridProjectNameSubject.next(this.currentGridProjectNameSnapshot);
            } else {
                this.backendService.getMProject(params['grids']).then((gridProject) => {
                    this.currentGridProjectNameSnapshot = gridProject.name;
                    this.currentGridProjectNameSubject.next(this.currentGridProjectNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['grid'] !== params['grid']) {

            if (!params['grid']) {
                this.currentGridNameSnapshot = null;
                this.currentGridNameSubject.next(this.currentGridNameSnapshot);
            } else {
                this.backendService.getMProgram(params['grid']).then((gridProgram) => {
                    this.currentGridNameSnapshot = gridProgram.name;
                    this.currentGridNameSubject.next(this.currentGridNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['instance'] !== params['instance']) {

            if (!params['instance']) {
                this.currentInstanceIdSnapshot = null;
                this.currentInstanceIdSubject.next(this.currentInstanceIdSnapshot);
            } else {
                this.currentInstanceIdSnapshot = params['instance'];
                this.currentInstanceIdSubject.next(this.currentInstanceIdSnapshot);
            }

        }

        this.currentParamsSnapshot = params;
        this.currentParamsSubject.next(this.currentParamsSnapshot);
    }

    public get(paramName: string): any {
        if (this.currentParamsSnapshot[paramName]) {
            return this.currentParamsSnapshot[paramName];
        }
        return null;
    }

}
