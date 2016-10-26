/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {
    IProject,
    IBProgram,
    ITypeOfBlock,
    IBlockoBlockShortVersion,
    IBlockoBlockVersion,
    IBoardsForBlocko,
    IHardwareGroup,
    IBoard,
    ICProgramVersion,
    ICProgram,
    IBProgramVersion,
    IBPair,
    IMProject,
    IMProgramSnapShot,
    IMProjectSnapShot
} from "../backend/TyrionAPI";
import {BlockoView} from "../components/BlockoView";
import {DraggableEventParams} from "../components/Draggable";
import {ModalsBlockoAddHardwareModel} from "../modals/blocko-add-hardware";
import {ModalsConfirmModel} from "../modals/confirm";
import {BlockoTargetInterface} from "blocko";
import {ModalsVersionDialogModel} from "../modals/version-dialog";
import {ModalsBlockoAddGridModel} from "../modals/blocko-add-grid";


declare var $: JQueryStatic;
import moment = require("moment/moment");

@Component({
    selector: "view-projects-project-blocko-blocko",
    templateUrl: "app/views/projects-project-blocko-blocko.html",
})
export class ProjectsProjectBlockoBlockoComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockoId: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;
    blockoProgram: IBProgram = null;

    advancedMode: boolean = false;

    // blocko blocks:

    blockGroups: ITypeOfBlock[] = null;
    blockGroupsOpenToggle: {[id: string]: boolean} = {};

    blocksLastVersions: {[id: string]: IBlockoBlockShortVersion} = {};
    blocksColors: {[id: string]: string} = {};
    blocksIcons: {[id: string]: string} = {};

    blocksCache: {[blockId_versionId: string]: IBlockoBlockVersion} = {};


    // hw:

    allBoardsDetails: IBoardsForBlocko = null;

    boardById: { [id: string]: IBoard } = {};

    selectedHardware: IHardwareGroup[] = [];

    // grid:

    allGridProjects: IMProject[] = null;

    selectedGridProgramVersions: { [projectId: string]: { [programId: string]: string }} = {};

    // versions:

    blockoProgramVersions: IBProgramVersion[] = null;
    selectedProgramVersion: IBProgramVersion = null;

    @ViewChild(BlockoView)
    blockoView: BlockoView;

    draggableOptions: JQueryUI.DraggableOptions = {
        helper: "clone",
        containment: "document",
        cursor: "move",
        cursorAt: {left: -5, top: -5}
    };

    staticBlocks = [
        {
            id: "logic_blocks",
            name: "Logic Blocks",
            blocko_blocks: [
                {
                    name: "NOT",
                    blockoName: "not",
                    backgroundColor: "rgb(161, 136, 127)"
                },
                {
                    name: "AND",
                    blockoName: "and",
                    backgroundColor: "rgb(161, 136, 127)"
                },
                {
                    name: "OR",
                    blockoName: "or",
                    backgroundColor: "rgb(161, 136, 127)"
                },
                {
                    name: "XOR",
                    blockoName: "xor",
                    backgroundColor: "rgb(161, 136, 127)"
                }
            ]
        },
        {
            id: "debug_blocks",
            name: "Debug Blocks",
            blocko_blocks: [
                {
                    name: "Switch",
                    blockoName: "switch",
                    backgroundColor: "rgb(204, 204, 255)"
                },
                {
                    name: "Push button",
                    blockoName: "pushButton",
                    backgroundColor: "rgb(204, 204, 255)"
                },
                {
                    name: "Digital output",
                    blockoName: "light",
                    backgroundColor: "rgb(204, 204, 255)"
                },
                {
                    name: "Analog input",
                    blockoName: "analogInput",
                    backgroundColor: "rgb(204, 255, 204)"
                },
                {
                    name: "Analog output",
                    blockoName: "analogOutput",
                    backgroundColor: "rgb(204, 255, 204)"
                }
            ]
        },
        {
            id: "js_blocks",
            name: "JavaScript Blocks",
            blocko_blocks: [
                {
                    name: "All in one example",
                    blockoDesignJson: "{\"displayName\":\"fa-font\",\"backgroundColor\":\"#32C5D2\",\"description\":\"All in one\"}",
                    blockoJsCode: "block.addDigitalInput(\"din1\", \"Digital input 1\");\nblock.addAnalogInput(\"anIn\", \"Analog input\");\nblock.addMessageInput(\"msgInTest\", \"Test message\", [ByzanceBool, ByzanceInt, ByzanceFloat, ByzanceString]);\n\nblock.addMessageOutput(\"msgOut\", \"Message output\", [ByzanceString]);\nblock.addAnalogOutput(\"aout\", \"Analog output\");\nblock.addDigitalOutput(\"digitalOut\", \"Digital output\");\n\nblock.addConfigProperty(ConfigPropertyType.Float, \"confOffset\", \"Analog offset\", 12.3);\n\nblock.configChanged = function () { // when config changed\n    block.aout(block.anIn() + block.confOffset());  \n}\n\nblock.init = function () { // when init\n    block.aout(block.anIn() + block.confOffset());  \n}\n\nblock.onAnIn = function (val) { // when change value of anIn analog input\n    block.aout(val + block.confOffset());  \n};\n\nblock.onMsgInTest = function (msg) { // when new message on msgInTest message input\n    block.msgOut(\"Test: \"+msg[3]);  \n};\n\nblock.inputsChanged = function () { // when change any analog or digital input\n	block.digitalOut(block.din1());\n};",
                    backgroundColor: "#32C5D2"
                },
                {
                    name: "Analog to digital example",
                    blockoDesignJson: "{\"displayName\":\"fa-line-chart\",\"backgroundColor\":\"#1BA39C\",\"description\":\"Analog to digital\"}",
                    blockoJsCode: "block.addAnalogInput(\"ain\", \"Analog input\");\nblock.addDigitalOutput(\"dout\", \"Digital output\");\n\nblock.addConfigProperty(ConfigPropertyType.Float, \"confMin\", \"Min\", 5, {range:true, min:0, max: 100});\nblock.addConfigProperty(ConfigPropertyType.Float, \"confMax\", \"Max\", 25, {range:true, min:0, max: 100});\n\n// when config changed, init or inputs changed\nblock.configChanged = block.init = block.inputsChanged = function () { \n    block.dout( block.confMin() <= block.ain() && block.ain() <= block.confMax() );  \n}",
                    backgroundColor: "#1BA39C"
                }
            ]
        }
    ];

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.blockoId = params["blocko"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onToggleGroup(groupId: string) {
        this.blockGroupsOpenToggle[groupId] = !this.blockGroupsOpenToggle[groupId];
    }

    onDragStop(params: DraggableEventParams) {

        var dragOffset = params.ui.offset;
        var blockoOffset = $(this.blockoView.field.nativeElement).offset();
        var blockoWidth = $(this.blockoView.field.nativeElement).width();
        var blockoHeight = $(this.blockoView.field.nativeElement).height();

        //var blockoOffset = $(this.blocko.field.nativeElement).width();

        if ((dragOffset.top >= blockoOffset.top) && (dragOffset.left >= blockoOffset.left) && (dragOffset.top <= (blockoOffset.top + blockoHeight)) && (dragOffset.left <= (blockoOffset.left + blockoWidth))) {
            var x = dragOffset.left - blockoOffset.left;
            var y = dragOffset.top - blockoOffset.top;

            if (params.data && params.data.id && this.blocksLastVersions[params.data.id]) {

                var wantedVersion = this.blocksLastVersions[params.data.id];
                var wantedVersionName = params.data.id + "_" + wantedVersion.id;

                if (this.blocksCache[wantedVersionName]) {

                    this.blockoView.addJsBlock(this.blocksCache[wantedVersionName].logic_json, this.blocksCache[wantedVersionName].design_json, x, y);

                } else {

                    // TODO: make only one request
                    this.backendService.getBlockoBlockVersion(wantedVersion.id)
                        .then((bbv) => {
                            this.blocksCache[wantedVersionName] = bbv;
                            this.blockoView.addJsBlock(this.blocksCache[wantedVersionName].logic_json, this.blocksCache[wantedVersionName].design_json, x, y);
                        })
                        .catch(reason => {
                            this.addFlashMessage(new FlashMessageError(`The blocko block version cannot be loaded.`, reason));
                        });

                }


            } else if (params.data && params.data.blockoName) {

                this.blockoView.addStaticBlock(params.data.blockoName, x, y);

            } else if (params.data && params.data.blockoJsCode) {

                this.blockoView.addJsBlock(params.data.blockoJsCode, params.data.blockoDesignJson, x, y);

            } else {
                this.addFlashMessage(new FlashMessageError(`The blocko block cannot be added.`));
            }

        }

    }

    onDragStart(params: DraggableEventParams) {

        // prefetch
        if (params.data && params.data.id && this.blocksLastVersions[params.data.id]) {
            var wantedVersion = this.blocksLastVersions[params.data.id];
            var wantedVersionName = params.data.id + "_" + wantedVersion.id;
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

    getCProgramsForBoardType(boardTypeId: string): ICProgram[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.c_programs) return [];
        return this.allBoardsDetails.c_programs.filter((cp) => (cp.type_of_board_id == boardTypeId));
    }

    hwCProgramVersionChanged(hwObj: IBPair, cProgramVersion: string) {
        hwObj.c_program_version_id = cProgramVersion;

        this.updateBlockoInterfaces();
    }

    hwRemove(hwId: string) {
        var i = -1;
        this.selectedHardware.forEach((sh, index) => {
            if (sh.main_board_pair && sh.main_board_pair.board_id == hwId) {
                i = index;
            }
        });
        if (i > -1) {
            this.selectedHardware.splice(i, 1);
        } else {
            this.selectedHardware.forEach((sh) => {
                if (sh.device_board_pairs && Array.isArray(sh.device_board_pairs)) {
                    var ii = -1;
                    sh.device_board_pairs.forEach((b, index) => {
                        if (b.board_id == hwId) {
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
        var out: string[] = [];
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
                    })
                }
            })
        }
        return out;
    }

    getAllFreeMainBoards(): IBoard[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.boards) return [];
        var used = this.getAllUsedHwIds();
        var out: IBoard[] = [];
        this.allBoardsDetails.boards.forEach((b) => {
            if (b.main_board && used.indexOf(b.id) == -1) {
                out.push(b);
            }
        });
        return out;
    }

    getAllFreeSubBoards(): IBoard[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.boards) return [];
        var used = this.getAllUsedHwIds();
        var out: IBoard[] = [];
        this.allBoardsDetails.boards.forEach((b) => {
            if (!b.main_board && used.indexOf(b.id) == -1) {
                out.push(b);
            }
        });
        return out;
    }

    gridAdd() {
        if (!this.allGridProjects) return;

        var projects = this.allGridProjects.filter((gp) => !this.selectedGridProgramVersions[gp.id]);

        if (!projects.length) return; //TODO: inform or disable button

        var m = new ModalsBlockoAddGridModel(projects);
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
            var mainBoards = this.getAllFreeMainBoards();

            if (!mainBoards || mainBoards.length == 0) {
                this.modalService.showModal(new ModalsConfirmModel("Error", "No available main boards hardware.", true, "OK", null));
                return;
            }

            var m = new ModalsBlockoAddHardwareModel(mainBoards);
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

            var subBoards = this.getAllFreeSubBoards();

            if (!subBoards || subBoards.length == 0) {
                this.modalService.showModal(new ModalsConfirmModel("Error", "No available padavan boards hardware.", true, "OK", null));
                return;
            }

            var m = new ModalsBlockoAddHardwareModel(subBoards);
            this.modalService.showModal(m)
                .then((success) => {
                    if (success && m.selectedBoard) {

                        var parentObj = this.selectedHardware.find((sh) => (sh.main_board_pair && sh.main_board_pair.board_id && sh.main_board_pair.board_id == parentHwId));

                        if (!parentObj.device_board_pairs) parentObj.device_board_pairs = [];
                        parentObj.device_board_pairs.push({
                            board_id: m.selectedBoard.id,
                            c_program_version_id: null
                        });

                        this.updateBlockoInterfaces();

                    }
                });
        }

    }

    getCProgramVersionById(programVersionId: string): ICProgramVersion {
        var ret: ICProgramVersion = null;

        if (this.allBoardsDetails && this.allBoardsDetails.c_programs) {

            this.allBoardsDetails.c_programs.forEach((cp) => {
                if (cp.program_versions) {
                    cp.program_versions.forEach((pv) => {
                        if (pv.version_object.id == programVersionId) {
                            ret = pv;
                        }
                    })
                }
            });
        }

        return ret;
    }

    getTargetNameByBoardTypeId(boardTypeId: string): string {
        var out: string = null;
        if (this.allBoardsDetails && this.allBoardsDetails.type_of_boards) {
            this.allBoardsDetails.type_of_boards.forEach((tob) => {
                if (tob.id == boardTypeId) {
                    out = tob.target_name;
                }
            })
        }
        return out;
    }

    updateBlockoInterfaces(): void {

        console.log(this.selectedGridProgramVersions);

        var outInterface: BlockoTargetInterface[] = [];

        var addInterface = (hwId: string, cProgramVersionId: string) => {
            if (hwId && cProgramVersionId) {
                var board = this.boardById[hwId];
                var targetName: string = null;
                if (board) {
                    targetName = this.getTargetNameByBoardTypeId(board.type_of_board_id);
                }
                var cpv = this.getCProgramVersionById(cProgramVersionId);

                if (board && targetName && cpv && cpv.virtual_input_output) {
                    var interfaceData = JSON.parse(cpv.virtual_input_output);
                    if (interfaceData) {
                        outInterface.push({
                            "targetType": targetName,
                            "targetId": hwId,
                            "displayName": board.personal_description ? board.personal_description : board.id,
                            "interface": interfaceData
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

                if (!this.selectedGridProgramVersions[gp.id]) return;

                var out: any = {
                    analogInputs: {},
                    digitalInputs: {},
                    messageInputs: {},
                    analogOutputs: {},
                    digitalOutputs: {},
                    messageOutputs: {},
                };

                if (gp.m_programs) {
                    gp.m_programs.forEach((p) => {

                        if (p.program_versions && this.selectedGridProgramVersions[gp.id] && (this.selectedGridProgramVersions[gp.id][p.id])) {

                            var programVersion = p.program_versions.find((pv)=> (pv.version_object.id == this.selectedGridProgramVersions[gp.id][p.id]));

                            if (programVersion) {

                                var iface: any = {};
                                try {
                                    iface = JSON.parse(programVersion.virtual_input_output);
                                } catch (e) {
                                    console.log(e);
                                }

                                if (iface.analogInputs) {
                                    for (var k in iface.analogInputs) {
                                        if (!iface.analogInputs.hasOwnProperty(k)) continue;
                                        if (!out.analogInputs[k]) out.analogInputs[k] = iface.analogInputs[k];
                                    }
                                }

                                if (iface.digitalInputs) {
                                    for (var k in iface.digitalInputs) {
                                        if (!iface.digitalInputs.hasOwnProperty(k)) continue;
                                        if (!out.digitalInputs[k]) out.digitalInputs[k] = iface.digitalInputs[k];
                                    }
                                }

                                if (iface.messageInputs) {
                                    for (var k in iface.messageInputs) {
                                        if (!iface.messageInputs.hasOwnProperty(k)) continue;
                                        if (!out.messageInputs[k]) out.messageInputs[k] = iface.messageInputs[k];
                                    }
                                }

                                if (iface.analogOutputs) {
                                    for (var k in iface.analogOutputs) {
                                        if (!iface.analogOutputs.hasOwnProperty(k)) continue;
                                        if (!out.analogOutputs[k]) out.analogOutputs[k] = iface.analogOutputs[k];
                                    }
                                }

                                if (iface.digitalOutputs) {
                                    for (var k in iface.digitalOutputs) {
                                        if (!iface.digitalOutputs.hasOwnProperty(k)) continue;
                                        if (!out.digitalOutputs[k]) out.digitalOutputs[k] = iface.digitalOutputs[k];
                                    }
                                }

                                if (iface.messageOutputs) {
                                    for (var k in iface.messageOutputs) {
                                        if (!iface.messageOutputs.hasOwnProperty(k)) continue;
                                        if (!out.messageOutputs[k]) out.messageOutputs[k] = iface.messageOutputs[k];
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
                        "targetType": "grid_project",
                        "targetId": gp.id,
                        "displayName": gp.name,
                        "interface": out
                    });
                }

            });

        }

        console.log(JSON.stringify(outInterface));

        this.blockoView.setInterfaces(outInterface);


    }

    onProgramVersionClick(programVersion: IBProgramVersion): void {
        this.selectProgramVersion(programVersion);
    }

    onRunProgramVersionClick(programVersion: IBProgramVersion): void {

        var m = new ModalsConfirmModel("Run program", "Really want run Blocko program version <b>" + programVersion.version_object.version_name + "</b>?");
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.backendService.uploadBProgramToCloud(programVersion.version_object.id, {}) //TODO: timestamp
                        .then((ok)=> {
                            this.addFlashMessage(new FlashMessageSuccess("Run Blocko version <b>" + programVersion.version_object.version_name + "</b> successfully.", null, true));
                        })
                        .catch((err)=> {
                            this.addFlashMessage(new FlashMessageError("Run Blocko version <b>" + programVersion.version_object.version_name + "</b> failed.", err, true));
                        })
                }
            });
    }

    onClearClick(): void {
        var m = new ModalsConfirmModel("Clear program", "Really want clear Blocko program?");
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
        var validHw = true;

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
            this.modalService.showModal(new ModalsConfirmModel("Error", "Cannot save blocko now, you have <b>hardware devices</b>, without program <b>version selected</b>.", true, "OK", null));
            return;
        }

        // Grid validation

        var validGrid = true;
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
            this.modalService.showModal(new ModalsConfirmModel("Error", "Cannot save blocko now, you have <b>grid programs</b>, without program <b>version selected</b>.", true, "OK", null));
            return;
        }


        // save dialog
        var m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
        this.modalService.showModal(m).then((success) => {
            if (success) {

                var mProjectSnapshots: IMProjectSnapShot[] = [];

                for (var projectId in this.selectedGridProgramVersions) {
                    if (!this.selectedGridProgramVersions.hasOwnProperty(projectId)) continue;
                    var programSnapshots: IMProgramSnapShot[] = [];

                    for (var programId in this.selectedGridProgramVersions[projectId]) {
                        if (!this.selectedGridProgramVersions[projectId].hasOwnProperty(programId)) continue;
                        programSnapshots.push({
                            m_program_id: programId,
                            version_object_id: this.selectedGridProgramVersions[projectId][programId]
                        });
                    }

                    mProjectSnapshots.push({
                        m_program_snapshots: programSnapshots,
                        m_project_id: projectId
                    })
                }

                console.log(mProjectSnapshots);

                this.backendService.createBProgramVersion(this.blockoId, {
                    version_name: m.name,
                    version_description: m.description,
                    hardware_group: this.selectedHardware,
                    m_project_snapshots: mProjectSnapshots,
                    program: this.blockoView.getDataJson()
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("Version <b>" + m.name + "</b> saved successfully.", null, true));
                        this.refresh();
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError("Failed saving version <b>" + m.name + "</b>", err, true));
                    });
            }
        });


    }

    selectProgramVersion(programVersion: IBProgramVersion): void {

        if (!this.blockoProgramVersions) return;
        if (this.blockoProgramVersions.indexOf(programVersion) == -1) return;

        this.selectedProgramVersion = programVersion;
        this.selectedHardware = this.hardwareGroupCopy(this.selectedProgramVersion.hardware_group) || [];

        this.selectedGridProgramVersions = {};
        programVersion.m_project_program_snapshots.forEach((pps) => {
            this.selectedGridProgramVersions[pps.m_project_id] = {};
            if (pps.m_program_snapshots) {
                pps.m_program_snapshots.forEach((ps) => {
                    this.selectedGridProgramVersions[pps.m_project_id][ps.m_program_id] = ps.version_object_id;
                });
            }

        });

        console.log(this.selectedGridProgramVersions);

        this.blockoView.setDataJson(this.selectedProgramVersion.program);

    }

    hardwareGroupCopy(hwGroup: IHardwareGroup[]): IHardwareGroup[] {
        if (!hwGroup) return null;
        var out: IHardwareGroup[] = [];
        hwGroup.forEach((hg)=> {
            var hgCopy: IHardwareGroup = {
                main_board_pair: {
                    board_id: hg.main_board_pair.board_id,
                    c_program_version_id: hg.main_board_pair.c_program_version_id
                },
                device_board_pairs: []
            };

            if (hg.device_board_pairs) {
                hg.device_board_pairs.forEach((dbp)=> {
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

    refresh(): void {
        /*this.backendService.getProject(this.projectId)
         .then((project:Project) => {
         this.project = project;
         return this.backendService.getInteractionsScheme(this.blockoId);
         })
         .catch(reason => {
         this.addFlashMessage(new FlashMessageError(`The blocko cannot be loaded.`, reason));
         });*/
        this.backendService.getBProgram(this.blockoId)
            .then((blockoProgram) => {
                console.log(blockoProgram);

                this.blockoProgram = blockoProgram;

                this.blockoProgramVersions = this.blockoProgram.program_versions || [];

                this.blockoProgramVersions.sort((a, b)=> {
                    if (a.version_object.date_of_create == b.version_object.date_of_create) return 0;
                    if (a.version_object.date_of_create > b.version_object.date_of_create) return -1;
                    return 1;
                });

                if (this.blockoProgramVersions.length) {
                    this.selectProgramVersion(this.blockoProgramVersions[0]);
                }

            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The blocko cannot be loaded.`, reason));
            });

        this.backendService.getAllTypeOfBlocks()
            .then((typeOfBlocks)=> {

                // TODO: make this better viz. TYRION-374
                this.blocksLastVersions = {};
                this.blocksColors = {};
                this.blocksIcons = {};

                typeOfBlocks.forEach((tob) => {
                    tob.blocko_blocks.forEach((bb) => {
                        var sortedVersion = bb.versions.sort((a, b)=> {
                            return parseInt(b.id) - parseInt(a.id);
                        });
                        if (sortedVersion.length) {
                            this.blocksLastVersions[bb.id] = sortedVersion[0];
                            if (this.blocksLastVersions[bb.id]) {
                                var version = this.blocksLastVersions[bb.id];
                                try {
                                    var dj = JSON.parse(version.design_json);
                                    if (dj["backgroundColor"]) {
                                        this.blocksColors[bb.id] = dj["backgroundColor"];
                                    }
                                    if (dj["displayName"] && dj["displayName"].indexOf("fa-") == 0) {
                                        this.blocksIcons[bb.id] = dj["displayName"];
                                    }
                                } catch (e) {
                                    console.log("DesignJson parse error:" + e);
                                }
                            }
                        }
                    });
                });

                this.blockGroups = typeOfBlocks;

                console.log(typeOfBlocks);
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`List of blocks cannot be loaded.`, reason));
            });

        this.backendService.getAllMProjectPersons()
            .then((projects) => {
                console.log(projects);
                this.allGridProjects = projects;
            });

        this.backendService.getAllBoardDetails(this.projectId)
            .then((allBoardsDetails)=> {
                this.allBoardsDetails = allBoardsDetails;

                console.log(allBoardsDetails);

                this.boardById = {};
                this.allBoardsDetails.boards.forEach((board) => {
                    this.boardById[board.id] = board;
                });

            });
    }

}
