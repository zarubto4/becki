/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Component, OnInit, Injector } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    FlashMessageError, FlashMessageSuccess,
    FlashMessageInfo, FlashMessageWarning, FlashMessage
} from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsProjectPropertiesModel } from '../modals/project-properties';
import { IProject, IApplicableProduct } from '../backend/TyrionAPI';


@Component({
    selector: 'bk-view-projects',
    templateUrl: './projects.html',
})
export class ProjectsComponent extends BaseMainComponent implements OnInit {

    projects: IProject[];

    products: IApplicableProduct[];

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();
        Promise.all<any>([this.backendService.getAllProjects(), this.backendService.getAllProductUserApplicables()])
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

    onProjectClick(project: IProject): void {
        this.navigate(['/projects', project.id]);
    }

    onTestClick(): void {
        this.blockUIService.blockUI();

        setTimeout(() => {
            this.blockUIService.unblockUI();
        }, 5000);
    }

    onTest2Click(): void {
        let text = '';
        /* tslint:disable:max-line-length */
        switch (Math.floor(Math.random() * 4)) {
            case 0: text = 'This is test flash message ... is this okay or its worng?'; break;
            case 1: text = 'Cannot add project now.'; break;
            case 2: text = 'Project created successfully ... its great ... I love it <3 :-)'; break;
            case 3: text = 'Some really really long message. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'; break;
        }
        /* tslint:enable */
        let m: FlashMessage = null;
        switch (Math.floor(Math.random() * 4)) {
            case 0: m = new FlashMessageError(text); break;
            case 1: m = new FlashMessageSuccess(text); break;
            case 2: m = new FlashMessageInfo(text); break;
            case 3: m = new FlashMessageWarning(text); break;
        }
        this.notificationService.addFlashMessage(m);
        // this.navigate(['projects', '1']);
    }

    onAddClick(): void {
        if (!this.products) {
            this.addFlashMessage(new FlashMessageError('Cannot add project now.'));
        }

        let model = new ModalsProjectPropertiesModel(this.products);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createProject({
                    project_name: model.name,
                    project_description: model.description,
                    product_id: parseInt(model.product, 10)
                }) // TODO: add tarrif nebo produkt či jak se to bude jmenovat
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The project ${model.name} has been created.`));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The project ${model.name} cannot be created.`, reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onEditClick(project: IProject): void {
        if (!this.products) {
            this.addFlashMessage(new FlashMessageError('Cannot add project now.'));
        }

        let model = new ModalsProjectPropertiesModel(this.products, project.name, project.description, '' + project.product_id, true, project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editProject(project.id, {
                    project_name: model.name,
                    project_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The project has been updated.'));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The project cannot be updated.', reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onRemoveClick(project: IProject): void {
        this.modalService.showModal(new ModalsRemovalModel(project.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteProject(project.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The project has been removed.'));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The project cannot be removed.', reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }
}
