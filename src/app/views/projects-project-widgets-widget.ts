/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IWidget, IWidgetVersion, IProject }  from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import moment = require('moment/moment');
import { Core, TestRenderer, Widgets } from 'the-grid';
import { ModalsGridConfigPropertiesModel } from '../modals/grid-config-properties';
import { Types, Libs } from 'common-lib';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { MachineMessage } from 'script-engine';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ExitConfirmationService } from '../services/ExitConfirmationService';
import { ModalsWidgetsWidgetPropertiesModel } from '../modals/widgets-widget-properties';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsPublicShareRequestModel } from '../modals/public-share-request';
import { ModalsPublicShareResponseModel } from '../modals/public-share-response';
import { ModalsWidgetsWidgetCopyModel } from '../modals/widgets-widget-copy';

@Component({
    selector: 'bk-view-projects-project-widgets-widget',
    templateUrl: './projects-project-widgets-widget.html',
})
export class ProjectsProjectWidgetsWidgetComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    widgetInstance: Core.Widget;
    widgetTestRunning: boolean;

    projectId: string; // Project
    project: IProject = null;
    widgetId: string;  // Widget
    typeOfWidgetId: string; // Type Of Widget

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    widget: IWidget = null;

    selectedWidgetVersion: IWidgetVersion = null;
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
            this.typeOfWidgetId = params['widgets'];

            if (this.projectId && this.typeOfWidgetId) {
                if (params['version']) {
                    this.router.navigate(['/projects', this.projectId, 'widgets', this.typeOfWidgetId, this.widgetId]);
                    this.selectVersionByVersionId(params['version']);
                }
            }

            this.refresh();
        });

        this.zone.runOutsideAngular(() => {
            let widgetTesterController = new Core.Controller();
            this._widgetTesterRenderer = new TestRenderer.ControllerRenderer(widgetTesterController, this.widgetTestScreen.nativeElement);

            this.monacoEditorLoaderService.registerTypings([Libs.ConsoleLib, Widgets.ContextLib, Libs.UtilsLib, Widgets.WKLib]);
        });
    }

    onPortletClick(action: string): void {
        if (action === 'edit_widget') {
            this.onWidgetEditClick();
        }

        if (action === 'remove_widget') {
            this.onWidgetDeleteClick();
        }
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onWidgetEditClick(): void {
        let model = new ModalsWidgetsWidgetPropertiesModel(this.widget.name, this.widget.description, true, this.widget.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetEdit(this.widget.id, {
                    name: model.name,
                    description: model.description,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_widget_edit_success')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_edit_fail'), reason));
                    });
            }
        });
    }

    onWidgetDeleteClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.widget.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetDelete(this.widget.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_widget_removed_success')));

                        if (this.projectId) {
                            this.navigate(['/projects', this.currentParamsService.get('project'), 'widgets']);
                        } else {
                            this.navigate(['/admin/grid', this.widget.id]);
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_widget_removed_fail'), reason));
                        if (this.projectId) {
                            this.navigate(['/projects', this.currentParamsService.get('project'), 'widgets']);
                        } else {
                            this.navigate(['/admin/grid', this.widget.id]);
                        }
                    });
            }
        });

    }

    onRemoveVersionClick(version: IWidgetVersion): void {
        this.modalService.showModal(new ModalsRemovalModel(version.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetVersionDelete(version.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_removed_success')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_version_removed_fail', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: IWidgetVersion): void {
        let model = new ModalsVersionDialogModel(version.name, version.description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetVersionEdit(version.id, { // TODO [permission]: version.update_permission
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_changed_success', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_version_changed_success', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    selectVersionByVersionId(versionId: string) {
        if (this.widget && !(this.widget.versions.length === 0)) {
            let version = null;
            if (versionId) {
                version = this.widget.versions.find((bpv) => bpv.id === versionId);
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
        this.tyrionBackendService.widgetGet(this.widgetId) // TODO [permission]: GridWidget_read_permission
            .then((widget) => {
                this.widget = widget;

                let version = null;
                if (this.afterLoadSelectedVersionId) {
                    version = this.widget.versions.find((bpv) => bpv.id === this.afterLoadSelectedVersionId);
                }

                if (version) {
                    this.selectWidgetVersion(version);
                } else if (this.widget.versions.length) {
                    this.selectWidgetVersion(this.widget.versions[0]); // also unblockUI
                } else {
                    this.unblockUI();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_version_load_fail'), reason));
                this.unblockUI();
            });

    }

    onWidgetVersionClick(version: IWidgetVersion) {
        this.selectWidgetVersion(version);
    }

    selectWidgetVersion(version: IWidgetVersion) {
        this.blockUI();
        this.tyrionBackendService.widgetVersionGet(version.id) // TODO [permission]: GridWidgetVersion_read_permission
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
                this.addFlashMessage(new FlashMessageError((this.translate('flash_version_load_fail', version.name, reason))));
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
            this.consoleLog.add('error', this.translate('label_console_cant_crate_widget'));
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
                        this.consoleLog.add('output', this.translate('label_console_output', e.connector.name, this.toReadableValue(e.connector.value)));
                    });
                }
            });

            this.widgetInstance.eventsEmitter.listenEvent('messageReceived', (e: Core.IOMessageEvent) => {
                if (e.connector.isInput()) {
                    return;
                }
                if (this.consoleLog) {
                    this.zone.run(() => {
                        this.consoleLog.add('output', this.translate('label_console_output', e.connector.name, this.toReadableValue(e.message)));
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
                return this.translate('label_console_true');
            } else {
                return this.translate('label_console_false');
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
                this.tyrionBackendService.widgetVersionCreate(this.widgetId, { // TODO [permission]: GridWidgetVersion_create_permission" : "create: If user have GridWidget.update_permission = true,
                    name: m.name,
                    description: m.description,
                    logic_json: this.widgetCode,
                    design_json: designJson
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_save_success', this.projectId)));
                        this.refresh(); // also unblockUI
                        this.unsavedChanges = false;
                        this.exitConfirmationService.setConfirmationEnabled(false);
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_version_save_fail', m.name, err)));
                        this.unblockUI();
                    });
            }
        });

    }

    onCommunityPublicVersionClick(programVersion: IWidgetVersion) {
        this.modalService.showModal(new ModalsPublicShareRequestModel(this.widget.name, programVersion.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetVersionMakePublic(programVersion.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_was_publisher')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_code_publish_error'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onProgramVersionPublishResult(version: IWidgetVersion): void {
        // Create Object and Modal
        let model = new ModalsPublicShareResponseModel(
            version.name,
            version.description,
            this.widget.name,
            this.widget.description,
            null,
            null,
            null,
        );

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetVersionEditResponsePublication({
                    version_id: version.id,
                    version_name: model.version_name,
                    version_description: model.version_description,
                    decision: model.decision,
                    reason: model.reason,
                    program_description: model.program_description,
                    program_name: model.program_name
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.navigate(['/admin/widgets']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.refresh();
                    });
            }
        });

    }

    onMakeClone(): void {
        let model = new ModalsWidgetsWidgetCopyModel(this.widget.name, this.widget.description, this.widget.tags);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.widgetMakeClone({
                    widget_id: this.widget.id,
                    project_id: this.projectId,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.unblockUI();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.unblockUI();
                    });
            }
        });
    }

    onWidgetSetMainClick(version: IWidgetVersion): void {
        this.blockUI();
        this.tyrionBackendService.widgetVersionSetAsMain(version.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.refresh();
            });
    }

}
