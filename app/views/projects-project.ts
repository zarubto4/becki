/**
 * Created by davidhradek on 09.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {Project} from "../lib-back-end/index";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {FormGroup, REACTIVE_FORM_DIRECTIVES, FormControl} from "@angular/forms";
import {Validators} from "@angular/common";
import {BeckiAsyncValidators} from "../helpers/BeckiAsyncValidators";
import {BeckiFormInput} from "../components/BeckiFormInput";

@Component({
    selector: "view-projects-project",
    templateUrl: "app/views/projects-project.html",
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, LayoutMain, BeckiFormInput],
})
export class ProjectsProjectComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription:Subscription;

    project:Project = null;

    constructor(injector:Injector) {
        super(injector);
    };

    ngOnInit():void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh():void {
        this.backEndService.getProject(this.id)
            .then(project => {
                this.project = project;
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });
    }
}
