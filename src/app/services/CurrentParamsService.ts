/**
 * Created by davidhradek on 16.08.16.
 */

import { Injectable } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRouteSnapshot, Params, NavigationCancel, NavigationEnd } from '@angular/router';
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

    public currentInvoiceNumber: Observable<string> = null;
    protected currentInvoiceNumberSubject: Subject<string> = null;
    public currentInvoiceNumberSnapshot: string = null;

    public currentGridName: Observable<string> = null;
    protected currentGridNameSubject: Subject<string> = null;
    public currentGridNameSnapshot: string = null;

    public currentInstanceId: Observable<string> = null;
    protected currentInstanceIdSubject: Subject<string> = null;
    public currentInstanceIdSnapshot: string = null;

    public currentLibraryName: Observable<string> = null;
    protected currentLibraryNameSubject: Subject<string> = null;
    public currentLibraryNameSnapshot: string = null;

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
        this.currentInvoiceNumber = this.currentInvoiceNumberSubject = new Subject<string>();
        this.currentLibraryName = this.currentLibraryNameSubject = new Subject<string>();

        router.events.subscribe(event => {
            if (event instanceof NavigationCancel || event instanceof NavigationEnd) {
                if (router.routerState && router.routerState.snapshot && router.routerState.snapshot.root) {
                    this.newParams(this.getParamsRecursive(router.routerState.snapshot.root));
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
                this.backendService.projectGet(params['project']).then((project) => {
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
                this.backendService.productsGetUserOwnList().then((products) => {
                    let p = products.find(product => params['product'] === '' + product.id); // TODO: make product id string in Tyrion!!! [DH]
                    if (p) {
                        this.currentProductNameSnapshot = p.name
                        ;
                        this.currentProductNameSubject.next(this.currentProductNameSnapshot);
                    }
                });
            }

        }

        if (this.currentParamsSnapshot['invoice'] !== params['invoice']) {

            if (!params['invoice']) {
                this.currentInvoiceNumberSnapshot = null;
                this.currentInvoiceNumberSubject.next(this.currentInvoiceNumberSnapshot);
            } else {
                // TODO: remove parseInt after make invoice id string in Tyrion!!! [DH]
                this.backendService.invoiceGet(params['invoice']).then((invoice) => {
                    this.currentInvoiceNumberSnapshot = invoice.invoice.invoice_number;
                    this.currentInstanceIdSubject.next(this.currentInvoiceNumberSnapshot);
                });
            }

        }




        if (this.currentParamsSnapshot['blocko'] !== params['blocko']) {

            if (!params['blocko']) {
                this.currentBlockoNameSnapshot = null;
                this.currentBlockoNameSubject.next(this.currentBlockoNameSnapshot);
            } else {
                this.backendService.bProgramGet(params['blocko']).then((blocko) => { // TODO [permission]: Project.read_permission
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
                this.backendService.cProgramGet(params['code']).then((code) => { // TODO [permission]: C_program.read_permission(Project.read_permission)
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
                this.backendService.typeOfBlockGet(params['blocks']).then((blocks) => {
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
                this.backendService.blockoBlockGet(params['block']).then((block) => {// TODO [permission]: BlockoBlock_read_permission
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
                this.backendService.typeOfWidgetGet(params['widgets']).then((widgets) => { // TODO [permission]: TypeOfWidget_read_permission
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
                this.backendService.gridWidgetGet(params['widget']).then((widget) => { // TODO [permission]: GridWidget_read_permission
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
                this.backendService.mProjectGet(params['grids']).then((gridProject) => {// TODO [permission]: M_Project.read_permission
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
                this.backendService.mProgramGet(params['grid']).then((gridProgram) => { // TODO [permission]: M_Program.read_permission
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

        if (this.currentParamsSnapshot['library'] !== params['library']) {

            if (!params['library']) {
                this.currentLibraryNameSnapshot = null;
                this.currentLibraryNameSubject.next(this.currentLibraryNameSnapshot);
            } else {
                this.backendService.libraryGet(params['library']).then((library) => {
                    this.currentLibraryNameSnapshot = library.name;
                    this.currentLibraryNameSubject.next(this.currentLibraryNameSnapshot);
                });
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
