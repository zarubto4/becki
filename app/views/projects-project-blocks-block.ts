/**
 * Created by davidhradek on 22.09.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {IProject} from "../backend/TyrionAPI";
import {AceEditor} from "../components/AceEditor";
import {BlockoView} from "../components/BlockoView";
import {Blocks} from "blocko";


import moment = require("moment/moment");
import {Core} from "blocko";
import {FormGroup, Validators} from "@angular/forms";
import {BeckiFormColorPicker} from "../components/BeckiFormColorPicker";
import {BeckiFormFAIconSelect} from "../components/BeckiFormFAIconSelect";

@Component({
    selector: "view-projects-project-blocks-block",
    templateUrl: "app/views/projects-project-blocks-block.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain, BlockoView, AceEditor, BeckiFormColorPicker, BeckiFormFAIconSelect],
})
export class ProjectsProjectBlocksBlockComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockId: string;

    routeParamsSubscription:Subscription;

    project:IProject = null;

    connectorTypes = Core.ConnectorType;
    argTypes = Core.ArgType;

    blockForm:FormGroup = null;
    blockCode:string = "block.addDigitalInput(\"din1\", \"Digital input 1\");\nblock.addAnalogInput(\"anIn\", \"Analog input\");\nblock.addMessageInput(\"msgInTest\", \"Test message\", [ByzanceBool, ByzanceInt, ByzanceFloat, ByzanceString]);\n\nblock.addMessageOutput(\"msgOut\", \"Message output\", [ByzanceBool, ByzanceString]);\nblock.addAnalogOutput(\"aout\", \"Analog output\");\nblock.addDigitalOutput(\"digitalOut\", \"Digital output\");\n\nblock.addConfigProperty(ConfigPropertyType.Float, \"confOffset\", \"Analog offset\", 44.6);\n\nblock.init = block.configChanged = function () { // when init and config changed\n    block.aout(block.anIn() + block.confOffset());  \n}\n\nblock.onAnIn = function (val) { // when change value of anIn analog input\n    block.aout(val + block.confOffset());  \n};\n\nblock.onMsgInTest = function (msg) { // when new message on msgInTest message input\n    block.msgOut(msg[0],\"S:\"+msg[3]+\" N:\"+(msg[1]+msg[2]));\n};\n\nblock.inputsChanged = function () { // when change any analog or digital input\n    block.digitalOut(block.din1());\n};";

    jsError:{ name:string, message:string };

    // Properties for test view:
    @ViewChild(BlockoView)
    blockoView:BlockoView;
    jsBlock:Blocks.JSBlock;
    jsBlockHeight:number = 0;
    testInputConnectors:Core.Connector[];
    messageInputsValueCache:{ [key:string]:boolean|number|string } = {};
    testEventLog:{timestamp:string, connector:Core.Connector, eventType:Core.ConnectorEventType, value:(boolean|number|Core.Message), readableValue:string}[] = [];

    constructor(injector:Injector) {
        super(injector);

        this.blockForm = this.formBuilder.group({
            "color": ["#3baedb", [Validators.required]],
            "icon": ["fa-question", [Validators.required]],
            "description": ["JavaScript block!"]
        });
    };

    ngOnInit():void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.blockId = params["block"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh():void {
        //TODO:

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
        var f = parseFloat((<HTMLInputElement>event.target).value);
        connector._inputSetValue(!isNaN(f)?f:0);
    }

    onMessageInputSendClick(connector:Core.Connector):void {
        var values:any[] = [];

        connector.argTypes.forEach((argType, index)=> {
            var val = this.messageInputsValueCache[connector.name+argType];
            if (argType == Core.ArgType.ByzanceBool) {
                if (!val) {
                    val = false;
                } else {
                    val = !!val;
                }

            }
            if (argType == Core.ArgType.ByzanceFloat) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseFloat(<string>val);
                }
            }
            if (argType == Core.ArgType.ByzanceInt) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseInt(<string>val);
                }
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

    cleanTestView():void {
        this.blockoView.removeAllBlocksWithoutReadonlyCheck();
        this.jsBlock = null;
        this.testEventLog = [];
        this.testInputConnectors = [];
        this.jsBlockHeight = 0;
        this.messageInputsValueCache = {};
    }

    onTestClick():void {
        this.cleanTestView();

        this.validate();
        if (!this.jsError) {


            try {
                var designJson = JSON.stringify({
                    backgroundColor: this.blockForm.controls["color"].value,
                    displayName: this.blockForm.controls["icon"].value,
                    description: this.blockForm.controls["description"].value
                });
                this.jsBlock = this.blockoView.addJsBlockWithoutReadonlyCheck("", designJson, 20, 10);
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
