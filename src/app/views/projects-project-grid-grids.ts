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

@Component({
    selector: 'bk-view-projects-project-grid-grids',
    templateUrl: './projects-project-grid-grids.html',
})
export class ProjectsProjectGridGridsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    gridsId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    // project: IProject = null;

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
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', this.gridsId, grid.id]);
    }

    onProgramAddClick(project: IMProjectShortDetail): void {
        let model = new ModalsGridProgramPropertiesModel();

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createMProgram(project.id, {
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
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid program cannot be edited.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
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
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid program cannot be removed.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }


}
