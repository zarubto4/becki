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
import { ModalsWidgetsWidgetCopyModel } from '../modals/widgets-widget-copy';

@Component({
    selector: 'bk-view-projects-project-widgets-widgets',
    templateUrl: './projects-project-widgets-widgets.html',
})
export class ProjectsProjectWidgetsWidgetsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    typeOfWidgetId: string;
    project: IProject = null;

    group: ITypeOfWidgetShortDetail | ITypeOfWidget = null; // User / Admin

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.typeOfWidgetId = params['widgets'];

            if (this.projectId) {
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.project = project;
                    this.group = project.type_of_widgets.find((tw) => tw.id === this.typeOfWidgetId);

                    if (!this.group) {
                        this.refresh();
                    }
                });
            } else {
                this.refresh();
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    refresh(): void {
        this.blockUI();
        Promise.all<any>([this.backendService.typeOfWidgetGet(this.typeOfWidgetId)])
            .then((values: [ITypeOfWidget]) => {
                this.group = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Widget Group cannot be loaded.', reason));
                this.unblockUI();
            });
    }


    onWidgetClick(widget: IGridWidgetShortDetail): void {
        if (this.projectId) {
            this.navigate(['/projects', this.currentParamsService.get('project'), 'widgets', this.typeOfWidgetId, widget.id]);
        } else {
            this.navigate(['/admin/widgets/', this.typeOfWidgetId, widget.id]);
        }
    }

    onMakeClone(widget: IGridWidgetShortDetail): void {
        let model = new ModalsWidgetsWidgetCopyModel(widget.name, widget.description, this.project.type_of_widgets);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.gridWidgetMakeClone({
                    grid_widget_id: widget.id,
                    type_of_widget_id: model.type_of_widget,
                    project_id: this.projectId,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_copy_success')));
                        this.unblockUI();

                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_copy_fail'), reason));
                        this.unblockUI();
                    });
            }
        });
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
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_edit_fail'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
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
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_remove_fail'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
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
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_add_fail'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
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
                    type_of_widget_id: this.typeOfWidgetId // tohle je trochu divný ne? ... možná kdyby jsi chtěl přesunout widget mezi groupama? [DU]
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_widget_edit_success')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_edit_fail'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
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
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_removed_fail'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    });
            }
        });

    }

    onWidgetActivateClick(widget: IGridWidgetShortDetail): void {
        this.blockUI();
        this.backendService.gridWidgetActivate(widget.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.refresh();
            });
    }

    onWidgetDeactivateClick(widget: IGridWidgetShortDetail): void {
        this.blockUI();
        this.backendService.gridWidgetDeactivate(widget.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.refresh();
            });
    }

}
