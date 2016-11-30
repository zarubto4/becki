/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

/**
 * Created by dominikkrisztof on 11/10/16.
 */

import {Component, OnInit} from "@angular/core";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {FlashMessageSuccess, FlashMessageError, NotificationService} from "../services/NotificationService";
import {BackendService} from "../services/BackendService";
import {Router} from "@angular/router";
import {BlockUIService} from "../services/BlockUIService";


@Component({
    selector: "createUser",
    templateUrl: "app/views/create-user.html"
})
export class CreateUserComponent implements OnInit {

    CreateUserForm: FormGroup;

    constructor(protected formBuilder: FormBuilder, protected router: Router, protected backendService: BackendService, protected notificationService: NotificationService) {

        this.CreateUserForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]],
            "nick_name": ["", [Validators.required, Validators.minLength(8), Validators.maxLength(60)]],
            "password": ["", [Validators.required, Validators.minLength(8), Validators.maxLength(60)]],
            "passwordConfirm": ["", [BeckiValidators.passwordSame(()=>this.CreateUserForm, "password"), Validators.required, Validators.minLength(8), Validators.maxLength(60)]]

        });
    }


    ngOnInit(): void {

    }

    sendCreateUser(): void {
        this.backendService.createPerson( {
            nick_name: this.CreateUserForm.controls["nick_name"].value,
            mail: this.CreateUserForm.controls["email"].value,
            password: this.CreateUserForm.controls["password"].value
        })
            .then(() => {
                this.notificationService.addFlashMessage(new FlashMessageSuccess("email with instructions was sent"));
                this.router.navigate(["/"]);
            })
            .catch(reason => {
                this.notificationService.addFlashMessage(new FlashMessageError("email cannot be sent, " + reason));
                console.log("err " + reason);
            })
    }

    clickButtonBack(): void {
        this.router.navigate(["/"]);
    }

}

