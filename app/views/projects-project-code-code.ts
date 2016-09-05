/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {Project, CProgram, CProgramVersion} from "../lib-back-end/index";
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

        var codeFiles = programVersion.user_files.map((uf) => {
            return new CodeFile(uf.file_name, uf.code);
        });

        codeFiles.push(new CodeFile("main.cpp", programVersion.main));

        this.selectedCodeFiles = codeFiles;




    }

    onProgramVersionClick(programVersion:CProgramVersion) {

        if (this.selectedProgramVersion && Array.isArray(this.selectedCodeFiles)) {

            var someEdited = false;
            var changedFiles:string[] = [];
            this.selectedCodeFiles.forEach((file) => {
                if (file.changes) {
                    someEdited = true;
                    changedFiles.push("/"+file.objectFullPath);
                }
            });

            if (someEdited) {

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

    onSaveClick() {
        console.log(this.selectedCodeFiles);
    }

}
