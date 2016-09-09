/**
 * Created by dominikkrisztof on 24/08/16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import * as ngCore from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {NotificationService} from "../services/NotificationService";
import {BackendService} from "../services/BackendService";

@Component({
    selector: "profile",
    directives: [LayoutMain],
    templateUrl: "app/views/profile.html"
})
export class ProfileComponent extends BaseMainComponent implements OnInit{

    constructor(injector:Injector,protected backEndService:BackendService,protected notificationService:NotificationService) {super(injector)};

    editPermission:boolean;

    id:number;

    nickName:string;

    fullName:string;

    email:string;


    ngOnInit(): void {
        var personObject = this.backEndService.personInfoSnapshot;

        this.editPermission=personObject.edit_permission;

        this.id=personObject.id;

        this.nickName=personObject.nick_name;

        this.fullName=personObject.full_name;

        this.email=personObject.mail;
    }
}

