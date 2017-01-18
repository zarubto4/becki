/**
 * Created by davidhradek on 22.09.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {Subscription} from "rxjs/Rx";
import {
    IBlockoBlock, IBlockoBlockVersion,
    ITypeOfBlock, IBlockoBlockVersionShortDetail, ITypeOfBlockShortDetail
} from "../backend/TyrionAPI";
import {BlockoView} from "../components/BlockoView";
import {Blocks, Core} from "blocko";
import {FormGroup, Validators} from "@angular/forms";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {ModalsVersionDialogModel} from "../modals/version-dialog";
import {Types, Libs} from "common-lib";
import {TypescriptBuildError, SafeMachineError} from "script-engine";

import moment = require("moment/moment");
import {MonacoEditorLoaderService} from "../services/MonacoEditorLoaderService";
import {ConsoleLog, ConsoleLogType} from "../components/ConsoleLog";

@Component({
    selector: "view-projects-project-blocks-blocks-block",
    templateUrl: "app/views/projects-project-blocks-blocks-block.html",
})
export class ProjectsProjectBlocksBlocksBlockComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockId: string;
    blocksId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    //project: IProject = null;

    group: ITypeOfBlockShortDetail = null;

    blockoBlock: IBlockoBlock = null;

    blockoBlockVersions: IBlockoBlockVersionShortDetail[] = [];
    selectedBlockoBlockVersion: IBlockoBlockVersion = null;


    connectorTypes = Types.ConnectorType;
    argTypes = Types.Type;

    blockForm: FormGroup = null;
    blockCode: string = "";// "block.addDigitalInput(\"din1\", \"Digital input 1\");\nblock.addAnalogInput(\"anIn\", \"Analog input\");\nblock.addMessageInput(\"msgInTest\", \"Test message\", [ByzanceBool, ByzanceInt, ByzanceFloat, ByzanceString]);\n\nblock.addMessageOutput(\"msgOut\", \"Message output\", [ByzanceBool, ByzanceString]);\nblock.addAnalogOutput(\"aout\", \"Analog output\");\nblock.addDigitalOutput(\"digitalOut\", \"Digital output\");\n\nblock.addConfigProperty(ConfigPropertyType.Float, \"confOffset\", \"Analog offset\", 44.6);\n\nblock.init = block.configChanged = function () { // when init and config changed\n    block.aout(block.anIn() + block.confOffset());  \n}\n\nblock.onAnIn = function (val) { // when change value of anIn analog input\n    block.aout(val + block.confOffset());  \n};\n\nblock.onMsgInTest = function (msg) { // when new message on msgInTest message input\n    block.msgOut(msg[0],\"S:\"+msg[3]+\" N:\"+(msg[1]+msg[2]));\n};\n\nblock.inputsChanged = function () { // when change any analog or digital input\n    block.digitalOut(block.din1());\n};";

    tsErrors: { name: string, message: string, line?:number }[] = [];

    // Properties for test view:
    @ViewChild(BlockoView)
    blockoView: BlockoView;
    tsBlock: Blocks.TSBlock;
    tsBlockHeight: number = 0;
    testInputConnectors: Core.Connector[];
    messageInputsValueCache: { [key: string]: boolean|number|string } = {};
    successfullyTested: boolean = false;

    @ViewChild(ConsoleLog)
    consoleLog: ConsoleLog;

    private monacoEditorLoaderService:MonacoEditorLoaderService = null;

    constructor(injector: Injector) {
        super(injector);

        this.monacoEditorLoaderService = injector.get(MonacoEditorLoaderService);

        this.blockForm = this.formBuilder.group({
            "color": ["#3baedb", [Validators.required]],
            "icon": ["fa-question", [Validators.required]],
            "description": [""]
        });
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.blockId = params["block"];
            this.blocksId = params["blocks"];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.group = project.type_of_blocks.find((tb) => tb.id == this.blocksId);
            });
            this.refresh();
        });
        this.monacoEditorLoaderService.registerTypings([Blocks.TSBlockLib, Libs.ConsoleLib, Libs.UtilsLib]);

    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) this.projectSubscription.unsubscribe();
    }

    onBlocksGroupClick(groupId:string) {
        this.navigate(["/projects", this.currentParamsService.get("project"), "blocks", groupId]);
    }

    newBlockCode(code: string) {
        this.successfullyTested = false;
        this.blockCode = code;
    }

    refresh(): void {

        this.blockUI();
        this.backendService.getBlockoBlock(this.blockId)
            .then((blockoBlock) => {
                console.log(blockoBlock);

                this.blockoBlock = blockoBlock;

                this.blockoBlockVersions = this.blockoBlock.versions || [];

                this.blockoBlockVersions.sort((a, b)=> {
                    if (a.date_of_create == b.date_of_create) return 0;
                    if (a.date_of_create > b.date_of_create) return -1;
                    return 1;
                });

                if (this.blockoBlockVersions.length) {
                    this.selectBlockVersion(this.blockoBlockVersions[0]); // also unblockUI
                } else {
                    this.unblockUI();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The block cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

    onBlockoBlockVersionClick(version: IBlockoBlockVersionShortDetail) {
        this.selectBlockVersion(version);
    }

    selectBlockVersion(version: IBlockoBlockVersionShortDetail) {
        this.blockUI();
        this.backendService.getBlockoBlockVersion(version.id)
            .then((blockoBlockVersion) => {

                console.log(blockoBlockVersion);

                this.cleanTestView();

                this.selectedBlockoBlockVersion = blockoBlockVersion;

                this.blockCode = this.selectedBlockoBlockVersion.logic_json;

                let designJson = JSON.parse(this.selectedBlockoBlockVersion.design_json);

                if (designJson.backgroundColor) this.blockForm.controls["color"].setValue(designJson.backgroundColor);
                if (designJson.displayName) this.blockForm.controls["icon"].setValue(designJson.displayName);
                if (designJson.description) this.blockForm.controls["description"].setValue(designJson.description);

                this.unblockUI();
            })
            .catch(reason => {
                this.selectedBlockoBlockVersion = null;
                console.log(this.blockCode);
                this.addFlashMessage(new FlashMessageError(`The block version cannot be loaded.`, reason));
                this.unblockUI();
            });
    }

    toReadableValue(value: any): string {
        if (typeof value == "boolean") {
            if (value) {
                return "<span class='bold font-red'>true</span>"
            } else {
                return "<span class='bold font-blue'>false</span>"
            }
        }
        if (typeof value == "number") {
            return "<span class='bold font-green-jungle'>" + value + "</span>"
        }
        if (typeof value == "string") {
            return "<span class='bold font-yellow-casablanca'>\"" + value + "\"</span>"
        }
        if (value.values && Array.isArray(value.values)) {
            return "[" + value.values.map((val: any)=>this.toReadableValue(val)).join(", ") + "]"
        }
        return JSON.stringify(value);
    }

    onDigitalInputClick(connector: Core.Connector): void {
        connector._inputSetValue(!connector.value);
    }

    onAnalogInputChange(event: Event, connector: Core.Connector): void {
        let f = parseFloat((<HTMLInputElement>event.target).value);
        connector._inputSetValue(!isNaN(f) ? f : 0);
    }

    onMessageInputSendClick(connector: Core.Connector): void {
        let values: any[] = [];

        connector.argTypes.forEach((argType, index)=> {
            let val = this.messageInputsValueCache[connector.name + argType];
            if (argType == Types.Type.Boolean) {
                if (!val) {
                    val = false;
                } else {
                    val = !!val;
                }

            }
            if (argType == Types.Type.Float) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseFloat(<string>val);
                }
            }
            if (argType == Types.Type.Integer) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseInt(<string>val);
                }
            }
            if (argType == Types.Type.String && !val) {
                val = "";
            }

            values.push(val)
        });

        let m = new Core.Message(connector.argTypes, values);
        connector._inputSetValue(m);

    }

    validate() {
        /*
         if (msg.indexOf("is not defined") > -1) {
         let index = msg.indexOf("is not defined");
         msg = "<b>" + msg.substr(0, index) + "</b>" + msg.substr(index);
         }

         if (msg.indexOf("is not a function") > -1) {
         let index = msg.indexOf("is not a function");
         msg = "<b>" + msg.substr(0, index) + "</b>" + msg.substr(index);
         }

         if (msg.indexOf("Unexpected token") == 0) {
         let len = "Unexpected token".length;
         msg = msg.substr(0, len) + "<b>" + msg.substr(len) + "</b>";
         }
         */

    }

    cleanTestView(): void {
        this.blockoView.removeAllBlocksWithoutReadonlyCheck();
        this.tsBlock = null;
        this.successfullyTested = false;
        if (this.consoleLog) this.consoleLog.clear();
        this.testInputConnectors = [];
        this.tsBlockHeight = 0;
        this.messageInputsValueCache = {};
    }

    onBlockoLog(bl:{block:Core.Block, type: string, message: string}): void {
        if (this.consoleLog) this.consoleLog.add(<ConsoleLogType>bl.type, bl.message);
    }

    onBlockoError(be:{block:Core.Block, error: any}): void {

        if (be && be.error) {

            if (be.error instanceof TypescriptBuildError) {

                if (!be.error.diagnostics) {
                    this.tsErrors.push({name: "TypeScript Error", message: be.error.message});
                } else {

                    be.error.diagnostics.forEach((d) => {
                        this.tsErrors.push({
                            name: "TypeScript Error #"+d.code,
                            line: this.blockCode.substr(0,Math.min(d.start,this.blockCode.length)).split("\n").length,
                            message: d.messageText
                        });
                    })

                }
                this.cleanTestView();
            } else {
                if (this.consoleLog) this.consoleLog.addFromError(be.error);
            }

        }

    }

    onTestClick(): void {
        this.cleanTestView();
        this.tsErrors = [];

        if (!this.blockCode) {
            this.tsErrors.push({name: "Block Error", message: "Block code cannot be empty"});
            return;
        }

        if (this.tsErrors.length == 0) {


            try {
                let designJson = JSON.stringify({
                    backgroundColor: this.blockForm.controls["color"].value,
                    displayName: this.blockForm.controls["icon"].value,
                    description: this.blockForm.controls["description"].value
                });
                this.tsBlock = this.blockoView.addTsBlockWithoutReadonlyCheck("", designJson, 20, 10);
            } catch (e) {
            }

            this.tsBlock.registerOutputEventCallback((connector: Core.Connector, eventType: Core.ConnectorEventType, value: (boolean|number|Core.Message)) => {
                if (this.consoleLog) this.consoleLog.add("output", "Output <strong>"+connector.name+"</strong> = "+ this.toReadableValue(value));
            });

            this.tsBlock.setCode(this.blockCode);

            // build errors can clean test view ... must check if still exist
            if (this.tsBlock) {
                this.testInputConnectors = this.tsBlock.getInputConnectors();

                this.tsBlockHeight = this.tsBlock.rendererGetBlockSize().height + 20; // for borders

                this.successfullyTested = true;
            }

        }

    }

    onSaveClick(): void {
        if (!this.successfullyTested) return;

        let m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
        this.modalService.showModal(m).then((success) => {
            if (success) {

                let designJson = JSON.stringify({
                    backgroundColor: this.blockForm.controls["color"].value,
                    displayName: this.blockForm.controls["icon"].value,
                    description: this.blockForm.controls["description"].value
                });

                this.blockUI();
                this.backendService.createBlockoBlockVersion(this.blockId, {
                    version_name: m.name,
                    version_description: m.description,
                    logic_json: this.blockCode,
                    design_json: designJson
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("Version <b>" + m.name + "</b> saved successfully."));
                        this.refresh(); // also unblockUI
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError("Failed saving version <b>" + m.name + "</b>", err));
                        this.unblockUI();
                    });
            }
        });

    }

}
