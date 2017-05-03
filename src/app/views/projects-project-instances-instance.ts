
/**
 * Created by davidhradek on 01.12.16.
 */

/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { IHomerInstanceRecord } from './../backend/TyrionAPI';
import { Component, OnInit, Injector, OnDestroy, AfterContentChecked, ViewChild, ElementRef } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IHomerInstance } from '../backend/TyrionAPI';
import { NullSafeDefault } from '../helpers/NullSafe';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { HomerService, HomerDao } from '../services/HomerService';
import { ModalsConfirmModel } from '../modals/confirm';
import { InstanceHistoryTimelineComponent } from '../components/InstanceHistoryTimelineComponent';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';


@Component({
    selector: 'bk-view-projects-project-instances-instance',
    templateUrl: './projects-project-instances-instance.html',
})
export class ProjectsProjectInstancesInstanceComponent extends BaseMainComponent implements OnInit, OnDestroy, AfterContentChecked {

    id: string;
    instanceId: string;
    routeParamsSubscription: Subscription;

    instance: IHomerInstance = null;


    currentHistoricInstance: IHomerInstanceRecord;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    @ViewChild(InstanceHistoryTimelineComponent)
    instanceHistoryTimeline: InstanceHistoryTimelineComponent;

    @ViewChild('historyEventsList')
    historyEventsList: ElementRef;

    @ViewChild('historyEvents')
    historyEvents: ElementRef;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    homerDao: HomerDao;

    instanceTab: string = 'schema';

    private homerService: HomerService = null;
    private liveViewLoaded: boolean = false;

    constructor(injector: Injector) {
        super(injector);

        this.homerService = injector.get(HomerService);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.instanceId = params['instance'];
            this.refresh();
        });
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

        this.backendService.getInstance(this.instanceId)
            .then((instance) => {
                this.instance = instance;
                this.loadBlockoLiveView();
                this.currentHistoricInstance = this.instance.instance_history.pop();
                this.unblockUI();

                if (!this.instance.actual_instance) {
                    this.router.navigate(['/', 'projects', this.id, 'instances']);
                }
            })
            .catch(reason => {
                this.fmError(`Instances ${this.id} cannot be loaded.`, reason);
                this.router.navigate(['/', 'projects', this.id, 'instances']);
                this.unblockUI();
            });
    }

    onToggleinstanceTab(tab: string) {
        this.instanceTab = tab;
    }

    onBlockoProgramClick(bProgramId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocko', bProgramId]);
    }

    connectionsHwCount() {
        let yodaCount = NullSafeDefault(() => this.instance.actual_instance.hardware_group, []).length;
        let padawansCount = 0;
        NullSafeDefault(() => this.instance.actual_instance.hardware_group, []).forEach((sh) => {
            padawansCount += sh.device_board_pairs.length;
        });
        return yodaCount + ' + ' + padawansCount;

    }

    selectedHistoryItem(event: {index: number, item: IHomerInstanceRecord}) {
        this.currentHistoricInstance = event.item;
    }

    connectionsGridCount() {
        return NullSafeDefault(() => this.instance.actual_instance.m_project_snapshot, []).length;
    }

    onEditClick() {

    }

    onRemoveClick() {
        let m = new ModalsConfirmModel('Shutdown instance', 'Do you want to shutdown running instance?');
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.cloudInstanceShutDown(this.instance.blocko_instance_name)
                        .then(() => {
                            this.storageService.projectRefresh(this.id);
                            this.refresh();
                            this.unblockUI();
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError('Cannot turn instance off.', err);
                        });
                }
            });
    }

    onBlockoClick() {

    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }

    onBlockoProgramVersionClick(instance: IHomerInstance) {
        this.router.navigate(['/projects', this.id, 'blocko', instance.b_program_id, {version: instance.actual_instance.b_program_version_id}]);

    }

    onGridProjectClick(projectId: string) {
        this.router.navigate(['projects', this.id, 'grid', projectId]);
    }

    onGridProgramClick(projectId: string, programId: string) {
        this.router.navigate(['projects', this.id, 'grid', projectId, programId]);
    }

    onGridProgramVersionClick(projectId: string, programId: string, versionId: string) {
        this.router.navigate(['projects', this.id, 'grid', projectId, programId, {version: versionId}]);
    }

    onHardwareClick(hardwareId: string) {
        this.router.navigate(['projects', this.id, 'hardware', hardwareId]);
    }

    onCProgramClick(programId: string) {
        this.router.navigate(['projects', this.id, 'code', programId]);
    }

    onCProgramVersionClick(programId: string, versionId: string) {
        this.router.navigate(['projects', this.id, 'code', programId, {version: versionId}]);
    }

    loadBlockoLiveView() {
        this.zone.runOutsideAngular(() => {
            if (this.blockoView && this.instance.actual_instance && this.instance.actual_instance.b_program_version_id) {
                this.backendService.getBProgramVersion(this.instance.actual_instance.b_program_version_id)
                    .then((programVersionFull) => {
                        const selectedProgramVersion = programVersionFull;
                        this.blockoView.setDataJson(selectedProgramVersion.program);

                        if (this.instance.instance_remote_url) {
                            const authToken = this.backendService.getToken();
                            this.homerDao = this.homerService.connectToHomer(this.instance.instance_remote_url, authToken);

                            this.homerDao.onOpenCallback = (e) => {
                                this.homerDao.sendMessage({
                                    messageType: 'getValues'
                                });
                            };

                            this.homerDao.onMessageCallback = (m: any) => this.homerMessageReceived(m);
                        }
                    })
                    .catch((err) => {
                        this.zone.run(() => {
                            this.fmError(`Cannot load version <b>${this.instance.actual_instance.b_program_version_name}</b>`, err);
                        });
                    });
            }
        });
    }

    homerMessageReceived(m: any) {
        this.zone.runOutsideAngular(() => {
            const controller = this.blockoView.getBlockoController();

            if (m.messageType === 'newInputConnectorValue') {
                controller.setInputConnectorValue(m.blockId, m.connectorName, m.value);
            }

            if (m.messageType === 'newOutputConnectorValue') {
                controller.setOutputConnectorValue(m.blockId, m.connectorName, m.value);
            }

            if (m.messageType === 'newExternalInputConnectorValue') {
                controller.setInputExternalConnectorValue(m.targetType, m.targetId, m.connectorName, m.value);
            }

            if (m.messageType === 'newExternalOutputConnectorValue') {
                controller.setOutputExternalConnectorValue(m.targetType, m.targetId, m.connectorName, m.value);
            }

            if (m.messageType === 'newConsoleEvent') {
                this.zone.run(() => {
                    this.consoleLog.add(m.consoleMessageType, m.consoleMessage);
                });
            }

            if (m.messageType === 'newErrorEvent') {
                controller.setError(m.blockId, true);
                this.zone.run(() => {
                    if (m.errorName) {
                        this.consoleLog.add('error', m.errorName + ': ' + m.errorMessage);
                    } else {
                        this.consoleLog.add('error', m.errorMessage);
                    }
                });
            }

            if (m.messageType === 'getValues') {
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
        });
    }
}
