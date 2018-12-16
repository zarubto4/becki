/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Injectable } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRouteSnapshot, Params, NavigationCancel, NavigationEnd } from '@angular/router';
import { TyrionBackendService } from './BackendService';
import { Observable, Subject } from 'rxjs';
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

    public currentProductExtensionName: Observable<string> = null;
    protected currentProductExtensionNameSubject: Subject<string> = null;
    public currentProductExtensionNameSnapshot: string = null;

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

    public currentGroupName: Observable<string> = null;
    protected currentGroupNameSubject: Subject<string> = null;
    public currentGroupNameSnapshot: string = null;

    public currentGarfieldName: Observable<string> = null;
    protected currentGarfieldNameSubject: Subject<string> = null;
    public currentGarfieldNameSnapshot: string = null;

    public currentTariffName: Observable<string> = null;
    protected currentTariffNameSubject: Subject<string> = null;
    public currentTariffNameSnapshot: string = null;

    public currentHomerServerName: Observable<string> = null;
    protected currentHomerServerNameSubject: Subject<string> = null;
    public currentHomerServerNameSnapshot: string = null;

    public currentCodeServerName: Observable<string> = null;
    protected currentCodeServerNameSubject: Subject<string> = null;
    public currentCodeServerNameSnapshot: string = null;

    public currentBugSummary: Observable<string> = null;
    protected currentBugSummarySubject: Subject<string> = null;
    public currentBugSummarySnapshot: string = null;

    public currentHardwareName: Observable<string> = null;
    protected currentHardwareNameSubject: Subject<string> = null;
    public currentHardwareNameSnapShot: string = null;

    public currentActualizationProcedureName: Observable<string> = null;
    protected currentActualizationProcedureSubject: Subject<string> = null;
    public currentActualizationProcedureSnapShot: string = null;

    constructor(protected router: Router, protected backendService: TyrionBackendService) {
        // console.info('BreadcrumbsService init');

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
        this.currentProductExtensionName = this.currentProductExtensionNameSubject = new Subject<string>();
        this.currentInvoiceNumber = this.currentInvoiceNumberSubject = new Subject<string>();
        this.currentLibraryName = this.currentLibraryNameSubject = new Subject<string>();
        this.currentGroupName = this.currentGroupNameSubject = new Subject<string>();
        this.currentGarfieldName = this.currentGarfieldNameSubject = new Subject<string>();
        this.currentTariffName = this.currentTariffNameSubject = new Subject<string>();
        this.currentHomerServerName = this.currentHomerServerNameSubject = new Subject<string>();
        this.currentCodeServerName = this.currentCodeServerNameSubject = new Subject<string>();
        this.currentBugSummary = this.currentBugSummarySubject = new Subject<string>();
        this.currentGarfieldName = this.currentGarfieldNameSubject = new Subject<string>();
        this.currentHardwareName = this.currentHardwareNameSubject = new Subject<string>();
        this.currentActualizationProcedureName = this.currentActualizationProcedureSubject = new Subject<string>();

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

        if (this.currentParamsSnapshot['hardware'] !== params['hardware']) {

            if (!params['hardware']) {
                this.currentHardwareNameSnapShot = null;
                this.currentHardwareNameSubject.next(this.currentHardwareNameSnapShot);
            } else {
                this.backendService.boardGet(params['hardware']).then((hardware) => {
                    this.currentHardwareNameSnapShot = hardware.name != null ? hardware.name : hardware.id;
                    this.currentHardwareNameSubject.next(this.currentHardwareNameSnapShot);
                });
            }

        }

        if (this.currentParamsSnapshot['product'] !== params['product']) {

            if (!params['product']) {
                this.currentProductNameSnapshot = null;
                this.currentProductNameSubject.next(this.currentProductNameSnapshot);
            } else {
                this.backendService.productsGetUserOwnList().then((products) => {
                    let p = products.find(product => params['product'] === '' + product.id);
                    if (p) {
                        this.currentProductNameSnapshot = p.name
                        ;
                        this.currentProductNameSubject.next(this.currentProductNameSnapshot);
                    }
                });
            }

        }

        if (this.currentParamsSnapshot['productExtension'] !== params['productExtension']) {

            if (!params['productExtension']) {
                this.currentProductExtensionNameSnapshot = null;
                this.currentProductExtensionNameSubject.next(this.currentProductExtensionNameSnapshot);
            } else {
                this.backendService.productExtensionGet(params['productExtension']).then((extension) => {
                    this.currentProductExtensionNameSnapshot = extension.name;
                    this.currentProductExtensionNameSubject.next(this.currentProductExtensionNameSnapshot);
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
                    this.currentInvoiceNumberSubject.next(this.currentInvoiceNumberSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['blocko'] !== params['blocko']) {

            if (!params['blocko']) {
                this.currentBlockoNameSnapshot = null;
                this.currentBlockoNameSubject.next(this.currentBlockoNameSnapshot);
            } else {
                this.backendService.bProgramGet(params['blocko']).then((blocko) => {
                    this.currentBlockoNameSnapshot = blocko.name;
                    this.currentBlockoNameSubject.next(this.currentBlockoNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['release-update'] !== params['release-update']) {

            if (!params['release-update']) {
                this.currentActualizationProcedureSnapShot = null;
                this.currentActualizationProcedureSubject.next(this.currentActualizationProcedureSnapShot);
            } else {
                this.backendService.hardwareReleaseUpdateGet(params['release-update']).then((procedure) => {
                    this.currentActualizationProcedureSnapShot = procedure.id;
                    this.currentActualizationProcedureSubject.next(this.currentActualizationProcedureSnapShot);
                });
            }

        }

        if (this.currentParamsSnapshot['code'] !== params['code']) {

            if (!params['code']) {
                this.currentCodeNameSnapshot = null;
                this.currentCodeNameSubject.next(this.currentCodeNameSnapshot);
            } else {
                this.backendService.cProgramGet(params['code']).then((code) => {
                    this.currentCodeNameSnapshot = code.name;
                    this.currentCodeNameSubject.next(this.currentCodeNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['block'] !== params['block']) {

            if (!params['block']) {
                this.currentBlockNameSnapshot = null;
                this.currentBlockNameSubject.next(this.currentBlockNameSnapshot);
            } else {
                this.backendService.blockGet(params['block']).then((block) => {
                    this.currentBlockNameSnapshot = block.name;
                    this.currentBlockNameSubject.next(this.currentBlockNameSnapshot);
                });
            }

        }


        if (this.currentParamsSnapshot['widget'] !== params['widget']) {

            if (!params['widget']) {
                this.currentWidgetNameSnapshot = null;
                this.currentWidgetNameSubject.next(this.currentWidgetNameSnapshot);
            } else {
                this.backendService.widgetGet(params['widget']).then((widget) => { // TODO [permission]: GridWidget_read_permission
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
                this.backendService.gridProjectGet(params['grids']).then((gridProject) => {// TODO [permission]: M_Project.read_permission
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
                this.backendService.gridProgramGet(params['grid']).then((gridProgram) => { // TODO [permission]: M_Program.read_permission
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
                this.backendService.instanceGet(params['instance']).then((instance) => {
                    this.currentInstanceIdSnapshot = instance.name;
                    this.currentInstanceIdSubject.next(this.currentInstanceIdSnapshot);
                });
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

        if (this.currentParamsSnapshot['group'] !== params['group']) {

            if (!params['group']) {
                this.currentGroupNameSnapshot = null;
                this.currentGroupNameSubject.next(this.currentGroupNameSnapshot);
            } else {
                this.backendService.roleGet(params['group']).then((roleGroup) => {
                    this.currentGroupNameSnapshot = roleGroup.name;
                    this.currentGroupNameSubject.next(this.currentGroupNameSnapshot);
                });
            }
        }

        if (this.currentParamsSnapshot['garfield'] !== params['garfield']) {

            if (!params['garfield']) {
                this.currentGarfieldNameSnapshot = null;
                this.currentGarfieldNameSubject.next(this.currentGarfieldNameSnapshot);
            } else {
                this.backendService.garfieldGet(params['garfield']).then((garfield) => {
                    this.currentGarfieldNameSnapshot = garfield.name;
                    this.currentGarfieldNameSubject.next(this.currentGarfieldNameSnapshot);
                });
            }
        }

        if (this.currentParamsSnapshot['tariff'] !== params['tariff']) {
            if (!params['tariff']) {
                this.currentTariffNameSnapshot = null;
                this.currentTariffNameSubject.next(this.currentTariffNameSnapshot);
            } else {
                this.backendService.tariffGet(params['tariff']).then((tariff) => {
                    this.currentTariffNameSnapshot = tariff.name;
                    this.currentTariffNameSubject.next(this.currentTariffNameSnapshot);
                });
            }
        }

        if (this.currentParamsSnapshot['homer_server'] !== params['homer_server']) {
            if (!params['homer_server']) {
                this.currentHomerServerNameSnapshot = null;
                this.currentHomerServerNameSubject.next(this.currentHomerServerNameSnapshot);
            } else {
                this.backendService.homerServerGet(params['homer_server']).then((server) => {
                    this.currentHomerServerNameSnapshot = server.name;
                    this.currentHomerServerNameSubject.next(this.currentHomerServerNameSnapshot);
                });
            }
        }

        if (this.currentParamsSnapshot['code_server'] !== params['code__server']) {
            if (!params['code_server']) {
                this.currentCodeServerNameSnapshot = null;
                this.currentCodeServerNameSubject.next(this.currentCodeServerNameSnapshot);
            } else {
                this.backendService.compilationServerGet(params['code__server']).then((server) => {
                    this.currentCodeServerNameSnapshot = server.personal_server_name;
                    this.currentCodeServerNameSubject.next(this.currentCodeServerNameSnapshot);
                });
            }
        }

        if (this.currentParamsSnapshot['bug'] !== params['bug']) {

            if (!params['bug']) {
                this.currentBugSummarySnapshot = null;
                this.currentBugSummarySubject.next(this.currentBugSummarySnapshot);
            } else {
                this.backendService.getBug(params['bug']).then((bug) => {
                    this.currentBugSummarySnapshot = bug.name;
                    this.currentBugSummarySubject.next(this.currentBugSummarySnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot['garfield'] !== params['garfield']) {

            if (!params['garfield']) {
                this.currentGarfieldNameSnapshot = null;
                this.currentGarfieldNameSubject.next(this.currentGarfieldNameSnapshot);
            } else {
                this.backendService.garfieldGet(params['garfield']).then((garfield) => {
                    this.currentGarfieldNameSnapshot = garfield.name;
                    this.currentGarfieldNameSubject.next(this.currentGarfieldNameSnapshot);
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
