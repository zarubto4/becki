/**
 * Created by davidhradek on 03.08.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageSuccess, FlashMessageError } from '../services/NotificationService';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IProject, IProjectShortDetail } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';

@Component({
    selector: 'bk-view-mobile-add-hardware',
    templateUrl: './mobile-add-hardware.html'
})
export class MobileAddHardwareComponent extends BaseMainComponent implements OnInit {


    blockForm: FormGroup = null;

    scan: boolean = false;

    projects: FormSelectComponentOption[];

    constructor(injector: Injector) {
        super(injector);
        this.blockForm = this.formBuilder.group({
            'id': ['', [Validators.required, BeckiAsyncValidators.hardwareDeviceId(this.backendService)]],
            'project': ['', [Validators.required]],
        });
    };

    qrCodeSent(qrcode: string) {
        this.scan = false;
        this.blockForm.controls['id'].setValue(qrcode);

    }


    ngOnInit(): void {
        this.backendService.projectGetByLoggedPerson().then((projects) => {
            this.projects = projects.map(project => {
                return {
                    label: project.product_name,
                    value: project.product_id
                };
            });

        });
    }

    onQrbuttonScan() {
        this.scan = true;
    }

    onBack() {
        this.router.navigate(['/dashboard']);
    }

    onSubmit(): void {

        this.blockUI();
        this.backendService.boardConnectWithProject({
            group_ids: [],  // TODO doplnit Dominiku https://youtrack.byzance.cz/youtrack/issue/BECKI-320
            hash_for_adding: this.blockForm.value.id,
            project_id: this.blockForm.value.id
        })
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_add_device_success'), this.blockForm.value.id));
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_add_device_fail', this.blockForm.value.id), reason));
                this.unblockUI();
            });
    }
}


