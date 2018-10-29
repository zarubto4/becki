/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IProject, IProjectParticipant, IRoleFilter, INameAndDescProjectIdOptional, IRoleList, IRole } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { CurrentParamsService } from '../services/CurrentParamsService';

import { ModalsRemovalModel } from '../modals/removal';
import { ModalsPermissionGroupModel } from '../modals/permission-group';
import { Subscription } from 'rxjs/Rx';


@Component({
    selector: 'bk-view-permission-group',
    templateUrl: './admin-permission-group.html'
})
export class RoleGroupComponent extends _BaseMainComponent implements OnInit, OnDestroy {
    project_id: string;

    routeParamsSubscription: Subscription;

    projectSubscription: Subscription;

    project: IProject = null;

    selfId: string = '';

    securityRoleList: IRoleList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    onPortletClick(action: string): void {
        if (action === 'create_role') {
            this.onRoleCreateClick();
        }
    }

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
            });
            this.refresh();
        });
        this.selfId = this.tyrionBackendService.personInfoSnapshot.id;
        this.refresh();
    }



    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    refresh(): void {
        this.onFilterRole();
    }

    onFilterRole(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.roleGetListByFilter(pageNumber, {
            project_id: this.project_id
        })
            .then((values) => {
                this.unblockUI();
                this.securityRoleList = values;
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onRoleClick(role_id: string): void {
        if (this.project_id) {
            this.navigate(['projects', this.project_id, 'roles', role_id]);
        } else {
            this.navigate(['admin/permission-group', role_id]);
        }
    }

    onRoleCreateClick(): void {
        let model = new ModalsPermissionGroupModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.roleCreate({
                    description: model.description,
                    name: model.name
                })
                    .then(role => {
                        this.onRoleClick(role.id);
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onRoleEditClick(role: IRole): void {
        let model = new ModalsPermissionGroupModel(role.name, role.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.roleEdit(role.id, {
                    description: model.description,
                    name: model.name
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

    onRoleRemoveClick(role: IRole): void {
        this.modalService.showModal(new ModalsRemovalModel(role.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.roleDelete(role.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onDrobDownEmiter (action: string, role: IRole): void {
        if (action === 'edit_role') {
            this.onRoleEditClick(role);
        }

        if (action === 'remove_role') {
            this.onRoleRemoveClick(role);
        }
    }

}




