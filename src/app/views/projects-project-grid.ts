/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import {IProject, IGridProject, IGridProjectList} from '../backend/TyrionAPI';
import { ModalsGridProjectPropertiesModel } from '../modals/grid-project-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-grid',
    templateUrl: './projects-project-grid.html',
})
export class ProjectsProjectGridComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    gridProjects: IGridProjectList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.onFilter();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onPortletClick(action: string): void {
        if (action === 'btn_add') {
            this.onProjectAddClick();
        }
    }

    onFilter(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.gridProjectGetByFilter(pageNumber, {
            project_ids : [this.projectId]
        })
            .then((values) => {
                this.gridProjects = values;
                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onProjectAddClick(): void {
        let model = new ModalsGridProjectPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProjectCreate(this.projectId, {  // TODO [permission]: M_Project.read_permission, M_Project.createPermission
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_project_add')));
                        this.onFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_grid_project'), reason));
                        this.onFilter();
                    });
            }
        });
    }

    onProjectEditClick(project: IGridProject): void {
        let model = new ModalsGridProjectPropertiesModel(project.name, project.description, true, project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                // console.log(model);
                this.blockUI();
                this.tyrionBackendService.gridProjectEdit(project.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_project_edit')));
                        this.onFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_grid_project'), reason));
                        this.onFilter();
                    });
            }
        });
    }

    onProjectDeleteClick(project: IGridProject): void {
        this.modalService.showModal(new ModalsRemovalModel(project.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProjectDelete(project.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_project_remove')));
                        this.onFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_grid_project'), reason));
                        this.onFilter();
                    });
            }
        });

    }

}
