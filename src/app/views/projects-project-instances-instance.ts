/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import {
    IInstanceSnapshot, IInstance, IBProgram,
    IActualizationProcedureTaskList, IHardwareGroupList, IHardwareList, ITerminalConnectionSummary
} from '../backend/TyrionAPI';
import { BlockoCore } from 'blocko';
import { Component, OnInit, Injector, OnDestroy, AfterContentChecked, ViewChild, ElementRef } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { NullSafe, NullSafeDefault } from '../helpers/NullSafe';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { HomerService, HomerDao } from '../services/HomerService';
import { ModalsConfirmModel } from '../modals/confirm';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsInstanceEditDescriptionModel } from '../modals/instance-edit-description';
import { ModalsBlockoVersionSelectModel } from '../modals/blocko-version-select';
import { OnlineChangeStatus } from '../backend/BeckiBackend';
import { InstanceHistoryTimeLineComponent } from '../components/InstanceHistoryTimeLineComponent';


@Component({
    selector: 'bk-view-projects-project-instances-instance',
    templateUrl: './projects-project-instances-instance.html',
})
export class ProjectsProjectInstancesInstanceComponent extends _BaseMainComponent implements OnInit, OnDestroy, AfterContentChecked {

    projectId: string;
    instanceId: string;
    routeParamsSubscription: Subscription;

    instance: IInstance = null;
    actualizationTaskFilter: IActualizationProcedureTaskList = null;
    devicesFilter: IHardwareList = null;
    deviceGroupFilter: IHardwareGroupList = null;

    gridUrl: string = '';

    instanceStatus: OnlineChangeStatus;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    currentHistoricInstance: IInstanceSnapshot = null;


    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    @ViewChild(InstanceHistoryTimeLineComponent)

    @ViewChild('historyEventsList')
    historyEventsList: ElementRef;

    @ViewChild('historyEvents')
    historyEvents: ElementRef;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    homerDao: HomerDao;

    tab: string = 'overview';

    private homerService: HomerService = null;
    private liveViewLoaded: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.homerService = injector.get(HomerService);

        this.tyrionBackendService.onlineStatus.subscribe((status) => {
            if (status.model === 'HomerInstance' && this.instanceId === status.model_id) {
                this.instance.online_state = status.online_state;
            }
        });

    };

    onInstanceEditClick() {
        let model = new ModalsInstanceEditDescriptionModel(this.instance.id, this.instance.name, this.instance.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceEdit(this.instance.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_instance_edit_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_instance_edit_fail'), reason));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    ngOnInit(): void {

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.instanceId = params['instance'];
            this.refresh();
        });
    }

    ngAfterContentChecked() {
        if (this.tab === 'view') {
            if (!this.liveViewLoaded && this.blockoView) {
                this.loadBlockoLiveView();
                this.liveViewLoaded = true;
            }
        } else {
            if (this.liveViewLoaded) {
                this.liveViewLoaded = false;
                if (this.homerDao) {
                    this.homerDao.close();
                    this.homerDao = null;
                }
            }
        }
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();

        if (this.homerDao) {
            this.homerDao.close();
            this.homerDao = null;
        }
    }

    refresh(): void {
        this.blockUI();
        // this.instance.actual_instance.procedures.forEach(proc => proc.updates.forEach(update => update.));
        this.tyrionBackendService.instanceGet(this.instanceId)
            .then((instance) => {

                this.instance = instance;
                this.loadBlockoLiveView();
                this.unblockUI();

                this.tyrionBackendService.onlineStatus.subscribe((status) => {
                    if (status.model === 'HomerServer' && this.instance.server.id === status.model_id) {
                        this.instance.server.online_state = status.online_state;
                    }
                });
            })
            .catch(reason => {
                this.fmError(`Instances ${this.projectId} cannot be loaded.`, reason);
                this.unblockUI();
            });
    }

    onPortletClick(action: string): void {

    }

    onToggleTab(tab: string) {
        this.tab = tab;

        if (tab === 'update' && !this.actualizationTaskFilter) {
            this.onFilterActualizationProcedureTask();
        }

        if (tab === 'hardware' && !this.devicesFilter) {
            this.onFilterHardware();
        }

        if (tab === 'hardware' && !this.deviceGroupFilter) {
            this.onFilterHardwareGroup();
        }

    }

    onGridProgramPublishClick(gridProgram: ITerminalConnectionSummary) {
        this.blockUI();
        this.tyrionBackendService.instanceUpdateGridSettings(this.instance.current_snapshot.id, this.instance.current_snapshot.settings)
            .then(() => {
                this.refresh();
            })
            .catch((reason) => {
                this.fmError(this.translate('label_cannot_change_version', reason));
                this.unblockUI();
            });
    }

    selectedHistoryItem(event: { index: number, item: IInstanceSnapshot }) {
        this.currentHistoricInstance = event.item;
    }

    onEditClick() {
        // TODO
    }

    onProcedureClick() {
        // TODO
    }

    onInstanceShutdownClick() { // start (True) for Start or (False) for Shutdown
        let model = new ModalsConfirmModel(this.translate('label_shut_down_instance_modal'), this.translate('label_shut_down_instance_modal_comment'));
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceSnapshotShutdown(this.instance.current_snapshot.id)
                    .then(() => {
                        this.unblockUI();
                        this.refresh();
                    })
                    .catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_upload_error', err));
                    });
            }
        });
    }

    onInstanceStartClick() {
        let model = new ModalsConfirmModel(this.translate('label_upload_instance_modal'), this.translate('label_upload_instance_modal_comment'));
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceSnapshotDeploy({
                    snapshot_id: this.instance.id,
                    upload_time: 0
                })
                    .then(() => {
                        this.unblockUI();
                        this.refresh();
                    })
                    .catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_upload_error', err));
                    });
            }
        });
    }


    onFilterHardwareGroup(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.hardwareGroupGetListByFilter(pageNumber, {
            project_id : this.projectId,
            instance_snapshots: [this.instance.current_snapshot.id]
        })
            .then((values) => {
                this.deviceGroupFilter = values;
                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onFilterHardware(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.boardsGetWithFilterParameters(pageNumber, {
            projects: [this.projectId],
            instance_snapshots: [this.instance.current_snapshot.id]
        })
            .then((values) => {
                this.devicesFilter = values;

                this.devicesFilter.content.forEach((device, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'Board' && device.id === status.model_id) {
                            device.online_state = status.online_state;
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


    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedureTask(pageNumber: number = 0,
                                       status: ('successful_complete' | 'complete' | 'complete_with_error' | 'canceled' | 'in_progress' | 'not_start_yet')[] = ['successful_complete', 'complete' , 'complete_with_error' , 'canceled' , 'in_progress' , 'not_start_yet'],
                                      ): void {
        this.blockUI();

        this.tyrionBackendService.actualizationTaskGetByFilter(pageNumber, {
            actualization_procedure_ids: null,
            instance_snapshot_ids: [this.instance.current_snapshot.id],
            hardware_ids: null,
            instance_ids: null,
            update_status: status,
            update_states: []
        })
            .then((values) => {

                this.actualizationTaskFilter = values;
                this.unblockUI();

                this.actualizationTaskFilter.content.forEach((task, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((online_status) => {
                        if (online_status.model === 'CProgramUpdatePlan' && task.id === online_status.model_id) {

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

            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }
    /* tslint:disable:max-line-length ter-indent*/

    loadBlockoLiveView() {
        this.zone.runOutsideAngular(() => {
            if (this.blockoView && this.instance.current_snapshot) {
                console.info(JSON.stringify(this.instance.current_snapshot.program));
                this.blockoView.setDataJson(this.instance.current_snapshot.program);

                if (this.instance.instance_remote_url) {
                    const authToken = this.tyrionBackendService.getToken();
                    this.homerDao = this.homerService.connectToHomer(this.instance.instance_remote_url, authToken);

                    this.homerDao.onOpenCallback = (e) => {
                        this.homerDao.sendMessage({
                            message_type: 'get_values'
                        });

                        this.homerDao.sendMessage({
                            message_type: 'get_logs'
                        });
                    };

                    this.homerDao.onMessageCallback = (m: any) => this.homerMessageReceived(m);
                }
            }
        });
    }

    homerMessageReceived(m: any) {
        this.zone.runOutsideAngular(() => {
            const controller = this.blockoView.getBlockoController();

            if (m.message_type === 'new_input_connector_value') {
                controller.setInputConnectorValue(m.block_id, m.interface_name, typeof m.value === 'object' ? new BlockoCore.Message(m.value) : m.value);
                return;
            }

            if (m.message_type === 'new_output_connector_value') {
                controller.setOutputConnectorValue(m.block_id, m.interface_name, typeof m.value === 'object' ? new BlockoCore.Message(m.value) : m.value);
                return;
            }

            if (m.message_type === 'new_external_input_connector_value') {
                // controller.setInputConnectorValue(m.block_id, m.interface_name, m.value);
                return;
            }

            if (m.message_type === 'new_external_output_connector_value') {
                // controller.setOutputConnectorValue(m.block_id, m.interface_name, m.value);
                return;
            }

            if (m.message_type === 'new_console_event') {
                this.zone.run(() => {
                    this.consoleLog.add(m.console_message_type, m.console_message, 'Block ' + m.block_id, new Date(m.console_message_time).toLocaleString());
                });
                return;
            }

            if (m.message_type === 'new_error_event') {
                controller.setError(m.block_id, true);
                this.zone.run(() => {
                    this.consoleLog.add('error', m.error_message, 'Block ' + m.block_id, new Date(m.error_time).toLocaleString());
                });
                return;
            }

            if (m.message_type === 'get_values') {

                for (let block in m.connector) {
                    if (!m.connector.hasOwnProperty(block)) {
                        continue;
                    }

                    for (let input in m.connector[block].inputs) {
                        if (!m.connector[block].inputs.hasOwnProperty(input)) {
                            continue;
                        }
                        controller.setInputConnectorValue(block, input, m.connector[block].inputs[input]);
                    }

                    for (let output in m.connector[block].outputs) {
                        if (!m.connector[block].outputs.hasOwnProperty(output)) {
                            continue;
                        }
                        controller.setOutputConnectorValue(block, output, m.connector[block].outputs[output]);
                    }

                    /* tslint:disable */

                    console.log("homerMessageReceived:: .message_type === 'getValues', for:   ", m);

                    /* tslint:enable */

                    for (let targetType in m.externalConnector) {

                        if (!m.externalConnector.hasOwnProperty(targetType)) {
                            continue;
                        }

                        /* tslint:disable */

                        console.log("homerMessageReceived:: .message_type === 'getValues', for:   ", targetType);

                        /* tslint:enable */

                        for (let targetId in m.externalConnector[targetType]) {
                            if (!m.externalConnector[targetType].hasOwnProperty(targetId)) {
                                continue;
                            }


                            /* tslint:disable */

                            console.log("homerMessageReceived:: m.message_type =  ", m.message_type);

                            /* tslint:enable */

                            for (let input in m.externalConnector[targetType][targetId].inputs) {
                                if (m.externalConnector[targetType][targetId].inputs.hasOwnProperty(input)) {
                                    continue;
                                }
                                // controller.set
                                // controller.setInputExternalConnectorValue(targetType, targetId, input, m.externalConnector[targetType][targetId].inputs[input]);

                                /* tslint:disable */
                                console.log("homerMessageReceived:: setInputExternalConnectorValue, for: ", targetType, targetId, input, m.externalConnector[targetType][targetId].inputs[input]);
                                /* tslint:enable */
                            }

                            for (let output in m.externalConnector[targetType][targetId].outputs) {
                                if (!m.externalConnector[targetType][targetId].outputs.hasOwnProperty(output)) {
                                    continue;
                                }
                                /* tslint:disable */
                                console.log("homerMessageReceived:: setOutputExternalConnectorValue, for: ", targetType, targetId, output, m.externalConnector[targetType][targetId].outputs[output]);
                                /* tslint:enable */
                                // controller.setOutputExternalConnectorValue(targetType, targetId, output, m.externalConnector[targetType][targetId].outputs[output]);
                            }
                        }
                    }
                }
            }

            if (m.message_type === 'get_logs') {
                this.zone.run(() => {
                    if (m.logs) {
                        for (let i = 0; i < m.logs.length; i++) {
                            const log = m.logs[i];
                            this.consoleLog.add(log.type, log.message, 'Block ' + log.block_id, new Date(log.time).toLocaleString());
                        }
                    }

                    if (m.errors) {
                        for (let i in m.errors) {
                            if (m.errors.hasOwnProperty(i)) {
                                controller.setError(i, true);
                            }
                        }
                    }
                });
            }
        });
    }
}

