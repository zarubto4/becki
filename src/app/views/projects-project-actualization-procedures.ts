/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { IProject, IActualizationProcedureList, IUpdateProcedure, IHardwareGroupList } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsUpdateReleaseFirmwareModel } from '../modals/update-release-firmware';

@Component({
    selector: 'bk-view-projects-project-actualization-procedures',
    templateUrl: './projects-project-actualization-procedures.html',
})
export class ProjectsProjectActualizationProceduresComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    project: IProject = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;


    deviceGroup: IHardwareGroupList = null;
    actualizationFilter: IActualizationProcedureList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    tab: string = 'updates';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.project = project;

                this.onFilterActualizationProcedure();
            });
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

        if (tab === 'updates' && this.actualizationFilter == null) {
            this.onFilterActualizationProcedure();
        }

    }

    onPortletClick(action: string): void {
        if (action === 'new_release') {
            this.onProcedureCreateClick();
        }
    }

    // FILTER ----------------------------------------------------------------------------------------------------------

    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedure(pageNumber: number = 0,
        states: ('SUCCESSFULLY_COMPLETE' | 'COMPLETE' | 'COMPLETE_WITH_ERROR' | 'CANCELED' | 'IN_PROGRESS' | 'NOT_START_YET')[] = ['SUCCESSFULLY_COMPLETE', 'COMPLETE' , 'COMPLETE_WITH_ERROR' , 'CANCELED' , 'IN_PROGRESS' , 'NOT_START_YET'],
        type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = ['MANUALLY_BY_USER_INDIVIDUAL' , 'MANUALLY_BY_USER_BLOCKO_GROUP' , 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' , 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE']): void {
        this.blockUI();
        this.tyrionBackendService.actualizationProcedureGetByFilter(pageNumber, {
            project_id: this.projectId,
            update_states: states,
            type_of_updates: type_of_updates
        })
            .then((values) => {
                this.actualizationFilter = values;

                this.actualizationFilter.content.forEach((procedure, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'ActualizationProcedure' && procedure.id === status.model_id) {

                            this.tyrionBackendService.actualizationProcedureGet(procedure.id)
                                .then((value) => {
                                    procedure.state = value.state;
                                    procedure.procedure_size_complete = value.procedure_size_complete;
                                    procedure.date_of_finish = value.date_of_finish;
                                })
                                .catch((reason) => {
                                    this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                                });

                        }
                    });
                });

                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }
    /* tslint:disable:max-line-length ter-indent*/

    // Actualization Procedure -----------------------------------------------------------------------------------------

    onUpdateProcedureCancelClick(procedure: IUpdateProcedure): void {
        this.tyrionBackendService.actualizationProcedureCancel(procedure.id)
            .then(() => {
                this.unblockUI();
                this.onFilterActualizationProcedure();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onUpdateProcedureUpdateClick(procedure: IUpdateProcedure): void {
        // TODO
    }


    onProcedureCreateClick() {

        // Get all deviceGroup - Recursion
        if (this.deviceGroup == null) {
            this.blockUI();
            this.tyrionBackendService.hardwareGroupGetListByFilter(0, {
                    project_id: this.projectId
                })
                .then((values) => {
                    this.unblockUI();
                    this.deviceGroup = values;
                    this.onProcedureCreateClick();
                    return;
                })
                .catch((reason) => {
                    this.unblockUI();
                    this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                });
            return;
        }

        let model = new ModalsUpdateReleaseFirmwareModel(this.projectId, this.deviceGroup);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.tyrionBackendService.actualizationProcedureMake({
                    firmware_type: model.firmwareType,
                    hardware_group_id: model.deviceGroupStringIdSelected,
                    project_id: this.projectId,
                    time: model.time,
                    hardware_type_settings: model.groups,
                    timeoffset: model.timeZoneOffset
                })
                    .then(() => {
                        this.unblockUI();
                        this.onFilterActualizationProcedure();
                    })
                    .catch(reason => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_grid_group_add_fail', reason)));
                    });
            }
        });

    }

    onDrobDownEmiter(action: string, object: any): void {
        if (action === 'edit_procedure') {
            this.onUpdateProcedureUpdateClick(object);
        }

        if (action === 'remove_procedure') {
            this.onUpdateProcedureCancelClick(object);
        }
    }


}
