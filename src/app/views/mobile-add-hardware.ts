/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageSuccess, FlashMessageError } from '../services/NotificationService';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { IProject } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { MultiSelectComponent } from '../components/MultiSelectComponent';

@Component({
    selector: 'bk-view-mobile-add-hardware',
    templateUrl: './mobile-add-hardware.html'
})
export class MobileAddHardwareComponent extends _BaseMainComponent implements OnInit {

    @ViewChild('groupList')
    listGroup: MultiSelectComponent;


    blockForm: FormGroup = null;

    scan: boolean = false;

    group_options_available: FormSelectComponentOption[] = [];

    projects: FormSelectComponentOption[];


    constructor(injector: Injector) {
        super(injector);
        this.blockForm = this.formBuilder.group({
            'project': ['', [Validators.required]],
            'id': ['', [Validators.required]],
        });

        this.blockForm.controls['project'].valueChanges.subscribe(newProjectId => { this.reloadGroupOptions(); });
    };

    qrCodeSent(qrcode: string) {
        this.scan = false;
        this.blockForm.controls['id'].setValue(qrcode);

    }

    reloadGroupOptions() {
        this.tyrionBackendService.hardwareGroupGetListByFilter(0, {
            project_id: this.blockForm.controls['project'].value
        }).then(groups => {
            this.group_options_available = groups.content.map((pv) => {
                return {
                    label: pv.name,
                    value: pv.id
                };
            });
        });

    }

    ngOnInit(): void {
        this.tyrionBackendService.projectGetByLoggedPerson().then((projects) => {
            this.projects = projects.map(project => {
                return {
                    label: project.name,
                    value: project.id
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
        let groupIDs: string[] = this.listGroup.selectedItems.map(a => a.value);

        this.blockUI();
        this.tyrionBackendService.projectAddHW({
            group_ids: groupIDs,
            registration_hash: this.blockForm.controls['id'].value,
            project_id: this.blockForm.controls['project'].value
        })
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_add_device_success', this.blockForm.controls['id'].value)));
                this.unblockUI();
                this.router.navigate(['/dashboard']);
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_add_device_fail', this.blockForm.controls['id'].value), reason));
                this.unblockUI();
            });
    }
}


