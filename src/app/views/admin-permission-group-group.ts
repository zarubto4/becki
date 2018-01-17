/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IPermission, IPersonMiddleDetail, ISecurityRole } from '../backend/TyrionAPI';
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
export class RoleGroupGroupComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    securityRole: ISecurityRole = null;

    routeParamsSubscription: Subscription;

    tab: string = 'permissions';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.blockUI();
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['group'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        Promise.all<any>([this.backendService.roleGet(this.id)])
            .then((values: [ISecurityRole]) => {
                this.securityRole = values[0];
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
                this.backendService.roleEdit(this.securityRole.id, {
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
                this.backendService.roleDelete(this.securityRole.id)
                    .then(() => {
                        this.unblockUI();
                        this.navigate(['/admin/permission-group']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onPersonClick(person: IPersonMiddleDetail) {
        // TODO stránka uživatele
    }


    onMembersAddClick() {
        let m = new ModalsMembersAddModel();
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.roleAddPerson(this.id, { persons_mail: m.emails })
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

    onMemberDeleteClick(member: IPersonMiddleDetail) {
        if ((this.backendService.personInfoSnapshot.mail === member.mail) || (this.backendService.personInfoSnapshot.id === member.id)) {
            this.fmError(this.translate('label_cannot_remove_yourself'));
        }

        let con = new ModalsConfirmModel(this.translate('modal_title_remove_member'), this.translate('modal_text_remove_member'), false, this.translate('btn_yes'), this.translate('btn_no'), null);
        this.modalService.showModal(con).then((success) => {
            if (!success) {
                return;
            } else {
                this.blockUI();
                this.backendService.roleRemovePerson(this.id, member.id)
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
        Promise.all<any>([this.backendService.permissionsGetAll()])
            .then((values: [IPermission[]]) => {
                let m = new ModalsRolePermissionAddModel(values[0]);
                this.modalService.showModal(m)
                    .then((success) => {
                        if (success) {
                            this.blockUI();
                            this.backendService.roleAddPermissions(this.id, { permissions: m.permissionsForAdd })
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

    onPermissionEditClick(permission: IPermission) {
        let model = new ModalsPermissionPermissionPropertyModel(permission.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.permissionEdit(permission.permission_key, {
                    description: model.description,
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

    onPermissionDeleteClick(permission: IPermission) {
        this.modalService.showModal(new ModalsRemovalModel(permission.permission_key)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.roleRemovePermission(this.id, permission.permission_key)
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

}




