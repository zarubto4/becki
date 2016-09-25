/**
 * Created by davidhradek on 22.09.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {IDEComponent} from "../lib-becki/field-ide";
import {CodeIDE, CodeFile} from "../components/CodeIDE";
import {ModalsConfirmModel} from "../modals/confirm";
import {ModalsVersionDialogModel} from "../modals/version-dialog";
import {IProject, ICProgram, ICProgramVersion, IUserFiles} from "../backend/TyrionAPI";
import {ICodeCompileErrorMessage, CodeCompileError} from "../backend/BeckiBackend";
import {AceEditor} from "../components/AceEditor";
import {BlockoView} from "../components/BlockoView";
import {Blocks} from "blocko";


import moment = require("moment/moment");

@Component({
    selector: "view-projects-project-blocks-block",
    templateUrl: "app/views/projects-project-blocks-block.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain, BlockoView, AceEditor],
})
export class ProjectsProjectBlocksBlockComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockId: string;

    routeParamsSubscription:Subscription;

    project:IProject = null;

    blockCode:string = "block.displayName = \"JSB\";\nblock.backgroundColor = \"orange\";\n\nblock.addDigitalInput(\"din1\", \"Digital input 1\");\nblock.addAnalogInput(\"anIn\", \"Analog input\");\nblock.addMessageInput(\"msgInTest\", \"Test message\", [ByzanceBool, ByzanceInt, ByzanceFloat, ByzanceString]);\n\nblock.addMessageOutput(\"msgOut\", \"Message output\", [ByzanceString]);\nblock.addAnalogOutput(\"aout\", \"Analog output\");\nblock.addDigitalOutput(\"digitalOut\", \"Digital output\");\n\nblock.addConfigProperty(ConfigPropertyType.Float, \"confOffset\", \"Analog offset\", 44.6);\n\nblock.configChanged = function () { // when config changed\n    block.aout(block.anIn() + block.confOffset());  \n}\n\nblock.onAnIn = function (val) { // when change value of anIn analog input\n    block.aout(val + block.confOffset());  \n};\n\nblock.onMsgInTest = function (msg) { // when new message on msgInTest message input\n    block.msgOut(\"Test: \"+msg[4]);  \n};\n\nblock.inputsChanged = function () { // when change any analog or digital input\n	block.digitalOut(block.din1());\n};";

    @ViewChild(BlockoView)
    blockoView:BlockoView;

    jsBlock:Blocks.JSBlock;


    constructor(injector:Injector) {super(injector)};

    ngOnInit():void {

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.blockId = params["block"];
            this.refresh();
        });

        // init block

        this.jsBlock = this.blockoView.addJsBlock(this.blockCode, 30, 30);

    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh():void {
        //TODO:

    }

    onTestClick():void {
        this.jsBlock.setJsCode(this.blockCode);
    }

}
