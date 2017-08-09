/**
 * Created by davidhradek on 01.11.16.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, ITypeOfWidget, IGridWidget, ITypeOfWidgetShortDetail, IGridWidgetShortDetail } from '../backend/TyrionAPI';
import { ModalsWidgetsWidgetPropertiesModel } from '../modals/widgets-widget-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsWidgetsTypePropertiesModel } from '../modals/widgets-type-properties';

@Component({
    selector: 'bk-view-projects-project-widgets-widgets',
    templateUrl: './projects-project-widgets-widgets.html',
})
export class ProjectsProjectWidgetsWidgetsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    widgetsId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    group: ITypeOfWidgetShortDetail = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.widgetsId = params['widgets'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.group = project.type_of_widgets.find((tw) => tw.id === this.widgetsId);
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onWidgetClick(widget: IGridWidgetShortDetail): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'widgets', this.widgetsId, widget.id]);
    }

    onGroupEditClick(): void {
        let model = new ModalsWidgetsTypePropertiesModel(this.group.name, this.group.description, true, this.group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfWidgetEdit(this.group.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_group_edit_success')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_edit_fail', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onGroupDeleteClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfWidgetDelete(this.group.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_group_remove_success')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_remove_fail', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

    onWidgetAddClick(group: ITypeOfWidgetShortDetail): void {

        let model = new ModalsWidgetsWidgetPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.gridWidgetCreate({
                    type_of_widget_id: group.id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_widget_add_success')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_add_fail', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

    onWidgetEditClick(widget: IGridWidgetShortDetail): void {

        let model = new ModalsWidgetsWidgetPropertiesModel(widget.name, widget.description, true, widget.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.gridWidgetEdit(widget.id, {
                    name: model.name,
                    description: model.description,
                    type_of_widget_id: this.widgetsId // tohle je trochu divný ne? ... možná kdyby jsi chtěl přesunout widget mezi groupama? [DU]
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_widget_edit_success')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_edit_fail', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

    onWidgetDeleteClick(widget: IGridWidgetShortDetail): void {

        this.modalService.showModal(new ModalsRemovalModel(widget.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.gridWidgetDelete(widget.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_widget_removed_success')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_removed_fail', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

}
