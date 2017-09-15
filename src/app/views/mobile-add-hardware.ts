/**
 * Created by davidhradek on 03.08.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageSuccess, FlashMessageError } from '../services/NotificationService';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';

@Component({
    selector: 'bk-view-mobile-add-hardware',
    templateUrl: './mobile-add-hardware.html'
})
export class MobileAddHardwareComponent extends BaseMainComponent implements OnInit {


    blockForm: FormGroup = null;
    scan: boolean = false;


    constructor(injector: Injector) {
        super(injector);
        this.blockForm = this.formBuilder.group({
            'id': ['', [Validators.required, /*BeckiAsyncValidators.hardwareDeviceId(this.backendService)*/]],
        });
    };


    ngOnInit(): void {

    }

    onQrbuttonScan() {
        this.scan = true;
    }

    onAddClick(): void {
        /*    let model = new ModalsAddHardwareModel();
            this.modalService.showModal(model).then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.boardConnectWithProject(model.id, this.id) // TODO [permission]: Board.first_connect_permission, Project.update_permission
                        .then(() => {
                            this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_add_device_success', model.id)));
                            this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                        })
                        .catch(reason => {
                            this.addFlashMessage(new FlashMessageError(this.translate('flash_add_device_fail', model.id, reason)));
                            this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                        });
                }
            });
        }*/
    }
}

