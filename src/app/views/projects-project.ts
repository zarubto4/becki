/**
 * Created by davidhradek on 09.08.16.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { IProject } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsProjectPropertiesModel } from '../modals/project-properties';
import { ModalsRemovalModel } from '../modals/removal';

@Component({
    selector: 'bk-view-projects-project',
    templateUrl: './projects-project.html',
})
export class ProjectsProjectComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string; // Project ID

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
            });
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onEditClick(): void {

        let model = new ModalsProjectPropertiesModel(null, this.project.name, this.project.description, this.project.product_id, true, this.project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editProject(this.id, {
                    project_name: model.name,
                    project_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The project has been updated.'));
                        this.refresh();
                        this.unblockUI();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The project cannot be updated.', reason));
                        this.refresh();
                        this.unblockUI();
                    });
            }
        });
    }

    onRemoveClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.project.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteProject(this.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The project has been removed.'));
                        this.router.navigate(['/projects']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The project cannot be removed.', reason));
                        this.refresh();
                        this.unblockUI();
                    });
            }
        });
    }


    count(status: 'grid_widgets'|'grid_programs'|'blocko_blocks'|'devices_online'|'devices_offline'|'instances_online'|'instances_offline'): number {
        if (!this.project) {
            return 0;
        }
        let count = 0;
        if (status === 'devices_online' && this.project.boards) {
            this.project.boards.forEach((b) => {
                if (b.board_online_status === 'online') {
                    count++;
                }
            });
        }
        if (status === 'devices_offline' && this.project.boards) {
            this.project.boards.forEach((b) => {
                if (b.board_online_status !== 'online') {
                    count++;
                }
            });
        }
        if (status === 'instances_online' && this.project.boards) {
            this.project.instancies.forEach((i) => {
                if (i.instance_is_online === 'online') {
                    count++;
                }
            });
        }
        if (status === 'instances_offline' && this.project.boards) {
            this.project.instancies.forEach((i) => {
                if (i.instance_is_online !== 'online') {
                    count++;
                }
            });
        }
        if (status === 'grid_widgets' && this.project.type_of_widgets) {
            this.project.type_of_widgets.forEach((tw) => {
                count += tw.grid_widgets.length;
            });
        }
        if (status === 'grid_programs' && this.project.m_projects) {
            this.project.m_projects.forEach((mp) => {
                count += mp.programs.length;
            });
        }
        if (status === 'blocko_blocks' && this.project.type_of_blocks) {
            this.project.type_of_blocks.forEach((tb) => {
                count += tb.blocko_blocks.length;
            });
        }
        return count;
    }


    refresh(): void {
        this.storageService.projectRefresh(this.id);
        /*
        this.blockUI();
        this.backendService.getProject(this.id)
            .then(project => {
                this.project = project;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
                this.unblockUI();
            });
        */
    }
}
