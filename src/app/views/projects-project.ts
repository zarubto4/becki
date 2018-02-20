/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
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
export class ProjectsProjectComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    // Routes
    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project_id: string; // Project ID
    project: IProject = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
            });

            this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
                if (status.model === 'Project' && this.project_id === status.model_id) {
                    this.refresh();
                }
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


    onPortletClick(action: string): void {
        if (action === 'edit_project') {
            this.onEditClick();
        }

        if (action === 'remove_project') {
            this.onRemoveClick();
        }
    }

    onEditClick(): void {

        let model = new ModalsProjectPropertiesModel(null, this.project.name, this.project.description, this.project.product.id, true, this.project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.projectEdit(this.project_id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_project_update')));
                        this.refresh();
                        this.unblockUI();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_project'), reason));
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
                this.tyrionBackendService.projectDelete(this.project_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_project_remove')));
                        this.router.navigate(['/projects']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_project'), reason));
                        this.refresh();
                        this.unblockUI();
                    });
            }
        });
    }

    refresh(): void {
        this.storageService.projectRefresh(this.project_id);
    }
}
