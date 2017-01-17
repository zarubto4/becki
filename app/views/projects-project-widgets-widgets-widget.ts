/**
 * Created by davidhradek on 22.09.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {Subscription} from "rxjs/Rx";
import {
    IGridWidget, IGridWidgetVersion,
    ITypeOfWidget, IGridWidgetVersionShortDetail, ITypeOfWidgetShortDetail
} from "../backend/TyrionAPI";
import {FormGroup, Validators} from "@angular/forms";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {ModalsVersionDialogModel} from "../modals/version-dialog";
import { GridView } from '../components/GridView';
import moment = require("moment/moment");
import {Core, TestRenderer, Widgets} from "the-grid";
import {ModalService} from "../services/ModalService";
import {ModalsGridConfigPropertiesModel} from "../modals/grid-config-properties";
import {Types, Libs} from "common-lib";
import {UtilsLib} from "script-engine";
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';

@Component({
    selector: "view-projects-project-widgets-widgets-widget",
    templateUrl: "app/views/projects-project-widgets-widgets-widget.html",
})
export class ProjectsProjectWidgetsWidgetsWidgetComponent extends BaseMainComponent implements OnInit, OnDestroy {
    widgetInstance: Core.Widget;

    projectId: string;
    widgetId: string;
    widgetsId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    group: ITypeOfWidgetShortDetail = null;
    widget: IGridWidget = null;

    widgetVersions: IGridWidgetVersionShortDetail[] = [];
    selectedWidgetVersion: IGridWidgetVersion = null;
    widgetCode: string = "";
    testInputConnectors: Core.Connector[];

    connectorTypes = Types.ConnectorType;
    argTypes = Types.Type;

    messageInputsValueCache: { [key: string]: boolean|number|string } = {};
    testEventLog: {timestamp: string, connector: Core.Connector, eventType: string, value: (boolean|number|Core.MessageValue), readableValue: string}[] = [];

    protected _widgetTesterRenderer: TestRenderer.ControllerRenderer;
    protected monacoEditorLoaderService:MonacoEditorLoaderService;
    protected buildErrors: any[] = null;
    protected runtimeErrors: any[] = null;

    // Properties for test view:
    @ViewChild("widgetTestScreen")
    widgetTestScreen: ElementRef;

    constructor(injector: Injector) {
        super(injector);

        this.monacoEditorLoaderService = injector.get(MonacoEditorLoaderService);

        this.testInputConnectors = [];
        this.messageInputsValueCache = {};
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.widgetId = params["widget"];
            this.widgetsId = params["widgets"];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.group = project.type_of_widgets.find((tw) => tw.id == this.widgetsId);
            });
            this.refresh();
        });

        var widgetTesterController = new Core.Controller();
        this._widgetTesterRenderer = new TestRenderer.ControllerRenderer(widgetTesterController, this.widgetTestScreen.nativeElement);

        this.monacoEditorLoaderService.registerTypings([Libs.TypesLib, Widgets.ContextLib, UtilsLib, Widgets.WKLib]);
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) this.projectSubscription.unsubscribe();
    }

    onWidgetsGroupClick(groupId:string) {
        this.navigate(["/projects", this.currentParamsService.get("project"), "widgets", groupId]);
    }

    newWidgetCode(code: string) {
        this.widgetCode = code;
    }

    refresh(): void {

        this.blockUI();
        this.backendService.getWidget(this.widgetId)
            .then((widget) => {
                this.widget = widget;

                this.widgetVersions = this.widget.versions || [];

                if (this.widgetVersions.length) {
                    this.selectWidgetVersion(this.widgetVersions[0]); // also unblockUI
                } else {
                    this.unblockUI();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The widget cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

    onWidgetVersionClick(version: IGridWidgetVersionShortDetail) {
        this.selectWidgetVersion(version);
    }

    selectWidgetVersion(version: IGridWidgetVersionShortDetail) {
        this.blockUI();
        this.backendService.getWidgetVersion(version.id)
            .then((widgetVersion) => {

                this.cleanTestView();

                this.selectedWidgetVersion = widgetVersion;
                this.widgetCode = this.selectedWidgetVersion.logic_json;

                this.unblockUI();
            })
            .catch(reason => {
                this.selectedWidgetVersion = null;
                console.log(this.widgetCode);
                this.addFlashMessage(new FlashMessageError(`The widget version cannot be loaded.`, reason));
                this.unblockUI();
            });
    }

    validate() {
    }

    cleanTestView(): void {
        this.testInputConnectors = [];
        this.messageInputsValueCache = {};
        this.widgetInstance = null;
        this.testEventLog = [];
        this.runtimeErrors = null;
    }

    onWidgetConfigClick(): void {
        var m = new ModalsGridConfigPropertiesModel(this._widgetTesterRenderer.widget);
        this.modalService.showModal(m);
    }





    onTestClick(): void {
        this.cleanTestView();
        this.buildErrors = null;

        let buildFailed = false;
        this._widgetTesterRenderer.runCode(this.widgetCode, true, (e) => {
            if (e.position) {
                if (!this.runtimeErrors) {
                    this.runtimeErrors = [];
                }

                this.runtimeErrors.unshift({
                    type: "error",
                    line: e.position.lineA,
                    text: e.message,
                    timestamp: moment().format("HH:mm:ss.SSS")
                });

                console.log("widget error",e,e.position);


            } else if (e.diagnostics) {
                console.log("build error", e, e.diagnostics);
                this.buildErrors = [];
                for(let n in e.diagnostics) {
                    const diagnosticsMessage = e.diagnostics[n];
                    this.buildErrors.push({
                        type: "error",
                        line: this.widgetCode.substr(0,Math.min(diagnosticsMessage.start,this.widgetCode.length)).split("\n").length,
                        text: diagnosticsMessage.messageText
                    });
                }
                buildFailed = true;
                this.cleanTestView();
            } else {
                console.log("widget error",e);
            }
        });

        this.widgetInstance = this._widgetTesterRenderer.widget;

        const widgetInterface = this.widgetInstance.getInterface();
        for(let n in widgetInterface.digitalInputs) {
            this.testInputConnectors.push(widgetInterface.digitalInputs[n]);
        }

        for(let n in widgetInterface.analogInputs) {
            this.testInputConnectors.push(widgetInterface.analogInputs[n]);
        }

        for(let n in widgetInterface.messageInputs) {
            this.testInputConnectors.push(widgetInterface.messageInputs[n]);
        }

        this.widgetInstance.eventsEmitter.listenEvent("valueChanged",(e: Core.IOEvent) => {
            if (e.connector.isInput()) return;
            this.testEventLog.unshift({
                timestamp: moment().format("HH:mm:ss.SSS"),
                connector: e.connector,
                eventType: e.type,
                value: e.connector.value,
                readableValue: this.toReadableValue(e.connector.value)
            });
        });

        this.widgetInstance.eventsEmitter.listenEvent("recieveMessage",(e: Core.IOMessageEvent) => {
            if (e.connector.isInput()) return;
            this.testEventLog.unshift({
                timestamp: moment().format("HH:mm:ss.SSS"),
                connector: e.connector,
                eventType: e.type,
                value: e.message,
                readableValue: this.toReadableValue(e.message)
            });
        });

        if (buildFailed) {
            this.cleanTestView();
        }
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

        connector.messageTypes.forEach((argType, index)=> {
            let val = this.messageInputsValueCache[connector.name + argType];
            if (Types.StringToTypeTable[argType] == Types.Type.Boolean) {
                if (!val) {
                    val = false;
                } else {
                    val = !!val;
                }

            }
            if (Types.StringToTypeTable[argType] == Types.Type.Float) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseFloat(<string>val);
                }
            }
            if (Types.StringToTypeTable[argType] == Types.Type.Integer) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseInt(<string>val);
                }
            }
            if (Types.StringToTypeTable[argType] == Types.Type.String && !val) {
                val = "";
            }

            values.push(val)
        });

        let m = {
            types:connector.messageTypes, 
            values: values
        }
        connector._inputSetValue(m);

    }

    onSaveClick(): void {
        let m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
        this.modalService.showModal(m).then((success) => {
            if (success) {
                
                let designJson = JSON.stringify({});

                this.blockUI();
                this.backendService.createWidgetVersion(this.widgetId, {
                    version_name: m.name,
                    version_description: m.description,
                    logic_json: this.widgetCode,
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
