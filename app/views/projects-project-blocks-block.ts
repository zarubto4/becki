/**
 * Created by davidhradek on 22.09.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef} from "@angular/core";
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
import {Blocks, SnapRenderer} from "blocko";


import moment = require("moment/moment");
import {Core} from "blocko";
import {BeckiFormSelectOption, BeckiFormSelect} from "../components/BeckiFormSelect";
import {FormGroup, Validators} from "@angular/forms";

@Component({
    selector: "view-projects-project-blocks-block",
    templateUrl: "app/views/projects-project-blocks-block.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain, BlockoView, AceEditor, BeckiFormSelect],
})
export class ProjectsProjectBlocksBlockComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockId: string;

    routeParamsSubscription:Subscription;

    project:IProject = null;

    blockCode:string = "block.displayName = \"JSB\";\nblock.backgroundColor = \"orange\";\n\nblock.addDigitalInput(\"din1\", \"Digital input 1\");\nblock.addAnalogInput(\"anIn\", \"Analog input\");\nblock.addMessageInput(\"msgInTest\", \"Test message\", [ByzanceBool, ByzanceInt, ByzanceFloat, ByzanceString]);\n\nblock.addMessageOutput(\"msgOut\", \"Message output\", [ByzanceString]);\nblock.addAnalogOutput(\"aout\", \"Analog output\");\nblock.addDigitalOutput(\"digitalOut\", \"Digital output\");\n\nblock.addConfigProperty(ConfigPropertyType.Float, \"confOffset\", \"Analog offset\", 44.6);\n\nblock.configChanged = function () { // when config changed\n    block.aout(block.anIn() + block.confOffset());  \n}\n\nblock.onAnIn = function (val) { // when change value of anIn analog input\n    block.aout(val + block.confOffset());  \n};\n\nblock.onMsgInTest = function (msg) { // when new message on msgInTest message input\n    block.msgOut(\"Test: \"+msg[4]);  \n};\n\nblock.inputsChanged = function () { // when change any analog or digital input\n	block.digitalOut(block.din1());\n};";

    @ViewChild(BlockoView)
    blockoView:BlockoView;

    @ViewChild("colorSelector")
    colorSelector:ElementRef;

    jsBlock:Blocks.JSBlock;

    testInputConnectors:Core.Connector[];
    connectorTypes = Core.ConnectorType;
    argTypes = Core.ArgType;

    messageInputsValueCache:{ [key:string]:boolean|number|string } = {};

    iconSelectOptions:{name:string,icon:string}[] = [];
    iconSelected:string = "fa-remove";

    colorSelected:string = "#3baedb";

    testEventLog:{timestamp:string, connector:Core.Connector, eventType:Core.ConnectorEventType, value:(boolean|number|Core.Message)}[] = [];

    constructor(injector:Injector) {super(injector)};

    ngOnInit():void {

        this.iconSelectOptions = [];
        var usedIcons:string[] = [];
        for (var key in SnapRenderer.RendererHelper.FontAwesomeMap) {
            var fa:string = (<any>SnapRenderer.RendererHelper.FontAwesomeMap)[key];
            if (usedIcons.indexOf(fa) > -1) continue;
            usedIcons.push(fa);
            this.iconSelectOptions.push({
                name: key,
                icon: fa
            });
        }

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.blockId = params["block"];
            this.refresh();
        });

        //TODO: move to component
        //missing typings for minicolors
        (<any>$(this.colorSelector.nativeElement)).minicolors({
            theme: "bootstrap",
            defaultValue: this.colorSelected,
            change: (value:string) => {
                this.colorSelected = value;
            }
        });

    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
        //missing typings for minicolors
        (<any>$(this.colorSelector.nativeElement)).minicolors('destroy');
    }

    refresh():void {
        //TODO:

    }

    onIconSelectBlockClick(name:string) {
        this.iconSelected = name;
    }

    toReadableValue(value:any):string {
        return value.values?JSON.stringify(value.values):value;
    }

    onDigitalInputClick(connector:Core.Connector):void {
        connector._inputSetValue(!connector.value);
    }

    onAnalogInputChange(event:Event, connector:Core.Connector):void {
        connector._inputSetValue(parseFloat((<HTMLInputElement>event.target).value));
    }

    onMessageInputSendClick(connector:Core.Connector):void {
        var values:any[] = [];

        connector.argTypes.forEach((argType, index)=> {
            var val = this.messageInputsValueCache[connector.name+index+argType];
            if (argType == Core.ArgType.ByzanceBool && !val) {
                val = false;
            }
            if (argType == Core.ArgType.ByzanceFloat && !val) {
                val = 0;
            }
            if (argType == Core.ArgType.ByzanceInt && !val) {
                val = 0;
            }
            if (argType == Core.ArgType.ByzanceString && !val) {
                val = "";
            }

            values.push(val)
        });

        var m = new Core.Message(connector.argTypes, values);
        connector._inputSetValue(m);

    }

    onTestClick():void {
        this.blockoView.removeAllBlocksWithoutReadonlyCheck();
        this.testEventLog = [];

        try {
            var desginJson = JSON.stringify({backgroundColor: this.colorSelected, displayName:this.iconSelected});
            this.jsBlock = this.blockoView.addJsBlockWithoutReadonlyCheck("ERROR", desginJson, 100, 30);
        } catch (e) {}

        this.jsBlock.setJsCode(this.blockCode);

        this.jsBlock.registerOutputEventCallback((connector:Core.Connector, eventType:Core.ConnectorEventType, value:(boolean|number|Core.Message)) => {
            this.testEventLog.unshift({
                timestamp: moment().format("HH:mm:ss.SSS"),
                connector: connector,
                eventType: eventType,
                value:value
            });
        });

        this.testInputConnectors = this.jsBlock.getInputConnectors();
    }

}
