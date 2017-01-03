/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {Subscription} from "rxjs/Rx";
import {CodeFile} from "../components/CodeIDE";
import {ModalsConfirmModel} from "../modals/confirm";
import {ModalsVersionDialogModel} from "../modals/version-dialog";
import {IProject, ICProgram, ICProgramVersion, IUserFiles, ICProgramVersionShortDetail} from "../backend/TyrionAPI";
import {ICodeCompileErrorMessage, CodeCompileError, CodeError} from "../backend/BeckiBackend";

import moment = require("moment/moment");
import {NullSafe} from "../helpers/NullSafe";


@Component({
    selector: "view-projects-project-code-code",
    templateUrl: "app/views/projects-project-code-code.html"
})
export class ProjectsProjectCodeCodeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    codeId: string;

    routeParamsSubscription: Subscription;

    //project: IProject = null;

    codeProgram: ICProgram = null;
    codeProgramVersions: ICProgramVersionShortDetail[] = null;

    selectedProgramVersion: ICProgramVersion = null;
    selectedCodeFiles: CodeFile[] = null;

    buildErrors: ICodeCompileErrorMessage[] = null;
    buildInProgress: boolean = false;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        var main = new CodeFile("main.cpp", "");
        main.fixedPath = true;
        this.selectedCodeFiles = [main];

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.codeId = params["code"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {

        this.blockUI();
        this.backendService.getCProgram(this.codeId)
            .then((codeProgram) => {
                console.log(codeProgram);
                this.codeProgram = codeProgram;

                this.codeProgramVersions = this.codeProgram.program_versions || [];

                /*this.codeProgramVersions.sort((a, b)=> {
                    if (a.version_object.date_of_create == b.version_object.date_of_create) return 0;
                    if (a.version_object.date_of_create > b.version_object.date_of_create) return -1;
                    return 1;
                });*/

                if (this.codeProgramVersions.length > 0) {
                    this.selectProgramVersion(this.codeProgramVersions[0]);
                }

                this.unblockUI();
            })
            .catch(reason => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(`The code types cannot be loaded.`, reason));
            });

    }

    onBoardTypeClick(boardTypeId:string): void {
        this.navigate(["/hardware", boardTypeId]);
    }

    selectProgramVersion(programVersion: ICProgramVersionShortDetail) {
        if (!this.codeProgramVersions) return;
        if (this.codeProgramVersions.indexOf(programVersion) == -1) return;

        this.blockUI();
        this.backendService.getCProgramVersion(programVersion.version_id)
            .then((programVersionFull) => {
                this.unblockUI();

                this.selectedProgramVersion = programVersionFull;

                let codeFiles: CodeFile[] = [];
                if (Array.isArray(programVersionFull.user_files)) {
                    codeFiles = (programVersionFull.user_files).map((uf) => {
                        return new CodeFile(uf.file_name, uf.code);
                    });
                }

                let main = new CodeFile("main.cpp", programVersionFull.main);
                main.fixedPath = true;
                codeFiles.push(main);

                this.selectedCodeFiles = codeFiles;

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

                let text = "";
                if (this.selectedProgramVersion.version_object.id == programVersion.version_id) {
                    text = "You have <b>unsaved changes</b> in version <b>" + this.selectedProgramVersion.version_object.version_name + "</b>, do you really want reload this version?";
                } else {
                    text = "You have <b>unsaved changes</b> in version <b>" + this.selectedProgramVersion.version_object.version_name + "</b>, do you really want switch to version <b>" + programVersion.version_name + "</b>?";
                }

                let confirm = new ModalsConfirmModel(
                    text,
                    "<h5>Changed files:</h5>" + changedFiles.join("<br>")
                );

                this.modalService.showModal(confirm).then((yes) => {
                    if (yes) {
                        this.selectProgramVersion(programVersion);
                    }
                })

            } else {
                if (this.selectedProgramVersion.version_object.id != programVersion.version_id) {
                    this.selectProgramVersion(programVersion);
                }
            }

        } else {
            this.selectProgramVersion(programVersion);
        }
    }

    changesInSelectedVersion(): string[] {
        var changedFiles: string[] = [];
        if (Array.isArray(this.selectedCodeFiles)) {
            this.selectedCodeFiles.forEach((file) => {
                if (file.changes) {
                    changedFiles.push("/" + file.objectFullPath);
                }
            });
        }
        return changedFiles;
    }

    isSelected(version:ICProgramVersionShortDetail):boolean {
        return NullSafe(()=>this.selectedProgramVersion.version_object.id) == version.version_id;
    }

    onSaveClick() {
        if (this.changesInSelectedVersion().length == 0) return;

        let m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
        this.modalService.showModal(m).then((success) => {
            if (success) {
                let main = "";

                let userFiles: IUserFiles[] = [];

                this.selectedCodeFiles.forEach((file) => {
                    if (file.objectFullPath == "main.cpp") {
                        main = file.content;
                    } else {
                        userFiles.push({
                            file_name: file.objectFullPath,
                            code: file.content
                        });
                    }
                });

                this.blockUI();
                this.backendService.createCProgramVersion(this.codeId, {
                    version_name: m.name,
                    version_description: m.description,
                    main: main,
                    user_files: userFiles
                })
                    .then(() => {
                        this.fmSuccess("Version <b>" + m.name + "</b> saved successfully.");
                        this.refresh();
                    })
                    .catch((err) => {
                        this.fmError("Failed saving version <b>" + m.name + "</b>", err);
                        this.unblockUI();
                    });
            }
        });
    }

    onBuildClick() {
        if (!this.selectedCodeFiles) return;

        var main = "";

        var userFiles: IUserFiles[] = [];

        this.buildErrors = null;
        this.selectedCodeFiles.forEach((file) => {
            file.annotations = [];

            if (file.objectFullPath == "main.cpp") {
                main = file.content;
            } else {
                userFiles.push({
                    file_name: file.objectFullPath,
                    code: file.content
                });
            }
        });

        this.buildInProgress = true;
        this.backendService.compileCProgram({
            main: main,
            user_files: userFiles,
            type_of_board_id: this.codeProgram.type_of_board_id
        })
            .then((success)=> {
                this.buildInProgress = false;
                console.log(success);
                this.addFlashMessage(new FlashMessageSuccess("Build successfully."));
            })
            .catch((error) => {
                this.buildInProgress = false;
                if (error.name == "CodeCompileError") {
                    this.buildErrors = error.errors;

                    // TODO: move to method
                    var filesAnnotations: {[filename: string]: AceAjax.Annotation[]} = {};
                    this.buildErrors.forEach((error) => {
                        var filename = error.filename.substr(1);
                        if (!filesAnnotations[filename]) filesAnnotations[filename] = [];
                        filesAnnotations[filename].push({
                            row: error.line - 1,
                            column: 1,
                            text: error.text,
                            type: error.type
                        });

                    });

                    this.selectedCodeFiles.forEach((f)=> {
                        if (filesAnnotations[f.objectFullPath]) {
                            f.annotations = filesAnnotations[f.objectFullPath];
                        }
                    });

                } else {
                    this.addFlashMessage(new FlashMessageError(error.toString()));
                }
            });
    }

}
