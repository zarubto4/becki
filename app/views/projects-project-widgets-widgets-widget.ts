/**
 * Created by davidhradek on 22.09.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {Subscription} from "rxjs/Rx";
import {
    IGridWidget, IGridWidgetVersion,
    ITypeOfWidget, IGridWidgetVersionShortDetail, ITypeOfWidgetShortDetail
} from "../backend/TyrionAPI";
import {FormGroup, Validators} from "@angular/forms";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {ModalsVersionDialogModel} from "../modals/version-dialog";
import { GridView } from '../components/GridView';
import moment = require("moment/moment");
import {Core, TestRenderer, Widgets} from "the-grid";

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

    protected _widgetTesterRenderer: TestRenderer.ControllerRenderer;

    // Properties for test view:
    @ViewChild("widgetTestScreen")
    widgetTestScreen: ElementRef;

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

        var widgetTesterController = new Core.Controller();
        this._widgetTesterRenderer = new TestRenderer.ControllerRenderer(widgetTesterController, this.widgetTestScreen.nativeElement);

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
        this._widgetTesterRenderer.runCode(this.widgetCode, true, (e) => {
            if (e.position) {
                //parse positions
                var positions = e.position.split("-");
                var start = positions[0].split(":");
                var end = positions[1].split(":");

                start = {
                    line: parseInt(start[0]),
                    column: parseInt(start[1]),
                }

                end = {
                    line: parseInt(end[0]),
                    column: parseInt(end[1]),
                }
            }
            /*
            ////////TEST of getting lines of code, where was the error////////////////////////////
            let widget = this._widgetTesterRenderer.widget;
            if (e.position) {
                var src = widget.machine["sourceCode"];
                var srcLines = src.split('\n');
                var pp = e.position.split("-");
                var a = parseInt(pp[0]);
                var b = parseInt(pp[1]);

                var lineA = Math.max(0, (src.substr(0, a)).split('\n').length - 1 - 1);
                var lineB = Math.min(srcLines.length - 1, (src.substr(0, b)).split('\n').length + 2);

                var showSrc = [];
                for(let i = lineA; i<lineB; i++) {
                    showSrc.push(srcLines[i]);
                }

                console.log(showSrc.join("\n"));
            }
            ////////////////////////////////////////////////////////////////////////////////////////*/
            console.log("widget error",e,e.position);
        });
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
