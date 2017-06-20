/**
 * Created by davidhradek on 17.08.16.
 */

import { Component, OnInit, Injector, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess, FlashMessage } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { CodeFile, CodeIDEComponent } from '../components/CodeIDEComponent';
import { ModalsConfirmModel } from '../modals/confirm';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import { IProject, ICProgram, ICProgramVersion, ILibraryRecord, ICProgramVersionShortDetail, ITypeOfBoard, IBoardShortDetail } from '../backend/TyrionAPI';
import { ICodeCompileErrorMessage, CodeCompileError, CodeError } from '../backend/BeckiBackend';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { NullSafe } from '../helpers/NullSafe';
import { ModalsSelectHardwareComponent, ModalsSelectHardwareModel } from '../modals/select-hardware';
import { getAllInputOutputs, getInputsOutputs } from '../helpers/CodeInterfaceHelpers';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { ModalsCodeAddLibraryModel } from '../modals/code-add-library';

import moment = require('moment/moment');
import { ModalsCodeLibraryVersionModel } from '../modals/code-library-version';


@Component({
    selector: 'bk-view-projects-project-code-code',
    templateUrl: './projects-project-code-code.html'
})
export class ProjectsProjectCodeCodeComponent extends BaseMainComponent implements OnInit, OnDestroy, AfterViewInit {

    projectId: string;
    codeId: string;

    routeParamsSubscription: Subscription;

    // project: IProject = null;

    codeProgram: ICProgram = null;
    codeProgramVersions: ICProgramVersionShortDetail[] = null;

    selectedProgramVersion: ICProgramVersion = null;
    selectedCodeFiles: CodeFile[] = null;

    buildErrors: ICodeCompileErrorMessage[] = null;
    buildInProgress: boolean = false;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    reloadInterval: any = null;
    device: ITypeOfBoard = null;

    allDevices: IBoardShortDetail[];
    projectSubscription: Subscription;

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    @ViewChild(CodeIDEComponent)
    codeIDE: CodeIDEComponent;

    protected afterLoadSelectedVersionId: string = null;

    fileChangeTimeout: any = null;

    versionStatusTranslate: { [key: string]: string } = {
        'compilation_in_progress': 'Compilation is in progress',
        'successfully_compiled_and_restored': 'Successfully compiled',
        'server_was_offline': 'Server error (offline) The server can fix bugs after a while. We know about this error immediately and we\'re working on it. Please be patient.',
        'successfully_compiled_not_restored': 'Compilation server error. But the server can fix bugs after a while. We know about this error immediately and we\'re working on it. Please be patient.',
        'compiled_with_code_errors': 'Code compilation finished with errors.',
        'file_with_code_not_found': 'Code file not found. But the server can fix bugs after a while. We know about this error immediately and we\'re working on it. Please be patient.',
        'compilation_server_error': 'Compilation server error. But the server can fix bugs after a while. We know about this error immediately and we\'re working on it. Please be patient.',
        'json_code_is_broken': 'Json Code is Broken. Please Try it again.',
        'hardware_unstable': 'Some of your devices with this version of the program had a critical error and had to be' +
                             ' restored from a backup. This version is not recommended to use in production until you' +
                             ' have solved the reason for the fall.',
        'undefined': 'Status of version is not known'
    };

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        let main = new CodeFile('main.cpp', '');
        main.fixedPath = true;
        this.selectedCodeFiles = [main];

        this.refreshInterface();

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.codeId = params['code'];
            this.refresh();

            if (!this.projectSubscription) {
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.allDevices = project.boards;
                });
            }
            if (params['version']) {
                this.router.navigate(['/projects', this.projectId, 'code', this.codeId], {replaceUrl: true});
                this.selectVersionByVersionId(params['version']);
            }
        });

        /*
         * TODO - this is something like DDOS attack to tyrion, it must be changed to something more sophisticated
         */
        this.reloadInterval = setInterval(() => {
            this.reloadVersions();
        }, 10000);

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

        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
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
        this.backendService.getCProgram(this.codeId) // TODO [permission]: C_program.read_permission(Project.read_permission)
            .then((codeProgram) => {

                this.codeProgram = codeProgram;

                this.codeProgramVersions = this.codeProgram.program_versions || [];

                /*this.codeProgramVersions.sort((a, b)=> {
                    if (a.version_object.date_of_create == b.version_object.date_of_create) return 0;
                    if (a.version_object.date_of_create > b.version_object.date_of_create) return -1;
                    return 1;
                });*/

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

                this.backendService.getTypeOfBoard(this.codeProgram.type_of_board_id)
                    .then((response) => {
                        this.device = response;
                    });
            })
            .catch(reason => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(`The code types cannot be loaded.`, reason));
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

                    let cf = new CodeFile(`${m.library.name} (${mm.libraryVersion.version_name})`, `# Library ${m.library.name}\n\nVersion: ${mm.libraryVersion.version_name}\n\nLooks like this library doesn't have README.md file.`);
                    cf.fixedPath = true;
                    cf.library = true;
                    cf.readonly = true;

                    cf.originalObjectFullPath = '';

                    cf.libraryId = m.library.id;
                    cf.libraryName = m.library.name;
                    cf.libraryVersionId = mm.libraryVersion.version_id;

                    this.codeIDE.exetrnalAddFile(cf);

                    this.backendService.getLibraryVersion(mm.libraryVersion.version_id)
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
                cf.content = cf.contentOriginal = `# Library ${cf.libraryName}\n\nVersion: ${mm.libraryVersion.version_name}\n\nLooks like this library doesn't have README.md file.`;
                cf.libraryVersionId = mm.libraryVersion.version_id;

                this.codeIDE.externalRefresh();

                this.backendService.getLibraryVersion(mm.libraryVersion.version_id)
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

    onFileContentChange(e: {fileFullPath: string, content: string}) {
        if (this.fileChangeTimeout) {
            clearTimeout(this.fileChangeTimeout);
        }
        this.fileChangeTimeout = setTimeout(() => this.onFileContentChangeDebounced(), 500);
    }

    onFileContentChangeDebounced() {
        this.refreshInterface();
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
            'targetType': 'yoda', // TODO - change this in homer [DH]
            'targetId': 'dummy_id',
            'displayName': 'Program ' + this.codeProgram.name,
            'interface': ios
        }]);
    }

    reloadVersions(): void {
        if (this.codeId) {
            this.backendService.getCProgram(this.codeId) // TODO [permission]: C_program.read_permission(Project.read_permission)
                .then((codeProgram) => {
                    this.codeProgram = codeProgram;
                    this.codeProgramVersions = this.codeProgram.program_versions || [];
                });
        }
    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }

    selectProgramVersion(programVersion: ICProgramVersionShortDetail) {
        if (!this.codeProgramVersions) {
            return;
        }
        if (this.codeProgramVersions.indexOf(programVersion) === -1) {
            return;
        }

        this.blockUI();
        this.backendService.getCProgramVersion(programVersion.version_id) // TODO [permission]: C_program.Version.read_permission
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

                        let cf = new CodeFile(
                            `${uf.library_short_detail.name} (${uf.library_version_short_detail.version_name})`,
                            `# Library ${uf.library_short_detail.name}\n\nVersion: ${uf.library_version_short_detail.version_name}\n\nLooks like this library doesn't have README.md file.`
                        );
                        cf.fixedPath = true;
                        cf.library = true;
                        cf.readonly = true;

                        cf.libraryId = uf.library_short_detail.id;
                        cf.libraryName = uf.library_short_detail.name;
                        cf.libraryVersionId = uf.library_version_short_detail.version_id;

                        this.backendService.getLibraryVersion(uf.library_version_short_detail.version_id)
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
                this.fmError(`Cannot load version <b>${programVersion.version_name}</b>`, err);
            });

    }

    onProgramVersionClick(programVersion: ICProgramVersionShortDetail) {

        if (this.selectedProgramVersion) {

            let changedFiles: string[] = this.changesInSelectedVersion();

            if (changedFiles.length) {

                let text = '';
                if (this.selectedProgramVersion.version_object.id === programVersion.version_id) {
                    text = 'You have <b>unsaved changes</b> in version <b>'
                        + this.selectedProgramVersion.version_object.version_name
                        + '</b>, do you really want reload this version?';
                } else {
                    text = 'You have <b>unsaved changes</b> in version <b>'
                        + this.selectedProgramVersion.version_object.version_name
                        + '</b>, do you really want switch to version <b>'
                        + programVersion.version_name
                        + '</b>?';
                }

                let confirm = new ModalsConfirmModel(
                    text,
                    '<h5>Changed files:</h5>' + changedFiles.join('<br>')
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

    onSaveClick() {
        if (this.changesInSelectedVersion().length === 0) {
            return;
        }

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
                this.backendService.createCProgramVersion(this.codeId, { // TODO [permission]: "C_Program.update_permission" : "true",
                    imported_libraries: libs,
                    version_name: m.name,
                    version_description: m.description,
                    main: main,
                    files: userFiles
                })
                    .then(() => {
                        this.fmSuccess('Version <b>' + m.name + '</b> saved successfully.');
                        this.refresh();
                    })
                    .catch((err) => {
                        this.fmError('Failed saving version <b>' + m.name + '</b>', err);
                        this.unblockUI();
                    });
            }
        });
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
            }  else if (file.library) {
                libs.push(file.libraryVersionId);
            } else {
                userFiles.push({
                    file_name: file.objectFullPath,
                    content: file.content
                });
            }
        });

        this.buildInProgress = true;
        this.backendService.compileCProgram({
            imported_libraries: libs,
            main: main,
            files: userFiles,
            type_of_board_id: this.codeProgram.type_of_board_id
        })
            .then((success) => {
                this.buildInProgress = false;
                // console.log(success);
                this.addFlashMessage(new FlashMessageSuccess('Build successfully.'));
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

    onUploadClick(version: ICProgramVersionShortDetail) {
        if (!version) {
            return;
        }

        this.blockUI();
        this.backendService.getBoardIdeHardware(this.projectId) // TODO [permission]: Board.edit_permission
            .then((boards) => {
                this.unblockUI();

                let connectibleDevices = boards;
                if (!connectibleDevices || connectibleDevices.length === 0) {
                    this.modalService.showModal(new ModalsConfirmModel('Error', 'No available yoda G2 boards hardware.', true, 'OK', null));
                    return;
                }

                let m = new ModalsSelectHardwareModel(connectibleDevices);
                this.modalService.showModal(m)
                    .then((success) => {
                        if (success && m.selectedBoard) {
                            this.blockUI();
                            this.backendService.uploadCProgramVersion({ // TODO [permission]: Board.update_permission, Project.read_permission
                                board_pairs: [{
                                    board_id: m.selectedBoard.id,
                                    c_program_version_id: version.version_id
                                }]
                            }).then((result) => {
                                this.fmSuccess(`Uploading was done successfully`);
                                this.unblockUI();
                            }).catch((e) => {
                                this.fmError(`Uploading code failed`);
                                this.unblockUI();
                            });
                        }
                    });
            });
    }
}
