/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import {
    IInstanceSnapshot, IInstance, IBProgram,
    IActualizationProcedureTaskList, IHardwareGroupList, IHardwareList, ITerminalConnectionSummary, IBProgramVersion,
    IInterface
} from '../backend/TyrionAPI';
import { BlockoCore } from 'blocko';
import {
    Component, OnInit, Injector, OnDestroy, AfterContentChecked, ViewChild, ElementRef, ViewChildren, QueryList,
    AfterViewInit
} from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { HomerService, HomerDao } from '../services/HomerService';
import { ModalsConfirmModel } from '../modals/confirm';
import { ConsoleLogComponent } from '../components/ConsoleLogComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsInstanceEditDescriptionModel } from '../modals/instance-edit-description';
import { OnlineChangeStatus, TyrionApiBackend } from '../backend/BeckiBackend';
import { InstanceHistoryTimeLineComponent } from '../components/InstanceHistoryTimeLineComponent';
import { ModalsSelectVersionModel } from '../modals/version-select';
import { DraggableEventParams } from '../components/DraggableDirective';


@Component({
    selector: 'bk-view-projects-project-instances-instance',
    templateUrl: './projects-project-instances-instance.html',
})
export class ProjectsProjectInstancesInstanceComponent extends _BaseMainComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit {

    projectId: string;
    instanceId: string;
    routeParamsSubscription: Subscription;

    instance: IInstance = null;
    instanceSnapshot: IInstanceSnapshot = null;
    bProgram: IBProgram = null;
    bProgramVersion: IBProgramVersion = null;
    actualizationTaskFilter: IActualizationProcedureTaskList = null;
    devicesFilter: IHardwareList = null;
    deviceGroupFilter: IHardwareGroupList = null;

    allHw: IHardwareList = null;
    allHwGroups: IHardwareGroupList = null;

    bindings: BlockoCore.BoundInterface[] = [];

    gridUrl: string = '';

    instanceStatus: OnlineChangeStatus;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    currentHistoricInstance: IInstanceSnapshot = null;


    @ViewChildren(BlockoViewComponent)
    blockoViews: QueryList<BlockoViewComponent>;

    editorView: BlockoViewComponent;

    liveView: BlockoViewComponent;

    @ViewChild(InstanceHistoryTimeLineComponent)

    @ViewChild('historyEventsList')
    historyEventsList: ElementRef;

    @ViewChild('historyEvents')
    historyEvents: ElementRef;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    homerDao: HomerDao;

    tab: string = 'overview';

    draggableOptions: JQueryUI.DraggableOptions = {
        helper: 'clone',
        containment: 'document',
        cursor: 'move',
        cursorAt: { left: -5, top: -5 }
    };

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

    ngAfterViewInit() {
        this.blockoViews.changes.subscribe((views: QueryList<BlockoViewComponent>) => {

            this.editorView = views.find((view) => {
                return view.id === 'snapshot_editor';
            });

            if (this.editorView) {

                if (this.instanceSnapshot) {
                    this.editorView.setDataJson(this.instanceSnapshot.program);
                } else if (this.bProgramVersion) {
                    this.editorView.setDataJson(this.bProgramVersion.program);
                }

                setTimeout(() => { // Must load bindings with little delay
                    this.bindings = this.editorView.getBindings();
                }, 100);

                this.editorView.registerInterfaceBoundCallback((iface) => {
                    let index = this.bindings.findIndex((i) => { return i.targetId === iface.targetId; });

                    if (index === -1) {
                        this.bindings.push(iface);
                    } else {
                        this.bindings[index] = iface;
                    }
                });
            }

            this.liveView = views.find((view) => {
                return view.id === 'liveview';
            });
        });

        // Preload hw and groups
        this.tyrionBackendService.boardsGetWithFilterParameters(0, {
            projects: [this.projectId]
        }).then((value) => {
            this.allHw = value;
        }).catch((reason) => {
            this.fmError(this.translate('flash_hardware_load_fail'), reason);
        });

        this.tyrionBackendService.hardwareGroupGetListByFilter(0, {
            project_id: this.projectId
        }).then((value) => {
            this.allHwGroups = value;
        }).catch((reason) => {
            this.fmError(this.translate('flash_hardware_group_load_fail'), reason);
        });
    }

    ngAfterContentChecked() {
        if (this.tab === 'view') {
            if (!this.liveViewLoaded && this.liveView) {
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

                if (this.instance.current_snapshot) {
                    this.instanceSnapshot = this.instance.current_snapshot;
                } else if (this.instance.snapshots.length > 0) {
                    this.instanceSnapshot = this.instance.snapshots[0];
                }

                this.loadBlockoLiveView();
                this.unblockUI();

                this.tyrionBackendService.bProgramGet(this.instance.b_program.id)
                    .then((bp) => {
                        this.bProgram = bp;
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_bprogram_load_fail'), reason);
                    });

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
        switch (action) {
            case 'change_version_instance': {
                this.onCreateNewSnapshot();
                break;
            }
            default: console.warn('TODO action for:', action);
        }
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

    onDragStop(params: DraggableEventParams) {

        switch (params.type) {
            case 'hardware': {

                let controller = this.editorView.getBlockoController();

                controller.bindInterface(params.data);

                break;
            }

            default: this.fmError(this.translate('flash_cant_add_blocko_block'));
        }
    }

    onCreateNewSnapshot() {
        let m: ModalsSelectVersionModel = new ModalsSelectVersionModel(this.bProgram.program_versions);
        this.modalService.showModal(m)
            .then((success) => {
                if (success && m.selectedId) {
                    this.tyrionBackendService.bProgramVersionGet(m.selectedId)
                        .then((bpv) => {
                            this.bProgramVersion = bpv;
                            this.tab = 'editor';
                            if (this.editorView) {
                                this.editorView.setDataJson(this.bProgramVersion.program);
                            }
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                        });
                }
            });
    }

    onEditorPortletClick(action: string) {
        switch (action) {
            case 'save_snapshot': {
                this.onSaveSnapshotClick();
                break;
            }
            case 'change_version': {
                this.onChangeVersion();
                break;
            }
            default: console.warn('undefined for:', action);
        }
    }

    onSaveSnapshotClick = () => {
        if (this.editorView.isDeployable()) {

            let version_id = null;

            if (this.instanceSnapshot) {
                version_id = this.instanceSnapshot.b_program_version.id;
            } else if (this.bProgramVersion) {
                version_id = this.bProgramVersion.id;
            }

            let interfaces: IInterface[] = [];

            this.bindings.forEach((binding) => {
                interfaces.push({
                    target_id: binding.targetId,
                    interface_id: binding.interfaceId,
                    type: binding.targetId.length === 24 ? 'hardware' : 'group'
                });
            });

            this.tyrionBackendService.instanceSnapshotCreate({
                instance_id: this.instanceId,
                version_id: version_id,
                interfaces: interfaces,
                snapshot: this.editorView.getDataJson()
            }).then((snapshot) => {
                this.instanceSnapshot = snapshot;
            }).catch((reason) => {
                this.fmError(this.translate('flash_snapshot_save_fail'), reason);
            });
        } else {
            this.fmError(this.translate('flash_not_deployable'));
        }
    }

    onChangeVersion = () => {
        let m: ModalsSelectVersionModel = new ModalsSelectVersionModel(this.bProgram.program_versions);
        this.modalService.showModal(m)
            .then((success) => {
                if (success && m.selectedId) {
                    this.tyrionBackendService.bProgramVersionGet(m.selectedId)
                        .then((bpv) => {
                            this.bProgramVersion = bpv;
                            this.tab = 'editor';
                            if (this.editorView) {
                                this.editorView.setDataJson(this.bProgramVersion.program);
                                this.bindings = this.editorView.getBindings();
                            }
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                        });
                }
            });
    }

    isBound(targetId: string): boolean {
        return this.bindings.findIndex((binding) => {
            return binding.targetId === targetId;
        }) > -1;
    }

    onGridProgramPublishClick(gridProgram: ITerminalConnectionSummary) {
        this.blockUI();
        this.tyrionBackendService.instanceUpdateGridSettings(this.instanceSnapshot.id, this.instanceSnapshot.settings)
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
                this.tyrionBackendService.instanceSnapshotShutdown(this.instanceSnapshot.id)
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
                    snapshot_id: this.instanceSnapshot.id,
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
            instance_snapshots: [this.instanceSnapshot.id]
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
            instance_snapshots: [this.instanceSnapshot.id]
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
                                       status: ('SUCCESSFULLY_COMPLETE' | 'COMPLETE' | 'COMPLETE_WITH_ERROR' | 'CANCELED' | 'IN_PROGRESS' | 'NOT_START_YET')[] = ['SUCCESSFULLY_COMPLETE', 'COMPLETE' , 'COMPLETE_WITH_ERROR' , 'CANCELED' , 'IN_PROGRESS' , 'NOT_START_YET'],
                                      ): void {
        this.blockUI();

        this.tyrionBackendService.actualizationTaskGetByFilter(pageNumber, {
            actualization_procedure_ids: null,
            instance_snapshot_ids: [this.instanceSnapshot.id],
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
            if (this.liveView && this.instance.current_snapshot) {
                console.info(JSON.stringify(this.instance.current_snapshot.program));
                this.liveView.setDataJson(this.instance.current_snapshot.program);

                if (this.instance.instance_remote_url) {
                    const authToken = TyrionApiBackend.getToken();
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
            const controller = this.liveView.getBlockoController();

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

