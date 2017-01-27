/**
 * Created by davidhradek on 21.09.16.
 */


import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, ITypeOfWidget, ITypeOfWidgetShortDetail } from '../backend/TyrionAPI';
import { ModalsWidgetsTypePropertiesModel } from '../modals/widgets-type-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-widgets',
    templateUrl: './projects-project-widgets.html',
})
export class ProjectsProjectWidgetsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;
    groups: ITypeOfWidgetShortDetail[] = [];

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
                this.groups = this.project.type_of_widgets;
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onGroupAddClick(): void {
        let model = new ModalsWidgetsTypePropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createTypeOfWidget({
                    project_id: this.id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The widgets group has been added.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The widgets group cannot be added.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onGroupEditClick(group: ITypeOfWidget): void {
        let model = new ModalsWidgetsTypePropertiesModel(group.name, group.description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editTypeOfWidget(group.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The widgets group has been edited.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The widgets group cannot be edited.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onGroupDeleteClick(group: ITypeOfWidget): void {
        this.modalService.showModal(new ModalsRemovalModel(group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteTypeOfWidget(group.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The widgets group has been removed.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The widgets group cannot be removed.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

    onGroupClick(group: ITypeOfWidget): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'widgets', group.id]);
    }

}
