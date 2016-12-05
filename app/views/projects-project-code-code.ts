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
import {IProject, ICProgram, ICProgramVersion, IUserFiles} from "../backend/TyrionAPI";
import {ICodeCompileErrorMessage, CodeCompileError} from "../backend/BeckiBackend";

import moment = require("moment/moment");


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
    codeProgramVersions: ICProgramVersion[] = null;

    selectedProgramVersion: ICProgramVersion = null;
    selectedCodeFiles: CodeFile[] = null;

    buildErrors: ICodeCompileErrorMessage[] = null;
    buildInProgress: boolean = false;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        var main = new CodeFile("main.cpp", "#include \"byzance.h\"\n\nint main() {\n    while (true) {\n        // your code here\n    }\n}\n");
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

                this.codeProgramVersions.sort((a, b)=> {
                    if (a.version_object.date_of_create == b.version_object.date_of_create) return 0;
                    if (a.version_object.date_of_create > b.version_object.date_of_create) return -1;
                    return 1;
                });

                if (this.codeProgramVersions.length > 0) {
                    this.selectProgramVersion(this.codeProgramVersions[0]);
                }

                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The code types cannot be loaded.`, reason));
            });

    }

    onBoardTypeClick(boardTypeId:string): void {
        this.navigate(["/hardware", boardTypeId]);
    }

    selectProgramVersion(programVersion: ICProgramVersion) {
        if (!this.codeProgramVersions) return;
        if (this.codeProgramVersions.indexOf(programVersion) == -1) return;

        this.selectedProgramVersion = programVersion;

        var codeFiles: CodeFile[] = [];
        if (Array.isArray(programVersion.user_files)) {
            codeFiles = (<IUserFiles[]>programVersion.user_files).map((uf) => { //TODO: remove after fix swagger
                return new CodeFile(uf.file_name, uf.code);
            });
        }

        var main = new CodeFile("main.cpp", <string>programVersion.main);  //TODO: remove after fix swagger
        main.fixedPath = true;
        codeFiles.push(main);

        this.selectedCodeFiles = codeFiles;

        this.buildErrors = null;

    }

    onProgramVersionClick(programVersion: ICProgramVersion) {

        if (this.selectedProgramVersion) {

            var changedFiles: string[] = this.changesInSelectedVersion();

            if (changedFiles.length) {

                var text = "";
                if (this.selectedProgramVersion == programVersion) {
                    text = "You have <b>unsaved changes</b> in version <b>" + this.selectedProgramVersion.version_object.version_name + "</b>, do you really want reload this version?";
                } else {
                    text = "You have <b>unsaved changes</b> in version <b>" + this.selectedProgramVersion.version_object.version_name + "</b>, do you really want switch to version <b>" + programVersion.version_object.version_name + "</b>?";
                }

                var confirm = new ModalsConfirmModel(
                    text,
                    "<h5>Changed files:</h5>" + changedFiles.join("<br>")
                );

                this.modalService.showModal(confirm).then((yes) => {
                    if (yes) {
                        this.selectProgramVersion(programVersion);
                    }
                })

            } else {
                if (this.selectedProgramVersion != programVersion) {
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

    onSaveClick() {
        if (this.changesInSelectedVersion().length == 0) return;

        var m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
        this.modalService.showModal(m).then((success) => {
            if (success) {
                var main = "";

                var userFiles: IUserFiles[] = [];

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


                this.backendService.createCProgramVersion(this.codeId, {
                    version_name: m.name,
                    version_description: m.description,
                    main: main,
                    user_files: userFiles
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("Version <b>" + m.name + "</b> saved successfully."));
                        this.refresh();
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError("Failed saving version <b>" + m.name + "</b>", err));
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
                console.log(error);
                if (error instanceof CodeCompileError) {
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
