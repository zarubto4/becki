/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IMProgram, IMProject, IMProjectShortDetail, ISwaggerMProgramShortDetail } from '../backend/TyrionAPI';
import { ModalsGridProgramPropertiesModel } from '../modals/grid-program-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsGridProjectPropertiesModel } from '../modals/grid-project-properties';

@Component({
    selector: 'bk-view-projects-project-grid-grids',
    templateUrl: './projects-project-grid-grids.html',
})
export class ProjectsProjectGridGridsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string; // Project ID
    gridsId: string; // M Project ID

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    gridProject: IMProjectShortDetail = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.gridsId = params['grids'];

            if (this.projectId) {
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.gridProject = project.m_projects.find((mp) => mp.id === this.gridsId);
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onProgramClick(grid: ISwaggerMProgramShortDetail): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', this.gridsId, grid.id]);
    }

    onProgramAddClick(project: IMProjectShortDetail): void {
        let model = new ModalsGridProgramPropertiesModel();

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.mProgramCreate(project.id, { // TODO [permission]: M_Program.create_permission
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_program_add')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_grid_program'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        }
                    });
            }
        });
    }

    refresh(): void {
        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', this.gridsId]);
    }

    onProjectEditClick(): void {
        let model = new ModalsGridProjectPropertiesModel(this.gridProject.name, this.gridProject.description, true, this.gridProject.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.mProjectEdit(this.gridProject.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_project_edit')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_grid_project'), reason));
                        this.refresh();
                    });
            }
        });
    }


    onProjectDeleteClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.gridProject.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.mProjectDelete(this.gridProject.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_project_remove')));

                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                            this.router.navigate(['/projects/' + this.projectId + '/grid']);
                        } else {
                            this.router.navigate(['/admin/widgets']);
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_grid_project'), reason));
                        this.refresh();
                    });
            }
        });

    }

    onProgramEditClick(program: IMProjectShortDetail): void {
        let model = new ModalsGridProgramPropertiesModel(program.name, program.description, true);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.mProgramEdit(program.id, {
                    name: model.name,
                    description: model.description,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_program_edit')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_grid_program'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onProgramDeleteClick(program: IMProgram): void {

        this.modalService.showModal(new ModalsRemovalModel(program.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.mProgramDelete(program.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_program_remove')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_grid_program'), reason));
                        this.refresh();
                    });
            }
        });

    }


}
