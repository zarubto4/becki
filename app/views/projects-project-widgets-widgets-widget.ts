/**
 * Created by davidhradek on 22.09.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {Subscription} from "rxjs/Rx";
import {
    IGridWidget, IGridWidgetVersion,
    ITypeOfWidget, IGridWidgetVersionShortDetail, ITypeOfWidgetShortDetail
} from "../backend/TyrionAPI";
import {BlockoView} from "../components/BlockoView";
import {Blocks, Core} from "blocko";
import {FormGroup, Validators} from "@angular/forms";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {ModalsVersionDialogModel} from "../modals/version-dialog";
import { GridView } from '../components/GridView';
import moment = require("moment/moment");

@Component({
    selector: "view-projects-project-widgets-widgets-widget",
    templateUrl: "app/views/projects-project-widgets-widgets-widget.html",
})
export class ProjectsProjectWidgetsWidgetsWidgetComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    widgetId: string;
    widgetsId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    group: ITypeOfWidgetShortDetail = null;
    widget: IGridWidget = null;

    widgetVersions: IGridWidgetVersionShortDetail[] = [];
    selectedWidgetVersion: IGridWidgetVersion = null;
    widgetCode: string = "";

    // Properties for test view:
    @ViewChild(GridView)
    gridView: GridView;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.widgetId = params["widget"];
            this.widgetsId = params["widgets"];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.group = project.type_of_widgets.find((tw) => tw.id == this.widgetsId);
            });
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) this.projectSubscription.unsubscribe();
    }

    onWidgetsGroupClick(groupId:string) {
        this.navigate(["/projects", this.currentParamsService.get("project"), "widgets", groupId]);
    }

    newWidgetCode(code: string) {
        this.widgetCode = code;
    }

    refresh(): void {

        this.blockUI();
        this.backendService.getWidget(this.widgetId)
            .then((widget) => {
                this.widget = widget;

                this.widgetVersions = this.widget.versions || [];

                /*
                TODO ... I need detail, because there is no create date in version structure
                this.blockoBlockVersions.sort((a, b)=> {
                    if (a.date_of_create == b.date_of_create) return 0;
                    if (a.date_of_create > b.date_of_create) return -1;
                    return 1;
                });*/

                if (this.widgetVersions.length) {
                    this.selectWidgetVersion(this.widgetVersions[0]); // also unblockUI
                } else {
                    this.unblockUI();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The widget cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

    onWidgetVersionClick(version: IGridWidgetVersionShortDetail) {
        this.selectWidgetVersion(version);
    }

    selectWidgetVersion(version: IGridWidgetVersionShortDetail) {
        this.blockUI();
        this.backendService.getWidgetVersion(version.id)
            .then((widgetVersion) => {

                this.cleanTestView();

                this.selectedWidgetVersion = widgetVersion;
                this.widgetCode = this.selectedWidgetVersion.logic_json;
    

                /*
                TODO Iam not sure, but I dont need this for widget
                let designJson = JSON.parse(this.selectedWidgetVersion.design_json);

                if (designJson.backgroundColor) this.blockForm.controls["color"].setValue(designJson.backgroundColor);
                if (designJson.displayName) this.blockForm.controls["icon"].setValue(designJson.displayName);
                if (designJson.description) this.blockForm.controls["description"].setValue(designJson.description);
                */

                this.unblockUI();
            })
            .catch(reason => {
                this.selectedWidgetVersion = null;
                console.log(this.widgetCode);
                this.addFlashMessage(new FlashMessageError(`The widget version cannot be loaded.`, reason));
                this.unblockUI();
            });
    }

    validate() {
    }

    cleanTestView(): void {
    }

    onTestClick(): void {
    }

    onSaveClick(): void {
        let m = new ModalsVersionDialogModel(moment().format("YYYY-MM-DD HH:mm:ss"));
        this.modalService.showModal(m).then((success) => {
            if (success) {
                
                let designJson = JSON.stringify({});

                this.blockUI();
                this.backendService.createWidgetVersion(this.widgetId, {
                    version_name: m.name,
                    version_description: m.description,
                    logic_json: this.widgetCode,
                    design_json: designJson
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

}
