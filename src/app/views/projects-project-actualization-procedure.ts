
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import {
    IProject, IBProgramShortDetail, IActualizationProcedure,
    IActualizationProcedureTaskList
} from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-actualization-procedure',
    templateUrl: './projects-project-actualization-procedure.html',
})
export class ProjectsProjectActualizationProcedureComponent extends BaseMainComponent implements OnInit, OnDestroy {

    actualization_procedure_id: string;
    projectId: string;
    procedure: IActualizationProcedure = null;
    actualizationTaskFilter: IActualizationProcedureTaskList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

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

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    refresh(): void {
        this.blockUI();
        this.backendService.actualizationProcedureGet(this.actualization_procedure_id)
            .then((procedure) => {
                this.procedure = procedure;

                this.backendService.objectUpdateTyrionEcho.subscribe(status => {
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
                                       states: ('successful_complete' | 'complete' | 'complete_with_error' | 'canceled' | 'in_progress' | 'not_start_yet')[] = ['successful_complete', 'complete' , 'complete_with_error' , 'canceled' , 'in_progress' , 'not_start_yet'],
                                       type_of_updates: ('MANUALLY_BY_USER_INDIVIDUAL' | 'MANUALLY_BY_USER_BLOCKO_GROUP' | 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' | 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' | 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE')[] = ['MANUALLY_BY_USER_INDIVIDUAL' , 'MANUALLY_BY_USER_BLOCKO_GROUP' , 'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME' , 'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE' , 'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE']): void {
        this.blockUI();

        this.backendService.actualizationTaskGetByFilter(pageNumber, {
            actualization_procedure_ids: [this.actualization_procedure_id],
            board_ids: null,
            instance_ids: null,
            update_status: states,
            update_states: [],
            type_of_updates: type_of_updates
        })
            .then((values) => {
                this.actualizationTaskFilter = values;

                this.actualizationTaskFilter.content.forEach((task, index, obj) => {
                    this.backendService.objectUpdateTyrionEcho.subscribe((status) => {
                        if (status.model === 'CProgramUpdatePlan' && task.id === status.model_id) {

                            this.backendService.actualizationTaskGet(task.id)
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

    selectedFilterPageActualizationProcedureTask(event: { index: number }) {
        this.onFilterActualizationProcedureTask(event.index);
    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }


}

