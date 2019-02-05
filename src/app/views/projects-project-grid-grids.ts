/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IGridProject, IGridProgram } from '../backend/TyrionAPI';
import { ModalsGridProgramPropertiesModel } from '../modals/grid-program-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsGridProjectPropertiesModel } from '../modals/grid-project-properties';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-projects-project-grid-grids',
    templateUrl: './projects-project-grid-grids.html',
})
export class ProjectsProjectGridGridsComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    projectId: string; // Project ID
    gridsId: string; // M Project ID

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    gridProject: IGridProject = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.gridsId = params['grids'];
            this.onGridProjectget();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onGridProjectget(): void {
        this.blockUI();
        this.tyrionBackendService.gridProjectGet(this.gridsId)
            .then((project) => {
                this.gridProject = project;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
            });
    }

    onProgramAddClick(): void {
        let model = new ModalsGridProgramPropertiesModel(this.gridProject.id);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProgramCreate(this.gridProject.id, {
                    name: model.program.name,
                    description: model.program.description,
                    tags: model.program.tags
                })
                    .then(gridProgram => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_program_add')));
                        this.unblockUI();
                        this.onGridProgramClick(this.gridProject.id, gridProgram.id);
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    refresh(): void {
        this.onGridProjectget();
    }

    onPortletClick(action: string): void {
        if (action === 'edit_project') {
            this.onProjectEditClick();
        }
        if (action === 'remove_project') {
            this.onProjectDeleteClick();
        }
        if (action === 'add_program') {
            this.onProgramAddClick();
        }
    }

    onProjectEditClick(): void {
        let model = new ModalsGridProjectPropertiesModel(this.projectId, this.gridProject);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProjectEdit(this.gridProject.id, {
                    name: model.project.name,
                    description: model.project.description,
                    tags: model.project.tags
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_project_edit')));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }


    onProjectDeleteClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.gridProject.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProjectDelete(this.gridProject.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_project_remove')));

                        if (this.projectId) {
                            this.router.navigate(['/projects/' + this.projectId + '/grid']);
                        } else {
                            this.router.navigate(['/admin/widgets']);
                        }
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });

    }

    onProgramEditClick(program: IGridProgram): void {
        let model = new ModalsGridProgramPropertiesModel(this.gridProject.id, program);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProgramUpdate(program.id, {
                    name: model.program.name,
                    description: model.program.description,
                    tags: model.program.tags
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_program_edit')));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    onProgramDeleteClick(program: IGridProgram): void {

        this.modalService.showModal(new ModalsRemovalModel(program.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProgramDelete(program.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_program_remove')));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });

    }

    onDrobDownEmiter(action: string, program: IGridProgram): void {

        if (action === 'edit_grid_app') {
            this.onProgramEditClick(program);
        }

        if (action === 'remove_grid_app') {
            this.onProgramDeleteClick(program);
        }
    }


}
