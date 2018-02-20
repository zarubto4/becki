/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnInit, Injector } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import {
    FlashMessageError, FlashMessageSuccess,
    FlashMessageInfo, FlashMessageWarning, FlashMessage
} from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsProjectPropertiesModel } from '../modals/project-properties';
import { IApplicableProduct, IProject } from '../backend/TyrionAPI';


@Component({
    selector: 'bk-view-projects',
    templateUrl: './projects.html',
})
export class ProjectsComponent extends _BaseMainComponent implements OnInit {

    projects: IProject[] = null;
    products: IApplicableProduct[] = null;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
            if (status.model === 'ProjectsRefreshAfterInvite') {
                this.refresh();
            }
        });
        this.refresh();
    }

    refresh(): void {
        this.blockUI();
        Promise.all<any>([this.tyrionBackendService.projectGetByLoggedPerson(), this.tyrionBackendService.productsGetUserCanUsed()])
            .then((values: [IProject[], IApplicableProduct[]]) => {
                this.projects = values[0];
                this.products = values[1];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Projects cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onAddClick(): void {

        if (!this.products) {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_project')));
        }

        let model = new ModalsProjectPropertiesModel(this.products);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectCreate({
                    name: model.name,
                    description: model.description,
                    product_id: model.product
                }) // TODO: add tarrif nebo produkt či jak se to bude jmenovat
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_project_create', model.name)));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_create_project', model.name, reason.message)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onEditClick(project: IProject): void {
        if (!this.products) {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_project')));
        }

        let model = new ModalsProjectPropertiesModel(this.products, project.name, project.description, project.product.id, true, project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectEdit(project.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_project_update')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_project'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onRemoveClick(project: IProject): void {
        this.modalService.showModal(new ModalsRemovalModel(project.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectDelete(project.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_project_remove')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_project'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onRedirectClick(): void {
        this.navigate(['/financial/product-registration']);
    }
}
