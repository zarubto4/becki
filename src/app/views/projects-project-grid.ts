/**
 * Created by davidhradek on 18.10.16.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IMProject, IMProjectShortDetail } from '../backend/TyrionAPI';
import { ModalsGridProjectPropertiesModel } from '../modals/grid-project-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-grid',
    templateUrl: './projects-project-grid.html',
})
export class ProjectsProjectGridComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    gridProjects: IMProjectShortDetail[] = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
                this.gridProjects = project.m_projects;
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onProjectClick(m_project: IMProjectShortDetail): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', m_project.id]);
    }

    onProjectAddClick(): void {
        let model = new ModalsGridProjectPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createMProject(this.id, {  // TODO [permission]: M_Project.read_permission, M_Project.createPermission
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The grid project has been added.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid project cannot be added.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onProjectEditClick(project: IMProjectShortDetail): void {
        let model = new ModalsGridProjectPropertiesModel(project.name, project.description, true, project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                // console.log(model);
                this.blockUI();
                this.backendService.editMProject(project.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The grid project has been edited.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid project cannot be edited.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onProjectDeleteClick(project: IMProjectShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(project.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteMProject(project.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The grid project has been removed.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The grid project cannot be removed.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

}
