/**
 * Created by dominikkrisztof on 24/08/16.
 */

import {Component, Injector, OnInit} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {NotificationService} from "../services/NotificationService";
import {BackendService} from "../services/BackendService";
import {FlashMessageSuccess, FlashMessageError} from "../services/FlashMessagesService";
import {FormGroup, Validators} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";

@Component({
    selector: "profile",
    templateUrl: "app/views/profile.html"
})
export class ProfileComponent extends BaseMainComponent implements OnInit {

    constructor(injector: Injector, protected backEndService: BackendService, protected notificationService: NotificationService) {
        super(injector);

        this.emailForm = this.formBuilder.group({
            "currentEmail": ["", [Validators.required, Validators.minLength(8), BeckiValidators.email]], //TODO kontrola zda sedí s původním emailem
            "newEmail": ["", [Validators.required, Validators.minLength(24), BeckiValidators.email]],
            "newEmailConfirm": ["", [Validators.required, Validators.minLength(24), BeckiValidators.email, BeckiValidators.passwordSame(()=>this.emailForm, "newEmail")]],
        });

        this.passwordForm = this.formBuilder.group({
            "currentPassword": ["", [Validators.required, Validators.minLength(8)]], //TODO kontrola zda sedí s původním heslem
            "newPassword": ["", [Validators.required, Validators.minLength(8)]],
            "newPasswordConfirm": ["", [Validators.required, Validators.minLength(8), BeckiValidators.passwordSame(()=>this.passwordForm, "newPassword")]],
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

    editPermission: boolean;

    nickName: string;

    fullName: string;

    email: string;

    state: string;


    ngOnInit(): void {
        var personObject = this.backEndService.personInfoSnapshot;

        this.editPermission = personObject.edit_permission;

        this.nickName = personObject.nick_name;

        this.fullName = personObject.full_name;

        this.email = personObject.mail;

    }

    changePassword(): void {
        console.log("klick");
        this.backEndService.createPersonChangeProperty({
            property: "password",
            password: this.passwordForm.controls["newPassword"].value
        })
            .then(ok => this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Email with instructions was sent")))
            .catch(error => this.flashMessagesService.addFlashMessage(new FlashMessageError("Cannot change password", error)))
    }

    changeEmail(): void {
        this.backEndService.createPersonChangeProperty({
            property: "email",
            email: this.emailForm.controls["newEmail"].value
        })
            .then(ok => this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Email with instructions was sent")))
            .catch(error => this.flashMessagesService.addFlashMessage(new FlashMessageError("Cannot change email", error)))

    }

    uploadProfilePicture(): void {
        //API requires 'multipart/form-data' Content-Type, name of the property is 'file'.
        this.backEndService.putPersonUploadPicture() //todo udělat něco co 1. nahraje obrázek 2. zkontroluje obrázek jestli je ve stavu jakém chceme 3. upravit ho 4. poslat ho
    }
}

