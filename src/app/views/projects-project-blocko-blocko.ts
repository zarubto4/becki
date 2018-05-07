import { ModalsSelectCodeModel } from '../modals/code-select';


declare let $: JQueryStatic;
import moment = require('moment/moment');
import { Component, OnInit, Injector, OnDestroy, ViewChild } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import {
    IProject, IBProgram, IBlockVersion, IBProgramVersion, IGridProject, IMProgramSnapShot,
    IMProjectSnapShot, ICProgram, IBlock, ICProgramList, ICProgramVersion, IBlockList, IGridProjectList, IGridProgram
} from '../backend/TyrionAPI';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { DraggableEventParams } from '../components/DraggableDirective';
import { ModalsConfirmModel } from '../modals/confirm';
import { Blocks, Core } from 'blocko';
import { Libs } from 'common-lib';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { ModalsBlockoAddGridModel } from '../modals/blocko-add-grid';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ExitConfirmationService } from '../services/ExitConfirmationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsBlockoPropertiesModel } from '../modals/blocko-properties';
import { ModalsBlockoAddGridEmptyModel } from '../modals/blocko-add-grid-emtpy';
import { ModalsSelectVersionModel } from '../modals/version-select';
import {ModalsSelectGridProjectModel} from "../modals/grid-project-select";
import {ModalsSelectBlockModel} from "../modals/block-select";
import {ModalsSelectHardwareModel} from "../modals/select-hardware";

@Component({
    selector: 'bk-view-projects-project-blocko-blocko',
    templateUrl: './projects-project-blocko-blocko.html',
})
export class ProjectsProjectBlockoBlockoComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    unsavedChanges: boolean = false;

    projectId: string; // genral project, not Grid
    blockoId: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;
    blockoProgram: IBProgram = null;

    advancedMode: boolean = false;

    blocksLastVersions: { [id: string]: IBlockVersion } = {};
    blocksColors: { [id: string]: string } = {};
    blocksIcons: { [id: string]: string } = {};

    blocksCache: { [blockId_versionId: string]: IBlockVersion } = {};

    // grid:
    allGridProjects: IGridProject[] = [];
    selectedGridProgramVersions: { [projectId: string]: { [programId: string]: string } } = {};

    // versions:
    blockoProgramVersions: IBProgramVersion[] = null;
    selectedProgramVersion: IBProgramVersion = null;

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    draggableOptions: JQueryUI.DraggableOptions = {
        helper: 'clone',
        containment: 'document',
        cursor: 'move',
        cursorAt: { left: -5, top: -5 }
    };

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    protected exitConfirmationService: ExitConfirmationService;

    blockoZoom: number = 1;

    /* tslint:disable:max-line-length */
    staticBlocks = [
        {
            id: 'logic_blocks',
            name: 'Logic Blocks',
            blocks: [
                {
                    name: 'NOT',
                    blockoName: 'not',
                    backgroundColor: 'rgb(161, 136, 127)'
                },
                {
                    name: 'AND',
                    blockoName: 'and',
                    backgroundColor: 'rgb(161, 136, 127)'
                },
                {
                    name: 'OR',
                    blockoName: 'or',
                    backgroundColor: 'rgb(161, 136, 127)'
                },
                {
                    name: 'XOR',
                    blockoName: 'xor',
                    backgroundColor: 'rgb(161, 136, 127)'
                }
            ]
        },
        {
            id: 'debug_blocks',
            name: 'Debug Blocks',
            blocks: [
                {
                    name: 'Switch',
                    blockoName: 'switch',
                    backgroundColor: 'rgb(204, 204, 255)'
                },
                {
                    name: 'Push button',
                    blockoName: 'pushButton',
                    backgroundColor: 'rgb(204, 204, 255)'
                },
                {
                    name: 'Digital output',
                    blockoName: 'light',
                    backgroundColor: 'rgb(204, 204, 255)'
                },
                {
                    name: 'Analog input',
                    blockoName: 'analogInput',
                    backgroundColor: 'rgb(204, 255, 204)'
                },
                {
                    name: 'Analog output',
                    blockoName: 'analogOutput',
                    backgroundColor: 'rgb(204, 255, 204)'
                }
            ]
        },
        {
            id: 'ts_blocks',
            name: 'TypeScript Blocks',
            blocks: [
                {
                    name: 'All in one example',
                    blockoDesignJson: '{\"displayName\":\"fa-font\",\"backgroundColor\":\"#32C5D2\",\"description\":\"All in one\"}',
                    blockoTsCode: '// add inputs\nlet din = context.inputs.add(\'din\', \'digital\', \'Digital input\');\nlet ain = context.inputs.add(\'ain\', \'analog\', \'Analog input\');\nlet min = context.inputs.add(\'min\', \'message\', \'Message input\', [\'boolean\', \'integer\', \'float\', \'string\']);\n\n// add outputs\nlet mout = context.outputs.add(\'mout\', \'message\', \'Message output\', [\'string\']);\nlet aout = context.outputs.add(\'aout\', \'analog\', \'Analog output\');\nlet dout = context.outputs.add(\'dout\', \'digital\', \'Digital output\');\n\n// add config properties\nlet offset = context.configProperties.add(\'offset\', \'float\', \'Analog offset\', 12.3, {\n    min: 0,\n    max: 50,\n    step: 0.1,\n    range: true\n});\n\nlet refreshAnalogValue = () => {\n    aout.value = ain.value + offset.value;\n};\n\n// set outputs on block ready\ncontext.listenEvent(\'ready\', () => {\n    dout.value = !din.value;\n    refreshAnalogValue();\n});\n\n// refresh analog value when ain or offset config property changed\nain.listenEvent(\'valueChanged\', refreshAnalogValue);\noffset.listenEvent(\'valueChanged\', refreshAnalogValue);\n\ndin.listenEvent(\'valueChanged\', () => {\n    dout.value = !din.value;\n});\n\nmin.listenEvent(\'messageReceived\', (event) => {\n    let val3 = event.message.values[3];\n    mout.send([\'Received \' + val3]);\n});\n',
                    backgroundColor: '#32C5D2'
                },
                {
                    name: 'Analog to digital example',
                    blockoDesignJson: '{\"displayName\":\"fa-line-chart\",\"backgroundColor\":\"#1BA39C\",\"description\":\"Analog to digital\"}',
                    blockoTsCode: '// add input and output\nlet ain = context.inputs.add(\'ain\', \'analog\', \'Analog input\');\nlet dout = context.outputs.add(\'dout\', \'digital\', \'Digital output\');\n\n// add config properties for min a max value\nlet min = context.configProperties.add(\'min\', \'float\', \'Min\', 5, {\n    min: 0,\n    max: 100,\n    step: 0.1,\n    range: true\n});\nlet max = context.configProperties.add(\'max\', \'float\', \'Min\', 25, {\n    min: 0,\n    max: 100,\n    step: 0.1,\n    range: true\n});\n\n// function for refresh digital output value\nlet refreshOutput = () => {\n    dout.value = ((ain.value >= min.value) && (ain.value <= max.value));\n};\n\n// trigger refreshOutput function when block ready, ain and config value changed\ncontext.listenEvent(\'ready\', refreshOutput);\nain.listenEvent(\'valueChanged\', refreshOutput);\ncontext.configProperties.listenEvent(\'valueChanged\', refreshOutput);\n',
                    backgroundColor: '#1BA39C'
                }
            ]
        }
    ];
    /* tslint:enable */

    tab: string = 'ide';

    private monacoEditorLoaderService: MonacoEditorLoaderService = null;
    protected afterLoadSelectedVersionId: string = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    constructor(injector: Injector) {
        super(injector);

        this.monacoEditorLoaderService = injector.get(MonacoEditorLoaderService);
        this.exitConfirmationService = injector.get(ExitConfirmationService);

        this.exitConfirmationService.setConfirmationEnabled(false);
    };

    // ng***
    ngOnInit(): void {
        this.unsavedChanges = false;
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.blockoId = params['blocko'];
            if (params['version']) {
                this.router.navigate(['/projects', this.projectId, 'blocko', this.blockoId]);
                this.selectBProgramVersionByVersionId(params['version']);
            }
        });
        this.refresh();
        this.monacoEditorLoaderService.registerTypings([Blocks.TSBlockLib, Libs.ConsoleLib, Libs.UtilsLib, Blocks.DatabaseLib, Blocks.FetchLib, Blocks.ServiceLib, this.blockoView.serviceHandler]);
    }
    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    // TOGGLE TAB & PORTLET BUTTONS
    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onPortletClick(action: string): void {
        if (action === 'edit_program') {
            this.onBlockoProgramEditClick();
        }

        if (action === 'remove_program') {
            this.onBlockoProgramRemoveClick();
        }
    }

    // Basic OPERATION ON BLOCKO PROGRAM

    // Clean Console
    onClearConsoleClick() {
        if (this.consoleLog) {
            this.consoleLog.clear();
        }
    }

    onBlockoLog(bl: { block: Core.Block, type: string, message: string }): void {
        if (this.consoleLog) {
            this.consoleLog.add(<ConsoleLogType>bl.type, bl.message,  bl.block.id, 'Block ' + bl.block.id);
        }
    }

    onBlockoError(be: { block: Core.Block, error: any }): void {
        if (be && be.error) {
            if (this.consoleLog) {
                this.consoleLog.addFromError(be.error, 'Block ' + be.block.id);
            }
        }
    }

    isEmptyObject(obj: any): boolean {
        return (Object.keys(obj).length === 0);
    }

    // BLOCK -----------------------------------------------------------------------------------------------------------

    onAddBlockInterfaceClick() {
        let model = new ModalsSelectBlockModel(this.projectId);
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA

            })
            .catch((err) => {

            });
    }


    blockChangeVersion(block_id: string, block_version_id: string) {
        let model = new ModalsSelectBlockModel(this.projectId, {
            block_id: block_id,
            block_version_id: block_version_id
        });
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA

            })
            .catch((err) => {

            });
    }


    blockRemove() {

    }

    // Hardware ---
    onSetHardwareByInterfaceClick() {
        let model = new ModalsSelectHardwareModel(this.projectId, null, false, true);
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA

            })
            .catch((err) => {

            });

    }

    // GRID ------------------------------------------------------------------------------------------------------------

    onAddGridInterfaceClick() {
        let model = new ModalsSelectGridProjectModel(this.projectId);
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA

            })
            .catch((err) => {

            });
    }

    gridProjectChangeVersion(grid_project_id: string, program_id: string, program_version_id: string) {
        let model = new ModalsSelectGridProjectModel(this.projectId, {
            grid_project_id: grid_project_id
        });
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA
                model.selectedGridProgramVersions;
            })
            .catch((err) => {

            });
    }

    gridRemove(gridProject: IGridProject) {
        // TODO
    }




    // CODE ------------------------------------------------------------------------------------------------------------

    onAddCodeInterfaceClick() {
        let model = new ModalsSelectCodeModel(this.projectId, null, );
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA
                model.selectedCProgramVersion;
            })
            .catch((err) => {

            });
    }

    // Change Selected CProgram Version to another version and change that in Blocko Program
    onChangeCProgramVersion(c_program_id: string, c_program_version_id: string) {
        let model = new ModalsSelectCodeModel(this.projectId, null, {
            c_program_id: c_program_id,
            c_program_version_id: c_program_version_id
        });
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA
                model.selectedCProgramVersion;
            })
            .catch((err) => {

            });
    }


    // BLOCKO ----------------------------------------------------------------------------------------------------------


    onBlockoProgramRemoveClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.blockoProgram.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramDelete(this.blockoProgram.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_blocko_removed')));
                        this.router.navigate(['/projects/' + this.projectId + '/blocko']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_blocko'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onBlockoProgramEditClick(): void {
        let model = new ModalsBlockoPropertiesModel(this.projectId, this.blockoProgram.name, this.blockoProgram.description, true, this.blockoProgram.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramEdit(this.blockoProgram.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_blocko_updated')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_blocko'), reason));
                        this.refresh();
                    });
            }
        });
    }

    // BLOCKO - VERSION OPERATIONS -------------------------------------------------------------------------------------

    selectBProgramVersionByVersionId(versionId: string) {
        // Select B_Program Version by ID if it is in URL parameter (or select last one)
        if (this.blockoProgramVersions) {
            let version = null;
            if (versionId) {
                version = this.blockoProgramVersions.find((bpv) => bpv.id === versionId);
            }

            if (version) {
                this.selectBProgramVersion(version);
            }
        } else {
            this.afterLoadSelectedVersionId = versionId;
        }
    }

    selectBProgramVersion(programVersion: IBProgramVersion): void {

        if (!this.blockoProgramVersions) {
            return;
        }
        if (this.blockoProgramVersions.indexOf(programVersion) === -1) {
            return;
        }

        this.blockUI();
        this.tyrionBackendService.bProgramVersionGet(programVersion.id)
            .then((programVersionFull) => {

                this.unsavedChanges = false;
                this.exitConfirmationService.setConfirmationEnabled(false);

                this.selectedProgramVersion = programVersionFull;
                this.selectedGridProgramVersions = {};

                programVersionFull.grid_project_snapshots.forEach((pps) => {
                    this.selectedGridProgramVersions[pps.grid_project.id] = {};
                    if (pps.grid_programs) {
                        pps.grid_programs.forEach((ps) => {
                            this.selectedGridProgramVersions[pps.grid_project.id][ps.id] = ps.grid_program_version.id;
                        });
                    }
                });

                this.blockoView.setDataJson(this.selectedProgramVersion.program);
                if (this.consoleLog) {
                    this.consoleLog.clear();
                }
                this.unblockUI();
            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(this.translate('flash_cant_load_version', programVersion.name, err));
            });
    }

    onRemoveBProgramVersionClick(version: IBProgramVersion): void {
        this.modalService.showModal(new ModalsRemovalModel(version.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramVersionDelete(version.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_removed')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_version'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onEditBProgramVersionClick(version: IBProgramVersion): void {
        let model = new ModalsVersionDialogModel(version.name, version.description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramVersionEdit(version.id, {
                    name: model.name,
                    description: model.description
                }).then(() => {
                    this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_version_been_changed', model.name)));
                    this.refresh();
                }).catch(reason => {
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_cant_change_version', model.name, reason)));
                    this.refresh();
                });
            }
        });
    }


    // EDITOR OPERATIONS -----------------------------------------------------------------------------------------------

    onClearIDEClick(): void {
        let m = new ModalsConfirmModel(this.translate('label_modal_clear_program'), this.translate('label_modal_confirm_clear_blocko_program'));
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockoView.removeAllBlocks();
                }
            });
    }

    onSaveClick(): void {

        // HW validation:
        let validHw = true;

        if (!validHw) {
            let m = new ModalsConfirmModel(this.translate('label_modal_error'), this.translate('label_modal_cant_save_blocko_hw_without_version'), true, this.translate('label_modal_ok'), null);
            this.modalService.showModal(m);
            return;
        }

        // Grid validation
        let validGrid = true;
        this.allGridProjects.forEach((gp) => {
            if (this.selectedGridProgramVersions[gp.id]) {
                if (gp.m_programs) {
                    gp.m_programs.forEach((mp) => {
                        if (mp.program_versions && mp.program_versions.length) {
                            if (!this.selectedGridProgramVersions[gp.id][mp.id]) {
                                validGrid = false;
                            }
                        }
                    });
                }
            }
        });

        if (!validGrid) {
            let m = new ModalsConfirmModel(this.translate('label_modal_error'), this.translate('label_modal_cant_save_grid_hw_without_version'), true, this.translate('label_modal_ok'), null);
            this.modalService.showModal(m);
            return;
        }


        // save dialog
        let m = new ModalsVersionDialogModel(moment().format('YYYY-MM-DD HH:mm:ss'));
        this.modalService.showModal(m).then((success) => {
            if (success) {

                let mProjectSnapshots: IMProjectSnapShot[] = [];

                for (let projectId in this.selectedGridProgramVersions) {
                    if (!this.selectedGridProgramVersions.hasOwnProperty(projectId)) {
                        continue;
                    }
                    let programSnapshots: IMProgramSnapShot[] = [];

                    for (let programId in this.selectedGridProgramVersions[projectId]) {
                        if (!this.selectedGridProgramVersions[projectId].hasOwnProperty(programId)) {
                            continue;
                        }
                        programSnapshots.push({
                            m_program_id: programId,
                            version_id: this.selectedGridProgramVersions[projectId][programId]
                        });
                    }

                    mProjectSnapshots.push({
                        m_program_snapshots: programSnapshots,
                        m_project_id: projectId
                    });
                }

                // console.log(mProjectSnapshots);
                this.blockUI();
                this.tyrionBackendService.bProgramVersionCreate(this.blockoId, { // TODO [permission]: B_program.update_permission
                    name: m.name,
                    description: m.description,
                    m_project_snapshots: mProjectSnapshots,
                    program: this.blockoView.getDataJson()
                }).then(() => {
                    this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_saved', m.name)));
                    this.refresh(); // also unblockUI
                    this.unsavedChanges = false;
                    this.exitConfirmationService.setConfirmationEnabled(false);
                }).catch((err) => {
                    this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_save_version', m.name, err)));
                    this.unblockUI();
                });
            }
        });


    }

    refresh(): void {
        this.blockUI();

        this.tyrionBackendService.bProgramGet(this.blockoId)
        .then((blockoProgram) => {
            this.blockoProgram = blockoProgram;

            this.blockoProgramVersions = this.blockoProgram.program_versions || [];

            let version = null;
            if (this.afterLoadSelectedVersionId) {
                version = this.blockoProgramVersions.find((bpv) => bpv.id === this.afterLoadSelectedVersionId);
            }

            if (version) {
                this.selectBProgramVersion(version);
            } else if (this.blockoProgramVersions.length) {
                this.selectBProgramVersion(this.blockoProgramVersions[0]);
            }
            this.unblockUI();
        }).catch(reason => {
            this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load_blocko'), reason));
            this.unblockUI();
        });
    }

    onSomethingChanged() {
        this.unsavedChanges = true;
        this.exitConfirmationService.setConfirmationEnabled(true);
    }

    blockoZoomOnChange(e: any) {
        this.blockoZoom = e.target.value * e.target.value;
    }

    onDrobDownEmiter(action: string, version: IBProgramVersion): void {
        if (action === 'edit_version_properties') {
            this.onEditBProgramVersionClick(version);
        }

        if (action === 'remove_version') {
            this.onRemoveBProgramVersionClick(version);
        }
    }
}
