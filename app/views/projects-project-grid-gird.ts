/**
 * Created by davidhradek on 10.10.16.
 */

import {Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {
    IProject, IMProgram
} from "../backend/TyrionAPI";
import {Draggable, DraggableEventParams} from "../components/Draggable";
import {GridView} from "../components/GridView";

declare var $:JQueryStatic;
import moment = require("moment/moment");


@Component({
    selector: "view-projects-project-grid-grid",
    templateUrl: "app/views/projects-project-grid-grid.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain, Draggable, GridView],
})
export class ProjectsProjectGridGridComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    gridId: string;

    routeParamsSubscription:Subscription;

    project:IProject = null;
    gridProgram:IMProgram = null;

    @ViewChild(GridView)
    gridView:GridView;

    constructor(injector:Injector) {super(injector)};

    ngOnInit():void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params["project"];
            this.gridId = params["grid"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh():void {

    }

}
