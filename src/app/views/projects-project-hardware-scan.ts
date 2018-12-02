/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsAddHardwareModel } from '../modals/add-hardware';
import { ModalsRemovalModel } from '../modals/removal';
import {
    IProject, IHardware, IHardwareList, IHardwareGroupList, IHardwareGroup
} from '../backend/TyrionAPI';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsHardwareGroupPropertiesModel } from '../modals/hardware-group-properties';
import { ModalsUpdateReleaseFirmwareModel } from '../modals/update-release-firmware';
import { FormGroup, Validators } from '@angular/forms';
import { ModalsSelectHardwareModel } from '../modals/select-hardware';

@Component({
    selector: `bk-view-projects-project-harware-scan`,
    templateUrl: './projects-project-harware-scan.html'
})
export class ProjectsProjectHardwareAddWithQrComponent extends _BaseMainComponent implements OnInit {

    projectId: string;
    project: IProject = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    codes: String[] = [];

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.project = project;
                this.refresh();
            });
        });
    }

    refresh(): void {

    }

    add(code: String) {
        this.codes.push(code);
    }

}
