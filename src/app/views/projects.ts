/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsProjectPropertiesModel } from '../modals/project-properties';
import { IApplicableProduct, IProject } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';


@Component({
    selector: 'bk-view-projects',
    templateUrl: './projects.html',
})
export class ProjectsComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    projects: IProject[] = null;
    products: IApplicableProduct[] = null;
    projectsUpdateSubscription: Subscription;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {

        this.refresh();

        this.projectsUpdateSubscription = this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
            if (status.model === 'ProjectsRefreshAfterInvite') {
                this.refresh();
            }
        });


    }

    ngOnDestroy(): void {
        this.projectsUpdateSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();

        this.tyrionBackendService.projectGetByLoggedPerson()
            .then((projects: IProject[]) => {
                this.projects = projects;
                this.unblockUI();
            });

        this.tyrionBackendService.productsGetUserCanUsed()
            .then((products: IApplicableProduct[]) => {
                this.products = products;
            });
    }

    onPortletClick(action: string): void {
        if (action === 'add_project') {
            this.onAddClick();
        }
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
                    name: model.project.name,
                    description: model.project.description,
                    product_id: model.product_id,
                    tags: model.project.tags
                })
                    .then(project => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_project_create', model.project.name)));
                        this.unblockUI();
                        this.onProjectClick(project.id);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_create_project', model.project.name, reason.message)));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onDrobDownEmiter(action: string, project: IProject): void {
        if (action === 'edit_project') {
            this.onEditClick(project);
        }

        if (action === 'remove_project') {
            this.onRemoveClick(project);
        }
    }

    onEditClick(project: IProject): void {
        if (!this.products) {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_project')));
        }

        let model = new ModalsProjectPropertiesModel(this.products, project);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectEdit(project.id, {
                    name: model.project.name,
                    description: model.project.description,
                    tags: model.project.tags
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
