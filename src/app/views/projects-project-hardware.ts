/**
 * Created by davidhradek on 10.08.16.
 */

/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsAddHardwareModel } from '../modals/add-hardware';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IBoardShortDetail } from '../backend/TyrionAPI';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsHardwareBootloaderUpdateModel } from '../modals/hardware-bootloader-update';

@Component({
    selector: 'bk-view-projects-project-hardware',
    templateUrl: './projects-project-hardware.html',
})
export class ProjectsProjectHardwareComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;
    devices: IBoardShortDetail[] = null;

    bootloaderRequred: boolean = false;
    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
                this.devices = project.boards;
                if (this.devices.find((device, index, obj) => {return !!(device.alert_list && device.alert_list.length); })) {
                    this.bootloaderRequred = true;
                } else {
                    this.bootloaderRequred = false;
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onUpdateListBootloaderClick() {
        // mass bootloader magic z toho bootloadersCheckboxChanged
    }

    onUpdateBootloaderClick(selected: IBoardShortDetail) {
        let model = new ModalsHardwareBootloaderUpdateModel(selected.id);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                /* this.blockUI();
                  this.backendService.editBoardUserDescription(device.id, {personal_description: model.description})
                  .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The device description was updated.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The device cannot be updated.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            */}
        });

    }

    onEditClick(device: IBoardShortDetail): void {
        let model = new ModalsDeviceEditDescriptionModel(device.id, device.personal_description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editBoardUserDescription(device.id, {personal_description: model.description})
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The device description was updated.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The device cannot be updated.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    bootloadersCheckboxChanged(device: IBoardShortDetail): void {
        // mass editing
    }


    onDeviceClick(device: IBoardShortDetail): void {
        this.navigate(['/projects', this.id, 'hardware', device.id]);
    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }

    onRemoveClick(device: IBoardShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.disconnectBoard(device.id) // TODO [permission]: Project.update_permission (probably implemented as device.delete_permission)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The hardware has been removed.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The hardware cannot be removed.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onAddClick(): void {
        let model = new ModalsAddHardwareModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.connectBoard(model.id, this.id) // TODO [permission]: Board.first_connect_permission, Project.update_permission
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The hardware ${model.id} has been added to project.`));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The hardware ${model.id} cannot be added to project.`, reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

}
