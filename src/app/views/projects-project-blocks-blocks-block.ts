/**
 * Created by davidhradek on 22.09.16.
 */
import moment = require('moment/moment');
import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import {
    IBlockoBlock, IBlockoBlockVersion,
    ITypeOfBlock, IBlockoBlockVersionShortDetail, ITypeOfBlockShortDetail
} from '../backend/TyrionAPI';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { Blocks, Core } from 'blocko';
import { FormGroup, Validators } from '@angular/forms';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { Types, Libs } from 'common-lib';
import { TypescriptBuildError, SafeMachineError } from 'script-engine';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ExitConfirmationService } from '../services/ExitConfirmationService';
import { ModalsBlocksBlockPropertiesModel } from '../modals/blocks-block-properties';
import { ModalsRemovalModel } from '../modals/removal';

@Component({
    selector: 'bk-view-projects-project-blocks-blocks-block',
    templateUrl: './projects-project-blocks-blocks-block.html',
})
export class ProjectsProjectBlocksBlocksBlockComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    blockId: string;
    blocksId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    // project: IProject = null;

    group: ITypeOfBlockShortDetail = null;

    blockoBlock: IBlockoBlock = null;

    blockoBlockVersions: IBlockoBlockVersionShortDetail[] = [];
    selectedBlockoBlockVersion: IBlockoBlockVersion = null;
    unsavedChanges: boolean = false;

    connectorTypes = Types.ConnectorType;
    argTypes = Types.Type;

    blockForm: FormGroup = null;
    blockCode: string = '';

    tsErrors: { name: string, message: string, line?: number }[] = [];

    // Properties for test view:
    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;
    tsBlock: Blocks.TSBlock;
    tsBlockHeight: number = 0;
    testInputConnectors: Core.Connector[];
    messageInputsValueCache: { [key: string]: boolean | number | string } = {};
    successfullyTested: boolean = false;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    protected monacoEditorLoaderService: MonacoEditorLoaderService = null;
    protected exitConfirmationService: ExitConfirmationService = null;
    protected afterLoadSelectedVersionId: string = null;


    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);

        this.monacoEditorLoaderService = injector.get(MonacoEditorLoaderService);
        this.exitConfirmationService = injector.get(ExitConfirmationService);

        this.blockForm = this.formBuilder.group({
            'color': ['#3baedb', [Validators.required]],
            'icon': ['fa-question', [Validators.required]],
            'description': ['']
        });

        this.exitConfirmationService.setConfirmationEnabled(false);
    };

    ngOnInit(): void {
        this.unsavedChanges = false;
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.blockId = params['block'];
            this.blocksId = params['blocks'];
            if (params['version']) {
                this.router.navigate(['/projects', this.projectId, 'blocks', this.blocksId, this.blockId]);
                this.selectVersionByVersionId(params['version']);
            }
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.group = project.type_of_blocks.find((tb) => tb.id === this.blocksId);
            });
            this.refresh();
        });
        this.monacoEditorLoaderService.registerTypings([Blocks.TSBlockLib, Libs.ConsoleLib, Libs.UtilsLib, Blocks.FetchLib, Blocks.ServiceLib, this.blockoView.serviceHandler]);

    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onBlocksGroupClick(groupId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocks', groupId]);
    }

    newBlockCode(code: string) {
        if (this.blockCode !== code) {
            this.unsavedChanges = true;
            this.exitConfirmationService.setConfirmationEnabled(true);
        }
        this.successfullyTested = false;
        this.blockCode = code;
    }

    selectVersionByVersionId(versionId: string) {
        if (this.blockoBlockVersions && !(this.blockoBlockVersions.length === 0)) {
            let version = null;
            if (versionId) {
                version = this.blockoBlockVersions.find((bpv) => bpv.id === versionId);
            }

            if (version) {
                this.selectBlockVersion(version);
            }
        } else {
            this.afterLoadSelectedVersionId = versionId;
        }
    }

    refresh(): void {

        this.blockUI();
        this.backendService.blockoBlockGet(this.blockId) // TODO [permission]: BlockoBlock_read_permission
            .then((blockoBlock) => {

                this.blockoBlock = blockoBlock;

                this.blockoBlockVersions = this.blockoBlock.versions || [];

                this.blockoBlockVersions.sort((a, b) => {
                    if (a.date_of_create === b.date_of_create) { return 0; }
                    if (a.date_of_create > b.date_of_create) { return -1; }
                    return 1;
                });

                let version = null;
                if (this.afterLoadSelectedVersionId) {
                    version = this.blockoBlockVersions.find((bpv) => bpv.id === this.afterLoadSelectedVersionId);
                }
                if (version) {
                    this.selectBlockVersion(version);

                } else if (this.blockoBlockVersions.length) {
                    this.selectBlockVersion(this.blockoBlockVersions[0]); // also unblockUI

                } else {
                    this.unblockUI();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load_block', reason)));
                this.unblockUI();
            });

    }

    onBlockEditClick(): void {

        let model = new ModalsBlocksBlockPropertiesModel(this.blockoBlock.name, this.blockoBlock.description, true, this.blockoBlock.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.blockoBlockEdit(this.blockoBlock.id, {
                    name: model.name,
                    general_description: model.description,
                    type_of_block_id: this.blocksId // tohle je trochu divný ne?
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_blocko_edit')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_block', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    });
            }
        });

    }

    onBlockDeleteClick(): void {

        this.modalService.showModal(new ModalsRemovalModel(this.blockoBlock.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.blockoBlockDelete(this.blockoBlock.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_remove')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocks', this.blocksId]);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_block', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    });
            }
        });

    }

    onRemoveVersionClick(version: IBlockoBlockVersionShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(version.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.blockoBlockVersionDelete(version.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_remove')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_version', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: IBlockoBlockVersionShortDetail): void {
        let model = new ModalsVersionDialogModel(version.name, version.description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.blockoBlockVersionEdit(version.id, { // TODO [permission]: version.update_permission
                    version_name: model.name,
                    version_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_change', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_version', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    onBlockoBlockVersionClick(version: IBlockoBlockVersionShortDetail) {
        this.selectBlockVersion(version);
    }

    selectBlockVersion(version: IBlockoBlockVersionShortDetail) {
        this.blockUI();
        this.backendService.blockoBlockVersionGet(version.id)
            .then((blockoBlockVersion) => {

                // console.log(blockoBlockVersion);

                this.cleanTestView();

                this.selectedBlockoBlockVersion = blockoBlockVersion;

                this.blockCode = this.selectedBlockoBlockVersion.logic_json;

                let designJson = JSON.parse(this.selectedBlockoBlockVersion.design_json);

                if (designJson.backgroundColor) {
                    this.blockForm.controls['color'].setValue(designJson.backgroundColor);
                }
                if (designJson.displayName) {
                    this.blockForm.controls['icon'].setValue(designJson.displayName);
                }
                if (designJson.description) {
                    this.blockForm.controls['description'].setValue(designJson.description);
                }

                this.unblockUI();
            })
            .catch(reason => {
                this.selectedBlockoBlockVersion = null;
                // console.log(this.blockCode);
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load_block_version', reason)));
                this.unblockUI();
            });
    }


    toReadableValue(value: any): string {
        if (typeof value === 'boolean') {
            if (value) {
                return '<span class="bold font-red">{{"bool_true"|bkTranslate:this}}</span>';
            } else {
                return '<span class="bold font-blue">{{"bool_false"|bkTranslate:this}}</span>';
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
        this.zone.runOutsideAngular(() => {
            let f = parseFloat((<HTMLInputElement>event.target).value);
            connector._inputSetValue(!isNaN(f) ? f : 0);
        });
    }

    onMessageInputSendClick(connector: Core.Connector): void {
        let values: any[] = [];

        connector.argTypes.forEach((argType, index) => {
            let val = this.messageInputsValueCache[connector.name + argType];
            if (argType === Types.Type.Boolean) {
                if (!val) {
                    val = false;
                } else {
                    val = !!val;
                }

            }
            if (argType === Types.Type.Float) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseFloat(<string>val);
                }
            }
            if (argType === Types.Type.Integer) {
                if (!val) {
                    val = 0;
                } else {
                    val = parseInt(<string>val, 10);
                }
            }
            if (argType === Types.Type.String && !val) {
                val = '';
            }

            values.push(val);
        });

        this.zone.runOutsideAngular(() => {
            let m = new Core.Message(connector.argTypes, values);
            connector._inputSetValue(m);
        });

    }

    cleanTestView(): void {
        this.blockoView.removeAllBlocksWithoutReadonlyCheck();
        this.tsBlock = null;
        this.successfullyTested = false;
        if (this.consoleLog) {
            this.consoleLog.clear();
        }
        this.testInputConnectors = [];
        this.tsBlockHeight = 0;
        this.messageInputsValueCache = {};
    }

    onBlockoLog(bl: { block: Core.Block, type: string, message: string }): void {
        if (this.consoleLog) {
            this.consoleLog.add(<ConsoleLogType>bl.type, bl.message);
        }
    }

    onBlockoError(be: { block: Core.Block, error: any }): void {

        if (be && be.error) {

            if (be.error instanceof TypescriptBuildError) {

                if (!be.error.diagnostics) {
                    this.tsErrors.push({ name: this.translate('ts_error_typescript_error'), message: be.error.message });
                } else {

                    be.error.diagnostics.forEach((d) => {
                        this.tsErrors.push({
                            name: this.translate('ts_error_typescript_error') + ' #' + d.code,
                            line: this.blockCode.substr(0, Math.min(d.start, this.blockCode.length)).split('\n').length,
                            message: d.messageText
                        });
                    });

                }
                this.cleanTestView();
            } else {
                if (this.consoleLog) {
                    this.consoleLog.addFromError(be.error);
                }
            }

        }

    }

    onTestClick(): void {
        this.cleanTestView();
        this.tsErrors = [];

        if (!this.blockCode) {
            this.tsErrors.push({ name: this.translate('ts_error_block_error'), message: this.translate('ts_error_block_error_code_empty') });
            return;
        }

        if (this.tsErrors.length === 0) {

            this.zone.runOutsideAngular(() => {

                try {
                    let designJson = JSON.stringify({
                        backgroundColor: this.blockForm.controls['color'].value,
                        displayName: this.blockForm.controls['icon'].value,
                        description: this.blockForm.controls['description'].value
                    });
                    this.tsBlock = this.blockoView.addTsBlockWithoutReadonlyCheck('', designJson, 22, 15);
                } catch (e) { // TODO: promyslet jestli othle je ok [DH]
                }

                this.tsBlock.registerOutputEventCallback((connector: Core.Connector, eventType: Core.ConnectorEventType, value: (boolean | number | Core.Message)) => {
                    this.zone.run(() => {
                        if (this.consoleLog) {
                            this.consoleLog.add('output', this.translate('label_console_output', connector.name, this.toReadableValue(value)));
                        }
                    });
                });

                this.tsBlock.setCode(this.blockCode);

            });

            // build errors can clean test view ... must check if still exist
            if (this.tsBlock) {
                this.testInputConnectors = this.tsBlock.getInputConnectors();

                this.tsBlockHeight = this.tsBlock.rendererGetBlockSize().height + 10; // for borders

                this.successfullyTested = true;
            }

        }

    }

    onSaveClick(): void {
        if (!this.successfullyTested) {
            return;
        }

        let m = new ModalsVersionDialogModel(moment().format('YYYY-MM-DD HH:mm:ss'));
        this.modalService.showModal(m).then((success) => {
            if (success) {

                let designJson = JSON.stringify({
                    backgroundColor: this.blockForm.controls['color'].value,
                    displayName: this.blockForm.controls['icon'].value,
                    description: this.blockForm.controls['description'].value
                });

                this.blockUI();
                this.backendService.blockoBlockVersionCreate(this.blockId, {// TODO [permission]: BlockoBlockVersion_create_permission
                    version_name: m.name,
                    version_description: m.description,
                    logic_json: this.blockCode,
                    design_json: designJson
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_save', m.name)));
                        this.refresh(); // also unblockUI
                        this.unsavedChanges = false;
                        this.exitConfirmationService.setConfirmationEnabled(false);
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_save_version', m.name, err)));
                        this.unblockUI();
                    });
            }
        });

    }

}
