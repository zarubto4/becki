/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import moment = require('moment/moment');
import { Component, OnInit, Injector, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import {
    IBlock, IBlockVersion, IProject
} from '../backend/TyrionAPI';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { Blocks, Core } from 'blocko';
import { FormGroup, Validators } from '@angular/forms';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { Types, Libs } from 'common-lib';
import { TypescriptBuildError } from 'script-engine';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ExitConfirmationService } from '../services/ExitConfirmationService';
import { ModalsBlocksBlockPropertiesModel } from '../modals/blocks-block-properties';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsPublicShareResponseModel } from '../modals/public-share-response';
import { ModalsPublicShareRequestModel } from '../modals/public-share-request';
import { ModalsWidgetsWidgetCopyModel } from '../modals/widgets-widget-copy';
import { BlockRenderer } from 'blocko/dist/editor/block/BlockRenderer';
import { IconData } from 'blocko/dist/editor/IconRenderer';
import { ModalsFileUploadModel } from '../modals/file-upload';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-projects-project-blocks-block',
    templateUrl: './projects-project-blocks-block.html',
})
export class ProjectsProjectBlocksBlockComponent extends _BaseMainComponent implements OnInit, OnDestroy, AfterViewInit {

    blockId: string;

    projectId: string;
    project: IProject = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    block: IBlock = null;

    blockoBlockVersions: IBlockVersion[] = [];
    selectedBlockVersion: IBlockVersion = null;
    unsavedChanges: boolean = false;

    connectorTypes = Types.ConnectorType;
    argTypes = Types.Type;

    blockForm: FormGroup = null;
    blockCode: string = '';
    blockIcon: IconData;
    svgIcon: boolean = false;

    tsErrors: { name: string, message: string, line?: number }[] = [];
    tab: string = 'ide';

    // Properties for test view:
    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    renderer: BlockRenderer;
    tsBlock: Blocks.TSBlock;
    testInputConnectors: Core.Connector<boolean | number | object | Core.Message>[];
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
            'name': ['Change me!', [Validators.required]],
            'icon': [''],
            'description': ['']
        });

        this.exitConfirmationService.setConfirmationEnabled(false);
    };

    ngOnInit(): void {
        this.unsavedChanges = false;
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.blockId = params['block'];


            if (this.projectId) {
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.project = project;
                });

                if (params['version']) {
                    this.router.navigate(['/projects', this.projectId, 'blocks', this.blockId]);
                    this.selectVersionByVersionId(params['version']);
                }
            }

            this.refresh();
        });
    }

    ngAfterViewInit(): void {
        this.monacoEditorLoaderService.registerTypings([Blocks.TSBlockLib, Libs.ConsoleLib, Libs.UtilsLib, Blocks.DatabaseLib, Blocks.FetchLib, Blocks.ServiceLib, this.blockoView.serviceHandler]);
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
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

    onPortletClick(action: string): void {
        if (action === 'edit_block') {
            this.onBlockEditClick();
        }

        if (action === 'remove_block') {
            this.onBlockDeleteClick();
        }
    }

    refresh(): void {

        this.blockUI();
        this.tyrionBackendService.blockGet(this.blockId) // TODO [permission]: BlockoBlock_read_permission
            .then((blockoBlock) => {

                this.block = blockoBlock;

                this.blockoBlockVersions = this.block.versions || [];

                this.blockoBlockVersions.sort((a, b) => {
                    if (a.created === b.created) { return 0; }
                    if (a.created > b.created) { return -1; }
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
            .catch((reason: IError) => {
                this.fmError(this.translate('flash_cant_load_block'), reason);
                this.unblockUI();
            });

    }

    onBlockEditClick(): void {
        let model = new ModalsBlocksBlockPropertiesModel(this.projectId, this.block);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockEdit(this.block.id, {
                    name: model.block.name,
                    description: model.block.description
                }).then(() => {
                    this.fmSuccess(this.translate('flash_blocko_edit'));
                    this.refresh();
                }).catch((reason: IError) => {
                    this.fmError(this.translate('flash_cant_edit_block'), reason);
                    this.refresh();
                });
            }
        });

    }

    onBlockDeleteClick(): void {

        this.modalService.showModal(new ModalsRemovalModel(this.block.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockDelete(this.block.id)
                    .then(() => {
                        this.fmSuccess(this.translate('flash_block_remove'));
                        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocks']);
                    })
                    .catch((reason: IError) => {
                        this.fmError(this.translate('flash_cant_remove_block'), reason);
                        this.refresh();
                    });
            }
        });

    }

    onRemoveVersionClick(version: IBlockVersion): void {
        this.modalService.showModal(new ModalsRemovalModel(version.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockVersionDelete(version.id)
                    .then(() => {
                        this.fmSuccess(this.translate('flash_version_remove'));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(this.translate('flash_cant_remove_version'), reason);
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: IBlockVersion): void {
        let model = new ModalsVersionDialogModel(this.block.id, 'BlockVersion', version);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockVersionEdit(version.id, {
                    name: model.object.name,
                    description: model.object.description,
                    tags: model.object.tags
                }).then(() => {
                    this.fmSuccess(this.translate('flash_version_change', model.object.name));
                    this.refresh();
                }).catch((reason: IError) => {
                    this.fmError(this.translate('flash_cant_change_version', model.object.name, reason));
                    this.refresh();
                });
            }
        });
    }

    onBlockoBlockVersionClick(version: IBlockVersion) {
        this.selectBlockVersion(version);
    }

    selectBlockVersion(version: IBlockVersion) {
        this.blockUI();
        this.tyrionBackendService.blockVersionGet(version.id)
            .then((blockVersion) => {

                // console.log(blockVersion);
                this.cleanTestView();

                this.selectedBlockVersion = blockVersion;

                let data: object;
                try {
                    data = JSON.parse(this.selectedBlockVersion.logic_json);
                    if (data['code']) {
                        this.blockCode = data['code'];
                    }
                } catch (error) {
                    if (this.selectedBlockVersion.design_json !== '') {
                        try {
                            data = JSON.parse(this.selectedBlockVersion.design_json);

                            this.blockCode = this.selectedBlockVersion.logic_json;
                        } catch (err) {
                            this.fmError(this.translate('flash_cant_load_block_version'));
                        }
                    }
                }

                if (data['name']) {
                    this.blockForm.controls['name'].setValue(data['name']);
                }

                if (data['description']) {
                    this.blockForm.controls['description'].setValue(data['description']);
                }

                if (data['data'] && data['data']['editor']) {
                    let editor = data['data']['editor'];
                    if (editor.icon) {
                        this.blockIcon = editor.icon;
                        this.svgIcon = this.blockIcon.type === 'json';
                        if (this.blockIcon.type === 'fa') {
                            this.blockForm.controls['icon'].setValue(this.blockIcon.data);
                        }
                    }
                }

                this.unblockUI();

                this.onTestClick();
            })
            .catch((reason: IError) => {
                this.selectedBlockVersion = null;
                // console.log(this.blockCode);
                this.fmError(this.translate('flash_cant_load_block_version'), reason);
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

    onSvgUploadClick() {
        let m: ModalsFileUploadModel = new ModalsFileUploadModel('SVG file', '', ['.svg'], true);
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockIcon = {
                        type: 'svg',
                        data: m.file
                    };
                }
            });
    }

    onDigitalInputClick(connector: Core.Connector<boolean | number | object | Core.Message>): void {
        this.zone.runOutsideAngular(() => {
            connector._inputSetValue(!connector.value);
        });
    }

    onAnalogInputChange(event: Event, connector: Core.Connector<boolean | number | object | Core.Message>): void {
        this.zone.runOutsideAngular(() => {
            let f = parseFloat((<HTMLInputElement>event.target).value);
            connector._inputSetValue(!isNaN(f) ? f : 0);
        });
    }

    onMessageInputSendClick(connector: Core.MessageConnector): void {
        let values: any[] = [];

        connector.argTypes.forEach((argType, index) => {

            let val = this.messageInputsValueCache[connector.name + argType + index];
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
        this.renderer = null;
        this.blockIcon = null;
        this.successfullyTested = false;
        if (this.consoleLog) {
            this.consoleLog.clear();
        }
        this.testInputConnectors = [];
        this.messageInputsValueCache = {};
    }

    onBlockoLog(bl: { block: Core.Block, type: string, message: string }): void {
        if (this.consoleLog) {
            this.consoleLog.add(<ConsoleLogType>bl.type, bl.message, bl.block.id, bl.block.id);
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

        this.tsErrors = [];

        if (!this.blockCode) {
            this.tsErrors.push({ name: this.translate('ts_error_block_error'), message: this.translate('ts_error_block_error_code_empty') });
            return;
        }

        this.zone.runOutsideAngular(() => {
            if (!this.tsBlock && !this.renderer) {
                try {
                    let data = {
                        name: this.blockForm.controls['name'].value,
                        // icon: this.blockForm.controls['icon'].value, TODO fa or svg
                        description: this.blockForm.controls['description'].value
                    };
                    this.renderer = this.blockoView.setSingleBlock(data);
                    this.tsBlock = <Blocks.TSBlock>this.renderer.block;
                } catch (e) {
                    console.error(e);
                }

                this.tsBlock.registerOutputEventCallback((connector: Core.Connector<boolean | number | object | Core.Message>, eventType: Core.ConnectorEventType, value: (boolean | number | Core.MessageJson)) => {
                    this.zone.run(() => {
                        if (this.consoleLog) {
                            this.consoleLog.add(
                                'info', // type
                                this.translate('label_console_output', connector.name, this.toReadableValue(value)), // message
                                'Test Click',
                                'Test Click',
                            );
                        }
                    });
                });
            }

            this.tsBlock.setCode(this.blockCode);
            this.tsBlock.name = this.blockForm.controls['name'].value;
            this.tsBlock.description = this.blockForm.controls['description'].value;

            this.renderer.refreshName();

            if (!this.svgIcon && this.blockForm.controls['icon'].value !== '') {
                this.blockIcon = {
                    type: 'fa',
                    data: this.blockForm.controls['icon'].value
                };
            }

            if (this.blockIcon) {
                this.renderer.setIcon(this.blockIcon);
            }
            this.blockoView.centerView();
        });

        if (this.tsBlock) {
            this.testInputConnectors = this.tsBlock.getInputConnectors();

            // this.tsBlockHeight = this.tsBlock.rendererGetBlockSize().height + 10; // for borders
            this.successfullyTested = true;
        }
    }

    onSaveClick(): void {
        if (this.successfullyTested && this.renderer) {
            console.info('In condition: block was successfully tested and rendered.');
            console.info('');
            let model = new ModalsVersionDialogModel(this.block.id, 'BlockVersion');
            console.info('So, model was created it is new instance of Modals Version Dialogue Model. It takes as a parameter block id(parent id?) and as a type BlockVersion');
            console.info(model);
            this.modalService.showModal(model).then((success) => {
                console.info('Then, model service makes model to be shown.');
                if (success) {
                    console.info('This is condition if model was successfully SAVED.');

                    let data: object = {
                        name: this.blockForm.controls['name'].value,
                        description: this.blockForm.controls['description'].value,
                        code: this.blockCode,
                        block_id: this.block.id,
                        data: {}
                    };

                    console.info('New object :data: was created.');

                    if (this.renderer.icon) {
                        data['data']['editor'] = {
                            icon: this.renderer.icon.getData()
                        };
                    }
                    console.info(model.object.name);
                    this.blockUI();
                    this.tyrionBackendService.blockVersionCreate(this.blockId, {// TODO [permission]: BlockoBlockVersion_create_permission
                        name: model.object.name,
                        description: model.object.description,
                        tags: model.object.tags,
                        logic_json: JSON.stringify(data),
                        design_json: 'empty' // TODO remove in future
                    }).then(() => {
                        this.fmSuccess(this.translate('flash_version_save', model.object.name));
                        this.refresh(); // also unblockUI
                        this.unsavedChanges = false;
                        this.exitConfirmationService.setConfirmationEnabled(false);
                    }).catch((err) => {
                        this.fmError(this.translate('flash_cant_save_version', model.object.name, err));
                        this.unblockUI();
                    });
                }
            });
        }
    }

    onCommunityPublicVersionClick(programVersion: IBlockVersion) {
        this.modalService.showModal(new ModalsPublicShareRequestModel(this.block.name, programVersion.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockVersionPublish(programVersion.id)
                    .then(() => {
                        this.fmSuccess(this.translate('flash_code_was_publisher'));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(this.translate('flash_code_publish_error'), reason);
                        this.refresh();
                    });
            }
        });
    }

    onProgramVersionPublishResult(version: IBlockVersion): void {

        // Create Object and Modal
        let model = new ModalsPublicShareResponseModel(
            version.name,
            version.description,
            this.block.name,
            this.block.description,
            null,
            null,
            null,
            null,
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockVersionEditResponsePublication({
                    version_id: version.id,
                    version_name: model.version_name,
                    version_description: model.version_description,
                    decision: model.decision,
                    reason: model.reason,
                    program_description: model.program_description,
                    program_name: model.program_name
                }).then(() => {
                    this.fmSuccess(this.translate('flash_code_update'));
                    this.navigate(['/admin/blocks']);
                }).catch((reason: IError) => {
                    this.fmError(this.translate('flash_cant_update_code'), reason);
                    this.refresh();
                });
            }
        });
    }

    onMakeClone(): void {
        let model = new ModalsWidgetsWidgetCopyModel(this.block.name, this.block);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockClone({
                    block_id: this.block.id,
                    project_id: this.projectId,
                    name: model.widget.name,
                    description: model.widget.description,
                    tags: model.widget.tags
                }).then(() => {
                    this.fmSuccess(this.translate('flash_code_update'));
                    this.unblockUI();
                }).catch((reason: IError) => {
                    this.fmError(this.translate('flash_cant_update_code'), reason);
                    this.unblockUI();
                });
            }
        });
    }

    onBlockSetMainClick(version: IBlockVersion): void {
        this.blockUI();
        this.tyrionBackendService.blockVersionSetMain(version.id)
            .then(() => {
                this.refresh();
            })
            .catch((reason: IError) => {
                this.fmError(this.translate('flash_extension_deactived_error'), reason);
                this.refresh();
            });
    }

    onDropDownEmitter(action: string, version: IBlockVersion): void {

        if (action === 'version_publish_community') {
            this.onCommunityPublicVersionClick(version);
        } else if (action === 'version_publish_admin') {
            this.onProgramVersionPublishResult(version);
        } else if (action === 'version_set_as_main') {
            this.onBlockSetMainClick(version);
        } else if (action === 'version_properties') {
            this.onEditVersionClick(version);
        } else if (action === 'remove_version') {
            this.onRemoveVersionClick(version);
        }
    }
}
