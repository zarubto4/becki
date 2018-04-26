/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { IRole } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsPermissionGroupModel } from '../modals/permission-group';

@Component({
    selector: 'bk-view-permission-group',
    templateUrl: './admin-permission-group.html'
})
export class RoleGroupComponent extends _BaseMainComponent implements OnInit {

    securityRole: IRole[] = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    onPortletClick(action: string): void {
        if (action === 'create_role') {
            this.onRoleCreateClick();
        }
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.tyrionBackendService.roleGetAll()])
            .then((values: [IRole[]]) => {
                this.securityRole = values[0];
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

        if (action === 'remove_prole') {
            this.onRoleRemoveClick(role);
        }
    }

}




