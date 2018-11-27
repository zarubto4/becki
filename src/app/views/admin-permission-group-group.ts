/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IPermission, IPerson, IRole } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsPermissionGroupModel } from '../modals/permission-group';
import { Subscription } from 'rxjs';
import { ModalsMembersAddModel } from '../modals/members-add';
import { ModalsConfirmModel } from '../modals/confirm';
import { ModalsRolePermissionAddModel } from '../modals/role-permission-add';
import { ModalsPermissionPermissionPropertyModel } from '../modals/permission-permission-properties';

@Component({
    selector: 'bk-view-permission-group-group',
    templateUrl: './admin-permission-group-group.html'
})
export class RoleGroupGroupComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    project_id: string = null;
    securityRole: IRole = null;

    routeParamsSubscription: Subscription;

    tab: string = 'permissions';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['group'];
            this.project_id = params['project'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onPortletClick(action: string): void {
        if (action === 'edit_role') {
            this.onRoleEditClick();
        }
        if (action === 'remove_role') {
            this.onRoleRemoveClick();
        }

        if (action === 'add_members') {
            this.onMembersAddClick();
        }
        if (action === 'add_permission') {
            this.onPermissionAddClick();
        }
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.roleGet(this.id)
            .then((values: IRole) => {
                this.securityRole = values;
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Role cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }


    onRoleEditClick(): void {
        let model = new ModalsPermissionGroupModel(this.securityRole.name, this.securityRole.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.roleEdit(this.securityRole.id, {
                    description: model.description,
                    name: model.name
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_edit')));
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onRoleRemoveClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.securityRole.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.roleDelete(this.securityRole.id)
                    .then(() => {
                        this.unblockUI();
                        if (this.project_id ) {
                            this.navigate(['/projects', this.project_id, 'roles']);
                        } else {
                            this.navigate(['/admin/permission-group']);
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onPersonClick(person: IPerson) {
        // TODO stránka uživatele
    }


    onMembersAddClick() {
        let m = new ModalsMembersAddModel();
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.tyrionBackendService.roleAddPerson(this.id, { persons_mail: m.emails })
                        .then(() => {
                            this.refresh(); // also unblockUI
                        })
                        .catch(reason => {
                            this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add'), reason));
                            this.refresh(); // also unblockUI
                        });
                }
            });
    }

    onMemberDeleteClick(member: IPerson) {
        if ((this.tyrionBackendService.personInfoSnapshot.email === member.email) || (this.tyrionBackendService.personInfoSnapshot.id === member.id)) {
            this.fmError(this.translate('label_cannot_remove_yourself'));
        }

        let con = new ModalsConfirmModel(this.translate('modal_title_remove_member'), this.translate('modal_text_remove_member'), false, this.translate('btn_yes'), this.translate('btn_no'), null);
        this.modalService.showModal(con).then((success) => {
            if (!success) {
                return;
            } else {
                this.blockUI();
                this.tyrionBackendService.roleRemovePerson(this.id, member.id)
                    .then(() => {
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }


    onPermissionAddClick() {
        Promise.all<any>([this.tyrionBackendService.permissionsGetAll()])
            .then((values: [IPermission[]]) => {
                let m = new ModalsRolePermissionAddModel(values[0]);
                this.modalService.showModal(m)
                    .then((success) => {
                        if (success) {
                            this.blockUI();
                            this.tyrionBackendService.roleAddPermissions(this.id, { permissions: m.permissionsForAdd })
                                .then(() => {
                                    this.refresh(); // also unblockUI
                                })
                                .catch(reason => {
                                    this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add'), reason));
                                    this.refresh(); // also unblockUI
                                });
                        }
                    });
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Role cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onPermissionDeleteClick(permission: IPermission) {
        this.modalService.showModal(new ModalsRemovalModel(permission.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.roleRemovePermission(this.id, permission.id)
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

    onDrobDownEmiter (action: string, object: any): void {

        if (action === 'remove_person') {
            this.onMemberDeleteClick(object);
        }
        if (action === 'remove_permission') {
            this.onPermissionDeleteClick(object);
        }
    }

}




