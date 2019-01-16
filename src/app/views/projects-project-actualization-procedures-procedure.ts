
import { Component, OnInit, Injector } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import { IHardwareReleaseUpdate, IHardwareReleaseUpdateFilter, IHardwareReleaseUpdateList, IHardwareUpdateList, IProject } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { FilterStatesValues, FilterTypesValues } from './projects-project-hardware-hardware';
import { FormGroup } from '@angular/forms';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-projects-project-actualization-procedures-procedure',
    templateUrl: './projects-project-actualization-procedures-procedure.html',
})
export class ProjectsProjectActualizationProceduresProcedureComponent extends _BaseMainComponent implements OnInit {

    projectId: string;
    project: IProject = null;
    actualization_procedure_id: string;

    procedure: IHardwareReleaseUpdate = null;
    hardwareUpdateList: IHardwareUpdateList = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    filterStatesValues = new FilterStatesValues();
    filterTypesValues = new FilterTypesValues();

    formFilterGroup: FormGroup;


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
            this.actualization_procedure_id = params['procedure'];
            this.projectId = params['project'];
            this.refresh();
        });
    }

    refresh(): void {
        this.blockUI();
        this.tyrionBackendService.hardwareReleaseUpdateGet(this.actualization_procedure_id)
            .then((procedure) => {
                this.procedure = procedure;

                this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
                    if (status.model === 'ActualizationProcedure' && this.procedure.id === status.model_id) {
                        this.refresh();
                    }
                });

                if (!this.hardwareUpdateList) {
                    this.onFilterActualizationProcedureTask();
                }

                this.unblockUI();

            }).catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }



    onFilterChange(filter: {key: string, value: boolean}) {
        console.info('onFilterChange: Key', filter.key, 'value', filter.value);


        if (this.filterStatesValues.hasOwnProperty(filter.key)) {
            this.filterStatesValues[filter.key] = filter.value;
        }

        if (this.filterTypesValues.hasOwnProperty(filter.key)) {
            this.filterTypesValues[filter.key] = filter.value;
        }

        this.onFilterActualizationProcedureTask();
    }

    onFilterActualizationProcedureTask(pageNumber: number = 0) {
        this.blockUI();

        let state_list: string[] = [];
        for (let k in this.filterStatesValues) {
            if (this.filterStatesValues.hasOwnProperty(k)) {
                if (this.filterStatesValues[k] === true) {
                    state_list.push(k);
                }
            }
        }


        let type_list: string[] = [];
        Object.keys(this.filterTypesValues).forEach((propKey) => {

            if (this.filterTypesValues[propKey].value === true) {
                type_list.push(propKey);
            }
        });


        this.tyrionBackendService.hardwareUpdateGetByFilter(pageNumber, {
            release_update_ids: [this.actualization_procedure_id],
            hardware_ids: null,
            instance_ids: null,
            update_states: <any> state_list,
            type_of_updates: <any>  type_list
        })
            .then((values: IHardwareUpdateList) => {
                this.hardwareUpdateList = values;

                this.hardwareUpdateList.content.forEach((task, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'CProgramUpdatePlan' && task.id === status.model_id) {

                            this.tyrionBackendService.hardwareReleaseUpdateGet(task.id)
                                .then((value) => {
                                    task.state = value.state;
                                    task.finished = value.finished;
                                })
                                .catch((reason: IError) => {
                                    this.fmError(reason);
                                });

                        }
                    });
                });

                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.fmError(reason);
            });
    }
}

