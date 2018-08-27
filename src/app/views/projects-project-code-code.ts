/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess, FlashMessage } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { CodeFile, CodeIDEComponent } from '../components/CodeIDEComponent';
import { ModalsConfirmModel } from '../modals/confirm';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { IProject, ICProgram, ILibraryRecord, ICProgramVersion, IHardwareType, IHardware } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { NullSafe } from '../helpers/NullSafe';
import { ModalsSelectHardwareComponent, ModalsSelectHardwareModel } from '../modals/select-hardware';
import { getAllInputOutputs, getInputsOutputs } from '../helpers/CodeInterfaceHelpers';
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
import { CodeCompileError, ICodeCompileErrorMessage } from '../services/_backend_class/Responses';
import { BlockoViewComponent } from '../components/BlockoViewComponent';

@Component({
    selector: 'bk-view-projects-project-code-code',
    templateUrl: './projects-project-code-code.html'
})
export class ProjectsProjectCodeCodeComponent extends _BaseMainComponent implements OnInit, OnDestroy, AfterViewInit {

    project_Id: string;
    codeId: string;

    routeParamsSubscription: Subscription;

    codeProgram: ICProgram = null;
    codeProgramVersions: ICProgramVersion[] = null;

    selectedProgramVersion: ICProgramVersion = null;
    selectedCodeFiles: CodeFile[] = null;

    buildErrors: ICodeCompileErrorMessage[] = null;
    buildInProgress: boolean = false;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    hardwareType: IHardwareType = null;

    selected_hardware: IHardware[] = [];
    projectSubscription: Subscription;


    @ViewChild('CodeIDEComponent')
    codeIDE: CodeIDEComponent;

    tab: string = 'ide';
    tab_under_ide: string = 'error_list';

    // List of all Version for compilation (for this type_of_board)
    libraryCompilationVersionOptions: FormSelectComponentOption[] = null;


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

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.codeId = params['code'];
            this.project_Id = params['project'];
            this.refresh();

            if (this.project_Id != null && params['version']) {
                this.router.navigate(['/projects', this.project_Id, 'code', this.codeId], { replaceUrl: true });
                this.selectVersionByVersionId(params['version']);
            }
        });

        this.tyrionBackendService.objectUpdateTyrionEcho.subscribe(status => {
            if (status.model === 'CProgram' && this.codeId === status.model_id) {
                this.refresh();
            }
        });

    }

    onPortletClick(action: string): void {
        if (action === 'edit_program') {
            this.onEditClick();
        }

        if (action === 'remove_program') {
            this.onRemoveClick();
        }

        if (action === 'make_clone') {
            this.onMakeClone();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onToggleIDETab(tab: string) {
        if (this.tab_under_ide === tab) {
            this.tab_under_ide = ''; // Hide tab
        }else {
            this.tab_under_ide = tab;
        }
    }


    ngAfterViewInit(): void {
        this.refreshInterface();
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();

        if (this.project_Id != null && this.projectSubscription) {
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
    markupableAsMain(version: ICProgramVersion): boolean {
        return !version
            && !this.project_Id
            && !this.hardwareType
            && (this.hardwareType.main_test_c_program != null || this.hardwareType.main_c_program == null)
            && (this.hardwareType.main_test_c_program.id === this.codeProgram.id || this.hardwareType.main_c_program.id === this.codeProgram.id)
            && version.status === 'SUCCESS'
            && !version.main_mark;
    }

    onCProgramPublishResult(version: ICProgramVersion): void {
        let model = new ModalsPublicShareResponseModel(
            version.name,
            version.description,
            this.codeProgram.name,
            this.codeProgram.description
        );
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramVersionEditResponsePublication({
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
                        if (this.project_Id != null) {
                            this.refresh();
                        }
                        this.router.navigate(['/projects/' + this.project_Id + '/code']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onEditClick(): void {
        let model = new ModalsCodePropertiesModel(null, this.codeProgram.name, this.codeProgram.description, '', this.codeProgram.tags, true, this.codeProgram.name);
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

    onRemoveVersionClick(version: ICProgramVersion): void {
        this.modalService.showModal(new ModalsRemovalModel(version.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramVersionDelete(version.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_version_remove')));
                        if (this.project_Id != null) {
                            this.refresh();
                        }
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code_version'), reason));
                        if (this.project_Id != null) {
                            this.refresh();
                        }
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: ICProgramVersion): void {
        let model = new ModalsVersionDialogModel(version.name, version.description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramVersionEditInformation(version.id, {
                    name: model.name,
                    description: model.description
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
                version = this.codeProgramVersions.find((bpv) => bpv.id === versionId);
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
        this.tyrionBackendService.cProgramGet(this.codeId).then((codeProgram) => {

            this.codeProgram = codeProgram;

            this.codeProgramVersions = this.codeProgram.program_versions || [];

            let version = null;
            if (this.afterLoadSelectedVersionId) {
                version = this.codeProgramVersions.find((bpv) => bpv.id === this.afterLoadSelectedVersionId);
            }

            if (version) {
                this.selectProgramVersion(version);
            } else if (this.codeProgramVersions.length > 0) {
                this.selectProgramVersion(this.codeProgramVersions[0]);
            }

            this.unblockUI();

            this.tyrionBackendService.hardwareTypeGet(this.codeProgram.hardware_type.id)
                .then((response) => {
                    this.hardwareType = response;
                    this.onMakeListOfCompilationVersion();
                });
        }).catch(reason => {
            this.unblockUI();
            this.fmError(this.translate('flash_cant_load_code_types'), reason);
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
        let m = new ModalsCodeAddLibraryModel(this.project_Id);
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

                    let cf = new CodeFile(this.translate('codefile_library_version_dont_have_readme', m.library.name, mm.libraryVersion.name, m.library.name, mm.libraryVersion.name));
                    cf.fixedPath = true;
                    cf.library = true;
                    cf.readonly = true;

                    cf.originalObjectFullPath = '';

                    cf.libraryId = m.library.id;
                    cf.libraryName = m.library.name;
                    cf.libraryVersionId = mm.libraryVersion.id;

                    this.codeIDE.exetrnalAddFile(cf);

                    this.tyrionBackendService.libraryVersionGet(mm.libraryVersion.id)
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

                cf.objectFullPath = `${cf.libraryName} (${mm.libraryVersion.name})`;
                cf.content = cf.contentOriginal = this.translate('codefile_library_version_short_dont_have_readme', cf.libraryName, mm.libraryVersion.name);
                cf.libraryVersionId = mm.libraryVersion.id;

                this.codeIDE.externalRefresh();

                this.tyrionBackendService.libraryVersionGet(mm.libraryVersion.id)
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
        let model = new ModalsCodePropertiesModel(null, this.codeProgram.name, this.codeProgram.description, '', this.codeProgram.tags, true, this.codeProgram.name, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramMakeClone({
                    c_program_id: this.codeProgram.id,
                    project_id: this.project_Id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));

                        this.unblockUI();
                        if (this.project_Id != null) {
                            this.navigate(['/projects', this.project_Id, 'code']);
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


        this.codeIDE.refreshInterface(ios);

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

    onCommunityPublicVersionClick(programVersion: ICProgramVersion) {
        this.modalService.showModal(new ModalsPublicShareRequestModel(this.codeProgram.name, programVersion.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramVersionMakePublic(programVersion.id)
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

    selectProgramVersion(programVersion: ICProgramVersion) {
        if (!this.codeProgramVersions) {
            return;
        }
        if (this.codeProgramVersions.indexOf(programVersion) === -1) {
            return;
        }

        this.selectedProgramVersion = programVersion;

        let codeFiles: CodeFile[] = [];
        if (Array.isArray(programVersion.program.files)) {
            codeFiles = (programVersion.program.files).map((uf) => {
                return new CodeFile(uf.file_name, uf.content);
            });
        }

        let main = new CodeFile('main.cpp', programVersion.program.main);
        main.fixedPath = true;
        codeFiles.push(main);

        if (Array.isArray(programVersion.program.imported_libraries)) {
            programVersion.program.imported_libraries.forEach((uf) => {

                let cf = new CodeFile(this.translate('codefile_library_version_dont_have_readme', uf.library.name, uf.library_version.name,
                    uf.library.name, uf.library_version.name));
                cf.fixedPath = true;
                cf.library = true;
                cf.readonly = true;

                cf.libraryId = uf.library.id;
                cf.libraryName = uf.library.name;
                cf.libraryVersionId = uf.library_version.id;

                this.tyrionBackendService.libraryVersionGet(uf.library_version.id)
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

    }

    onProgramVersionClick(programVersion: ICProgramVersion) {

        if (this.selectedProgramVersion) {

            let changedFiles: string[] = this.changesInSelectedVersion();

            if (changedFiles.length) {

                let text = '';
                if (this.selectedProgramVersion.id === programVersion.id) {
                    text = this.translate('text_unsaved_change_reload', this.selectedProgramVersion.name);
                } else {
                    text = this.translate('text_unsaved_change_switch', this.selectedProgramVersion.name, programVersion.name);
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
                if (this.selectedProgramVersion.id !== programVersion.id) {
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

    isSelected(version: ICProgramVersion): boolean {
        return NullSafe(() => this.selectedProgramVersion.id) === version.id;
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
                this.tyrionBackendService.cProgramVersionCreateSaveAs(this.codeId, {
                    imported_libraries: libs,
                    name: m.name,
                    description: m.description,
                    main: main,
                    files: userFiles,
                    library_compilation_version: this.codeIDE.formLibrarySelector.controls['compilation_version_library_tag'].value
                })
                    .then(() => {
                        this.fmSuccess(this.translate('flash_code_version_save', m.name));
                        this.exitConfirmationService.setConfirmationEnabled(false);

                        this.refresh();
                    })
                    .catch((err) => {
                        this.fmError(this.translate('flash_cant_save_code_version', m.name, err));
                        this.unblockUI();
                    });
            }
        });
    }

    saveAsCode() {

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
        this.tyrionBackendService.cProgramVersionWorkingcopysave(this.codeId, {
            imported_libraries: libs,
            main: main,
            files: userFiles,
            library_compilation_version: this.codeIDE.formLibrarySelector.controls['compilation_version_library_tag'].value,
           // name: 'Working Cpy'
        })
            .then(() => {
                this.exitConfirmationService.setConfirmationEnabled(false);
                this.refresh();
            })
            .catch((err) => {
                this.fmError(this.translate('flash_cant_save_code_version', 'Working Copy', err));
                this.unblockUI();
            });

    }

    onSaveClick() {
        console.info('onSaveClick');
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
            hardware_type_id: this.codeProgram.hardware_type.id,
            library_compilation_version: this.codeIDE.formLibrarySelector.controls['compilation_version_library_tag'].value,
            immediately_hardware_update: this.codeIDE.upload_after_build,
            hardware_ids: this.codeIDE.selectedHardware.map(x => x.id)
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

    onCProgramDefaultSetMainClick(version: ICProgramVersion) {
        this.modalService.showModal(new ModalsSetAsMainModel(this.translate('label_default_c_program_setting'), version.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.hardwareTypeSetcprogramversion_as_main(version.id)
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

    onAddDeveloperHardwareClick() {
        let m = new ModalsSelectHardwareModel(this.project_Id, this.hardwareType, true, false, true);
        this.modalService.showModal(m).then((success) => {
            this.selected_hardware.push.apply(this.selected_hardware, m.selected_hardware);
        });
    }

    onRemoveDeveloperHardwareClick(hardware: IHardware) {
        for (let i =  this.selected_hardware.length - 1; i >= 0; i--) {
            if (this.selected_hardware[i].id === hardware.id) {
                this.selected_hardware.splice(i, 1);
            }
        }
    }

    onDrobDownEmiter(action: string, version: ICProgramVersion): void {

        if (action === 'version_properties') {
            this.onEditVersionClick(version);
        }

        if (action === 'version_properties_community') {
            this.onCommunityPublicVersionClick(version);
        }

        if (action === 'version_publish') {
            this.onCProgramPublishResult(version);
        }

        if (action === 'set_as_main') {
            this.onCProgramDefaultSetMainClick(version);
        }

        if (action === 'remove_version') {
            this.onRemoveVersionClick(version);
        }
    }
}
