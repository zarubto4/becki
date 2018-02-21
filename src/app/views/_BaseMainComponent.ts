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
import {IProject} from "../backend/TyrionAPI";
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
            this.zone = injector.get(NgZone);
            this.beckiImageLinks = injector.get(BeckiImageLinks);
            injector.get(MonacoEditorLoaderService); // only for preload monaco scripts
        } else {
            throw new Error('Injector is not defined! ... Don\'t you forget to add \"constructor(injector:Injector) {super(injector)};\"" in inherited class?');
        }
    }

    protected addFlashMessage(fm: FlashMessage): void {
        this.notificationService.addFlashMessage(fm);
    }

    protected navigate(link: any[]): void {
        this.router.navigate(link);
    }

    protected blockUI(): void {
        this.blockUIService.blockUI();
    }

    protected unblockUI(): void {
        this.blockUIService.unblockUI();
    }

    protected getBeckiFlag(imageName: string): string {
        return this.beckiImageLinks.getBeckiImage(imageName, 'flags');
    }

    protected getBeckiImage(imageName: string, folderName: string): string {
        return this.beckiImageLinks.getBeckiImage(imageName, folderName);
    }

    protected translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    protected translateTable(key: string, table: string, ...args: any[]): string {
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

    protected fmWarning(msg: string, reason?: Object): FlashMessage {
        let fm = new FlashMessageWarning(msg, reason);
        this.addFlashMessage(fm);
        return fm;
    }

    protected fmError(msg: string, reason?: Object): FlashMessage {
        let fm = new FlashMessageError(msg, reason);
        this.addFlashMessage(fm);
        return fm;
    }

// -- ON CLIC ----------------------------------------------------------------------------------------------------------------

    public onFinanceClick(): void {
        this.navigate(['/financial']);
    }

    public onGarfieldClick(): void {
        this.navigate(['/admin/garfield']);
    }


    public onRoleClick(role_id: string): void {
        this.navigate(['admin/permission-group/', role_id]);
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

    public onLibraryClick(library_id: string): void {
        this.navigate(['/admin/hardware/libraries', library_id]);
    }

    public onCProgramClick(cProgram_id: string): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'code', cProgram_id]);
    }

    public onCProgramAdminClick(c_program_id: string): void {
        this.router.navigate(['/admin/hardware/code', c_program_id]);
    }

    public onDeviceClick_Admin(device_id: string): void {
        this.navigate(['/device', device_id]);
    }

    public onInstanceClick(instance_id: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'instances', instance_id]);
    }

    public onBlockoProgramClick(b_program_id: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocko', b_program_id]);
    }

}
