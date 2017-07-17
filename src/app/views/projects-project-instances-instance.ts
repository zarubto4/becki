
/**
 * Created by davidhradek on 01.12.16.
 */

/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { IHomerInstanceRecord, IInstanceGridAppSettings } from './../backend/TyrionAPI';
import { Component, OnInit, Injector, OnDestroy, AfterContentChecked, ViewChild, ElementRef } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IBProgram, IHomerInstance, IModelMProgramInstanceParameter } from '../backend/TyrionAPI';
import { NullSafe, NullSafeDefault } from '../helpers/NullSafe';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { HomerService, HomerDao } from '../services/HomerService';
import { ModalsConfirmModel } from '../modals/confirm';
import { InstanceHistoryTimelineComponent } from '../components/InstanceHistoryTimelineComponent';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { QRCodeComponent } from '../components/QRCodeComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsInstanceEditDescriptionModel } from '../modals/instance-edit-description';
import { ModalsBlockoVersionSelectModel } from '../modals/blocko-version-select';
import { ProjectsProjectBlockoBlockoComponent } from './projects-project-blocko-blocko';

@Component({
    selector: 'bk-view-projects-project-instances-instance',
    templateUrl: './projects-project-instances-instance.html',
})
export class ProjectsProjectInstancesInstanceComponent extends BaseMainComponent implements OnInit, OnDestroy, AfterContentChecked {

    id: string;
    instanceId: string;
    routeParamsSubscription: Subscription;

    instance: IHomerInstance = null;

    gridUrl: string = '';

    currentHistoricInstance: IHomerInstanceRecord;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    @ViewChild(InstanceHistoryTimelineComponent)

    @ViewChild('historyEventsList')
    historyEventsList: ElementRef;

    @ViewChild('historyEvents')
    historyEvents: ElementRef;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    homerDao: HomerDao;

    instanceTab: string = 'overview';

    private homerService: HomerService = null;
    private liveViewLoaded: boolean = false;

    constructor(injector: Injector) {
        super(injector);

        this.homerService = injector.get(HomerService);
    };

    onInstanceEditClick() {
        let model = new ModalsInstanceEditDescriptionModel(this.instance.id, this.instance.name, this.instance.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editInstance(this.instance.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_instance_edit_success')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_instance_edit_fail', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.instanceId = params['instance'];
            this.refresh();
        });

        /** Supported by Tyrion
            if (location.hostname.indexOf('portal.stage.') === 0) {
                this.gridUrl = 'https://app.stage.byzance.cz/program/';
            } else {
                this.gridUrl = 'http://localhost:8888/program/';
            }
        */
    }

    ngAfterContentChecked() {
        if (this.instanceTab === 'view') {
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

        if (this.instanceTab !== 'history') {
            this.currentHistoricInstance = null;
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
        this.backendService.getInstance(this.instanceId) // TODO [permission]: "B_program.update_permission"
            .then((instance) => {
                this.instance = instance;
                this.loadBlockoLiveView();
                this.currentHistoricInstance = this.instance.instance_history.pop();
                this.unblockUI();

                if (!this.instance.actual_instance) {
                    this.router.navigate(['/', 'projects', this.id, 'instances', this.instanceId]);
                }
            })
            .catch(reason => {
                this.fmError(`Instances ${this.id} cannot be loaded.`, reason);
                this.router.navigate(['/', 'projects', this.id, 'instances', this.instanceId]);
                this.unblockUI();
            });
    }

    onToggleinstanceTab(tab: string) {
        this.instanceTab = tab;
    }

    onBlockoProgramClick(bProgramId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocko', bProgramId]);
    }

    onBlockoProgramVersionClick(bProgramId: string, bProgramVersionId: string) {
        this.router.navigate(['/projects', this.id, 'blocko', bProgramId, bProgramVersionId]);
    }

    onGridProgramPublishClick(gridProgram: IModelMProgramInstanceParameter) {
        this.blockUI();
        this.backendService.putInstanceApp({
            m_program_parameter_id: gridProgram.id,
            snapshot_settings: gridProgram.snapshot_settings === 'absolutely_public' ? 'only_for_project_members' : 'absolutely_public'
        })
            .then(() => {
                this.refresh();
            })
            .catch((reason) => {
                this.fmError(this.translate('label_cannot_change_version', reason));
                this.unblockUI();
            });
    }

    connectionsHwCount() {
        let yodaCount = NullSafeDefault(() => this.instance.actual_instance.hardware_group, []).length;
        let padawansCount = 0;
        NullSafeDefault(() => this.instance.actual_instance.hardware_group, []).forEach((sh) => {
            padawansCount += sh.device_board_pairs.length;
        });
        return yodaCount + ' + ' + padawansCount;

    }

    onChangeVersionClick(): void {
        /**if (!this. || !this.blockoProgramVersions.length) {
            this.fmWarning('Must create some version first.');  // TODO domimplementovat
            return;
        }*/
        if (this.instance.instance_status) {
            let mConfirm = new ModalsConfirmModel(this.translate('label_modal_change_instance_version'), this.translate('label_modal_change_running_instance_version'));
            this.modalService.showModal(mConfirm)
                .then((success) => {
                    if (success) {
                        this.changeVersionAction();
                    }
                });
        } else {
            this.changeVersionAction();
        }
    }

    changeVersionAction() {

        this.backendService.getBProgram(this.instance.actual_instance.b_program_id).then((blocko) => {
            let m = new ModalsBlockoVersionSelectModel(blocko.program_versions, NullSafe(() => this.instance.actual_instance.b_program_version_id));
            this.modalService.showModal(m)
                .then((success) => {
                    if (success) {
                        this.blockUI();
                        this.backendService.cloudInstanceUpload(m.programVersion, {}) // TODO [permission]: B_program.update_permission
                            .then(() => {
                                this.storageService.projectRefresh(this.id);
                                this.refresh();
                            })
                            .catch((err) => {
                                this.unblockUI();
                                this.fmError(this.translate('label_cannot_change_version', err));
                            });
                    }
                });
        });
    }

    selectedHistoryItem(event: { index: number, item: IHomerInstanceRecord }) {
        this.currentHistoricInstance = event.item;
    }

    connectionsGridCount() {
        return NullSafeDefault(() => this.instance.actual_instance.m_project_snapshot, []).length;
    }

    onEditClick() {
        // TODO
    }

    onProcedureClick() {
        // TODO
    }


    onInstanceStartOrShutdownClick(start: boolean) { // start (True) for Start or (False) for Shutdown
        let m = null;

        if (start) {
            m = new ModalsConfirmModel(this.translate('label_modal_shutdown_instance'), this.translate('label_modal_confirm_shutdown_instance'));
        } else {
            m = new ModalsConfirmModel(this.translate('label_modal_shutdown_instance'), this.translate('label_modal_confirm_run_latest_version'));
        }

        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.startOrShutDownInstance(this.instanceId)
                        .then(() => {
                            this.storageService.projectRefresh(this.id);
                            this.unblockUI();
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError(this.translate('label_cannot_execute', err));
                        });
                }
            });
    }

    onBlockoClick() {

    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }


    onGridProjectClick(projectId: string) {
        this.router.navigate(['projects', this.id, 'grid', projectId]);
    }

    onGridProgramClick(projectId: string, programId: string) {
        this.router.navigate(['projects', this.id, 'grid', projectId, programId]);
    }

    onGridProgramVersionClick(projectId: string, programId: string, versionId: string) {
        this.router.navigate(['projects', this.id, 'grid', projectId, programId, { version: versionId }]);
    }

    onHardwareClick(hardwareId: string) {
        this.router.navigate(['projects', this.id, 'hardware', hardwareId]);
    }

    onCProgramClick(programId: string) {
        this.router.navigate(['projects', this.id, 'code', programId]);
    }

    onCProgramVersionClick(programId: string, versionId: string) {
        this.router.navigate(['projects', this.id, 'code', programId, { version: versionId }]);
    }

    loadBlockoLiveView() {
        this.zone.runOutsideAngular(() => {
            if (this.blockoView && this.instance.actual_instance && this.instance.actual_instance.b_program_version_id) {
                this.backendService.getBProgramVersion(this.instance.actual_instance.b_program_version_id) // TODO [permission]: B_program.read_permission
                    .then((programVersionFull) => {
                        const selectedProgramVersion = programVersionFull;
                        this.blockoView.setDataJson(selectedProgramVersion.program);

                        if (this.instance.instance_remote_url) {
                            const authToken = this.backendService.getToken();
                            this.homerDao = this.homerService.connectToHomer(this.instance.instance_remote_url, authToken);

                            this.homerDao.onOpenCallback = (e) => {
                                this.homerDao.sendMessage({
                                    message_type: 'getValues'
                                });

                                this.homerDao.sendMessage({
                                    message_type: 'getLogs'
                                });
                            };

                            this.homerDao.onMessageCallback = (m: any) => this.homerMessageReceived(m);
                        }
                    })
                    .catch((err) => {
                        this.zone.run(() => {
                            this.fmError(this.translate('flash_cant_load_verion', this.instance.actual_instance.b_program_version_name, err));
                        });
                    });
            }
        });
    }

    homerMessageReceived(m: any) {
        this.zone.runOutsideAngular(() => {
            const controller = this.blockoView.getBlockoController();

            if (m.message_type === 'newInputConnectorValue') {
                controller.setInputConnectorValue(m.blockId, m.connectorName, m.value);
            }

            if (m.message_type === 'newOutputConnectorValue') {
                controller.setOutputConnectorValue(m.blockId, m.connectorName, m.value);
            }

            if (m.message_type === 'newExternalInputConnectorValue') {
                controller.setInputExternalConnectorValue(m.targetType, m.targetId, m.connectorName, m.value);
            }

            if (m.message_type === 'newExternalOutputConnectorValue') {
                controller.setOutputExternalConnectorValue(m.targetType, m.targetId, m.connectorName, m.value);
            }

            if (m.message_type === 'newConsoleEvent') {
                this.zone.run(() => {
                    this.consoleLog.add(m.consoleMessageType, m.consoleMessage, 'Block ' + m.blockId, new Date(m.consoleMessageTime).toLocaleString());
                });
            }

            if (m.message_type === 'newErrorEvent') {
                controller.setError(m.blockId, true);
                this.zone.run(() => {
                    this.consoleLog.add('error', m.errorMessage, 'Block ' + m.blockId, new Date(m.errorTime).toLocaleString());
                });
            }

            if (m.message_type === 'getValues') {
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
                }

                for (let targetType in m.externalConnector) {

                    if (!m.externalConnector.hasOwnProperty(targetType)) {
                        continue;
                    }

                    for (let targetId in m.externalConnector[targetType]) {
                        if (!m.externalConnector[targetType].hasOwnProperty(targetId)) {
                            continue;
                        }

                        for (let input in m.externalConnector[targetType][targetId].inputs) {
                            if (m.externalConnector[targetType][targetId].inputs.hasOwnProperty(input)) {
                                continue;
                            }
                            controller.setInputExternalConnectorValue(targetType, targetId, input, m.externalConnector[targetType][targetId].inputs[input]);
                        }

                        for (let output in m.externalConnector[targetType][targetId].outputs) {
                            if (!m.externalConnector[targetType][targetId].outputs.hasOwnProperty(output)) {
                                continue;
                            }
                            controller.setOutputExternalConnectorValue(targetType, targetId, output, m.externalConnector[targetType][targetId].outputs[output]);
                        }
                    }
                }
            }

            if (m.message_type === 'getLogs') {
                this.zone.run(() => {
                    if (m.logs) {
                        for (let i = 0; i < m.logs.length; i++) {
                            const log = m.logs[i];
                            this.consoleLog.add(log.type, log.message, 'Block ' + log.blockId, new Date(log.time).toLocaleString());
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
