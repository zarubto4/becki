import { ModalsSelectCodeModel } from '../modals/code-select';


declare let $: JQueryStatic;
import moment = require('moment/moment');
import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import {
    IProject, IBProgram, IBlockVersion, IBProgramVersion, IGridProject, IMProgramSnapShot,
    IMProjectSnapShot, ICProgram, IBlock, ICProgramList, ICProgramVersion, IBlockList
} from '../backend/TyrionAPI';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { DraggableEventParams } from '../components/DraggableDirective';
import { ModalsConfirmModel } from '../modals/confirm';
import { Blocks, Core } from 'blocko';
import { Libs } from 'common-lib';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { ModalsBlockoAddGridModel } from '../modals/blocko-add-grid';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ExitConfirmationService } from '../services/ExitConfirmationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsBlockoPropertiesModel } from '../modals/blocko-properties';
import { ModalsBlockoAddGridEmptyModel } from '../modals/blocko-add-grid-emtpy';
import { ModalsSelectVersionModel } from '../modals/version-select';

@Component({
    selector: 'bk-view-projects-project-blocko-blocko',
    templateUrl: './projects-project-blocko-blocko.html',
})
export class ProjectsProjectBlockoBlockoComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    unsavedChanges: boolean = false;

    projectId: string;
    blockoId: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;
    blockoProgram: IBProgram = null;

    advancedMode: boolean = false;

    // blocko blocks:
    blocks: IBlock[] = null;
    blockGroupsOpenToggle: { [id: string]: boolean } = {};
    codePrograms: ICProgram[] = [];

    blocksLastVersions: { [id: string]: IBlockVersion } = {};
    blocksColors: { [id: string]: string } = {};
    blocksIcons: { [id: string]: string } = {};

    blocksCache: { [blockId_versionId: string]: IBlockVersion } = {};

    // grid:
    allGridProjects: IGridProject[] = [];

    selectedGridProgramVersions: { [projectId: string]: { [programId: string]: string } } = {};

    // versions:
    blockoProgramVersions: IBProgramVersion[] = null;
    selectedProgramVersion: IBProgramVersion = null;

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    draggableOptions: JQueryUI.DraggableOptions = {
        helper: 'clone',
        containment: 'document',
        cursor: 'move',
        cursorAt: { left: -5, top: -5 }
    };

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    protected exitConfirmationService: ExitConfirmationService;

    blockoZoom: number = 1;

    /* tslint:disable:max-line-length */
    staticBlocks = [
        {
            id: 'logic_blocks',
            name: 'Logic Blocks',
            blocks: [
                {
                    name: 'NOT',
                    blockoName: 'not',
                    backgroundColor: 'rgb(161, 136, 127)'
                },
                {
                    name: 'AND',
                    blockoName: 'and',
                    backgroundColor: 'rgb(161, 136, 127)'
                },
                {
                    name: 'OR',
                    blockoName: 'or',
                    backgroundColor: 'rgb(161, 136, 127)'
                },
                {
                    name: 'XOR',
                    blockoName: 'xor',
                    backgroundColor: 'rgb(161, 136, 127)'
                }
            ]
        },
        {
            id: 'debug_blocks',
            name: 'Debug Blocks',
            blocks: [
                {
                    name: 'Switch',
                    blockoName: 'switch',
                    backgroundColor: 'rgb(204, 204, 255)'
                },
                {
                    name: 'Push button',
                    blockoName: 'pushButton',
                    backgroundColor: 'rgb(204, 204, 255)'
                },
                {
                    name: 'Digital output',
                    blockoName: 'light',
                    backgroundColor: 'rgb(204, 204, 255)'
                },
                {
                    name: 'Analog input',
                    blockoName: 'analogInput',
                    backgroundColor: 'rgb(204, 255, 204)'
                },
                {
                    name: 'Analog output',
                    blockoName: 'analogOutput',
                    backgroundColor: 'rgb(204, 255, 204)'
                }
            ]
        },
        {
            id: 'ts_blocks',
            name: 'TypeScript Blocks',
            blocks: [
                {
                    name: 'All in one example',
                    blockoDesignJson: '{\"displayName\":\"fa-font\",\"backgroundColor\":\"#32C5D2\",\"description\":\"All in one\"}',
                    blockoTsCode: '// add inputs\nlet din = context.inputs.add(\'din\', \'digital\', \'Digital input\');\nlet ain = context.inputs.add(\'ain\', \'analog\', \'Analog input\');\nlet min = context.inputs.add(\'min\', \'message\', \'Message input\', [\'boolean\', \'integer\', \'float\', \'string\']);\n\n// add outputs\nlet mout = context.outputs.add(\'mout\', \'message\', \'Message output\', [\'string\']);\nlet aout = context.outputs.add(\'aout\', \'analog\', \'Analog output\');\nlet dout = context.outputs.add(\'dout\', \'digital\', \'Digital output\');\n\n// add config properties\nlet offset = context.configProperties.add(\'offset\', \'float\', \'Analog offset\', 12.3, {\n    min: 0,\n    max: 50,\n    step: 0.1,\n    range: true\n});\n\nlet refreshAnalogValue = () => {\n    aout.value = ain.value + offset.value;\n};\n\n// set outputs on block ready\ncontext.listenEvent(\'ready\', () => {\n    dout.value = !din.value;\n    refreshAnalogValue();\n});\n\n// refresh analog value when ain or offset config property changed\nain.listenEvent(\'valueChanged\', refreshAnalogValue);\noffset.listenEvent(\'valueChanged\', refreshAnalogValue);\n\ndin.listenEvent(\'valueChanged\', () => {\n    dout.value = !din.value;\n});\n\nmin.listenEvent(\'messageReceived\', (event) => {\n    let val3 = event.message.values[3];\n    mout.send([\'Received \' + val3]);\n});\n',
                    backgroundColor: '#32C5D2'
                },
                {
                    name: 'Analog to digital example',
                    blockoDesignJson: '{\"displayName\":\"fa-line-chart\",\"backgroundColor\":\"#1BA39C\",\"description\":\"Analog to digital\"}',
                    blockoTsCode: '// add input and output\nlet ain = context.inputs.add(\'ain\', \'analog\', \'Analog input\');\nlet dout = context.outputs.add(\'dout\', \'digital\', \'Digital output\');\n\n// add config properties for min a max value\nlet min = context.configProperties.add(\'min\', \'float\', \'Min\', 5, {\n    min: 0,\n    max: 100,\n    step: 0.1,\n    range: true\n});\nlet max = context.configProperties.add(\'max\', \'float\', \'Min\', 25, {\n    min: 0,\n    max: 100,\n    step: 0.1,\n    range: true\n});\n\n// function for refresh digital output value\nlet refreshOutput = () => {\n    dout.value = ((ain.value >= min.value) && (ain.value <= max.value));\n};\n\n// trigger refreshOutput function when block ready, ain and config value changed\ncontext.listenEvent(\'ready\', refreshOutput);\nain.listenEvent(\'valueChanged\', refreshOutput);\ncontext.configProperties.listenEvent(\'valueChanged\', refreshOutput);\n',
                    backgroundColor: '#1BA39C'
                }
            ]
        }
    ];
    /* tslint:enable */

    private monacoEditorLoaderService: MonacoEditorLoaderService = null;
    protected afterLoadSelectedVersionId: string = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    constructor(injector: Injector) {
        super(injector);

        this.monacoEditorLoaderService = injector.get(MonacoEditorLoaderService);
        this.exitConfirmationService = injector.get(ExitConfirmationService);

        this.exitConfirmationService.setConfirmationEnabled(false);
    };

    onPortletClick(action: string): void {
        if (action === 'edit_program') {
            this.onEditClick();
        }

        if (action === 'remove_program') {
            this.onRemoveClick();
        }
    }


    onRemoveClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.blockoProgram.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramDelete(this.blockoProgram.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_blocko_removed')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.router.navigate(['/projects/' + this.projectId + '/blocko']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_blocko'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onEditClick(): void {
        let model = new ModalsBlockoPropertiesModel(this.projectId, this.blockoProgram.name, this.blockoProgram.description, true, this.blockoProgram.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramEdit(this.blockoProgram.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_blocko_updated')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_blocko'), reason));
                        this.refresh();
                    });
            }
        });
    }

    ngOnInit(): void {
        this.unsavedChanges = false;
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.blockoId = params['blocko'];
            if (params['version']) {
                this.router.navigate(['/projects', this.projectId, 'blocko', this.blockoId]);
                this.selectVersionByVersionId(params['version']);
            }
        });
        this.refresh();
        this.monacoEditorLoaderService.registerTypings([Blocks.TSBlockLib, Libs.ConsoleLib, Libs.UtilsLib, Blocks.FetchLib, Blocks.ServiceLib, this.blockoView.serviceHandler]);
    }

    selectVersionByVersionId(versionId: string) {
        if (this.blockoProgramVersions) {
            let version = null;
            if (versionId) {
                version = this.blockoProgramVersions.find((bpv) => bpv.id === versionId);
            }

            if (version) {
                this.selectProgramVersion(version);
            }
        } else {
            this.afterLoadSelectedVersionId = versionId;
        }
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onClearConsoleClick() {
        if (this.consoleLog) {
            this.consoleLog.clear();
        }
    }

    onBlockoLog(bl: { block: Core.Block, type: string, message: string }): void {
        if (this.consoleLog) {
            this.consoleLog.add(<ConsoleLogType>bl.type, bl.message, 'Block ' + bl.block.id);
        }
    }

    onBlockoError(be: { block: Core.Block, error: any }): void {
        if (be && be.error) {
            if (this.consoleLog) {
                this.consoleLog.addFromError(be.error, 'Block ' + be.block.id);
            }
        }
    }

    onToggleGroup(groupId: string) {
        this.blockGroupsOpenToggle[groupId] = !this.blockGroupsOpenToggle[groupId];
    }

    onDragStop(params: DraggableEventParams) {

        let dragOffset = params.ui.offset;
        let blockoOffset = $(this.blockoView.field.nativeElement).offset();
        let blockoWidth = $(this.blockoView.field.nativeElement).width();
        let blockoHeight = $(this.blockoView.field.nativeElement).height();

        // let blockoOffset = $(this.blocko.field.nativeElement).width();
        if (dragOffset.top >= blockoOffset.top && dragOffset.left >= blockoOffset.left && dragOffset.top <= (blockoOffset.top + blockoHeight) && dragOffset.left <= (blockoOffset.left + blockoWidth)) {

            let x = dragOffset.left - blockoOffset.left;
            let y = dragOffset.top - blockoOffset.top;

            switch (params.type) {
                case 'block': {
                    if (params.data && params.data.id && this.blocksLastVersions[params.data.id]) {

                        let wantedVersion = this.blocksLastVersions[params.data.id];
                        let wantedVersionName = params.data.id + '_' + wantedVersion.id;

                        if (this.blocksCache[wantedVersionName]) {
                            this.blockoView.addTsBlock(this.blocksCache[wantedVersionName].logic_json, this.blocksCache[wantedVersionName].design_json, x, y, params.data.id, wantedVersion.id);
                        } else {

                            // TODO: make only one request
                            this.tyrionBackendService.blockVersionGet(wantedVersion.id)
                                .then((bbv) => {
                                    this.blocksCache[wantedVersionName] = bbv;
                                    this.blockoView.addTsBlock(this.blocksCache[wantedVersionName].logic_json, this.blocksCache[wantedVersionName].design_json, x, y, params.data.id, wantedVersion.id);
                                })
                                .catch(reason => {
                                    this.fmError(this.translate('flash_cant_load_blocko_version'), reason);
                                });
                        }

                    } else if (params.data && params.data.blockoName) {

                        this.blockoView.addStaticBlock(params.data.blockoName, x, y);

                    } else if (params.data && params.data.blockoTsCode) {

                        this.blockoView.addTsBlock(params.data.blockoTsCode, params.data.blockoDesignJson, x, y);

                    } else {
                        this.fmError(this.translate('flash_cant_add_blocko_block'));
                    }
                    break;
                }
                case 'code': {

                    let code = this.codePrograms.find((cp) => {
                        return cp.id === params.data.id;
                    });

                    if (code) {
                        let m = new ModalsSelectVersionModel(code.program_versions);
                        this.modalService.showModal(m)
                            .then((success: boolean) => {
                                if (success && m.selectedId) {
                                    let cpv = this.getCProgramVersionById(m.selectedId);
                                    if (cpv && cpv.virtual_input_output) {
                                        let interfaceData = JSON.parse(cpv.virtual_input_output);
                                        if (interfaceData) {
                                            this.blockoView.addInterface({
                                                'color': '#30f485',
                                                'interfaceId': cpv.id,
                                                'displayName': cpv.id,
                                                'pos_x': Math.round(x / 22) * 22,
                                                'pos_y': Math.round(y / 22) * 22,
                                                'interface': interfaceData
                                            });
                                        }
                                    }
                                }
                            });
                    }

                    break;
                }

                case 'grid': {
                    /*let m = new ModalsSelectVersionModel(this.allGridProjects[params.data.id].);
                    this.modalService.showModal(m)
                        .then((success: boolean) => {
                            if (success && m.selectedVersionId) {
                                let cpv = this.getCProgramVersionById(m.selectedVersionId);
                                if (cpv && cpv.virtual_input_output) {
                                    let interfaceData = JSON.parse(cpv.virtual_input_output);
                                    if (interfaceData) {
                                        this.blockoView.addInterface({
                                            'grid': true,
                                            'color': '#30f485',
                                            'interfaceId': cpv.id,
                                            'displayName': cpv.id,
                                            'pos_x': Math.round(x / 22) * 22,
                                            'pos_y': Math.round(y / 22) * 22,
                                            'interface': interfaceData
                                        });
                                    }
                                }
                            }
                        });*/
                    break;
                }

                default: this.fmError(this.translate('flash_cant_add_blocko_block'));
            }
        }
    }

    onDragStart(params: DraggableEventParams) {

        // prefetch
        if (params.data && params.data.id && this.blocksLastVersions[params.data.id]) {
            let wantedVersion = this.blocksLastVersions[params.data.id];
            let wantedVersionName = params.data.id + '_' + wantedVersion.id;
            if (!this.blocksCache[wantedVersionName]) {
                this.tyrionBackendService.blockVersionGet(wantedVersion.id)
                    .then((bbv) => {
                        this.blocksCache[wantedVersionName] = bbv;
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load_blocko_block'), reason));
                    });
            }

        }

    }

    isEmptyObject(obj: any): boolean {
        return (Object.keys(obj).length === 0);
    }

    gridAdd() {
        if (!this.allGridProjects) {
            return;
        }

        let projects = this.allGridProjects.filter((gp) => !this.selectedGridProgramVersions[gp.id]);

        if (!projects.length) {
            let m = new ModalsBlockoAddGridEmptyModel();
            this.modalService.showModal(m)
                .then((success) => {
                    if (success) {
                        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid']);
                        return;
                    }
                });
            return;
        }

        let m = new ModalsBlockoAddGridModel(projects);
        this.modalService.showModal(m)
            .then((success) => {
                if (success && m.selectedGridProject) {
                    this.selectedGridProgramVersions[m.selectedGridProject.id] = {};
                    /*if (m.selectedGridProject.m_programs) {
                     m.selectedGridProject.m_programs.forEach((mp)=>{
                     this.selectedGridProgramVersions[m.selectedGridProject.id][mp.id] = null;
                     });
                     }*/
                }
            });
    }

    gridRemove(gridProject: IGridProject) {
        delete this.selectedGridProgramVersions[gridProject.id];
    }

    gridSelectedProgramVersionIdChange(projectId: string, programId: string, programVersionId: string) {
        this.selectedGridProgramVersions[projectId][programId] = programVersionId;
    }

    getCProgramVersionById(programVersionId: string): ICProgramVersion {
        let ret: ICProgramVersion = null;

        this.codePrograms.find((cp: ICProgram) => {
            ret = cp.program_versions.find((cpv: ICProgramVersion) => {
                return cpv.id === programVersionId;
            });
            return !!ret;
        });

        return ret;
    }

    /*updateBlockoInterfaces(): void {

        // console.log(this.selectedGridProgramVersions);
        let outInterface: BlockoTargetInterface[] = [];

        let addInterface = (hwId: string, cProgramVersionId: string) => {
            if (hwId && cProgramVersionId) {
                let board = this.boardById[hwId];
                let targetName: string = null;
                if (board) {
                    targetName = this.getTargetNameByBoardTypeId(board.type_of_board_id);
                }
                let cpv = this.getCProgramVersionById(cProgramVersionId);

                if (board && targetName && cpv && cpv.virtual_input_output) {
                    let interfaceData = JSON.parse(cpv.virtual_input_output);
                    if (interfaceData) {
                        outInterface.push({
                            // 'targetType': targetName === 'BYZANCE_YODAG2' ? 'yoda' : 'device', // TODO: make better detection for another generations [DH] - Not supported?? [TZ]
                            'color': '#99ccff', // change color [TZ]
                            'targetId': hwId,
                            'displayName': board.name ? board.name : board.id,
                            'interface': interfaceData
                        });
                    }
                }
            }
        };

        if (this.selectedHardware) {

            this.selectedHardware.forEach((sh) => {
                if (sh.main_board_pair) {
                    addInterface(sh.main_board_pair.board_id, sh.main_board_pair.c_program_version_id);
                }
                if (sh.device_board_pairs && Array.isArray(sh.device_board_pairs)) {
                    sh.device_board_pairs.forEach((b) => {
                        addInterface(b.board_id, b.c_program_version_id);
                    });
                }
            });


        }

        if (this.allGridProjects) {

            this.allGridProjects.forEach((gp) => {

                if (!this.selectedGridProgramVersions[gp.id]) {
                    return;
                }

                let out: any = {
                    analogInputs: {},
                    digitalInputs: {},
                    messageInputs: {},
                    analogOutputs: {},
                    digitalOutputs: {},
                    messageOutputs: {},
                };

                if (gp.m_programs) {
                    gp.m_programs.forEach((p) => {

                        if (p.versions && this.selectedGridProgramVersions[gp.id] && (this.selectedGridProgramVersions[gp.id][p.id])) {

                            let programVersion = p.versions.find((pv) => (pv.id === this.selectedGridProgramVersions[gp.id][p.id]));

                            if (programVersion) {

                                let iface: any = {};
                                try {
                                    iface = JSON.parse(programVersion.virtual_input_output);
                                } catch (e) {
                                    console.error(e);
                                }

                                if (iface.analogInputs) {
                                    for (let k in iface.analogInputs) {
                                        if (!iface.analogInputs.hasOwnProperty(k)) { continue; }
                                        if (!out.analogInputs[k]) {
                                            out.analogInputs[k] = iface.analogInputs[k];
                                        }
                                    }
                                }

                                if (iface.digitalInputs) {
                                    for (let k in iface.digitalInputs) {
                                        if (!iface.digitalInputs.hasOwnProperty(k)) { continue; }
                                        if (!out.digitalInputs[k]) {
                                            out.digitalInputs[k] = iface.digitalInputs[k];
                                        }
                                    }
                                }

                                if (iface.messageInputs) {
                                    for (let k in iface.messageInputs) {
                                        if (!iface.messageInputs.hasOwnProperty(k)) { continue; }
                                        if (!out.messageInputs[k]) {
                                            out.messageInputs[k] = iface.messageInputs[k];
                                        }
                                    }
                                }

                                if (iface.analogOutputs) {
                                    for (let k in iface.analogOutputs) {
                                        if (!iface.analogOutputs.hasOwnProperty(k)) { continue; }
                                        if (!out.analogOutputs[k]) {
                                            out.analogOutputs[k] = iface.analogOutputs[k];
                                        }
                                    }
                                }

                                if (iface.digitalOutputs) {
                                    for (let k in iface.digitalOutputs) {
                                        if (!iface.digitalOutputs.hasOwnProperty(k)) { continue; }
                                        if (!out.digitalOutputs[k]) {
                                            out.digitalOutputs[k] = iface.digitalOutputs[k];
                                        }
                                    }
                                }

                                if (iface.messageOutputs) {
                                    for (let k in iface.messageOutputs) {
                                        if (!iface.messageOutputs.hasOwnProperty(k)) { continue; }
                                        if (!out.messageOutputs[k]) {
                                            out.messageOutputs[k] = iface.messageOutputs[k];
                                        }
                                    }
                                }
                            }
                        }
                    });
                }

                if (
                    Object.keys(out.analogInputs).length ||
                    Object.keys(out.digitalInputs).length ||
                    Object.keys(out.messageInputs).length ||
                    Object.keys(out.analogOutputs).length ||
                    Object.keys(out.digitalOutputs).length ||
                    Object.keys(out.messageOutputs).length
                ) {
                    outInterface.push({
                        // 'targetType': 'grid_project',
                        'color': '#9966ff',  // change color [TZ]
                        'targetId': gp.id,
                        'displayName': gp.name,
                        'interface': out
                    });
                }
            });
        }

        // console.log(JSON.stringify(outInterface));
        this.blockoView.setInterfaces(outInterface);
    }*/

    onProgramVersionClick(programVersion: IBProgramVersion): void {
        this.selectProgramVersion(programVersion);
    }

    onProgramVersionIdClick(programVersionId: string): void {
        let programVersion = this.blockoProgramVersions.find((pv) => pv.id === programVersionId);
        if (programVersion) {
            this.selectProgramVersion(programVersion);
        } else {
            this.fmError(this.translate('flash_cant_find_program_version'));
        }
    }

    onRemoveVersionClick(version: IBProgramVersion): void {
        this.modalService.showModal(new ModalsRemovalModel(version.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramVersionDelete(version.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_removed')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_version'), reason));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: IBProgramVersion): void {
        let model = new ModalsVersionDialogModel(version.name, version.description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramVersionEdit(version.id, { // TODO [permission]: version.update_permission (Project.update_permission)
                    name: model.name,
                    description: model.description
                }).then(() => {
                    this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_version_been_changed', model.name)));
                    this.refresh();
                }).catch(reason => {
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_cant_change_version', model.name, reason)));
                    this.refresh();
                });
            }
        });
    }

    onClearClick(): void {
        let m = new ModalsConfirmModel(this.translate('label_modal_clear_program'), this.translate('label_modal_confirm_clear_blocko_program'));
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockoView.removeAllBlocks();
                }
            });
    }

    onSaveClick(): void {

        // HW validation:
        let validHw = true;

        if (!validHw) {
            let m = new ModalsConfirmModel(this.translate('label_modal_error'), this.translate('label_modal_cant_save_blocko_hw_without_version'), true, this.translate('label_modal_ok'), null);
            this.modalService.showModal(m);
            return;
        }

        // Grid validation
        let validGrid = true;
        this.allGridProjects.forEach((gp) => {
            if (this.selectedGridProgramVersions[gp.id]) {
                if (gp.m_programs) {
                    gp.m_programs.forEach((mp) => {
                        if (mp.program_versions && mp.program_versions.length) {
                            if (!this.selectedGridProgramVersions[gp.id][mp.id]) {
                                validGrid = false;
                            }
                        }
                    });
                }
            }
        });

        if (!validGrid) {
            let m = new ModalsConfirmModel(this.translate('label_modal_error'), this.translate('label_modal_cant_save_grid_hw_without_version'), true, this.translate('label_modal_ok'), null);
            this.modalService.showModal(m);
            return;
        }


        // save dialog
        let m = new ModalsVersionDialogModel(moment().format('YYYY-MM-DD HH:mm:ss'));
        this.modalService.showModal(m).then((success) => {
            if (success) {

                let mProjectSnapshots: IMProjectSnapShot[] = [];

                for (let projectId in this.selectedGridProgramVersions) {
                    if (!this.selectedGridProgramVersions.hasOwnProperty(projectId)) {
                        continue;
                    }
                    let programSnapshots: IMProgramSnapShot[] = [];

                    for (let programId in this.selectedGridProgramVersions[projectId]) {
                        if (!this.selectedGridProgramVersions[projectId].hasOwnProperty(programId)) {
                            continue;
                        }
                        programSnapshots.push({
                            m_program_id: programId,
                            version_id: this.selectedGridProgramVersions[projectId][programId]
                        });
                    }

                    mProjectSnapshots.push({
                        m_program_snapshots: programSnapshots,
                        m_project_id: projectId
                    });
                }

                // console.log(mProjectSnapshots);
                this.blockUI();
                this.tyrionBackendService.bProgramVersionCreate(this.blockoId, { // TODO [permission]: B_program.update_permission
                    name: m.name,
                    description: m.description,
                    m_project_snapshots: mProjectSnapshots,
                    program: this.blockoView.getDataJson()
                }).then(() => {
                    this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_saved', m.name)));
                    this.refresh(); // also unblockUI
                    this.unsavedChanges = false;
                    this.exitConfirmationService.setConfirmationEnabled(false);
                }).catch((err) => {
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_save_version', m.name, err)));
                    this.unblockUI();
                });
            }
        });


    }

    selectProgramVersion(programVersion: IBProgramVersion): void {

        if (!this.blockoProgramVersions) {
            return;
        }
        if (this.blockoProgramVersions.indexOf(programVersion) === -1) {
            return;
        }

        this.blockUI();
        this.tyrionBackendService.bProgramVersionGet(programVersion.id)
            .then((programVersionFull) => {

                this.unsavedChanges = false;
                this.exitConfirmationService.setConfirmationEnabled(false);

                this.selectedProgramVersion = programVersionFull;
                this.selectedGridProgramVersions = {};

                programVersionFull.grid_project_snapshots.forEach((pps) => {
                    this.selectedGridProgramVersions[pps.grid_project.id] = {};
                    if (pps.grid_programs) {
                        pps.grid_programs.forEach((ps) => {
                            this.selectedGridProgramVersions[pps.grid_project.id][ps.id] = ps.grid_program_version.id;
                        });
                    }
                });

                this.blockoView.setDataJson(this.selectedProgramVersion.program);
                if (this.consoleLog) {
                    this.consoleLog.clear();
                }
                this.unblockUI();
            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(this.translate('flash_cant_load_version', programVersion.name, err));
            });

    }

    refresh(): void {

        this.blockUI();

        Promise.all<any>([
            this.tyrionBackendService.blockGetByFilter(0, {
                project_id: this.projectId
            }),
            this.tyrionBackendService.cProgramGetListByFilter(0, {
                project_id: this.projectId
            })
        ]).then((values: [IBlockList, ICProgramList]) => {
            let blocks: IBlockList = values[0];
            let cPrograms: ICProgramList = values[1];

            this.blocksLastVersions = {};
            this.blocksColors = {};
            this.blocksIcons = {};

            blocks.content.forEach((b: IBlock) => {
                if (b.versions.length) {
                    this.blocksLastVersions[b.id] = b.versions[0];
                    if (this.blocksLastVersions[b.id]) {
                        let version = this.blocksLastVersions[b.id];
                        try {
                            let dj = JSON.parse(version.design_json);
                            if (dj['backgroundColor']) {
                                this.blocksColors[b.id] = dj['backgroundColor'];
                            }
                            if (dj['displayName'] && dj['displayName'].indexOf('fa-') === 0) {
                                this.blocksIcons[b.id] = dj['displayName'];
                            }
                        } catch (e) {
                            console.error('DesignJson parse error:' + e);
                        }
                    }
                }
            });

            this.blocks = blocks.content;

            // this.allGridProjects = projects; TODO grid projects
            this.codePrograms = cPrograms.content;

            return this.tyrionBackendService.bProgramGet(this.blockoId); // TODO [permission]: Project.read_permission
        }).then((blockoProgram) => {
            this.blockoProgram = blockoProgram;

            this.blockoProgramVersions = this.blockoProgram.program_versions || [];

            let version = null;
            if (this.afterLoadSelectedVersionId) {
                version = this.blockoProgramVersions.find((bpv) => bpv.id === this.afterLoadSelectedVersionId);
            }

            if (version) {
                this.selectProgramVersion(version);
            } else if (this.blockoProgramVersions.length) {
                this.selectProgramVersion(this.blockoProgramVersions[0]);
            }
            this.unblockUI();
        }).catch(reason => {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load_blocko'), reason));
            this.unblockUI();
        });
    }

    onSomethingChanged() {
        this.unsavedChanges = true;
        this.exitConfirmationService.setConfirmationEnabled(true);
    }

    blockoZoomOnChange(e: any) {
        this.blockoZoom = e.target.value * e.target.value;
    }
}
