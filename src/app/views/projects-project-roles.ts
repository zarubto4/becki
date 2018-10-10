/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit, OnDestroy} from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';

import { Subscription } from 'rxjs/Rx';
import { IProject, IProjectParticipant, IRoleFilter, INameAndDescProjectIdOptional, IRoleList } from '../backend/TyrionAPI';
import { ModalsMembersAddModel } from '../modals/members-add';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsConfirmModel } from '../modals/confirm';

import { IRole } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess, FlashMessageInfo } from '../services/NotificationService';
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

    securityRole: IRole[] = null;

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
            this.refresh()
        });
        this.selfId = this.tyrionBackendService.personInfoSnapshot.id;
        this.refresh()
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onRoleAddClick(): void {

    }

    refresh(): void {
        this.blockUI();

        const filter: IRoleFilter = {
            project_id: this.project_id
        }
        this.tyrionBackendService.roleGetListByFilter(1, filter)
            .then((values: IRoleList) => {
                this.securityRole = values.content;
                if (!this.securityRole || !this.securityRole.length) {
                    this.addFlashMessage(new FlashMessageError('Roles are Empty.', null));
                } else {
                    this.addFlashMessage(new FlashMessageSuccess('Roles are fetched', null));
                } 
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Roles cannot be loaded.', reason));
                this.unblockUI();
            });
    }


    onRoleCreateClick(): void {
        let model = new ModalsPermissionGroupModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.roleCreate({
                    description: model.description,
                    name: model.name,
                    project_id: this.project_id
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }
}




