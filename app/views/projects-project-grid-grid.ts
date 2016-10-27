/**
 * Created by davidhradek on 10.10.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {IProject, IMProgram, IMProgramVersion} from "../backend/TyrionAPI";
import {GridView} from "../components/GridView";
import {ModalsVersionDialogModel} from "../modals/version-dialog";

declare var $: JQueryStatic;
import moment = require("moment/moment");


@Component({
    selector: "view-projects-project-grid-grid",
    templateUrl: "app/views/projects-project-grid-grid.html",
})
export class ProjectsProjectGridGridComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    gridId: string;

    routeParamsSubscription: Subscription;

    //project: IProject = null;
    gridProgram: IMProgram = null;
    gridProgramVersions: IMProgramVersion[] = [];
    selectedProgramVersion: IMProgramVersion = null;

    @ViewChild(GridView)
    gridView: GridView;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.gridId = params["grid"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getMProgram(this.gridId)
            .then((gridProgram) => {
                console.log(gridProgram);

                this.gridProgram = gridProgram;

                this.gridProgramVersions = this.gridProgram.program_versions || [];

                this.gridProgramVersions.sort((a, b)=> {
                    if (a.version_object.date_of_create == b.version_object.date_of_create) return 0;
                    if (a.version_object.date_of_create > b.version_object.date_of_create) return -1;
                    return 1;
                });

                if (this.gridProgramVersions.length) {
                    this.selectProgramVersion(this.gridProgramVersions[0]);
                }

                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The grid cannot be loaded.`, reason));
                this.unblockUI();
            });


    }

    onProgramVersionClick(programVersion: IMProgramVersion): void {
        this.selectProgramVersion(programVersion);
    }

    selectProgramVersion(programVersion: IMProgramVersion): void {

        if (!this.gridProgramVersions) return;
        if (this.gridProgramVersions.indexOf(programVersion) == -1) return;

        this.selectedProgramVersion = programVersion;
        this.gridView.setDataJson(this.selectedProgramVersion.m_code);

    }

    onSaveClick(): void {

        var m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
        this.modalService.showModal(m).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createMProgramVersion(this.gridId, {
                    version_name: m.name,
                    version_description: m.description,
                    m_code: this.gridView.getDataJson(),
                    virtual_input_output: this.gridView.getInterfaceJson()
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("Version <b>" + m.name + "</b> saved successfully.", null, true));
                        this.refresh(); // also unblockUI
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError("Failed saving version <b>" + m.name + "</b>", err, true));
                        this.unblockUI();
                    });
            }
        });


    }

}
