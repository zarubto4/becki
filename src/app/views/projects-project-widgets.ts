/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IGridWidgetList, IWidget } from '../backend/TyrionAPI';
import { ModalsWidgetsWidgetPropertiesModel } from '../modals/widgets-widget-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsWidgetsWidgetCopyModel } from '../modals/widgets-widget-copy';

@Component({
    selector: 'bk-view-projects-project-widgets-widgets',
    templateUrl: './projects-project-widgets.html',
})
export class ProjectsProjectWidgetsComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    widgetList: IGridWidgetList = null;
    widgetPublicList: IGridWidgetList = null;
    widgetListNotApproved: IGridWidgetList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    tab: string = 'my_widgets';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];

            if (this.projectId) {
                this.onShowProgramPrivateWidgetFilter();
            } else {
                this.tab = 'public_widgets';
                this.onShowProgramPublicWidgetFilter();
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;

        if (tab === 'my_widgets' && this.widgetList == null) {
            this.onShowProgramPrivateWidgetFilter();
        }

        if (tab === 'public_widgets' && this.widgetPublicList == null) {
            this.onShowProgramPublicWidgetFilter();
        }

        if (tab === 'admin_widgets' && this.widgetListNotApproved == null) {
            this.onShowProgramPendingWidgetFilter();
        }
    }

    onPortletClick(action: string): void {
        if (action === 'add_widget') {
            this.onWidgetAddClick();
        }
    }

    onWidgetClick(widget: IWidget): void {
        if (this.projectId) {
            this.navigate(['/projects', this.currentParamsService.get('project'), 'widgets', widget.id]);
        } else {
            this.navigate(['/admin/widget/', widget.id]);
        }
    }


    onMakeClone(widget: IWidget): void {
        let model = new ModalsWidgetsWidgetCopyModel(widget.name, widget.description, widget.tags);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetMakeClone({
                    widget_id: widget.id,
                    project_id: this.projectId,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_copy_success')));
                        this.onShowProgramPrivateWidgetFilter();
                        this.tab = 'my_widgets';
                        this.unblockUI();

                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_copy_fail'), reason));
                        this.onShowProgramPrivateWidgetFilter();
                        this.onShowProgramPublicWidgetFilter();
                        this.unblockUI();
                    });
            }
        });
    }

    onWidgetAddClick(): void {

        let model = new ModalsWidgetsWidgetPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetCreate({
                    project_id: this.projectId,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_widget_add_success')));
                        this.onShowProgramPrivateWidgetFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_add_fail'), reason));
                        this.onShowProgramPrivateWidgetFilter();
                    });
            }
        });

    }

    onWidgetEditClick(widget: IWidget): void {

        let model = new ModalsWidgetsWidgetPropertiesModel(widget.name, widget.description, true, widget.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetEdit(widget.id, {
                    name: model.name,
                    description: model.description,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_widget_edit_success')));
                        if (widget.publish_type === 'PRIVATE') {
                            this.onShowProgramPrivateWidgetFilter();
                        } else {
                            this.onShowProgramPublicWidgetFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_edit_fail'), reason));
                        if (widget.publish_type === 'PRIVATE') {
                            this.onShowProgramPrivateWidgetFilter();
                        } else {
                            this.onShowProgramPublicWidgetFilter();
                        }
                    });
            }
        });

    }

    onWidgetDeleteClick(widget: IWidget): void {

        this.modalService.showModal(new ModalsRemovalModel(widget.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetDelete(widget.id)
                    .then(() => {

                        if (widget.publish_type === 'PRIVATE') {
                            this.onShowProgramPrivateWidgetFilter();
                        } else {
                            this.onShowProgramPublicWidgetFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_removed_fail'), reason));
                        if (widget.publish_type === 'PRIVATE') {
                            this.onShowProgramPrivateWidgetFilter();
                        } else {
                            this.onShowProgramPublicWidgetFilter();
                        }
                    });
            }
        });

    }

    onWidgetActivateClick(widget: IWidget): void {
        this.blockUI();
        this.tyrionBackendService.widgetActivate(widget.id)
            .then(() => {
                if (widget.publish_type === 'PRIVATE') {
                    this.onShowProgramPrivateWidgetFilter();
                } else {
                    this.onShowProgramPublicWidgetFilter();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                if (widget.publish_type === 'PRIVATE') {
                    this.onShowProgramPrivateWidgetFilter();
                } else {
                    this.onShowProgramPublicWidgetFilter();
                }
            });
    }

    onWidgetDeactivateClick(widget: IWidget): void {
        this.blockUI();
        this.tyrionBackendService.widgetDeactivate(widget.id)
            .then(() => {
                if (widget.publish_type === 'PRIVATE') {
                    this.onShowProgramPrivateWidgetFilter();
                } else {
                    this.onShowProgramPublicWidgetFilter();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                if (widget.publish_type === 'PRIVATE') {
                    this.onShowProgramPrivateWidgetFilter();
                } else {
                    this.onShowProgramPublicWidgetFilter();
                }
            });
    }

    onShowProgramPrivateWidgetFilter(page: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.widgetGetByFilter(page, {
            project_id: this.projectId,
        })
            .then((list) => {
                this.widgetList = list;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code'), reason));
                this.unblockUI();
            });
    }

    onShowProgramPublicWidgetFilter(page: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.widgetGetByFilter(page, {
            public_programs: true,
        })
            .then((list) => {
                this.widgetPublicList = list;
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Widget cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowProgramPendingWidgetFilter(page: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.widgetGetByFilter(page, {
            pending_widgets: true,       // For public its required
        })
            .then((list) => {
                this.widgetListNotApproved = list;
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Widget cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onDrobDownEmiter(action: string, object: any): void {

        if (action === 'clone_widget') {
            this.onMakeClone(object);
        }

        if (action === 'activate_widget') {
            this.onWidgetActivateClick(object);
        }
        if (action === 'deactivate_widget') {
            this.onWidgetDeactivateClick(object);
        }

        if (action === 'edit_widget') {
            this.onWidgetEditClick(object);
        }

        if (action === 'remove_widget') {
            this.onWidgetDeleteClick(object);
        }

        if (action === 'make_decision') {
            this.onWidgetClick(object);
        }
    }

}
