/**
 * Created by davidhradek on 17.08.16.
 */
declare let $: JQueryStatic;
import moment = require('moment/moment');
import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import {
    IProject,
    IBProgram,
    ITypeOfBlock,
    IBlockoBlockVersion,
    IBoardsForBlocko,
    IBProgramVersion,
    IBPair,
    IMProject,
    IMProgramSnapShot,
    IMProjectSnapShot, IBlockoBlockVersionShortDetail, IBoardShortDetail,
    IBProgramVersionShortDetail, ISwaggerCProgramShortDetailForBlocko, ISwaggerCProgramVersionsShortDetailForBlocko,
    ISwaggerMProjectShortDetailForBlocko, IHardwareGroupIN
} from '../backend/TyrionAPI';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { DraggableEventParams } from '../components/DraggableDirective';
import { ModalsBlockoAddHardwareModel } from '../modals/blocko-add-hardware';
import { ModalsConfirmModel } from '../modals/confirm';
import { BlockoTargetInterface, Blocks, Core } from 'blocko';
import { Libs } from 'common-lib';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { ModalsBlockoAddGridModel } from '../modals/blocko-add-grid';
import { NullSafe, NullSafeDefault } from '../helpers/NullSafe';
import { ModalsBlockoVersionSelectModel } from '../modals/blocko-version-select';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-blocko-blocko',
    templateUrl: './projects-project-blocko-blocko.html',
})
export class ProjectsProjectBlockoBlockoComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockoId: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;
    blockoProgram: IBProgram = null;

    advancedMode: boolean = false;

    connectionsTab: string = '';

    // blocko blocks:

    blockGroups: ITypeOfBlock[] = null;
    blockGroupsOpenToggle: {[id: string]: boolean} = {};

    blocksLastVersions: {[id: string]: IBlockoBlockVersionShortDetail} = {};
    blocksColors: {[id: string]: string} = {};
    blocksIcons: {[id: string]: string} = {};

    blocksCache: {[blockId_versionId: string]: IBlockoBlockVersion} = {};


    // hw:

    allBoardsDetails: IBoardsForBlocko = null;

    boardById: { [id: string]: IBoardShortDetail } = {};

    selectedHardware: IHardwareGroupIN[] = [];

    // grid:

    allGridProjects: ISwaggerMProjectShortDetailForBlocko[] = null;

    selectedGridProgramVersions: { [projectId: string]: { [programId: string]: string }} = {};

    // versions:

    blockoProgramVersions: IBProgramVersionShortDetail[] = null;
    selectedProgramVersion: IBProgramVersion = null;

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    draggableOptions: JQueryUI.DraggableOptions = {
        helper: 'clone',
        containment: 'document',
        cursor: 'move',
        cursorAt: {left: -5, top: -5}
    };

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    /* tslint:disable:max-line-length */
    staticBlocks = [
        {
            id: 'logic_blocks',
            name: 'Logic Blocks',
            blocko_blocks: [
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
            blocko_blocks: [
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
            blocko_blocks: [
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

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);

        this.monacoEditorLoaderService = injector.get(MonacoEditorLoaderService);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.blockoId = params['blocko'];
            this.refresh();
        });
        this.monacoEditorLoaderService.registerTypings([Blocks.TSBlockLib, Libs.ConsoleLib, Libs.UtilsLib]);
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onToggleConnectionsTab(tabName: string) {
        if (this.connectionsTab === tabName) {
            this.connectionsTab = '';
        } else {
            this.connectionsTab = tabName;
        }
    }

    onClearConsoleClick() {
        if (this.consoleLog) {
            this.consoleLog.clear();
        }
    }

    onBlockoLog(bl: {block: Core.Block, type: string, message: string}): void {
        if (this.consoleLog) {
            this.consoleLog.add(<ConsoleLogType>bl.type, bl.message, 'Block ' + bl.block.id);
        }
    }

    onBlockoError(be: {block: Core.Block, error: any}): void {
        if (be && be.error) {
            if (this.consoleLog) {
                this.consoleLog.addFromError(be.error, 'Block ' + be.block.id);
            }
        }
    }

    connectionsHwCount() {
        let yodaCount = this.selectedHardware.length;
        let padawansCount = 0;
        this.selectedHardware.forEach((sh) => {
            padawansCount += sh.device_board_pairs.length;
        });
        return yodaCount + ' + ' + padawansCount;
    }

    connectionsGridCount() {
        return Object.keys(this.selectedGridProgramVersions).length;
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

        if (
            (dragOffset.top >= blockoOffset.top)
            && (dragOffset.left >= blockoOffset.left)
            && (dragOffset.top <= (blockoOffset.top + blockoHeight))
            && (dragOffset.left <= (blockoOffset.left + blockoWidth))
            ) {
            let x = dragOffset.left - blockoOffset.left;
            let y = dragOffset.top - blockoOffset.top;

            if (params.data && params.data.id && this.blocksLastVersions[params.data.id]) {

                let wantedVersion = this.blocksLastVersions[params.data.id];
                let wantedVersionName = params.data.id + '_' + wantedVersion.id;

                if (this.blocksCache[wantedVersionName]) {

                    this.blockoView.addTsBlock(this.blocksCache[wantedVersionName].logic_json, this.blocksCache[wantedVersionName].design_json, x, y);

                } else {

                    // TODO: make only one request
                    this.backendService.getBlockoBlockVersion(wantedVersion.id)
                        .then((bbv) => {
                            this.blocksCache[wantedVersionName] = bbv;
                            this.blockoView.addTsBlock(this.blocksCache[wantedVersionName].logic_json, this.blocksCache[wantedVersionName].design_json, x, y);
                        })
                        .catch(reason => {
                            this.addFlashMessage(new FlashMessageError(`The blocko block version cannot be loaded.`, reason));
                        });

                }


            } else if (params.data && params.data.blockoName) {

                this.blockoView.addStaticBlock(params.data.blockoName, x, y);

            } else if (params.data && params.data.blockoTsCode) {

                this.blockoView.addTsBlock(params.data.blockoTsCode, params.data.blockoDesignJson, x, y);

            } else {
                this.addFlashMessage(new FlashMessageError(`The blocko block cannot be added.`));
            }

        }

    }

    onDragStart(params: DraggableEventParams) {

        // prefetch
        if (params.data && params.data.id && this.blocksLastVersions[params.data.id]) {
            let wantedVersion = this.blocksLastVersions[params.data.id];
            let wantedVersionName = params.data.id + '_' + wantedVersion.id;
            if (!this.blocksCache[wantedVersionName]) {
                this.backendService.getBlockoBlockVersion(wantedVersion.id)
                    .then((bbv) => {
                        this.blocksCache[wantedVersionName] = bbv;
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The blocko block version cannot be loaded.`, reason));
                    });
            }


        }

    }

    isEmptyObject(obj: any): boolean {
        return (Object.keys(obj).length === 0);
    }

    getCProgramsForBoardType(boardTypeId: string): ISwaggerCProgramShortDetailForBlocko[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.c_programs) {
            return [];
        }
        return this.allBoardsDetails.c_programs.filter((cp) => (cp.type_of_board_id === boardTypeId));
    }

    hwCProgramVersionChanged(hwObj: IBPair, cProgramVersion: string) {
        hwObj.c_program_version_id = cProgramVersion;

        this.updateBlockoInterfaces();
    }

    hwRemove(hwId: string) {
        let i = -1;
        this.selectedHardware.forEach((sh, index) => {
            if (sh.main_board_pair && sh.main_board_pair.board_id === hwId) {
                i = index;
            }
        });
        if (i > -1) {
            this.selectedHardware.splice(i, 1);
        } else {
            this.selectedHardware.forEach((sh) => {
                if (sh.device_board_pairs && Array.isArray(sh.device_board_pairs)) {
                    let ii = -1;
                    sh.device_board_pairs.forEach((b, index) => {
                        if (b.board_id === hwId) {
                            ii = index;
                        }
                    });
                    if (ii > -1) {
                        sh.device_board_pairs.splice(ii, 1);
                    }
                }
            });
        }

        this.updateBlockoInterfaces();
    }

    getAllUsedHwIds(): string[] {
        let out: string[] = [];
        if (this.selectedHardware) {
            this.selectedHardware.forEach((sh) => {
                if (sh.main_board_pair && sh.main_board_pair.board_id) {
                    out.push(sh.main_board_pair.board_id);
                }
                if (sh.device_board_pairs && Array.isArray(sh.device_board_pairs)) {
                    sh.device_board_pairs.forEach((b) => {
                        if (b.board_id) {
                            out.push(b.board_id);
                        }
                    });
                }
            });
        }
        return out;
    }

    getAllFreeMainBoards(): IBoardShortDetail[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.boards) {
            return [];
        }
        let used = this.getAllUsedHwIds();
        let out: IBoardShortDetail[] = [];
        this.allBoardsDetails.boards.forEach((b) => {
            if (
                NullSafe(() => this.allBoardsDetails.type_of_boards.find((tob) => tob.id === b.type_of_board_id).connectible_to_internet)
                && used.indexOf(b.id) === -1
                ) {
                out.push(b);
            }
        });
        return out;
    }

    getAllFreeSubBoards(): IBoardShortDetail[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.boards) {
            return [];
        }
        let used = this.getAllUsedHwIds();
        let out: IBoardShortDetail[] = [];
        this.allBoardsDetails.boards.forEach((b) => {
            if (
                !NullSafe(() => this.allBoardsDetails.type_of_boards.find((tob) => tob.id === b.type_of_board_id).connectible_to_internet)
                && used.indexOf(b.id) === -1
                ) {
                out.push(b);
            }
        });
        return out;
    }

    gridAdd() {
        if (!this.allGridProjects) {
            return;
        }

        let projects = this.allGridProjects.filter((gp) => !this.selectedGridProgramVersions[gp.id]);

        if (!projects.length) {
            return; // TODO: inform or disable button
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
                    this.updateBlockoInterfaces();
                }
            });
    }

    gridRemove(gridProject: IMProject) {
        delete this.selectedGridProgramVersions[gridProject.id];
        this.updateBlockoInterfaces();
    }

    gridSelectedProgramVersionIdChange(projectId: string, programId: string, programVersionId: string) {
        this.selectedGridProgramVersions[projectId][programId] = programVersionId;
        this.updateBlockoInterfaces();
    }

    hwAdd(parentHwId: string = null) {

        if (!parentHwId) {
            let mainBoards = this.getAllFreeMainBoards();

            if (!mainBoards || mainBoards.length === 0) {
                this.modalService.showModal(new ModalsConfirmModel('Error', 'No available main boards hardware.', true, 'OK', null));
                return;
            }

            let m = new ModalsBlockoAddHardwareModel(mainBoards);
            this.modalService.showModal(m)
                .then((success) => {
                    if (success && m.selectedBoard) {
                        this.selectedHardware.push({
                            device_board_pairs: [],
                            main_board_pair: {
                                board_id: m.selectedBoard.id,
                                c_program_version_id: null
                            }
                        });

                        this.updateBlockoInterfaces();

                    }
                });

        } else {

            let subBoards = this.getAllFreeSubBoards();

            if (!subBoards || subBoards.length === 0) {
                this.modalService.showModal(new ModalsConfirmModel('Error', 'No available padavan boards hardware.', true, 'OK', null));
                return;
            }

            let m = new ModalsBlockoAddHardwareModel(subBoards);
            this.modalService.showModal(m)
                .then((success) => {
                    if (success && m.selectedBoard) {

                        let parentObj = this.selectedHardware.find((sh) =>
                            (sh.main_board_pair && sh.main_board_pair.board_id && sh.main_board_pair.board_id === parentHwId)
                            );

                        if (!parentObj.device_board_pairs) {
                            parentObj.device_board_pairs = [];
                        }
                        parentObj.device_board_pairs.push({
                            board_id: m.selectedBoard.id,
                            c_program_version_id: null
                        });

                        this.updateBlockoInterfaces();

                    }
                });
        }

    }

    getCProgramVersionById(programVersionId: string): ISwaggerCProgramVersionsShortDetailForBlocko {
        let ret: ISwaggerCProgramVersionsShortDetailForBlocko = null;

        if (this.allBoardsDetails && this.allBoardsDetails.c_programs) {

            this.allBoardsDetails.c_programs.forEach((cp) => {
                if (cp.versions) {
                    cp.versions.forEach((pv) => {
                        if (pv.id === programVersionId) {
                            ret = pv;
                        }
                    });
                }
            });
        }

        return ret;
    }

    getTargetNameByBoardTypeId(boardTypeId: string): string {
        let out: string = null;
        if (this.allBoardsDetails && this.allBoardsDetails.type_of_boards) {
            this.allBoardsDetails.type_of_boards.forEach((tob) => {
                if (tob.id === boardTypeId) {
                    out = tob.target_name;
                }
            });
        }
        return out;
    }

    updateBlockoInterfaces(): void {

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
                            'targetType': targetName === 'BYZANCE_YODAG2' ? 'yoda' : 'device', // TODO: make better detection for another generations [DH]
                            'targetId': hwId,
                            'displayName': board.personal_description ? board.personal_description : board.id,
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
                        'targetType': 'grid_project',
                        'targetId': gp.id,
                        'displayName': gp.name,
                        'interface': out
                    });
                }

            });

        }

        // console.log(JSON.stringify(outInterface));

        this.blockoView.setInterfaces(outInterface);


    }

    onInstanceIdClick(instanceId: string): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'instances', instanceId]);
    }

    onProgramVersionClick(programVersion: IBProgramVersionShortDetail): void {
        this.selectProgramVersion(programVersion);
    }

    onChangeVersionClick(): void {
        if (!this.blockoProgramVersions || !this.blockoProgramVersions.length) {
            this.fmWarning('Must create some version first.');
            return;
        }
        let m = new ModalsBlockoVersionSelectModel(this.blockoProgramVersions, NullSafe(() => this.blockoProgram.instance_details.version_id));
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.cloudInstanceUpload(m.programVersion, {})
                        .then(() => {
                            this.refresh();
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError('Cannot change version.', err);
                        });
                }
            });
    }

    onProgramVersionIdClick(programVersionId: string): void {
        let programVersion = this.blockoProgramVersions.find((pv) => pv.version_id === programVersionId);
        if (programVersion) {
            this.selectProgramVersion(programVersion);
        } else {
            this.fmError('Program version not found');
        }
    }

    onTurnOnClick(): void {
        if (NullSafe(() => this.blockoProgram.instance_details.version_id)) {
            this.blockUI();
            this.backendService.cloudInstanceUpload(this.blockoProgram.instance_details.version_id, {})
                .then(() => {
                    this.refresh();
                })
                .catch((err) => {
                    this.unblockUI();
                    this.fmError('Cannot turn instance on.', err);
                });

        } else {
            this.fmWarning('Cannot turn instance on.');
        }
    }

    onTurnOffClick(): void {
        if (NullSafe(() => this.blockoProgram.instance_details.instance_id)) {
            this.blockUI();
            this.backendService.cloudInstanceShutDown(this.blockoProgram.instance_details.instance_id)
                .then(() => {
                    this.refresh();
                })
                .catch((err) => {
                    this.unblockUI();
                    this.fmError('Cannot turn instance off.', err);
                });

        } else {
            this.fmWarning('Cannot turn instance off.');
        }
    }

    onClearClick(): void {
        let m = new ModalsConfirmModel('Clear program', 'Really want clear Blocko program?');
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockoView.removeAllBlocks();
                    this.updateBlockoInterfaces();
                }
            });
    }

    onSaveClick(): void {

        // HW validation:
        let validHw = true;

        this.selectedHardware.forEach((sh) => {

            if (!sh.main_board_pair || !sh.main_board_pair.c_program_version_id) {
                validHw = false;
            }
            if (sh.device_board_pairs) {
                sh.device_board_pairs.forEach((dbp) => {
                    if (!dbp.c_program_version_id) {
                        validHw = false;
                    }
                });
            }
        });

        if (!validHw) {
            let m = new ModalsConfirmModel('Error', 'Cannot save blocko now, you have <b>hardware devices</b>, without program <b>version selected</b>.', true, 'OK', null);
            this.modalService.showModal(m);
            return;
        }

        // Grid validation

        let validGrid = true;
        this.allGridProjects.forEach((gp) => {
            if (this.selectedGridProgramVersions[gp.id]) {
                if (gp.m_programs) {
                    gp.m_programs.forEach((mp) => {
                        if (mp.versions && mp.versions.length) {
                            if (!this.selectedGridProgramVersions[gp.id][mp.id]) {
                                validGrid = false;
                            }
                        }
                    });
                }
            }
        });

        if (!validGrid) {
            let m = new ModalsConfirmModel('Error', 'Cannot save blocko now, you have <b>grid programs</b>, without program <b>version selected</b>.', true, 'OK', null);
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
                            version_object_id: this.selectedGridProgramVersions[projectId][programId]
                        });
                    }

                    mProjectSnapshots.push({
                        m_program_snapshots: programSnapshots,
                        m_project_id: projectId
                    });
                }

                // console.log(mProjectSnapshots);

                this.blockUI();
                this.backendService.createBProgramVersion(this.blockoId, {
                    version_name: m.name,
                    version_description: m.description,
                    hardware_group: this.selectedHardware,
                    m_project_snapshots: mProjectSnapshots,
                    program: this.blockoView.getDataJson()
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('Version <b>' + m.name + '</b> saved successfully.'));
                        this.refresh(); // also unblockUI
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError('Failed saving version <b>' + m.name + '</b>', err));
                        this.unblockUI();
                    });
            }
        });


    }

    selectProgramVersion(programVersion: IBProgramVersionShortDetail): void {

        if (!this.blockoProgramVersions) {
            return;
        }
        if (this.blockoProgramVersions.indexOf(programVersion) === -1) {
            return;
        }

        this.blockUI();
        this.backendService.getBProgramVersion(programVersion.version_id)
            .then((programVersionFull) => {
                this.unblockUI();

                this.selectedProgramVersion = programVersionFull;
                // here is save re-cast it to IHardwareGroupIN because its only object with more properties
                this.selectedHardware = this.hardwareGroupCopy(<IHardwareGroupIN[]>this.selectedProgramVersion.hardware_group) || [];

                this.selectedGridProgramVersions = {};
                programVersionFull.m_project_program_snapshots.forEach((pps) => {
                    this.selectedGridProgramVersions[pps.m_project_id] = {};
                    if (pps.m_program_snapshots) {
                        pps.m_program_snapshots.forEach((ps) => {
                            this.selectedGridProgramVersions[pps.m_project_id][ps.m_program_id] = ps.version_object_id;
                        });
                    }

                });

                // console.log(this.selectedGridProgramVersions);

                this.blockoView.setDataJson(this.selectedProgramVersion.program);

                if (this.consoleLog) {
                    this.consoleLog.clear();
                }

            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(`Cannot load version <b>${programVersion.version_name}</b>`, err);
            });

    }

    hardwareGroupCopy(hwGroup: IHardwareGroupIN[]): IHardwareGroupIN[] {
        if (!hwGroup) {
            return null;
        }
        let out: IHardwareGroupIN[] = [];
        hwGroup.forEach((hg) => {
            let hgCopy: IHardwareGroupIN = {
                main_board_pair: {
                    board_id: hg.main_board_pair.board_id,
                    c_program_version_id: hg.main_board_pair.c_program_version_id
                },
                device_board_pairs: []
            };

            if (hg.device_board_pairs) {
                hg.device_board_pairs.forEach((dbp) => {
                    hgCopy.device_board_pairs.push({
                        board_id: dbp.board_id,
                        c_program_version_id: dbp.c_program_version_id
                    });
                });
            }
            out.push(hgCopy);
        });
        return out;
    }

    versionRunning(v: IBProgramVersion): boolean {
        let vId = NullSafe(() => v.version_object.id);
        let cId = NullSafe(() => this.blockoProgram.instance_details.version_id);
        return (vId && cId && vId === cId);
    }

    refresh(): void {

        this.blockUI();

        Promise.all<any>([
            this.backendService.getAllTypeOfBlocks(),
            this.backendService.getAllBlockoDetails(this.projectId)
        ])
            .then((values: [ITypeOfBlock[], IBoardsForBlocko]) => {
                let typeOfBlocks: ITypeOfBlock[] = values[0];
                let blockoDetails: IBoardsForBlocko = values[1];

                let projects: ISwaggerMProjectShortDetailForBlocko[] = blockoDetails.m_projects;

                // TODO: make this better viz. TYRION-374
                this.blocksLastVersions = {};
                this.blocksColors = {};
                this.blocksIcons = {};

                typeOfBlocks.forEach((tob) => {
                    tob.blocko_blocks.forEach((bb) => {
                        let sortedVersion = bb.versions.sort((a, b) => {
                            return parseInt(b.id, 10) - parseInt(a.id, 10);
                        });
                        if (sortedVersion.length) {
                            this.blocksLastVersions[bb.id] = sortedVersion[0];
                            if (this.blocksLastVersions[bb.id]) {
                                let version = this.blocksLastVersions[bb.id];
                                try {
                                    let dj = JSON.parse(version.design_json);
                                    if (dj['backgroundColor']) {
                                        this.blocksColors[bb.id] = dj['backgroundColor'];
                                    }
                                    if (dj['displayName'] && dj['displayName'].indexOf('fa-') === 0) {
                                        this.blocksIcons[bb.id] = dj['displayName'];
                                    }
                                } catch (e) {
                                    console.error('DesignJson parse error:' + e);
                                }
                            }
                        }
                    });
                });

                this.blockGroups = typeOfBlocks;
                // console.log(typeOfBlocks);

                // console.log(projects);
                this.allGridProjects = projects;

                this.allBoardsDetails = blockoDetails;

                // console.log(blockoDetails);

                this.boardById = {};
                this.allBoardsDetails.boards.forEach((board) => {
                    this.boardById[board.id] = board;
                });


                return this.backendService.getBProgram(this.blockoId);
            })
            .then((blockoProgram) => {
                // console.log(blockoProgram);

                this.blockoProgram = blockoProgram;

                this.blockoProgramVersions = this.blockoProgram.program_versions || [];

                /*this.blockoProgramVersions.sort((a, b)=> {
                    if (a.version_object.date_of_create == b.version_object.date_of_create) return 0;
                    if (a.version_object.date_of_create > b.version_object.date_of_create) return -1;
                    return 1;
                });*/

                if (this.blockoProgramVersions.length) {
                    this.selectProgramVersion(this.blockoProgramVersions[0]);
                }

                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The blocko cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

}
