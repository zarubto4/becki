/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */



import { Router, ActivatedRoute } from '@angular/router';
import { TyrionBackendService } from '../services/BackendService';
import { ModalService } from '../services/ModalService';
import { Injector, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { BlockUIService } from '../services/BlockUIService';
import {
    NotificationService, FlashMessage, FlashMessageInfo,
    FlashMessageSuccess, FlashMessageWarning, FlashMessageError
} from '../services/NotificationService';
import { StorageService } from '../services/StorageService';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { TranslationService } from '../services/TranslationService';
import { BeckiImageLinks } from '../helpers/BeckiImageLinks';
import { IError } from '../services/_backend_class/Responses';
import { FileDownloaderService } from '../services/FileDownloaderService';

/* tslint:disable:class-name  */
export abstract class _BaseMainComponent {
/* tslint:disable:class-name  */

    protected beckiImageLinks: BeckiImageLinks = null;
    protected tyrionBackendService: TyrionBackendService = null;
    protected storageService: StorageService = null;
    protected router: Router = null;
    protected activatedRoute: ActivatedRoute = null;
    protected modalService: ModalService = null;
    protected notificationService: NotificationService = null;
    protected formBuilder: FormBuilder = null;
    protected currentParamsService: CurrentParamsService = null;
    protected blockUIService: BlockUIService = null;
    protected translationService: TranslationService = null;
    protected fileDownloaderService: FileDownloaderService = null;
    protected zone: NgZone = null;

    constructor(protected injector: Injector) {
        // console.log('BaseMainComponent init');
        if (injector) {
            this.tyrionBackendService = injector.get(TyrionBackendService);
            this.storageService = injector.get(StorageService);
            this.router = injector.get(Router);
            this.activatedRoute = injector.get(ActivatedRoute);
            this.modalService = injector.get(ModalService);
            this.notificationService = injector.get(NotificationService);
            this.formBuilder = injector.get(FormBuilder);
            this.currentParamsService = injector.get(CurrentParamsService);
            this.blockUIService = injector.get(BlockUIService);
            this.translationService = injector.get(TranslationService);
            this.fileDownloaderService = injector.get(FileDownloaderService);
            this.zone = injector.get(NgZone);
            this.beckiImageLinks = injector.get(BeckiImageLinks);
            injector.get(MonacoEditorLoaderService); // only for preload monaco scripts
        } else {
            throw new Error('Injector is not defined! ... Don\'t you forget to add \"constructor(injector:Injector) {super(injector)};\"" in inherited class?');
        }
    }

    public addFlashMessage(fm: FlashMessage): void {
        this.notificationService.addFlashMessage(fm);
    }

    protected navigate(link: any[]): void {
        this.router.navigate(link);
    }

    public blockUI(): void {
        this.blockUIService.blockUI();
    }

    public unblockUI(): void {
        this.blockUIService.unblockUI();
    }

    protected getBeckiFlag(imageName: string): string {
        return this.beckiImageLinks.getBeckiImage(imageName, 'flags');
    }

    protected getBeckiImage(imageName: string, folderName: string): string {
        return this.beckiImageLinks.getBeckiImage(imageName, folderName);
    }

    public translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    public translateTable(key: string, table: string, ...args: any[]): string {
        return this.translationService.translateTable(key, this, table, null, args);
    }

    protected fmInfo(msg: string, reason?: Object): FlashMessage {
        let fm = new FlashMessageInfo(msg, reason);
        this.addFlashMessage(fm);
        return fm;
    }

    protected fmSuccess(msg: string, reason?: Object): FlashMessage {
        let fm = new FlashMessageSuccess(msg, reason);
        this.addFlashMessage(fm);
        return fm;
    }

    protected fmWarning(msg: string, reason?: IError): FlashMessage {
        let fm = new FlashMessageWarning(msg, reason);
        this.addFlashMessage(fm);
        return fm;
    }

    protected fmError(msg: string, reason?: IError): FlashMessage {
        let fm = new FlashMessageError(msg, reason);
        this.addFlashMessage(fm);
        return fm;
    }

// -- ON CLIC ----------------------------------------------------------------------------------------------------------------



    public onLogOutClick(): void {
        this.navigate(['/logout']);
    }

    public onDashboardClick(): void {
        this.navigate(['/dashboard']);
    }

    public onFinanceClick(): void {
        this.navigate(['/financial']);
    }

    public onAddProductClick(): void {
        this.navigate(['/financial/product-registration']);
    }

    public onGarfieldClick(garfield_id: string): void {
        this.navigate(['/admin/garfield/', garfield_id]);
    }

    public onGarfieldListClick(): void {
        this.navigate(['/admin/garfield']);
    }

    public onGSMListClick(): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'gsm']);
    }

    public onGSMClick(gsm_id: string): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'gsm', gsm_id]);
    }


    public onRoleClick(role_id: string): void {
        this.navigate(['admin/permission-group', role_id]);
    }

    public onProjectClick(project_id: string): void {
        this.navigate(['/projects', project_id]);
    }

    public onProductClick(product_id: string): void {
        this.router.navigate(['/financial', product_id]);
    }

    public onHardwareTypeClick(hardware_id: string): void {
        this.navigate(['/hardware', hardware_id]);
    }

    public onProducerClick(producer: string): void {
        this.router.navigate(['/producers', producer]);
    }

    public onDeviceClick(device_id: string): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'hardware', device_id]);
    }

    public onActualizationProcedureClick(procedure_id?: string): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'actualization_procedures', procedure_id]);
    }

    public onLibraryAdminClick(library_id: string): void {
        this.navigate(['/admin/hardware/libraries', library_id]);
    }

    public onLibraryClick(library_id: string, version_id: string = null): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'libraries', library_id, {version: version_id}]);
    }

    public onCProgramClick(cProgram_id: string, version_id: string = null): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'code', cProgram_id, {version: version_id}]);
    }

    public onCProgramAdminClick(c_program_id: string, version_id: string = null): void {
        this.router.navigate(['/admin/hardware/code', c_program_id, {version: version_id}]);
    }

    public onBProgramClick(bProgram_id: string, version_id: string = null): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocko', bProgram_id, { version: version_id}]);
    }

    public onBlockClick(block_id: string, version_id: string = null): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocks', block_id, { version: version_id}]);
    }

    public onBlockAdminClick(block_id: string, version_id: string = null): void {
        this.navigate(['admin/blocks', block_id, {version: version_id}]);
    }

    public onDeviceClick_Admin(device_id: string): void {
        this.navigate(['/device', device_id]);
    }

    public onInstanceClick(instance_id: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'instances', instance_id]);
    }

    public onGridProjectClick(grid_project_id: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', grid_project_id]);
    }

    public onGridProgramClick(grid_project_id: string, grid_program_id: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', grid_project_id, grid_program_id]);
    }

    public onGridProgramVersionClick(grid_project_id: string, grid_program_id: string, grid_program_version_id: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', grid_project_id, grid_program_id, {version: grid_program_version_id}]);
    }

    public onWidgetClick(widget_id: string, version_id: string = null): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'widgets', widget_id, {version: version_id}]);
    }

    public onWidgetAdminClick(widget_id: string, version_id: string = null): void {
        this.navigate(['admin/widgets', widget_id, {version: version_id}]);
    }
}
