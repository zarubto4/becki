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
import {BeckiFormSelectOption} from "../components/BeckiFormSelect";
import {StaticOptionLists} from "../helpers/StaticOptionLists";

@Component({
    selector: "profile",
    templateUrl: "app/views/profile.html"
})
export class ProfileComponent extends BaseMainComponent implements OnInit {

    constructor(injector: Injector, protected backEndService: BackendService, protected notificationService: NotificationService) {
        super(injector);

        this.emailForm = this.formBuilder.group({
            "currentEmail": ["", [Validators.required, Validators.minLength(8), BeckiValidators.email]], //TODO kontrola zda sedí s původním emailem
            "newEmail": ["", [Validators.required,  BeckiValidators.email]],
            "newEmailConfirm": ["", [Validators.required, BeckiValidators.email, BeckiValidators.passwordSame(()=>this.emailForm, "newEmail")]],
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

    countryList: BeckiFormSelectOption[] = StaticOptionLists.countryList;

    openTabName = "personal";

    onTabClick(tabName:string) {
        this.openTabName = tabName;
    }

    ngOnInit(): void {
        var personObject = this.backEndService.personInfoSnapshot;

        this.editPermission = personObject.edit_permission;

        this.nickName = personObject.nick_name;

        this.fullName = personObject.full_name;

        this.email = personObject.mail;
        

        this.infoForm.controls["fullName"].setValue(personObject.full_name);

        this.infoForm.controls["nickName"].setValue(personObject.nick_name);
    }


    /*
    *
    * TODO neposíláme info! (info se bude posílat, až tyrion implementuje všechny věci co chceme zaznamenávat
    *
     */


    changePassword(): void {
        this.blockUI();
        this.backEndService.createPersonChangeProperty({
            property: "password",
            password: this.passwordForm.controls["newPassword"].value
        })
            .then(ok =>{
                this.unblockUI();
        this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Email with instructions was sent"))})
            .catch(error =>{
            this.unblockUI();
        this.flashMessagesService.addFlashMessage(new FlashMessageError("Cannot change password", error))})
    }

    changeEmail(): void {
        this.blockUI();
        this.backEndService.validatePersonEntity({key:"mail",value:this.emailForm.controls["newEmail"].value}).then(response =>{
            if(response.valid){
                this.backEndService.createPersonChangeProperty({
                    property: "email",
                    email: this.emailForm.controls["newEmail"].value
                })
                    .then(ok =>{
                        this.unblockUI();
                        this.flashMessagesService.addFlashMessage(new FlashMessageSuccess("Email with instructions was sent"))
                    })
                    .catch(error =>{
                        this.unblockUI();
                        this.flashMessagesService.addFlashMessage(new FlashMessageError("Cannot change email", error))
                    })
            }else {
                this.unblockUI();
                this.flashMessagesService.addFlashMessage(new FlashMessageError("Cannot change email, ", response.message));
            }
        })

    }

    uploadProfilePicture(): void {
        //API requires 'multipart/form-data' Content-Type, name of the property is 'file'.
        this.backEndService.putPersonUploadPicture() //todo udělat něco co 1. nahraje obrázek 2. zkontroluje obrázek jestli je ve stavu jakém chceme 3. upravit ho 4. poslat ho
    }
}

