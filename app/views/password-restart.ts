/**
 * Created by dominik krisztof on 02/09/16.
 */

import {Component, OnInit, OnDestroy} from "@angular/core";
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {BeckiValidators} from "../helpers/BeckiValidators";
import {Subscription} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";
import {NotificationService, FlashMessageSuccess, FlashMessageError} from "../services/NotificationService";
import {BackendService} from "../services/BackendService";

@Component({
    selector: "PasswordRestart",
    templateUrl: "app/views/password-restart.html"
})
export class PasswordRestartComponent implements OnInit, OnDestroy {

    passwordRestartForm: FormGroup;

    routeParamsSubscription: Subscription;

    token: string;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected formBuilder: FormBuilder, protected backEndService: BackendService, protected notificationService: NotificationService) {

        this.passwordRestartForm = this.formBuilder.group({
            "email": ["", [Validators.required, BeckiValidators.email]],
            "password": ["", [Validators.required, Validators.minLength(8)]],
            "confirmpassword": ["", [Validators.required, BeckiValidators.passwordSame(()=>this.passwordRestartForm, "password")]]
        });
    }

    onSubmit(): void {
        this.backEndService.recoveryPersonPassword({
            mail: this.passwordRestartForm.controls["email"].value,
            password_recovery_token: this.token,
            password: this.passwordRestartForm.controls["password"].value
        })
            .then(()=> {
                this.notificationService.addFlashMessage(new FlashMessageSuccess("password was successfully changed"));
                this.router.navigate(["/"]);
            })
            .catch(reason => {
                this.notificationService.addFlashMessage(new FlashMessageError("password cannot be changed, " + reason));
            });
    }


    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.token = params["token"];
        })
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }


    clickButtonBack(): void {
        this.router.navigate(["/"]);
    }

}

