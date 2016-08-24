/**
 * Created by dominikkrisztof on 24/08/16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import * as ngCore from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {NotificationService} from "../services/NotificationService";
import {BackEndService} from "../services/BackEndService";

@Component({
    selector: "profile",
    directives: [LayoutMain],
    templateUrl: "app/views/profile.html"
})
export class ProfileComponent extends BaseMainComponent implements OnInit{

    constructor(injector:Injector,protected backEndService:BackEndService,protected notificationService:NotificationService) {super(injector)};


    ngOnInit(): void {

    }
}

