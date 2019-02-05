import { ModalsSelectCodeModel } from '../modals/code-select';
import moment = require('moment/moment');
import { Component, OnInit, Injector, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import {
    IProject, IBProgram, IBlockVersion, IBProgramVersion, IGridProject, IMProgramSnapShot, IMProjectSnapShot,
    IGridProgramVersion, IGridProgram, IBProgramVersionSnapGridProject, IBProgramVersionSnapGridProjectProgram
} from '../backend/TyrionAPI';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { ModalsConfirmModel } from '../modals/confirm';
import { BlockoCore, Blocks, Core } from 'blocko';
import { Libs } from 'common-lib';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { MonacoEditorLoaderService } from '../services/MonacoEditorLoaderService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ExitConfirmationService } from '../services/ExitConfirmationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsBlockoPropertiesModel } from '../modals/blocko-properties';
import { ModalsSelectGridProjectModel } from '../modals/grid-project-select';
import { ModalsSelectBlockModel } from '../modals/block-select';
import { ModalsSelectHardwareModel } from '../modals/select-hardware';
import { FileDownloaderService } from '../services/FileDownloaderService';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-projects-project-blocko-blocko',
    templateUrl: './projects-project-blocko-blocko.html'
})
export class ProjectsProjectBlockoBlockoComponent extends _BaseMainComponent implements OnInit, OnDestroy, AfterViewInit {

    unsavedChanges: boolean = false;

    projectId: string; // genral project, not Grid
    blockoId: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;
    blockoProgram: IBProgram = null;

    blocksLastVersions: { [id: string]: IBlockVersion } = {};
    blocksColors: { [id: string]: string } = {};
    blocksIcons: { [id: string]: string } = {};

    blocksCache: { [blockId_versionId: string]: IBlockVersion } = {};

    // grid:
    selectedGrid: { [projectId: string]: { [programId: string]: string } } = {};

    // versions:
    blockoProgramVersions: IBProgramVersion[] = null;
    selectedProgramVersion: IBProgramVersion = null;

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    protected exitConfirmationService: ExitConfirmationService;

    show_console: boolean = false;

    tab: string = 'ide';
    tab_under_ide: string = 'console';

    protected fileDownloaderService: FileDownloaderService = null;
    private monacoEditorLoaderService: MonacoEditorLoaderService = null;
    protected afterLoadSelectedVersionId: string = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    constructor(injector: Injector) {
        super(injector);

        this.monacoEditorLoaderService = injector.get(MonacoEditorLoaderService);
        this.exitConfirmationService = injector.get(ExitConfirmationService);
        this.fileDownloaderService = injector.get(FileDownloaderService);

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
    }


    onToggleIDETab(tab: string): void {
        if (this.tab_under_ide === tab) {
            this.tab_under_ide = ''; // Hide tab
        } else {
            this.tab_under_ide = tab;
        }
    }

    ngAfterViewInit(): void {
        this.monacoEditorLoaderService.registerTypings([Blocks.TSBlockLib, Libs.ConsoleLib, Libs.UtilsLib, Blocks.DatabaseLib, Blocks.FetchLib, Blocks.ServiceLib, this.blockoView.serviceHandler]);

        this.blockoView.registerAddBlockCallback(this.onAddBlock.bind(this));
        this.blockoView.registerAddGridCallback(this.onAddGrid.bind(this));
        this.blockoView.registerAddHardwareCallback(this.onAddCode.bind(this));
        this.blockoView.registerChangeGridCallback(this.onChangeGrid.bind(this));
        this.blockoView.registerChangeHardwareCallback(this.onChangeCode.bind(this));
        this.blockoView.registerBlockRemovedCallback((block) => {
            this.zone.run(() => {
                if (block.isInterface()) {
                    let iface: Blocks.BaseInterfaceBlock = <Blocks.BaseInterfaceBlock>block;
                    if (iface.isGrid()) {
                        this.gridRemove(iface);
                    }
                }
            });
        });
        // Set Hardware on interface is not allowed here
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

        if (action === 'console_clean') {
            this.onClearConsoleClick();
        }

        if (action === 'save_program') {
            this.onSaveClick();
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

    onAddBlock(callback: (block: BlockoCore.Block) => void) {
        let model = new ModalsSelectBlockModel(this.projectId);
        this.modalService.showModal(model)
            .then((success) => {

                if (model.selectedBlock) {
                    this.zone.runOutsideAngular(() => {
                        callback(this.blockoView.getCoreBlock(model.selectedBlockVersion, model.selectedBlock));
                    });
                } else if (model.selectedSpecialBlock) {
                    this.zone.runOutsideAngular(() => {
                        callback(this.blockoView.getStaticBlock(model.selectedSpecialBlock.blockoName));
                    });
                }
            })
            .catch((reason: IError) => {
            });
    }


    onChangeBlock(block_id: string, block_version_id: string) {
        let model = new ModalsSelectBlockModel(this.projectId, {
            block_id: block_id,
            block_version_id: block_version_id
        });
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA

            })
            .catch((reason: IError) => {
            });
    }


    blockRemove() {

    }

    // Hardware --------------------------------------------------------------------------------------------------------

    onSetHardwareByInterfaceClick(callback: (block: BlockoCore.Block) => void) {
        let model = new ModalsSelectHardwareModel(this.projectId, null, false, true);
        this.modalService.showModal(model)
            .then((success) => {
                // TODO Doplnit do BLOCKA

            })
            .catch((reason: IError) => {
            });
    }

    // GRID ------------------------------------------------------------------------------------------------------------

    onAddGrid(callback: (iface: Blocks.BlockoTargetInterface) => void) {
        let model = new ModalsSelectGridProjectModel(this.projectId);
        this.modalService.showModal(model)
            .then((success) => {
                if (this.selectedGrid.hasOwnProperty(model.selected_grid_project.id)) {
                    this.fmWarning(this.translate('flash_grid_already_added'));
                } else {
                    let gridProject = {};
                    for (let key in model.selectedGridProgramVersions) {
                        if (model.selectedGridProgramVersions.hasOwnProperty(key)) {
                            gridProject[key] = model.selectedGridProgramVersions[key].version.id;
                        }
                    }

                    this.selectedGrid[model.selected_grid_project.id] = gridProject;
                    let converted: Blocks.BlockoTargetInterface = this.convertGridToBlockoInterface(model.selected_grid_project, model.selectedGridProgramVersions);
                    this.zone.runOutsideAngular(() => {
                        callback(converted);
                    });
                }
            })
            .catch((reason: IError) => {
            });
    }

    onChangeGrid(iface: Blocks.BlockoTargetInterface, callback: (iface: Blocks.BlockoTargetInterface) => void) {

        console.info('onChangeGrid:: iface', iface);

        if (typeof iface.grid !== 'object') {
            this.fmWarning(this.translate('flash_old_interface'));
            return;
        }

        // TODO make options for preselect of versions in grid programs
        let model = new ModalsSelectGridProjectModel(this.projectId, {
            grid_project_id: iface.grid.projectId
        });
        this.modalService.showModal(model)
            .then((success) => {
                let gridProject = {};
                for (let key in model.selectedGridProgramVersions) {
                    if (model.selectedGridProgramVersions.hasOwnProperty(key)) {
                        gridProject[key] = model.selectedGridProgramVersions[key].version.id;
                    }
                }

                this.selectedGrid[model.selected_grid_project.id] = gridProject;
                let converted: Blocks.BlockoTargetInterface = this.convertGridToBlockoInterface(model.selected_grid_project, model.selectedGridProgramVersions);
                this.zone.runOutsideAngular(() => {
                    callback(converted);
                });
            })
            .catch((reason: IError) => {
            });
    }

    gridRemove(gridBlock: Blocks.BaseInterfaceBlock) {
        if (gridBlock.interface.grid.projectId && this.selectedGrid.hasOwnProperty(gridBlock.interface.grid.projectId)) {
            delete this.selectedGrid[gridBlock.interface.grid.projectId];
        }
    }

    convertGridToBlockoInterface(project: IGridProject, summary: { [program_id: string]: { m_program: IGridProgram; version: IGridProgramVersion; } }): Blocks.BlockoTargetInterface {
        let out: any = {
            analogInputs: {},
            digitalInputs: {},
            messageInputs: {},
            analogOutputs: {},
            digitalOutputs: {},
            messageOutputs: {},
        };

        let programs: Array<{
            programId: string,
            programName: string,
            versionId: string,
            versionName: string
        }> = [];

        for (let key in summary) {
            if (summary.hasOwnProperty(key)) {

                const pair = summary[key];
                const program = pair.m_program;
                const version = pair.version;

                programs.push({
                    programId: program.id,
                    programName: program.name,
                    versionId: version.id,
                    versionName: version.name
                });

                let iface: any = {};
                try {
                    iface = JSON.parse(version.m_program_virtual_input_output);
                } catch (e) {
                    console.error(e);
                }

                if (iface.analogInputs) {
                    for (let k in iface.analogInputs) {
                        if (!iface.analogInputs.hasOwnProperty(k)) {
                            continue;
                        }
                        if (!out.analogInputs[k]) {
                            out.analogInputs[k] = iface.analogInputs[k];
                        }
                    }
                }

                if (iface.digitalInputs) {
                    for (let k in iface.digitalInputs) {
                        if (!iface.digitalInputs.hasOwnProperty(k)) {
                            continue;
                        }
                        if (!out.digitalInputs[k]) {
                            out.digitalInputs[k] = iface.digitalInputs[k];
                        }
                    }
                }

                if (iface.messageInputs) {
                    for (let k in iface.messageInputs) {
                        if (!iface.messageInputs.hasOwnProperty(k)) {
                            continue;
                        }
                        if (!out.messageInputs[k]) {
                            out.messageInputs[k] = iface.messageInputs[k];
                        }
                    }
                }

                if (iface.analogOutputs) {
                    for (let k in iface.analogOutputs) {
                        if (!iface.analogOutputs.hasOwnProperty(k)) {
                            continue;
                        }
                        if (!out.analogOutputs[k]) {
                            out.analogOutputs[k] = iface.analogOutputs[k];
                        }
                    }
                }

                if (iface.digitalOutputs) {
                    for (let k in iface.digitalOutputs) {
                        if (!iface.digitalOutputs.hasOwnProperty(k)) {
                            continue;
                        }
                        if (!out.digitalOutputs[k]) {
                            out.digitalOutputs[k] = iface.digitalOutputs[k];
                        }
                    }
                }

                if (iface.messageOutputs) {
                    for (let k in iface.messageOutputs) {
                        if (!iface.messageOutputs.hasOwnProperty(k)) {
                            continue;
                        }
                        if (!out.messageOutputs[k]) {
                            out.messageOutputs[k] = iface.messageOutputs[k];
                        }
                    }
                }
            }
        }

        if (
            Object.keys(out.analogInputs).length ||
            Object.keys(out.digitalInputs).length ||
            Object.keys(out.messageInputs).length ||
            Object.keys(out.analogOutputs).length ||
            Object.keys(out.digitalOutputs).length ||
            Object.keys(out.messageOutputs).length
        ) {
            return {
                grid: {
                    projectId: project.id,
                    projectName: project.name,
                    programs: programs
                },
                interface: out
            };
        }

        return null;
    }


    // CODE ------------------------------------------------------------------------------------------------------------

    onAddCode(callback: (iface: Blocks.BlockoTargetInterface) => void) {
        let model = new ModalsSelectCodeModel(this.projectId, null, );
        this.modalService.showModal(model)
            .then((success) => {
                this.zone.runOutsideAngular(() => {
                    let interfaceData = JSON.parse(model.selected_c_program_version.virtual_input_output);
                    if (interfaceData) {
                        callback({
                            code: {
                                programId: model.selected_c_program.id,
                                programName: model.selected_c_program.name,
                                versionId: model.selected_c_program_version.id,
                                versionName: model.selected_c_program_version.name,
                                versionDescription: model.selected_c_program_version.description
                            },
                            interface: interfaceData
                        });
                    }
                });
            })
            .catch((reason: IError) => {
            });
    }

    // Change Selected CProgram Version to another version and change that in Blocko Program
    onChangeCode(iface: Blocks.BlockoTargetInterface, callback: (iface: Blocks.BlockoTargetInterface) => void) {

        if (!iface.code) {
            this.fmWarning(this.translate('flash_old_interface'));
            return;
        }

        // console.log('iface.code.programId', iface.code.programId);
        // console.log('iface.code.versionId', iface.code.versionId);

        let model = new ModalsSelectCodeModel(this.projectId, null, {
            c_program_id: iface.code.programId,
            c_program_version_id: iface.code.versionId
        });
        this.modalService.showModal(model)
            .then((success) => {
                this.zone.runOutsideAngular(() => {
                    let interfaceData = JSON.parse(model.selected_c_program_version.virtual_input_output);
                    if (interfaceData) {
                        callback({
                            code: {
                                programId: model.selected_c_program.id,
                                programName: model.selected_c_program.name,
                                versionId: model.selected_c_program_version.id,
                                versionName: model.selected_c_program_version.name,
                                versionDescription: model.selected_c_program_version.description
                            },
                            interface: interfaceData
                        });
                    }
                });
            })
            .catch((reason: IError) => {

            });
    }


    // BLOCKO ----------------------------------------------------------------------------------------------------------


    onBlockoProgramRemoveClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.blockoProgram.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramDelete(this.blockoProgram.id)
                    .then(() => {
                        this.fmSuccess(this.translate('flash_blocko_removed'));
                        this.router.navigate(['/projects/' + this.projectId + '/blocko']);
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    onBlockoProgramEditClick(): void {
        let model = new ModalsBlockoPropertiesModel(this.projectId, this.blockoProgram);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramEdit(this.blockoProgram.id, { name: model.blocko.name, description: model.blocko.description })
                    .then(() => {
                        this.fmSuccess(this.translate('flash_blocko_updated'));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    // BLOCKO - VERSION OPERATIONS -------------------------------------------------------------------------------------

    selectBProgramVersionByVersionId(versionId: string) {
        // Select B_Program Version by ID if it is in URL parameter (or select last one)
        if (this.blockoProgramVersions) {
             // console.log('selectBProgramVersionByVersionId:: this.blockoProgramVersions');
            let version = null;
            if (versionId) {
                version = this.blockoProgramVersions.find((bpv) => bpv.id === versionId);
            }

            if (version) {
                this.selectBProgramVersion(version);
            }
        } else {
            // console.log('selectBProgramVersionByVersionId:: version id', versionId, 'afterLoadSelectedVersionId');
            this.afterLoadSelectedVersionId = versionId;
        }
    }

    selectBProgramVersion(programVersion: IBProgramVersion): void {

        if (!this.blockoProgramVersions || this.blockoProgramVersions.indexOf(programVersion) === -1) {
            return;
        }

        // console.log('selectBProgramVersion:: programVersion ', programVersion.name);

        this.blockUI();
        this.tyrionBackendService.bProgramVersionGet(programVersion.id)
            .then((programVersionFull) => {

                this.selectedProgramVersion = programVersionFull;
                this.selectedGrid = {};

                if (this.consoleLog) {
                    this.consoleLog.clear();
                }

                this.fileDownloaderService.download(this.selectedProgramVersion.link_to_download)
                    .then((program) => {
                        this.blockoView.setDataJson(program);

                        // Must be done after data json setting!!!
                        programVersionFull.grid_project_snapshots.forEach((pps: IBProgramVersionSnapGridProject) => {
                            this.selectedGrid[pps.grid_project.id] = {};
                            if (pps.grid_programs) {
                                pps.grid_programs.forEach((ps: IBProgramVersionSnapGridProjectProgram) => {
                                    if (ps.grid_program_version) {
                                        this.selectedGrid[pps.grid_project.id][ps.grid_program.id] = ps.grid_program_version.id;
                                    } else {
                                        this.fmErrorFromString(this.translate('flash_broken_grid_missing_version'));
                                    }
                                });
                            }
                        });

                        this.unsavedChanges = false;
                        this.exitConfirmationService.setConfirmationEnabled(false);
                        this.unblockUI();
                    })
                    .catch((reason: IError) => {
                        console.error(reason);
                        this.unsavedChanges = false;
                        this.exitConfirmationService.setConfirmationEnabled(false);
                        this.unblockUI();
                        this.fmError(reason);
                    });
            })
            .catch((reason: IError) => {
                this.unblockUI();
                console.error(reason);
                this.fmError(reason);
            });
    }

    onRemoveBProgramVersionClick(version: IBProgramVersion): void {
        this.modalService.showModal(new ModalsRemovalModel(version.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramVersionDelete(version.id)
                    .then(() => {
                        this.fmSuccess(this.translate('flash_version_removed'));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    onEditBProgramVersionClick(version: IBProgramVersion): void {
        let model = new ModalsVersionDialogModel(this.blockoProgram.id, 'BProgramVersion', version);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.bProgramVersionEdit(version.id, {
                    name: model.object.name,
                    description: model.object.description,
                    tags: model.object.tags
                }).then(() => {
                    this.fmSuccess(this.translate('flash_edit_version_been_changed', model.object.name));
                    this.refresh();
                }).catch((reason: IError) => {
                    this.fmError(reason);
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

        // console.log('onSaveClick:: selectedGrid: ',  JSON.stringify(this.selectedGrid, null, 2));

        // Grid validation
        let validGrid = true;
        for (let gridProjectId in this.selectedGrid) {
            if (this.selectedGrid.hasOwnProperty(gridProjectId)) {
                for (let gridProgramId in this.selectedGrid[gridProjectId]) {
                    if (this.selectedGrid[gridProjectId].hasOwnProperty(gridProgramId) && !this.selectedGrid[gridProjectId][gridProgramId]) {
                        validGrid = false;
                    }
                }
            }
        }

        if (!validGrid) {
            /*tslint:disable:no-shadowed-variable*/
            let m = new ModalsConfirmModel(this.translate('label_modal_error'), this.translate('label_modal_cant_save_grid_hw_without_version'), true, this.translate('label_modal_ok'), null);
            this.modalService.showModal(m);
            /*tslint:enable:no-shadowed-variable*/
            return;
        }


        // save dialog
        let model = new ModalsVersionDialogModel(this.blockoProgram.id, 'BProgramVersion');
        this.modalService.showModal(model).then((success) => {
            if (success) {

                let mProjectSnapshots: IMProjectSnapShot[] = [];

                for (let projectId in this.selectedGrid) {
                    if (this.selectedGrid.hasOwnProperty(projectId)) {

                        let programSnapshots: IMProgramSnapShot[] = [];

                        for (let programId in this.selectedGrid[projectId]) {
                            if (this.selectedGrid[projectId].hasOwnProperty(programId)) {
                                programSnapshots.push({
                                    m_program_id: programId,
                                    version_id: this.selectedGrid[projectId][programId]
                                });
                            }
                        }

                        mProjectSnapshots.push({
                            m_program_snapshots: programSnapshots,
                            m_project_id: projectId
                        });
                    }
                }

                // console.log(mProjectSnapshots);
                this.blockUI();
                this.tyrionBackendService.bProgramVersionCreate(this.blockoId, {
                    name: model.object.name,
                    description: model.object.description,
                    tags: model.object.tags,
                    m_project_snapshots: mProjectSnapshots,
                    program: this.blockoView.getDataJson()
                }).then(() => {
                    this.fmSuccess(this.translate('flash_version_saved', model.object.name));
                    this.refresh(); // also unblockUI
                    this.unsavedChanges = false;
                    this.exitConfirmationService.setConfirmationEnabled(false);
                }).catch((reason: IError) => {
                    this.fmError(reason);
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
                } else {
                    this.unblockUI();
                }
            }).catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }

    onSomethingChanged() {
        this.unsavedChanges = true;
        this.exitConfirmationService.setConfirmationEnabled(true);
    }

    onDrobDownEmiter(action: string, version: IBProgramVersion): void { // TODO cool function name :-P
        if (action === 'edit_version_properties') {
            this.onEditBProgramVersionClick(version);
        }

        if (action === 'remove_version') {
            this.onRemoveBProgramVersionClick(version);
        }
    }
}
