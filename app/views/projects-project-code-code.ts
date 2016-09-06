/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {Project, CProgram, CProgramVersion, CodeCompileError, CodeCompileErrorMessage} from "../lib-back-end/index";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsCodePropertiesModel} from "../modals/code-poperties";
import {IDEComponent} from "../lib-becki/field-ide";
import {AceEditor} from "../components/AceEditor";
import {CodeIDE, CodeFile} from "../components/CodeIDE";
import {ModalsConfirmModel} from "../modals/confirm";
import {ModalsVersionDialogModel} from "../modals/version-dialog";

import moment = require("moment/moment");

@Component({
    selector: "view-projects-project-code-code",
    templateUrl: "app/views/projects-project-code-code.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain, IDEComponent, CodeIDE],
})
export class ProjectsProjectCodeCodeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    codeId: string;

    routeParamsSubscription:Subscription;

    project:Project = null;

    codeProgram:CProgram = null;
    codeProgramVersions:CProgramVersion[] = null;

    selectedProgramVersion:CProgramVersion = null;
    selectedCodeFiles:CodeFile[] = null;

    buildErrors:CodeCompileErrorMessage[] = null;
    buildInProgress:boolean = false;

    constructor(injector:Injector) {super(injector)};

    ngOnInit():void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.codeId = params["code"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh():void {

        //this.backEndService.addVersionToCProgram("verzeeeeee 1", "hele asi fajn veerze programu kterej se super mega ultra dobrej", "hlavní program", {"neco.cpp":"something"}, this.codeId);

        this.backEndService.getCProgram(this.codeId)
            .then((codeProgram:CProgram) => {
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
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The code types cannot be loaded.`, reason));
            });

    }

    selectProgramVersion(programVersion:CProgramVersion) {
        if (!this.codeProgramVersions) return;
        if (this.codeProgramVersions.indexOf(programVersion) == -1) return;

        this.selectedProgramVersion = programVersion;

        var codeFiles:CodeFile[] = [];
        if (Array.isArray(programVersion.user_files)) {
            codeFiles = programVersion.user_files.map((uf) => {
                return new CodeFile(uf.file_name, uf.code);
            });
        }

        var main = new CodeFile("main.cpp", programVersion.main);
        main.fixedPath = true;
        codeFiles.push(main);

        this.selectedCodeFiles = codeFiles;

        this.buildErrors = null;

    }

    onProgramVersionClick(programVersion:CProgramVersion) {

        if (this.selectedProgramVersion) {

            var changedFiles:string[] = this.changesInSelectedVersion();

            if (changedFiles.length) {

                var text = "";
                if (this.selectedProgramVersion == programVersion) {
                    text = "You have <b>unsaved changes</b> in version <b>"+this.selectedProgramVersion.version_object.version_name+"</b>, do you really want reload this version?";
                } else {
                    text = "You have <b>unsaved changes</b> in version <b>"+this.selectedProgramVersion.version_object.version_name+"</b>, do you really want switch to version <b>"+programVersion.version_object.version_name+"</b>?";
                }

                var confirm = new ModalsConfirmModel(
                    text,
                    "<h5>Changed files:</h5>"+changedFiles.join("<br>")
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

    changesInSelectedVersion():string[] {
        var changedFiles:string[] = [];
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

                var userFiles:{[name:string]:string} = {};

                this.selectedCodeFiles.forEach((file) => {
                    if (file.objectFullPath == "main.cpp") {
                        main = file.content;
                    } else {
                        userFiles[file.objectFullPath] = file.content;
                    }
                });


                this.backEndService.addVersionToCProgram(m.name, m.description, main, userFiles, this.codeId)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("Version <b>"+m.name+"</b> saved successfully.", null, true));
                        this.refresh();
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError("Failed saving version <b>"+m.name+"</b>", err, true));
                    });
            }
        });
    }

    onBuildClick() {
        if (!this.selectedCodeFiles) return;

        var main = "";

        var userFiles:{[name:string]:string} = {};

        this.buildErrors = null;
        this.selectedCodeFiles.forEach((file) => {
            file.annotations = [];

            if (file.objectFullPath == "main.cpp") {
                main = file.content;
            } else {
                userFiles[file.objectFullPath] = file.content;
            }
        });

        this.buildInProgress = true;
        this.backEndService.buildCProgram(main, userFiles, this.codeProgram.type_of_board_id)
            .then((success)=> {
                this.buildInProgress = false;
                console.log(success);
                this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Build successfully."));
            })
            .catch((error) => {
                this.buildInProgress = false;
                console.log(error);
                if (error instanceof CodeCompileError) {
                    this.buildErrors = error.errors;

                    // TODO: move to method
                    var filesAnnotations:{[filename:string]:AceAjax.Annotation[]} = {};
                    this.buildErrors.forEach((error) => {
                        var filename = error.filename.substr(1);
                        if (!filesAnnotations[filename]) filesAnnotations[filename] = [];
                        filesAnnotations[filename].push({
                            row: error.line-1,
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
                    this.flashMessagesService.addFlashMessage(new FlashMessageError(error.toString()));
                }
            });
    }

}
