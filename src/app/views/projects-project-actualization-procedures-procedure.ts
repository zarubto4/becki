
import { Component, OnInit, Injector } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { IHardwareReleaseUpdate, IHardwareReleaseUpdateFilter, IProject } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { FilterStatesValues, FilterTypesValues } from './projects-project-hardware-hardware';
import { FormGroup } from '@angular/forms';
@Component({
    selector: 'bk-view-projects-project-actualization-procedures-procedure',
    templateUrl: './projects-project-actualization-procedures-procedure.html',
})
export class ProjectsProjectActualizationProceduresProcedureComponent extends _BaseMainComponent implements OnInit {

    projectId: string;
    project: IProject = null;
    actualization_procedure_id: string;

    procedure: IHardwareReleaseUpdate = null;
    actualizationTaskFilter: IHardwareReleaseUpdateFilter = null;

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
        this.tyrionBackendService.actualizationProcedureGet(this.actualization_procedure_id)
            .then((procedure) => {
                this.procedure = procedure;

                this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
                    if (status.model === 'ActualizationProcedure' && this.procedure.id === status.model_id) {
                        this.refresh();
                    }
                });

                if (!this.actualizationTaskFilter) {
                    this.onFilterActualizationProcedureTask();
                }

                this.unblockUI();

            }).catch(reason => {
                this.fmError(this.translate('label_cant_load_actualization_procedure'));
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


        this.tyrionBackendService.hardwareUpdateTaskGetByFilter(pageNumber, {
            actualization_procedure_ids: [this.actualization_procedure_id],
            hardware_ids: null,
            instance_ids: null,
            update_status: null,
            update_states: <any> state_list,
            type_of_updates: <any>  type_list
        })
            .then((values) => {
                this.actualizationTaskFilter = values;

                this.actualizationTaskFilter.content.forEach((task, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'CProgramUpdatePlan' && task.id === status.model_id) {

                            this.tyrionBackendService.actualizationTaskGet(task.id)
                                .then((value) => {
                                    task.state = value.state;
                                    task.finished = value.finished;
                                })
                                .catch(reason => {
                                    this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                                });

                        }
                    });
                });

                this.unblockUI();
            })
            .catch(reason => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }



}

