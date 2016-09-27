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

    blockCode:string = "block.addDigitalInput(\"din1\", \"Digital input 1\");\nblock.addAnalogInput(\"anIn\", \"Analog input\");\nblock.addMessageInput(\"msgInTest\", \"Test message\", [ByzanceBool, ByzanceInt, ByzanceFloat, ByzanceString]);\n\nblock.addMessageOutput(\"msgOut\", \"Message output\", [ByzanceString]);\nblock.addAnalogOutput(\"aout\", \"Analog output\");\nblock.addDigitalOutput(\"digitalOut\", \"Digital output\");\n\nblock.addConfigProperty(ConfigPropertyType.Float, \"confOffset\", \"Analog offset\", 44.6);\n\nblock.init = block.configChanged = function () { // when init and config changed\n    block.aout(block.anIn() + block.confOffset());  \n}\n\nblock.onAnIn = function (val) { // when change value of anIn analog input\n    block.aout(val + block.confOffset());  \n};\n\nblock.onMsgInTest = function (msg) { // when new message on msgInTest message input\n    block.msgOut(\"Test: \"+msg[3]);  \n};\n\nblock.inputsChanged = function () { // when change any analog or digital input\n    block.digitalOut(block.din1());\n};";

    @ViewChild(BlockoView)
    blockoView:BlockoView;

    @ViewChild("colorSelector")
    colorSelector:ElementRef;

    jsBlock:Blocks.JSBlock;
    jsBlockHeight:number = 0;

    jsError:{ name:string, message:string };

    testInputConnectors:Core.Connector[];
    connectorTypes = Core.ConnectorType;
    argTypes = Core.ArgType;

    messageInputsValueCache:{ [key:string]:boolean|number|string } = {};

    iconSelectOptions:{name:string,icon:string}[] = [];
    iconSelected:string = "fa-question";
    iconSelectOpen:boolean = false;

    colorSelected:string = "#3baedb";

    description:string = "";

    testEventLog:{timestamp:string, connector:Core.Connector, eventType:Core.ConnectorEventType, value:(boolean|number|Core.Message), readableValue:string}[] = [];

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

        this.iconSelectOptions.sort((a,b)=>a.name.localeCompare(b.name));

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
        this.iconSelectOpen = false;
    }

    onIconSelectClick() {
        this.iconSelectOpen = !this.iconSelectOpen;
    }

    toReadableValue(value:any):string {
        if (typeof value == "boolean") {
            if (value) {
                return "<span class='bold font-red'>true</span>"
            } else {
                return "<span class='bold font-blue'>false</span>"
            }
        }
        if (typeof value == "number") {
            return "<span class='bold font-green-jungle'>"+value+"</span>"
        }
        if (typeof value == "string") {
            return "<span class='bold font-yellow-casablanca'>\""+value+"\"</span>"
        }
        if (value.values && Array.isArray(value.values)) {
            return "["+value.values.map((val:any)=>this.toReadableValue(val)).join(", ")+"]"
        }
        return JSON.stringify(value);
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

    validate() {
        try {
            if (Blocks.JSBlock.validateJsCode(this.blockCode)) {
                this.jsError = null;
            } else {
                this.jsError = { name: "Error", message: "Unknown error" };
            }
        } catch (e) {

            var name = e.name || "Error";
            name = name.replace(/([A-Z])/g, ' $1').trim();

            var msg:string = e.message || e.toString();

            if (e instanceof Blocks.JSBlockError) {
                name = "JS Block Error";
                msg = e.htmlMessage;
            }

            if (msg.indexOf("is not defined") > -1) {
                var index = msg.indexOf("is not defined");
                msg = "<b>" + msg.substr(0, index) + "</b>" + msg.substr(index);
            }

            if (msg.indexOf("is not a function") > -1) {
                var index = msg.indexOf("is not a function");
                msg = "<b>" + msg.substr(0, index) + "</b>" + msg.substr(index);
            }

            if (msg.indexOf("Unexpected token") == 0) {
                var len = "Unexpected token".length;
                msg = msg.substr(0, len) + "<b>" + msg.substr(len) + "</b>";
            }


            this.jsError = { name: name, message: msg };
        }
    }

    onTestClick():void {
        this.blockoView.removeAllBlocksWithoutReadonlyCheck();
        this.jsBlock = null;
        this.testEventLog = [];
        this.testInputConnectors = [];
        this.jsBlockHeight = 0;

        this.validate();
        if (!this.jsError) {


            try {
                var designJson = JSON.stringify({
                    backgroundColor: this.colorSelected,
                    displayName: this.iconSelected,
                    description: this.description
                });
                this.jsBlock = this.blockoView.addJsBlockWithoutReadonlyCheck("", designJson, 10, 10);
            } catch (e) {
            }

            this.jsBlock.registerOutputEventCallback((connector: Core.Connector, eventType: Core.ConnectorEventType, value: (boolean|number|Core.Message)) => {
                this.testEventLog.unshift({
                    timestamp: moment().format("HH:mm:ss.SSS"),
                    connector: connector,
                    eventType: eventType,
                    value: value,
                    readableValue: this.toReadableValue(value)
                });
            });

            this.jsBlock.setJsCode(this.blockCode);

            this.testInputConnectors = this.jsBlock.getInputConnectors();

            this.jsBlockHeight = this.jsBlock.rendererGetBlockSize().height + 20; // for borders

        }

    }

}
