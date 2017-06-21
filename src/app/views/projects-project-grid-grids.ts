/**
 * Created by davidhradek on 18.10.16.
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

    id: string; // Project ID
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
            this.id = params['project'];
            this.gridsId = params['grids'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.gridProject = project.m_projects.find((mp) => mp.id === this.gridsId);
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onProgramClick(grid: ISwaggerMProgramShortDetail): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', this.gridsId]);
    }

    onProgramAddClick(project: IMProjectShortDetail): void {
        let model = new ModalsGridProgramPropertiesModel();

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createMProgram(project.id, { // TODO [permission]: M_Program.create_permission
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The grid program has been added.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid program cannot be added.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    refresh(): void {
        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', this.gridsId]);
    }

    onProjectEditClick(): void {
        let model = new ModalsGridProjectPropertiesModel(this.gridProject.name, this.gridProject.description, true, this.gridProject.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editMProject(this.gridProject.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The grid project has been edited.'));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid project cannot be edited.', reason));
                        this.refresh();
                    });
            }
        });
    }


    onProjectDeleteClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.gridProject.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteMProject(this.gridProject.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The grid project has been removed.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                        this.router.navigate(['/projects/' + this.id + '/grid']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid project cannot be removed.', reason));
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
                this.backendService.editMProgram(program.id, {
                    name: model.name,
                    description: model.description,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The grid program has been edited.'));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid program cannot be edited.', reason));
                        this.refresh();
                    });
            }
        });
    }

    onProgramDeleteClick(program: IMProgram): void {

        this.modalService.showModal(new ModalsRemovalModel(program.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteMProgram(program.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The grid program has been removed.'));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid program cannot be removed.', reason));
                        this.refresh();
                    });
            }
        });

    }


}
