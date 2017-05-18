/**
 * Created by davidhradek on 22.09.16.
 */

import { Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import {
    IGridWidget, IGridWidgetVersion,
    ITypeOfWidget, IGridWidgetVersionShortDetail, ITypeOfWidgetShortDetail
} from '../backend/TyrionAPI';
import { FormGroup, Validators } from '@angular/forms';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { GridViewComponent } from '../components/GridViewComponent';
import moment = require('moment/moment');
import { Core, TestRenderer, Widgets } from 'the-grid';
import { ModalService } from '../services/ModalService';
import { ModalsGridConfigPropertiesModel } from '../modals/grid-config-properties';
import { Types, Libs } from 'common-lib';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { MachineMessage, SafeMachineMessage } from 'script-engine';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ExitConfirmationService } from '../services/ExitConfirmationService';

@Component({
    selector: 'bk-view-projects-project-widgets-widgets-widget',
    templateUrl: './projects-project-widgets-widgets-widget.html',
})
export class ProjectsProjectWidgetsWidgetsWidgetComponent extends BaseMainComponent implements OnInit, OnDestroy {
    widgetInstance: Core.Widget;
    widgetTestRunning: boolean;

    projectId: string;
    widgetId: string;
    widgetsId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    group: ITypeOfWidgetShortDetail = null;
    widget: IGridWidget = null;

    widgetVersions: IGridWidgetVersionShortDetail[] = [];
    selectedWidgetVersion: IGridWidgetVersion = null;
    widgetCode: string = '';
    testInputConnectors: Core.Connector[];

    connectorTypes = Types.ConnectorType;
    argTypes = Types.Type;

    messageInputsValueCache: { [key: string]: boolean | number | string } = {};

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    unsavedChanges: boolean = false;

    protected _widgetTesterRenderer: TestRenderer.ControllerRenderer;
    protected monacoEditorLoaderService: MonacoEditorLoaderService;
    protected exitConfirmationService: ExitConfirmationService;

    protected buildErrors: any[] = null;
    protected afterLoadSelectedVersionId: string = null;

    // Properties for test view:
    @ViewChild('widgetTestScreen')
    widgetTestScreen: ElementRef;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    constructor(injector: Injector) {
        super(injector);

        this.monacoEditorLoaderService = injector.get(MonacoEditorLoaderService);
        this.exitConfirmationService = injector.get(ExitConfirmationService);

        this.testInputConnectors = [];
        this.messageInputsValueCache = {};
        this.widgetTestRunning = false;

        this.exitConfirmationService.setConfirmationEnabled(false);
    };

    ngOnInit(): void {
        this.unsavedChanges = false;
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.widgetId = params['widget'];
            this.widgetsId = params['widgets'];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.group = project.type_of_widgets.find((tw) => tw.id === this.widgetsId);
            });
            if (params['version']) {
                this.router.navigate(['/projects', this.projectId, 'widgets', this.widgetsId, this.widgetId]);
                this.selectVersionByVersionId(params['version']);
            }
            this.refresh();
        });

        this.zone.runOutsideAngular(() => {
            let widgetTesterController = new Core.Controller();
            this._widgetTesterRenderer = new TestRenderer.ControllerRenderer(widgetTesterController, this.widgetTestScreen.nativeElement);

            this.monacoEditorLoaderService.registerTypings([Libs.ConsoleLib, Widgets.ContextLib, Libs.UtilsLib, Widgets.WKLib]);
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    selectVersionByVersionId(versionId: string) {
        if (this.widgetVersions && !(this.widgetVersions.length === 0)) {
            let version = null;
            if (versionId) {
                version = this.widgetVersions.find((bpv) => bpv.id === versionId);
            }

            if (version) {
                this.selectWidgetVersion(version);
            }
        } else {
            this.afterLoadSelectedVersionId = versionId;
        }
    }

    onWidgetsGroupClick(groupId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'widgets', groupId]);
    }

    newWidgetCode(code: string) {
        if (this.widgetCode !== code) {
            this.unsavedChanges = true;
            this.exitConfirmationService.setConfirmationEnabled(true);
        }
        this.widgetCode = code;
    }

    refresh(): void {

        this.blockUI();
        this.backendService.getWidget(this.widgetId)
            .then((widget) => {
                this.widget = widget;

                this.widgetVersions = this.widget.versions || [];

                let version = null;
                if (this.afterLoadSelectedVersionId) {
                    version = this.widgetVersions.find((bpv) => bpv.id === this.afterLoadSelectedVersionId);
                }

                if (version) {
                    this.selectWidgetVersion(version);
                } else if (this.widgetVersions.length) {
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

                this.unsavedChanges = false;
                this.exitConfirmationService.setConfirmationEnabled(false);

                this.selectedWidgetVersion = widgetVersion;
                this.widgetCode = this.selectedWidgetVersion.logic_json;

                this.unblockUI();
            })
            .catch(reason => {
                this.selectedWidgetVersion = null;
                // console.log(this.widgetCode);
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
        this.widgetTestRunning = false;
        if (this.consoleLog) {
            this.consoleLog.clear();
        }
    }

    onWidgetConfigClick(): void {
        let m = new ModalsGridConfigPropertiesModel(this._widgetTesterRenderer.widget, this._widgetTesterRenderer.controller);
        this.modalService.showModal(m);
    }

    onTestClick(): void {

        this.cleanTestView();
        this.buildErrors = null;

        let buildFailed = false;
        this.zone.runOutsideAngular(() => {

            this._widgetTesterRenderer.runCode(this.widgetCode, true, (e) => {
                this.zone.run(() => {
                    if (e.diagnostics) {
                        this.buildErrors = [];
                        for (let n in e.diagnostics) {
                            if (!e.diagnostics.hasOwnProperty(n)) { continue; }
                            const diagnosticsMessage = e.diagnostics[n];
                            this.buildErrors.push({
                                type: 'error',
                                line: this.widgetCode.substr(0, Math.min(diagnosticsMessage.start, this.widgetCode.length)).split('\n').length,
                                text: diagnosticsMessage.messageText
                            });
                        }
                        buildFailed = true;
                        this.cleanTestView();
                    } else {
                        if (this.consoleLog) {
                            this.consoleLog.addFromError(e, null, moment().format('HH:mm:ss.SSS'));
                        }
                    }
                });
            }, (message: MachineMessage) => {
                this.zone.run(() => {
                    if (this.consoleLog) {
                        this.consoleLog.addFromMessage(message, null, moment().format('HH:mm:ss.SSS'));
                    }
                });
            }, (type: string, message: string) => {
                this.zone.run(() => {
                    if (this.consoleLog) {
                        this.consoleLog.add(<ConsoleLogType>type, message);
                    }
                });
            });

        });

        this.widgetInstance = this._widgetTesterRenderer.widget;
        this.widgetTestRunning = true;

        if (!this.widgetInstance) {
            this.consoleLog.add('error', '<strong>Cannot create widget:</strong> Make sure, that you specified size profiles for widget');
            return;
        }

        this.zone.runOutsideAngular(() => {
            const widgetInterface = this.widgetInstance.getInterface();
            for (let n in widgetInterface.digitalInputs) {
                if (!widgetInterface.digitalInputs.hasOwnProperty(n)) { continue; }
                this.testInputConnectors.push(widgetInterface.digitalInputs[n]);
            }

            for (let n in widgetInterface.analogInputs) {
                if (!widgetInterface.analogInputs.hasOwnProperty(n)) { continue; }
                this.testInputConnectors.push(widgetInterface.analogInputs[n]);
            }

            for (let n in widgetInterface.messageInputs) {
                if (!widgetInterface.messageInputs.hasOwnProperty(n)) { continue; }
                this.testInputConnectors.push(widgetInterface.messageInputs[n]);
            }

            this.widgetInstance.eventsEmitter.listenEvent('valueChanged', (e: Core.IOEvent) => {
                if (e.connector.isInput()) {
                    return;
                }
                if (this.consoleLog) {
                    this.zone.run(() => {
                        this.consoleLog.add('output', 'Output <strong>' + e.connector.name + '</strong> = ' + this.toReadableValue(e.connector.value));
                    });
                }
            });

            this.widgetInstance.eventsEmitter.listenEvent('messageReceived', (e: Core.IOMessageEvent) => {
                if (e.connector.isInput()) {
                    return;
                }
                if (this.consoleLog) {
                    this.zone.run(() => {
                        this.consoleLog.add('output', 'Output <strong>' + e.connector.name + '</strong> = ' + this.toReadableValue(e.message));
                    });
                }
            });

        });

        if (buildFailed) {
            this.cleanTestView();
        }

    }

    toReadableValue(value: any): string {
        if (typeof value === 'boolean') {
            if (value) {
                return '<span class="bold font-red">true</span>';
            } else {
                return '<span class="bold font-blue">false</span>';
            }
        }
        if (typeof value === 'number') {
            return '<span class="bold font-green-jungle">' + value + '</span>';
        }
        if (typeof value === 'string') {
            return '<span class="bold font-yellow-casablanca">\"' + value + '\"</span>';
        }
        if (value.values && Array.isArray(value.values)) {
            return '[' + value.values.map((val: any) => this.toReadableValue(val)).join(', ') + ']';
        }
        return JSON.stringify(value);
    }

    onDigitalInputClick(connector: Core.Connector): void {
        this.zone.runOutsideAngular(() => {
            connector._inputSetValue(!connector.value);
        });
    }

    onAnalogInputChange(event: Event, connector: Core.Connector): void {
        let f = parseFloat((<HTMLInputElement>event.target).value);
        this.zone.runOutsideAngular(() => {
            connector._inputSetValue(!isNaN(f) ? f : 0);
        });
    }

    onMessageInputSendClick(connector: Core.Connector): void {
        let values: any[] = [];
        connector.messageTypes.forEach((argType, index) => {
            let val = this.messageInputsValueCache[connector.name + argType];
            if (Types.StringToTypeTable[argType] === Types.Type.Boolean) {
                if (!val) {
                    val = false;
                } else {
                    val = !!val;
                }

            }
            if (Types.StringToTypeTable[argType] === Types.Type.Float) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseFloat(<string>val);
                }
            }
            if (Types.StringToTypeTable[argType] === Types.Type.Integer) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseInt(<string>val, 10);
                }
            }
            if (Types.StringToTypeTable[argType] === Types.Type.String && !val) {
                val = '';
            }

            values.push(val);
        });

        let m = {
            types: connector.messageTypes,
            values: values
        };

        this.zone.runOutsideAngular(() => {
            connector._inputSetValue(m);
        });
    }

    onSaveClick(): void {
        let m = new ModalsVersionDialogModel(moment().format('YYYY-MM-DD HH:mm:ss'));
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
                        this.addFlashMessage(new FlashMessageSuccess('Version <b>' + m.name + '</b> saved successfully.'));
                        this.refresh(); // also unblockUI
                        this.unsavedChanges = false;
                        this.exitConfirmationService.setConfirmationEnabled(false);
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError('Failed saving version <b>' + m.name + '</b>', err));
                        this.unblockUI();
                    });
            }
        });

    }

}
