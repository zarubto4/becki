/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { IProject, IHardwareUpdateList, IHardwareGroupList, IHardwareUpdate, IHardwareReleaseUpdate, IHardwareReleaseUpdateList } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsUpdateReleaseFirmwareModel } from '../modals/update-release-firmware';
import { FilterStatesValues, FilterTypesValues } from './projects-project-hardware-hardware';
import { FormGroup } from '@angular/forms';


export class FilterUpdateStates {
    public SUCCESSFULLY_COMPLETE: boolean = true;
    public COMPLETE: boolean = true;
    public COMPLETE_WITH_ERROR: boolean = true;
    public CANCELED: boolean = true;
    public IN_PROGRESS: boolean = true;
    public NOT_START_YET: boolean = true;
}

@Component({
    selector: 'bk-view-projects-project-actualization-procedures',
    templateUrl: './projects-project-actualization-procedures.html'
})
export class ProjectsProjectActualizationProceduresComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    project: IProject = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;


    deviceGroup: IHardwareGroupList = null;
    releaseList: IHardwareReleaseUpdateList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    formFilterGroup: FormGroup;

    filterUpdateValues = new FilterUpdateStates();

    tab: string = 'updates';

    constructor(injector: Injector) {
        super(injector);


        // Filter Helper
        this.formFilterGroup = this.formBuilder.group({
            'orderBy': ['DATE', []],
            'order_schema': ['ASC', []],
        });
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

        if (tab === 'updates' && this.releaseList == null) {
            this.onFilterActualizationProcedure();
        }

    }

    onPortletClick(action: string): void {
        if (action === 'new_release') {
            this.onProcedureCreateClick();
        }
    }

    // FILTER ----------------------------------------------------------------------------------------------------------

    onFilterChange(filter: {key: string, value: boolean}) {
        console.info('onFilterChange: Key', filter.key, 'value', filter.value);


        if (this.filterUpdateValues.hasOwnProperty(filter.key)) {
            this.filterUpdateValues[filter.key] = filter.value;
        }

        this.onFilterActualizationProcedure();
    }

    onFilterActualizationProcedure(pageNumber: number = 0) {
        this.blockUI();

        let state_list: string[] = [];
        for (let k in this.filterUpdateValues) {
            if (this.filterUpdateValues.hasOwnProperty(k)) {
                if (this.filterUpdateValues[k] === true) {
                    state_list.push(k);
                }
            }
        }

        this.blockUI();
        this.tyrionBackendService.hardwareReleaseUpdateGetByFilter(pageNumber, {
            project_id: this.projectId,
            states: <any> state_list
        })
            .then((values) => {
                this.releaseList = values;

                this.releaseList.content.forEach((procedure, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'ActualizationProcedure' && procedure.id === status.model_id) {

                            this.tyrionBackendService.hardwareReleaseUpdateGet(procedure.id)
                                .then((value: IHardwareReleaseUpdate) => {
                                    procedure.state = value.state;
                                    procedure.state_complete = value.state_complete;
                                    procedure.finished = value.finished;
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


    // Actualization Procedure -----------------------------------------------------------------------------------------

    onUpdateProcedureCancelClick(procedure: IHardwareReleaseUpdate): void {
        this.tyrionBackendService.hardwareReleaseUpdateCancel(procedure.id)
            .then(() => {
                this.unblockUI();
                this.onFilterActualizationProcedure();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onUpdateProcedureUpdateClick(procedure: IHardwareReleaseUpdate): void {
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

        let model = new ModalsUpdateReleaseFirmwareModel(this.projectId, '', '', this.deviceGroup);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.tyrionBackendService.hardwareReleaseUpdateMake({
                    name: model.name,
                    description: model.description,
                    firmware_type: model.firmwareType,
                    hardware_group_ids: [ model.deviceGroupStringIdSelected ],
                    hardware_ids: [],
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
