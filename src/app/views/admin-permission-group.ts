/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IRoleShortDetai } from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsPermissionGroupModel } from '../modals/permission-group';

@Component({
    selector: 'bk-view-permission-group',
    templateUrl: './admin-permission-group.html'
})
export class RoleGroupComponent extends BaseMainComponent implements OnInit {

    securityRole: IRoleShortDetai[] = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.backendService.roleGetAll()])
            .then((values: [IRoleShortDetai[]]) => {
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
                this.backendService.roleCreate({
                    description: model.description,
                    name: model.name
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onRoleClick(role: string): void {
        this.navigate(['admin/permission-group/', role]);
    }

    onRoleEditClick(role: IRoleShortDetai): void {
        let model = new ModalsPermissionGroupModel(role.name, role.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.roleEdit(role.id, {
                    description: model.description,
                    name: model.name
                })
                    .then(() => {
                        this.refresh();
                    }).catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_fail', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onRoleRemoveClick(role: IRoleShortDetai): void {
        this.modalService.showModal(new ModalsRemovalModel(role.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.roleDelete(role.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove', reason)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

}




