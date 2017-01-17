/**
 * Created by davidhradek on 10.10.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {Subscription} from "rxjs/Rx";
import {
    IGridWidget, IProject, IMProgram, IMProgramVersion, IMProject, IMProgramVersionShortDetail,
    ITypeOfWidgetShortDetail, ITypeOfWidget, IMProjectShortDetail
} from '../backend/TyrionAPI';
import {GridView} from "../components/GridView";
import {ModalsVersionDialogModel} from "../modals/version-dialog";

declare var $: JQueryStatic;
import moment = require("moment/moment");
import {ModalsConfirmModel} from "../modals/confirm";
import {NullSafe} from "../helpers/NullSafe";


@Component({
    selector: "view-projects-project-grid-grids-grid",
    templateUrl: "app/views/projects-project-grid-grids-grid.html",
})
export class ProjectsProjectGridGridsGridComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    gridId: string;
    gridsId: string;

    routeParamsSubscription: Subscription;

    //project: IProject = null;
    gridProject: IMProjectShortDetail = null;
    gridProgram: IMProgram = null;
    gridProgramVersions: IMProgramVersionShortDetail[] = [];
    selectedProgramVersion: IMProgramVersion = null;

    gridDeviceProfile:string = "mobile";

    projectSubscription: Subscription;
    //project: IProject = null;

    widgetGroups: ITypeOfWidget[];

    widgetGroupsOpenToggle: {[id: string]: boolean} = {};

    @ViewChild(GridView)
    gridView: GridView;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.gridsId = params["grids"];
            this.gridId = params["grid"];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.gridProject = project.m_projects.find((mp) => mp.id == this.gridsId);
            });
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) this.projectSubscription.unsubscribe();
    }

    onGridProjectClick(gridProjectId:string) {
        this.navigate(["/projects", this.currentParamsService.get("project"), "grid", gridProjectId]);
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([
            this.backendService.getAllTypeOfWidgets(),
            this.backendService.getMProgram(this.gridId)
        ])
            .then((values:[ITypeOfWidget[], IMProgram]) => {
                let typesOfWidgets: ITypeOfWidget[] = values[0];
                let gridProgram: IMProgram = values[1];

                this.widgetGroups = typesOfWidgets;

                this.gridProgram = gridProgram;

                this.gridProgramVersions = this.gridProgram.program_versions || [];

                if (this.gridProgramVersions.length) {
                    this.selectProgramVersion(this.gridProgramVersions[this.gridProgramVersions.length - 1]);
                }

                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The grid cannot be loaded.`, reason));
                this.unblockUI();
            });
    }

    onAddPageClick(): void {
        this.gridView.addPage();
    }

    onProgramVersionClick(programVersion: IMProgramVersionShortDetail): void {
        this.selectProgramVersion(programVersion);
    }

    selectProgramVersion(programVersion: IMProgramVersionShortDetail): void {
        if (!this.gridProgramVersions) return;
        if (this.gridProgramVersions.indexOf(programVersion) == -1) return;

        this.blockUI();
        this.backendService.getMProgramVersion(programVersion.version_id)
            .then((programVersionFull) => {
                this.unblockUI();
                this.selectedProgramVersion = programVersionFull;
                this.gridView.setDataJson(this.selectedProgramVersion.m_code);
                this.gridDeviceProfile = this.gridView.getDeviceProfile();
            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(`Cannot load version <b>${programVersion.version_name}</b>`, err);
            });

    }

    onChangeGridDeviceProfile(newValue:string): void {
        let oldValue = this.gridDeviceProfile;
        this.gridDeviceProfile = newValue;
        let m = new ModalsConfirmModel("Grid size class change","Changing grid size class <strong>delete all your pages</strong>, are you sure?");
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.gridView.setDeviceProfile(this.gridDeviceProfile);
                } else {
                    this.gridDeviceProfile = oldValue;
                }
            })
    }

    isSelected(version:IMProgramVersionShortDetail):boolean {
        return NullSafe(()=>this.selectedProgramVersion.version_object.id) == version.version_id;
    }

    onSaveClick(): void {

        let m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
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
                        this.addFlashMessage(new FlashMessageSuccess("Version <b>" + m.name + "</b> saved successfully."));
                        this.refresh(); // also unblockUI
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError("Failed saving version <b>" + m.name + "</b>", err));
                        this.unblockUI();
                    });
            }
        });
    }

    onToggleGroup(groupId: string) {
        this.widgetGroupsOpenToggle[groupId] = !this.widgetGroupsOpenToggle[groupId];
    }

    onWidgetDown(e: MouseEvent, widget: IGridWidget):void {
        this.gridView.requestCreateWidget({
            name: widget.name,
            id: widget.id,
            version_id: widget.versions[0].id
        },e);
    }

    onWidgetRequestingSource(event: any) {
        console.log(event);
        this.backendService.getWidgetVersion(event.type.version_id)
        .then((widgetVersion) => {
            console.log(widgetVersion);
            //TODO add cache
            event.resolve(widgetVersion.logic_json);
            this.unblockUI();
        })
        .catch((err) => {
            console.log(err);
            this.unblockUI();
            this.addFlashMessage(new FlashMessageError("Cannot load widget version", err));
        });
    }

}
