/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit, OnDestroy} from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';

import { Subscription } from 'rxjs/Rx';
import { IProject, IProjectParticipant } from '../backend/TyrionAPI';
import { ModalsMembersAddModel } from '../modals/members-add';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel } from '../modals/confirm';

import { IRole } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsPermissionGroupModel } from '../modals/permission-group';

@Component({
    selector: 'bk-view-projects-project-roles',
    templateUrl: './projects-project-roles.html',
})

export class ProjectsProjectRolesComponent extends _BaseMainComponent implements OnInit {
    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    selfId: string = '';

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
            });
        });
        this.selfId = this.tyrionBackendService.personInfoSnapshot.id;
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }
    onRoleAddClick(): void {

    }

}




