/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {
    IProject, IBProgram, ITypeOfBlock, IBlockoBlock, IBlockoBlockShortVersion,
    IBlockoBlockVersion, IBoardsForBlocko, IHardwareGroup, IBoard, ICProgramVersion, ICProgram,
    IBProgramVersion, IBPair, IMProject
} from "../backend/TyrionAPI";
import {BlockoView} from "../components/BlockoView";
import {Draggable, DraggableEventParams} from "../components/Draggable";
import {CProgramVersionSelector} from "../components/CProgramVersionSelector";
import {ModalsBlockoAddHardwareModel} from "../modals/blocko-add-hardware";
import {ModalsConfirmModel} from "../modals/confirm";
import {BlockoTargetInterface} from "blocko";
import {ModalsVersionDialogModel} from "../modals/version-dialog";


declare var $:JQueryStatic;
import moment = require("moment/moment");
import {ModalsBlockoAddGridModel} from "../modals/blocko-add-grid";

@Component({
    selector: "view-projects-project-blocko-blocko",
    templateUrl: "app/views/projects-project-blocko-blocko.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain, BlockoView, Draggable, CProgramVersionSelector],
})
export class ProjectsProjectBlockoBlockoComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockoId: string;

    routeParamsSubscription:Subscription;

    project:IProject = null;
    blockoProgram:IBProgram = null;

    advancedMode:boolean = false;

    // blocko blocks:

    blockGroups:ITypeOfBlock[] = null;
    blockGroupsOpenToggle:{[id:string]:boolean} = {};

    blocksLastVersions:{[id:string]:IBlockoBlockShortVersion} = {};

    blocksCache:{[blockId_versionId:string]:IBlockoBlockVersion} = {};


    // hw:

    allBoardsDetails:IBoardsForBlocko = null;

    boardById:{ [id:string]:IBoard } = {};

    selectedHardware:IHardwareGroup[] = [];

    // grid:

    allGridProjects:IMProject[] = null;

    selectedGridProjects:IMProject[] = [];

    // versions:

    blockoProgramVersions:IBProgramVersion[] = null;
    selectedProgramVersion:IBProgramVersion = null;

    @ViewChild(BlockoView)
    blockoView:BlockoView;

    draggableOptions:JQueryUI.DraggableOptions = {
        helper: "clone",
        containment: "document",
        cursor: "move",
        cursorAt: {left:-5, top: -5}
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

    constructor(injector:Injector) {super(injector)};

    ngOnInit():void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.blockoId = params["blocko"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    onToggleGroup(groupId:string) {
        this.blockGroupsOpenToggle[groupId] = !this.blockGroupsOpenToggle[groupId];
    }

    onDragStop(params:DraggableEventParams) {

        var dragOffset = params.ui.offset;
        var blockoOffset = $(this.blockoView.field.nativeElement).offset();
        var blockoWidth = $(this.blockoView.field.nativeElement).width();
        var blockoHeight = $(this.blockoView.field.nativeElement).height();

        //var blockoOffset = $(this.blocko.field.nativeElement).width();

        if ((dragOffset.top >= blockoOffset.top) && (dragOffset.left >= blockoOffset.left) && (dragOffset.top <= (blockoOffset.top+blockoHeight)) && (dragOffset.left <= (blockoOffset.left+blockoWidth))) {
            var x = dragOffset.left - blockoOffset.left;
            var y = dragOffset.top - blockoOffset.top;

            if (params.data && params.data.id && this.blocksLastVersions[params.data.id]) {

                var wantedVersion = this.blocksLastVersions[params.data.id];
                var wantedVersionName = params.data.id+"_"+wantedVersion.id;

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

    onDragStart(params:DraggableEventParams) {

        // prefetch
        if (params.data && params.data.id && this.blocksLastVersions[params.data.id]) {
            var wantedVersion = this.blocksLastVersions[params.data.id];
            var wantedVersionName = params.data.id+"_"+wantedVersion.id;
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

    getCProgramsForBoardType(boardTypeId:string):ICProgram[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.c_programs) return [];
        return this.allBoardsDetails.c_programs.filter((cp) => (cp.type_of_board_id == boardTypeId));
    }

    hwCProgramVersionChanged(hwObj:IBPair, cProgramVersion:string) {
        hwObj.c_program_version_id = cProgramVersion;

        this.updateBlockoInterfaces();
    }

    hwRemove(hwId:string) {
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

    getAllUsedHwIds():string[] {
        var out:string[] = [];
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

    getAllFreeMainBoards():IBoard[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.boards) return [];
        var used = this.getAllUsedHwIds();
        var out:IBoard[] = [];
        this.allBoardsDetails.boards.forEach((b) => {
            if (b.main_board && used.indexOf(b.id) == -1) {
                out.push(b);
            }
        });
        return out;
    }

    getAllFreeSubBoards():IBoard[] {
        if (!this.allBoardsDetails || !this.allBoardsDetails.boards) return [];
        var used = this.getAllUsedHwIds();
        var out:IBoard[] = [];
        this.allBoardsDetails.boards.forEach((b) => {
            if (!b.main_board && used.indexOf(b.id) == -1) {
                out.push(b);
            }
        });
        return out;
    }

    gridAdd() {
        if (!this.allGridProjects) return;

        var projects = this.allGridProjects.filter((gp) => this.selectedGridProjects.indexOf(gp) == -1);

        if (!projects.length) return; //TODO: inform or disable button

        var m = new ModalsBlockoAddGridModel(projects);
        this.modalService.showModal(m)
            .then((success) => {
                if (success && m.selectedGridProject) {
                    this.selectedGridProjects.push(m.selectedGridProject);
                    this.updateBlockoInterfaces();
                }
            });
    }

    gridRemove(gridProject:IMProject) {
        var i = this.selectedGridProjects.indexOf(gridProject);
        if (i > -1) {
            this.selectedGridProjects.splice(i, 1);
            this.updateBlockoInterfaces();
        }
    }

    hwAdd(parentHwId:string = null) {

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

    getCProgramVersionById(programVersionId:string):ICProgramVersion {
        var ret:ICProgramVersion = null;

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

    getTargetNameByBoardTypeId(boardTypeId:string):string {
        var out:string = null;
        if (this.allBoardsDetails && this.allBoardsDetails.type_of_boards) {
            this.allBoardsDetails.type_of_boards.forEach((tob) => {
                if (tob.id == boardTypeId) {
                    out = tob.target_name;
                }
            })
        }
        return out;
    }

    updateBlockoInterfaces():void {

        var outInterface:BlockoTargetInterface[] = [];

        var addInterface = (hwId:string, cProgramVersionId:string) => {
            console.log("hwId"+hwId+" cProgramVersionId"+cProgramVersionId);
            if (hwId && cProgramVersionId) {
                var board = this.boardById[hwId];
                var targetName:string = null;
                if (board) {
                    targetName = this.getTargetNameByBoardTypeId(board.type_of_board_id);
                }
                var cpv = this.getCProgramVersionById(cProgramVersionId);

                console.log("board"+board);
                console.log("targetName"+targetName);
                console.log("cpv"+cpv);

                if (board && targetName && cpv && cpv.virtual_input_output) {
                    var interfaceData = JSON.parse(cpv.virtual_input_output);
                    if (interfaceData) {
                        outInterface.push({
                            "targetType": targetName,
                            "targetId": hwId,
                            "displayName": board.personal_description?board.personal_description:board.id,
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

        if (this.selectedGridProjects) {

            this.selectedGridProjects.forEach((gp) => {

                var out = {
                    analogInputs: {},
                    digitalInputs: {},
                    messageInputs: {},
                    analogOutputs: {},
                    digitalOutputs: {},
                    messageOutputs: {},
                };

                if (gp.m_programs) {
                    gp.m_programs.forEach((p) => {

                        if (p.program_versions && p.program_versions.length) {
                            var iface = JSON.parse(p.program_versions[0].virtual_input_output);

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

                    });
                }

                outInterface.push({
                    "targetType": "grid_project",
                    "targetId": gp.id,
                    "displayName": gp.name,
                    "interface": out
                });

            });

        }

        console.log(JSON.stringify(outInterface));

        this.blockoView.setInterfaces(outInterface);


    }

    onProgramVersionClick(programVersion:IBProgramVersion):void {
        this.selectProgramVersion(programVersion);
    }

    onRunProgramVersionClick(programVersion:IBProgramVersion):void {

        var m = new ModalsConfirmModel("Run program", "Really want run Blocko program version <b>"+programVersion.version_object.version_name+"</b>?");
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.backendService.uploadBProgramToCloud(programVersion.version_object.id)
                        .then((ok)=> {
                            this.addFlashMessage(new FlashMessageSuccess("Run Blocko version <b>"+programVersion.version_object.version_name+"</b> successfully.", null, true));
                        })
                        .catch((err)=> {
                            this.addFlashMessage(new FlashMessageError("Run Blocko version <b>"+programVersion.version_object.version_name+"</b> failed.", err, true));
                        })
                }
            });
    }

    onClearClick():void {
        var m = new ModalsConfirmModel("Clear program", "Really want clear Blocko program?");
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockoView.removeAllBlocks();
                }
            });
    }

    onSaveClick():void {

        var m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
        this.modalService.showModal(m).then((success) => {
            if (success) {

                this.backendService.createBProgramVersion(this.blockoId, {
                    version_name: m.name,
                    version_description: m.description,
                    hardware_group: this.selectedHardware,
                    program: this.blockoView.getDataJson()
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("Version <b>"+m.name+"</b> saved successfully.", null, true));
                        this.refresh();
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError("Failed saving version <b>"+m.name+"</b>", err, true));
                    });
            }
        });


    }

    selectProgramVersion(programVersion:IBProgramVersion):void {

        if (!this.blockoProgramVersions) return;
        if (this.blockoProgramVersions.indexOf(programVersion) == -1) return;

        this.selectedProgramVersion = programVersion;
        this.selectedHardware = this.hardwareGroupCopy(this.selectedProgramVersion.hardware_group) || [];
        this.blockoView.setDataJson(this.selectedProgramVersion.program);

    }

    hardwareGroupCopy(hwGroup:IHardwareGroup[]):IHardwareGroup[] {
        if (!hwGroup) return null;
        var out:IHardwareGroup[] = [];
        hwGroup.forEach((hg)=>{
            var hgCopy:IHardwareGroup = {
                main_board_pair: {
                    board_id: hg.main_board_pair.board_id,
                    c_program_version_id: hg.main_board_pair.c_program_version_id
                },
                device_board_pairs: []
            };

            if (hg.device_board_pairs) {
                hg.device_board_pairs.forEach((dbp)=>{
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

    refresh():void {
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
                typeOfBlocks.forEach((tob) => {
                    tob.blocko_blocks.forEach((bb) => {
                        var sortedVersion = bb.versions.sort((a,b)=> {
                            return parseInt(b.id) - parseInt(a.id);
                        });
                        if (sortedVersion.length) {
                            this.blocksLastVersions[bb.id] = sortedVersion[0];
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
