/**
 * Created by dominikkrisztof on 11/10/16.
 */

import {Component, Injector, OnInit} from '@angular/core';
import {LayoutMain} from "../layouts/main";
import * as ngCore from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {BaseMainComponent} from "./BaseMainComponent";
import {LayoutNotLogged} from "../layouts/not-logged";
import {BeckiFormInput} from "../components/BeckiFormInput";
import {REACTIVE_FORM_DIRECTIVES, Validators, FormGroup, FormBuilder} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {FlashMessagesComponent} from "../components/FlashMessagesComponent";
import {FlashMessageSuccess, FlashMessageError, FlashMessagesService} from "../services/FlashMessagesService";
import {BackendService} from "../services/BackendService";
import {Router} from "@angular/router";


@Component({
    selector: "createUser",
    directives: [LayoutNotLogged,CORE_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, BeckiFormInput],
    templateUrl: "app/views/create-user.html"
})
export class CreateUserComponent implements OnInit{

    CreateUserForm:FormGroup;

    showSuccess:boolean;
    showFailed:boolean;
    failedReason:string;

    constructor(protected formBuilder:FormBuilder,protected router:Router,protected backendService:BackendService,protected flashMessagesService:FlashMessagesService ) {

        this.CreateUserForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]],
            "nick_name": ["", [Validators.required, Validators.minLength(8),Validators.maxLength(60)]],
            "password": ["", [Validators.required, Validators.minLength(8),Validators.maxLength(60)]],
            "passwordConfirm": ["", [BeckiValidators.passwordSame(()=>this.CreateUserForm, "password"),Validators.required, Validators.minLength(8),Validators.maxLength(60)]]

        });
    }


    ngOnInit(): void {

    }

    sendCreateUser():void {
        this.backendService.createPerson({  mail:this.CreateUserForm.controls["email"].value,nick_name:this.CreateUserForm.controls["nick_name"].value,password:this.CreateUserForm.controls["password"].value})
            .then(() => {
                this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("email with instructions was sent"));
                //this.router.navigate(["/"]);

            })
            .catch(reason => {
                this.flashMessagesService.addFlashMessage(new FlashMessageError("email cannot be sent, " + reason));
                console.log("err "+reason);
            })
    }

    clickButtonBack():void{
        //this.router.navigate(["/"]);
    }

}

