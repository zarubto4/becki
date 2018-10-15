
import { Component, OnInit, Injector } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { IActualizationProcedureTaskList, IProject, IUpdateProcedure } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
@Component({
    selector: 'bk-view-projects-project-actualization-procedures-procedure',
    templateUrl: './projects-project-actualization-procedures-procedure.html',
})
export class ProjectsProjectActualizationProceduresProcedureComponent extends _BaseMainComponent implements OnInit {

    projectId: string;
    project: IProject = null;
    actualization_procedure_id: string;

    procedure: IUpdateProcedure = null;
    actualizationTaskFilter: IActualizationProcedureTaskList = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
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

            }).catch((reason) => {
                this.fmError(this.translate('label_cant_load_actualization_procedure'));
                this.unblockUI();
            });
    }


    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedureTask(pageNumber: number = 0,
                                       states: ('SUCCESSFULLY_COMPLETE' | 'COMPLETE' | 'COMPLETE_WITH_ERROR' | 'CANCELED' | 'IN_PROGRESS' | 'NOT_START_YET')[] = ['SUCCESSFULLY_COMPLETE', 'COMPLETE' , 'COMPLETE_WITH_ERROR' , 'CANCELED' , 'IN_PROGRESS' , 'NOT_START_YET'],
                                       type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_RELEASE_MANAGER' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = ['MANUALLY_RELEASE_MANAGER', 'MANUALLY_BY_USER_BLOCKO_GROUP' , 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' , 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' , 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE']): void {
        this.blockUI();

        this.tyrionBackendService.actualizationTaskGetByFilter(pageNumber, {
            actualization_procedure_ids: [this.actualization_procedure_id],
            hardware_ids: null,
            instance_ids: null,
            update_status: states,
            update_states: [],
            type_of_updates: type_of_updates
        })
            .then((values) => {
                this.actualizationTaskFilter = values;

                this.actualizationTaskFilter.content.forEach((task, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'CProgramUpdatePlan' && task.id === status.model_id) {

                            this.tyrionBackendService.actualizationTaskGet(task.id)
                                .then((value) => {
                                    task.state = value.state;
                                    task.date_of_finish = value.date_of_finish;
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



}

