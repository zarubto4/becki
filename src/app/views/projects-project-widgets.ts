/**
 * Created by davidhradek on 21.09.16.
 */


import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import {
    IGridWidgetList, IGridWidgetShortDetail, IProject, ITypeOfWidget, ITypeOfWidgetList,
    ITypeOfWidgetShortDetail
} from '../backend/TyrionAPI';
import { ModalsWidgetsTypePropertiesModel } from '../modals/widgets-type-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-widgets',
    templateUrl: './projects-project-widgets.html',
})
export class ProjectsProjectWidgetsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;
    privateGroups: ITypeOfWidgetShortDetail[] = [];
    publicGroups: ITypeOfWidgetList = null;

    widgetsNotApproved: IGridWidgetList = null; // Only if user is Admin and there is no project

    tab: string = 'public_groups';

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    onToggleTab(tab: string) {
        this.tab = tab;

        if (tab === 'public_groups' && this.publicGroups == null) {
            this.onShowPublicGridGroupsByFilter();
        }

        if (tab === 'admin_programs_for_decisions' && this.widgetsNotApproved == null) {
            this.onShowProgramForDecisionsByFilter();
        }
    }

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];

            if (this.projectId) {

                this.tab = 'private_groups';
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.project = project;
                    this.onShowPrivateGridGroupsByFilter();
                });
            } else {
                this.onShowPublicGridGroupsByFilter();
            }
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
                this.backendService.typeOfWidgetCreate({ // TODO [permission]: TypeOfWidget_create_permission
                    project_id: this.projectId ? this.projectId : null,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_group_add_success')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicGridGroupsByFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicGridGroupsByFilter();
                        }
                    });
            }
        });
    }

    onGroupEditClick(group: ITypeOfWidget): void {
        let model = new ModalsWidgetsTypePropertiesModel(group.name, group.description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfWidgetEdit(group.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_group_edit_success')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicGridGroupsByFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_edit_fail'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicGridGroupsByFilter();
                        }
                    });
            }
        });
    }

    onGroupDeleteClick(group: ITypeOfWidget): void {
        this.modalService.showModal(new ModalsRemovalModel(group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfWidgetDelete(group.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_group_edit_success')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicGridGroupsByFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_remove_fail'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicGridGroupsByFilter();
                        }
                    });
            }
        });

    }

    onShowPrivateGridGroupsByFilter(page: number = 0): void {
        this.privateGroups = this.project.type_of_widgets;
    }

    onShowPublicGridGroupsByFilter(page: number = 0): void {
        this.blockUI();
        Promise.all<any>([this.backendService.typeOfWidgetGetByFilter(page, {
            public_programs: true,       // For public its required
        })
        ])
            .then((values: [ITypeOfWidgetList]) => {
                this.publicGroups = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowProgramForDecisionsByFilter(page: number = 0): void {
        this.blockUI();
        Promise.all<any>([this.backendService.gridWidgetGetByFilter(page, {
            pending_widget: true,       // For public its required
        })
        ])
            .then((values: [IGridWidgetList]) => {
                this.widgetsNotApproved = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onGroupShiftUpClick(group: ITypeOfWidgetShortDetail): void {
        this.backendService.typeOfWidgetOrderUp(group.id)
            .then(() => {
                this.onShowPublicGridGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_label'), reason));
                this.onShowPublicGridGroupsByFilter();
            });
    }

    onGroupShiftDownClick(group: ITypeOfWidgetShortDetail): void {
        this.backendService.typeOfWidgetOrderDown(group.id)
            .then(() => {
                this.onShowPublicGridGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_label'), reason));
                this.onShowPublicGridGroupsByFilter();
            });
    }

    onGroupActivateClick(group: ITypeOfWidgetShortDetail): void {
        this.blockUI();
        this.backendService.typeOfWidgetActivate(group.id)
            .then(() => {
                this.onShowPublicGridGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.onShowPublicGridGroupsByFilter();
            });
    }

    onGroupDeactivateClick(group: ITypeOfWidgetShortDetail): void {
        this.blockUI();
        this.backendService.typeOfWidgetDeactivate(group.id)
            .then(() => {
                this.onShowPublicGridGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.onShowPublicGridGroupsByFilter();
            });
    }

    onGroupClick(group: ITypeOfWidget): void {
        if (this.project) {
            this.router.navigate(['/projects', this.currentParamsService.get('project'), 'widgets', group.id]);
        } else {
            this.router.navigate(['/admin/widgets/', group.id]);
        }
    }

    onWidgetForDecisionClick(widget: IGridWidgetShortDetail): void {
        this.router.navigate(['/admin/widget/', widget.id]);
    }

}
