/**
 * Created by davidhradek on 17.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {Project, CProgram} from "../lib-back-end/index";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsCodePropertiesModel} from "../modals/code-poperties";
import {IDEComponent} from "../lib-becki/field-ide";
import {AceEditor} from "../components/AceEditor";
import {CodeIDE} from "../components/CodeIDE";

@Component({
    selector: "view-projects-project-code-code",
    templateUrl: "app/views/projects-project-code-code.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain, IDEComponent, CodeIDE],
})
export class ProjectsProjectCodeCodeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;
    codeId: string;

    someCode:string;
    someCode2:string;

    routeParamsSubscription:Subscription;

    project:Project = null;

    codeProgram:CProgram = null;

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
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The code types cannot be loaded.`, reason));
            });


    }

}
