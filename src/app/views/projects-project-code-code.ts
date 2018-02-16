/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Component, OnInit, Injector, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess, FlashMessage } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { CodeFile, CodeIDEComponent } from '../components/CodeIDEComponent';
import { ModalsConfirmModel } from '../modals/confirm';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { IProject, ICProgram, ICProgramVersion, ILibraryRecord, ICProgramVersionShortDetail, IHardwareType, IHardware } from '../backend/TyrionAPI';
import { ICodeCompileErrorMessage, CodeCompileError, CodeError } from '../backend/BeckiBackend';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { NullSafe } from '../helpers/NullSafe';
import { ModalsSelectHardwareComponent, ModalsSelectHardwareModel } from '../modals/select-hardware';
import { getAllInputOutputs, getInputsOutputs } from '../helpers/CodeInterfaceHelpers';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { ModalsCodeAddLibraryModel } from '../modals/code-add-library';
import moment = require('moment/moment');
import { ModalsCodeLibraryVersionModel } from '../modals/code-library-version';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsCodePropertiesModel } from '../modals/code-properties';
import { ModalsSetAsMainModel } from '../modals/set-as-main';
import { ModalsPublicShareRequestModel } from '../modals/public-share-request';
import { ModalsPublicShareResponseModel } from '../modals/public-share-response';
import { ExitConfirmationService } from '../services/ExitConfirmationService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'bk-view-projects-project-code-code',
    templateUrl: './projects-project-code-code.html'
})
export class ProjectsProjectCodeCodeComponent extends BaseMainComponent implements OnInit, OnDestroy, AfterViewInit {

    projectId: string;
    codeId: string;

    routeParamsSubscription: Subscription;

    codeProgram: ICProgram = null;
    codeProgramVersions: ICProgramVersionShortDetail[] = null;

    selectedProgramVersion: ICProgramVersion = null;
    selectedCodeFiles: CodeFile[] = null;

    buildErrors: ICodeCompileErrorMessage[] = null;
    buildInProgress: boolean = false;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    reloadInterval: any = null;
    hardwareType: IHardwareType = null;

    allDevices: IHardware[];
    projectSubscription: Subscription;

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    @ViewChild(CodeIDEComponent)
    codeIDE: CodeIDEComponent;


    // List of all Version for compilation (for this type_of_board)
    libraryCompilationVersionOptions: FormSelectComponentOption[] = null;
    formLibrarySelector: FormGroup;

    protected afterLoadSelectedVersionId: string = null;

    fileChangeTimeout: any = null;

    protected exitConfirmationService: ExitConfirmationService = null;


    constructor(injector: Injector) {
        super(injector);

        this.exitConfirmationService = injector.get(ExitConfirmationService);
        this.exitConfirmationService.setConfirmationEnabled(false);

    };

    ngOnInit(): void {
        let main = new CodeFile('main.cpp', '');
        main.fixedPath = true;
        this.selectedCodeFiles = [main];

        this.refreshInterface();

        this.formLibrarySelector = this.formBuilder.group({
            'tag_name': ['', [Validators.required]]
        });

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.codeId = params['code'];
            this.projectId = params['project'];
            this.refresh();

            if (this.projectId != null && !this.projectSubscription) {
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.allDevices = project.boards;
                });
            }
            if (this.projectId != null && params['version']) {
                this.router.navigate(['/projects', this.projectId, 'code', this.codeId], { replaceUrl: true });
                this.selectVersionByVersionId(params['version']);
            }
        });

        this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
            if (status.model === 'CProgram' && this.codeId === status.model_id) {
                this.refresh();
            }
        });

    }

    ngAfterViewInit(): void {
        this.refreshInterface();
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();

        if (this.reloadInterval) {
            clearInterval(this.reloadInterval);
            this.reloadInterval = null;
        }

        if (this.projectId != null && this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    /**
     * Little bit complicated Boolean,
     * But its only for Main Default C_PRograms for Type Of Boards and only for not already Mark && only
     * succesfully compiled
     * @param version
     * @returns {boolean}
     */
    markupableAsMain(version: ICProgramVersionShortDetail): boolean {
        return !version
            && !this.projectId
            && !this.hardwareType
            && (this.hardwareType.main_test_c_program != null || this.hardwareType.main_c_program == null)
            && (this.hardwareType.main_test_c_program.id === this.codeProgram.id || this.hardwareType.main_c_program.id === this.codeProgram.id)
            && version.status === 'successfully_compiled_and_restored'
            && !version.main_mark;
    }


    onCProgramPublishResult(version: ICProgramVersionShortDetail): void {
        let model = new ModalsPublicShareResponseModel(
            version.version_name,
            version.version_description,
            this.codeProgram.name,
            this.codeProgram.description
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramVersionEditResponsePublication({
                    version_id: version.version_id,
                    version_name: model.version_name,
                    version_description: model.version_description,
                    decision: model.decision,
                    reason: model.reason,
                    program_description: model.program_description,
                    program_name: model.program_name
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onRemoveClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.codeProgram.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramDelete(this.codeProgram.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        if (this.projectId != null) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        }
                        this.router.navigate(['/projects/' + this.projectId + '/code']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code'), reason));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    onEditClick(): void {
        let model = new ModalsCodePropertiesModel(null, this.codeProgram.name, this.codeProgram.description, '', true, this.codeProgram.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramEdit(this.codeProgram.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onRemoveVersionClick(version: ICProgramVersionShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(version.version_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramVersionDelete(version.version_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_version_remove')));
                        if (this.projectId != null) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        }
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code_version'), reason));
                        if (this.projectId != null) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        }
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: ICProgramVersionShortDetail): void {
        let model = new ModalsVersionDialogModel(version.version_name, version.version_description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramVersionEditInformation(version.version_id, { // TODO [permission]: version.update_permission
                    version_name: model.name,
                    version_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_version_change', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_code_version', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    selectVersionByVersionId(versionId: string) {
        if (this.codeProgramVersions && !(this.codeProgramVersions.length === 0)) {
            let version = null;
            if (versionId) {
                version = this.codeProgramVersions.find((bpv) => bpv.version_id === versionId);
            }

            if (version) {
                this.selectProgramVersion(version);
            }
        } else {
            this.afterLoadSelectedVersionId = versionId;
        }
    }

    refresh(): void {

        this.blockUI();
        this.tyrionBackendService.cProgramGet(this.codeId) // TODO [permission]: C_program.read_permission(Project.read_permission)
            .then((codeProgram) => {

                this.codeProgram = codeProgram;

                this.codeProgramVersions = this.codeProgram.program_versions || [];

                let version = null;
                if (this.afterLoadSelectedVersionId) {
                    version = this.codeProgramVersions.find((bpv) => bpv.version_id === this.afterLoadSelectedVersionId);
                }

                if (version) {
                    this.selectProgramVersion(version);
                } else if (this.codeProgramVersions.length > 0) {
                    this.selectProgramVersion(this.codeProgramVersions[0]);
                }

                this.unblockUI();

                this.tyrionBackendService.hardwareTypeGet(this.codeProgram.type_of_board_id)
                    .then((response) => {
                        this.hardwareType = response;
                        this.onMakeListOfCompilationVersion();
                    });
            })
            .catch(reason => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load_code_types'), reason));
            });

    }

    onMakeListOfCompilationVersion() {
        this.libraryCompilationVersionOptions = this.hardwareType.supported_libraries.map((pv) => {
            return {
                label: pv.tag_name,
                value: pv.tag_name
            };
        });
    }

    onAddLibraryClick() {
        let m = new ModalsCodeAddLibraryModel(this.projectId);
        let mm: ModalsCodeLibraryVersionModel = null;
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    mm = new ModalsCodeLibraryVersionModel(m.library.id);
                    return this.modalService.showModal(mm);
                }
                return null;
            })
            .then((success) => {
                if (success && mm && mm.libraryVersion) {

                    let cf = new CodeFile(this.translate('codefile_library_version_dont_have_readme', m.library.name, mm.libraryVersion.version_name, m.library.name, mm.libraryVersion.version_name));
                    cf.fixedPath = true;
                    cf.library = true;
                    cf.readonly = true;

                    cf.originalObjectFullPath = '';

                    cf.libraryId = m.library.id;
                    cf.libraryName = m.library.name;
                    cf.libraryVersionId = mm.libraryVersion.version_id;

                    this.codeIDE.exetrnalAddFile(cf);

                    this.tyrionBackendService.libraryVersionGet(mm.libraryVersion.version_id)
                        .then((lv) => {
                            if (lv && lv.files) {
                                lv.files.forEach((f) => {
                                    if (f.file_name.toLowerCase() === 'readme.md') {
                                        cf.content = cf.contentOriginal = f.content;
                                    }
                                });
                            }
                        });
                }
            });
    }

    onChangeLibraryVersionClick(cf: CodeFile) {

        let mm = new ModalsCodeLibraryVersionModel(cf.libraryId, cf.libraryVersionId);
        this.modalService.showModal(mm)
            .then((success) => {

                cf.objectFullPath = `${cf.libraryName} (${mm.libraryVersion.version_name})`;
                cf.content = cf.contentOriginal = this.translate('codefile_library_version_short_dont_have_readme', cf.libraryName, mm.libraryVersion.version_name);
                cf.libraryVersionId = mm.libraryVersion.version_id;

                this.codeIDE.externalRefresh();

                this.tyrionBackendService.libraryVersionGet(mm.libraryVersion.version_id)
                    .then((lv) => {
                        if (lv && lv.files) {
                            lv.files.forEach((f) => {
                                if (f.file_name.toLowerCase() === 'readme.md') {
                                    cf.content = cf.contentOriginal = f.content;
                                }
                            });
                        }
                    });

            });
    }

    onFileContentChange(e: { fileFullPath: string, content: string }) {
        if (this.fileChangeTimeout) {
            clearTimeout(this.fileChangeTimeout);
        }
        this.fileChangeTimeout = setTimeout(() => this.onFileContentChangeDebounced(), 500);
        this.exitConfirmationService.setConfirmationEnabled(true);

    }

    onFileContentChangeDebounced() {
        this.refreshInterface();
    }

    onMakeClone(): void {
        let model = new ModalsCodePropertiesModel(null, this.codeProgram.name, this.codeProgram.description, '', true, this.codeProgram.name, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramMakeClone({
                    c_program_id: this.codeProgram.id,
                    project_id: this.projectId,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));

                        this.unblockUI();
                        if (this.projectId != null) {
                            this.navigate(['/projects', this.projectId, 'code']);
                        }

                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.unblockUI();
                    });
            }
        });
    }

    refreshInterface() {

        if (!this.codeProgram) {
            return;
        }

        let main = '';

        let userFiles: { [file: string]: string } = {};

        this.selectedCodeFiles.forEach((file) => {
            if (file.objectFullPath === 'main.cpp') {
                main = file.content;
            } else if (!file.library) {
                userFiles[file.objectFullPath] = file.content;
            }
        });

        let ios = getAllInputOutputs(main, userFiles);

        this.blockoView.setInterfaces([{
            'color': '#99ccff',
            'targetId': 'dummy_id',
            'displayName': 'Program ' + this.codeProgram.name,
            'interface': ios
        }]);
    }

    reloadVersions(): void {
        if (this.codeId) {
            this.tyrionBackendService.cProgramGet(this.codeId)
                .then((codeProgram) => {
                    this.codeProgram = codeProgram;
                    this.codeProgramVersions = this.codeProgram.program_versions || [];
                });
        }
    }

    onCommunityPublicVersionClick(programVersion: ICProgramVersionShortDetail) {
        this.modalService.showModal(new ModalsPublicShareRequestModel(this.codeProgram.name, programVersion.version_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramVersionMakePublic(programVersion.version_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_was_publisher')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_code_publish_error'), reason));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    selectProgramVersion(programVersion: ICProgramVersionShortDetail) {
        if (!this.codeProgramVersions) {
            return;
        }
        if (this.codeProgramVersions.indexOf(programVersion) === -1) {
            return;
        }

        this.blockUI();
        this.tyrionBackendService.cProgramVersionGet(programVersion.version_id) // TODO [permission]: C_program.Version.read_permission
            .then((programVersionFull) => {
                this.unblockUI();

                this.selectedProgramVersion = programVersionFull;

                let codeFiles: CodeFile[] = [];
                if (Array.isArray(programVersionFull.files)) {
                    codeFiles = (programVersionFull.files).map((uf) => {
                        return new CodeFile(uf.file_name, uf.content);
                    });
                }

                let main = new CodeFile('main.cpp', programVersionFull.main);
                main.fixedPath = true;
                codeFiles.push(main);

                if (Array.isArray(programVersionFull.imported_libraries)) {
                    programVersionFull.imported_libraries.forEach((uf) => {

                        let cf = new CodeFile(this.translate('codefile_library_version_dont_have_readme', uf.library_short_detail.name, uf.library_version_short_detail.version_name,
                            uf.library_short_detail.name, uf.library_version_short_detail.version_name));
                        cf.fixedPath = true;
                        cf.library = true;
                        cf.readonly = true;

                        cf.libraryId = uf.library_short_detail.id;
                        cf.libraryName = uf.library_short_detail.name;
                        cf.libraryVersionId = uf.library_version_short_detail.version_id;

                        this.tyrionBackendService.libraryVersionGet(uf.library_version_short_detail.version_id)
                            .then((lv) => {
                                if (lv && lv.files) {
                                    lv.files.forEach((f) => {
                                        if (f.file_name.toLowerCase() === 'readme.md') {
                                            cf.content = cf.contentOriginal = f.content;
                                        }
                                    });
                                }
                            });

                        codeFiles.push(cf);
                    });
                }

                this.selectedCodeFiles = codeFiles;

                this.refreshInterface();

                this.buildErrors = null;

            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(this.translate('flash_cant_load_version', programVersion.version_name, err));
            });

    }

    onProgramVersionClick(programVersion: ICProgramVersionShortDetail) {

        if (this.selectedProgramVersion) {

            let changedFiles: string[] = this.changesInSelectedVersion();

            if (changedFiles.length) {

                let text = '';
                if (this.selectedProgramVersion.version_object.id === programVersion.version_id) {
                    text = this.translate('text_unsaved_change_reload', this.selectedProgramVersion.version_object.version_name);
                } else {
                    text = this.translate('text_unsaved_change_switch', this.selectedProgramVersion.version_object.version_name, programVersion.version_name);
                }

                let confirm = new ModalsConfirmModel(
                    text,
                    this.translate('text_changed_files') + changedFiles.join('<br>')
                );

                this.modalService.showModal(confirm).then((yes) => {
                    if (yes) {
                        this.selectProgramVersion(programVersion);
                    }
                });

            } else {
                if (this.selectedProgramVersion.version_object.id !== programVersion.version_id) {
                    this.selectProgramVersion(programVersion);
                }
            }

        } else {
            this.selectProgramVersion(programVersion);
        }
    }

    changesInSelectedVersion(): string[] {
        let changedFiles: string[] = [];
        if (Array.isArray(this.selectedCodeFiles)) {
            this.selectedCodeFiles.forEach((file) => {
                if (file.changes) {
                    changedFiles.push('/' + file.objectFullPath);
                }
            });
        }
        return changedFiles;
    }

    isSelected(version: ICProgramVersionShortDetail): boolean {
        return NullSafe(() => this.selectedProgramVersion.version_object.id) === version.version_id;
    }

    saveCode() {
        let m = new ModalsVersionDialogModel(moment().format('YYYY-MM-DD HH:mm:ss'));
        this.modalService.showModal(m).then((success) => {
            if (success) {
                let main = '';

                let userFiles: ILibraryRecord[] = [];

                let libs: string[] = [];

                this.selectedCodeFiles.forEach((file) => {
                    if (file.objectFullPath === 'main.cpp') {
                        main = file.content;
                    } else if (file.library) {
                        libs.push(file.libraryVersionId);
                    } else {
                        userFiles.push({
                            file_name: file.objectFullPath,
                            content: file.content
                        });
                    }
                });

                this.blockUI();
                this.tyrionBackendService.cProgramVersionCreate(this.codeId, { // TODO [permission]: "C_Program.update_permission" : "true",
                    imported_libraries: libs,
                    version_name: m.name,
                    version_description: m.description,
                    main: main,
                    files: userFiles,
                    library_compilation_version: this.formLibrarySelector.controls['tag_name'].value
                })
                    .then(() => {
                        this.fmSuccess(this.translate('flash_code_version_save', m.name));
                        this.exitConfirmationService.setConfirmationEnabled(true);

                        this.refresh();
                    })
                    .catch((err) => {
                        this.fmError(this.translate('flash_cant_save_code_version', m.name, err));
                        this.unblockUI();
                    });
            }
        });

    }

    onSaveClick() {
        if (this.changesInSelectedVersion().length === 0) {
            let con = new ModalsConfirmModel(this.translate('modal_label_save_same_code'), this.translate('modal_text_no_change'), false, this.translate('btn_yes'), this.translate('btn_no'), null);
            this.modalService.showModal(con).then((success) => {
                if (!success) {
                    return;
                } else {
                    this.saveCode();
                }
            });
        } else {
            this.saveCode();
        }
    }

    onBuildClick() {
        if (!this.selectedCodeFiles) {
            return;
        }

        let main = '';

        let userFiles: ILibraryRecord[] = [];

        let libs: string[] = [];

        this.buildErrors = null;
        this.selectedCodeFiles.forEach((file) => {
            file.annotations = [];

            if (file.objectFullPath === 'main.cpp') {
                main = file.content;
            } else if (file.library) {
                libs.push(file.libraryVersionId);
            } else {
                userFiles.push({
                    file_name: file.objectFullPath,
                    content: file.content
                });
            }
        });

        this.buildInProgress = true;
        this.tyrionBackendService.cProgramCompile({
            imported_libraries: libs,
            main: main,
            files: userFiles,
            type_of_board_id: this.codeProgram.type_of_board_id,
            library_compilation_version: this.formLibrarySelector.controls['tag_name'].value
        })
            .then((success) => {
                this.buildInProgress = false;
                // console.log(success);
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_version_build_success')));
            })
            .catch((error) => {
                this.buildInProgress = false;
                if (error instanceof CodeCompileError) {
                    this.buildErrors = error.errors;

                    // TODO: move to method
                    let filesAnnotations: { [filename: string]: any[] } = {};
                    this.buildErrors.forEach((bError) => {
                        let filename = bError.filename.substr(1);
                        if (!filesAnnotations[filename]) {
                            filesAnnotations[filename] = [];
                        }
                        filesAnnotations[filename].push({
                            row: bError.line - 1,
                            column: 1,
                            text: bError.text,
                            type: bError.type
                        });

                    });

                    this.selectedCodeFiles.forEach((f) => {
                        if (filesAnnotations[f.objectFullPath]) {
                            f.annotations = filesAnnotations[f.objectFullPath];
                        }
                    });

                } else {
                    this.addFlashMessage(new FlashMessageError(error.toString()));
                }
            });
    }

    onCProgramDefaultSetMainClick(version: ICProgramVersionShortDetail) {
        this.modalService.showModal(new ModalsSetAsMainModel(this.translate('label_default_c_program_setting'), version.version_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.typeofboardSetcprogramversion_as_main(version.version_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_successfully_set_as_default')));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove'), reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onUploadClick(version: ICProgramVersionShortDetail) {
        if (!version) {
            return;
        }

        this.blockUI();
        this.tyrionBackendService.boardsGetForIdeOperation(this.projectId) // TODO [permission]: Board.update_permission
            .then((boards) => {
                this.unblockUI();

                let connectibleDevices = boards;
                if (!connectibleDevices || connectibleDevices.length === 0) {
                    this.modalService.showModal(new ModalsConfirmModel(this.translate('modal_label_error'), this.translate('modal_text_no_yoda'), true, this.translate('btn_ok'), null));
                    return;
                }

                let m = new ModalsSelectHardwareModel(connectibleDevices);
                this.modalService.showModal(m)
                    .then((success) => {
                        if (success && m.selectedBoard) {
                            this.blockUI();
                            this.tyrionBackendService.cProgramUploadIntoHardware({
                                board_pairs: [{
                                    board_id: m.selectedBoard.id,
                                    c_program_version_id: version.version_id
                                }]
                            }).then((result) => {
                                this.fmSuccess(this.translate('flash_update_success'));
                                this.unblockUI();
                            }).catch((e) => {
                                this.fmError(this.translate('flash_cant_upload_code'));
                                this.unblockUI();
                            });
                        }
                    });
            });
    }
}
