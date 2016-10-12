/**
 * Created by dominikkrisztof on 24/08/16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import * as ngCore from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {NotificationService} from "../services/NotificationService";
import {BackendService} from "../services/BackendService";
import {FlashMessageSuccess, FlashMessageError} from "../services/FlashMessagesService";
import {FormControl, FormGroup} from "@angular/forms";
import {Validators} from "@angular/common";
import {BeckiAsyncValidators} from "../helpers/BeckiAsyncValidators";
import {ModalsBlockoPropertiesModel} from "../modals/blocko-properties";

@Component({
    selector: "profile",
    directives: [LayoutMain],
    templateUrl: "app/views/profile.html"
})
export class ProfileComponent extends BaseMainComponent implements OnInit{

    constructor(injector:Injector,protected backEndService:BackendService,protected notificationService:NotificationService) {
        super(injector);

        this.emailForm = this.formBuilder.group({
            "currentEmail": ["", [Validators.required, Validators.minLength(8)]],
            "newEmail": ["", [Validators.required, Validators.minLength(24)]],
            "newEmailConfirm": ["", [Validators.required, Validators.minLength(24)]],
        });

        this.passwordForm = this.formBuilder.group({
            "currentPassword": ["", [Validators.required, Validators.minLength(8)]],
            "newPassword": ["", [Validators.required, Validators.minLength(8)]],
            "newPasswordConfirm": ["", [Validators.required, Validators.minLength(8)]],
        });

        this.infoForm = this.formBuilder.group({
            "fullName": ["", [Validators.required, Validators.minLength(8)]],
            "nickName": ["", [Validators.required, Validators.minLength(8)]],
            "interests": ["", [Validators.required, Validators.minLength(8)]],
            "state": ["", [Validators.required, Validators.minLength(4)]],

            //a tak dále, je třeba se domluvit co dál se zaznamená
        });

    };


    emailForm: FormGroup;

    passwordForm: FormGroup;

    infoForm: FormGroup;

    editPermission:boolean;

    nickName:string;

    fullName:string;

    email:string;

    state:string;


    ngOnInit(): void {
        var personObject = this.backEndService.personInfoSnapshot;

        this.editPermission=personObject.edit_permission;

        this.nickName=personObject.nick_name;

        this.fullName=personObject.full_name;

        this.email=personObject.mail;

    }

    changePassword():void{ //TODO https://youtrack.byzance.cz/youtrack/issue/TYRION-387
        this.backEndService.createPersonChangeProperty({property: "password",password:"new"/*toto získat z panelu na obrazovce*/})
            .then(ok => this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Email with instructions was sent")))
            .catch(error => this.flashMessagesService.addFlashMessage(new FlashMessageError("Cannot change password",error)))
    }
    changeEmail():void{ //TODO https://youtrack.byzance.cz/youtrack/issue/TYRION-387
        this.backEndService.createPersonChangeProperty({property: "email",email:"new"/*toto získat z panelu na obrazovce*/})
            .then(ok => this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Email with instructions was sent")))
            .catch(error => this.flashMessagesService.addFlashMessage(new FlashMessageError("Cannot change email",error)))

    }

    uploadProfilePicture():void{
        //API requires 'multipart/form-data' Content-Type, name of the property is 'file'.
        this.backEndService.putPersonUploadPicture()
    }
}

