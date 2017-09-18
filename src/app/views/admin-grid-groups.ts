///<reference path="BaseMainComponent.ts"/>


import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    ICProgramVersionShortDetail, IGridWidgetList, IGridWidgetShortDetail, ITypeOfWidgetList,
    ITypeOfWidgetShortDetail
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsWidgetsTypePropertiesModel } from '../modals/widgets-type-properties';

@Component({
    selector: 'bk-view-admin-grid-groups',
    templateUrl: './admin-grid-groups.html'
})
export class CommunityGridGroupsComponent extends BaseMainComponent implements OnInit {

    // Groups - All from Filter
    groups: ITypeOfWidgetList = null;
    widgetsNotApproved: IGridWidgetList = null;

    tab: string = 'public_groups';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {

        // Find first 25 objects
        // There is place for make it faster - load only if user click on tab
        this.onShowPublicGridGroupsByFilter();
        this.onShowProgramForDecisionsByFilter();
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onShowPublicGridGroupsByFilter(page: number = 0): void {
        Promise.all<any>([this.backendService.typeOfWidgetGetByFilter(page, {
            public_programs: true,       // For public its required
        })
        ])
            .then((values: [ITypeOfWidgetList]) => {
                this.groups = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowProgramForDecisionsByFilter(page: number = 0): void {
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

    onGroupRemoveClick(group: ITypeOfWidgetShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfWidgetDelete(group.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        this.onShowPublicGridGroupsByFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code', reason)));
                    });
            }
        });
    }

    onGroupEditClick(group: ITypeOfWidgetShortDetail): void {
        let model = new ModalsWidgetsTypePropertiesModel(group.name, group.description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfWidgetEdit(group.id, { // TODO [permission]: TypeOfWidget_edit_permission
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_library_edit_success')));
                        this.onShowPublicGridGroupsByFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_library_edit_fail', reason)));
                    });
            }
        });
    }

    onGroupShiftUpClick(group: ITypeOfWidgetShortDetail): void {
        this.backendService.typeOfWidgetOrderUp(group.id)
            .then(() => {
                this.onShowPublicGridGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_label', reason)));
                this.refresh();
            });
    }

    onGroupShiftDownClick(group: ITypeOfWidgetShortDetail): void {
        this.backendService.typeOfWidgetOrderDown(group.id)
            .then(() => {
                this.onShowPublicGridGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_label', reason)));
                this.refresh();
            });
    }

    onGroupActivateClick(group: ITypeOfWidgetShortDetail): void {
        this.blockUI();
        this.backendService.typeOfWidgetActivate(group.id)
            .then(() => {
                this.onShowPublicGridGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error', reason)));
                this.refresh();
            });
    }

    onGroupDeactivateClick(group: ITypeOfWidgetShortDetail): void {
        this.blockUI();
        this.backendService.typeOfWidgetDeactivate(group.id)
            .then(() => {
                this.onShowPublicGridGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error', reason)));
                this.refresh();
            });
    }

    onGroupCreateClick(): void {
        let model = new ModalsWidgetsTypePropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfWidgetCreate({ // TODO [permission]: TypeOfWidget_create_permission
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.onShowPublicGridGroupsByFilter();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onGroupClick(group: ITypeOfWidgetShortDetail): void {
        this.router.navigate(['/admin/grid-group/', group.id]);
    }

    onWidgetClick(widget: IGridWidgetShortDetail): void {
        this.router.navigate(['/admin/grid/', widget.id]);
    }

}




