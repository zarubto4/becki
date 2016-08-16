/**
 * Created by davidhradek on 03.08.16.
 */

import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from "@angular/common";
import {Router, ROUTER_DIRECTIVES} from "@angular/router";

import {BackEndService} from "../services/BackEndService";
import {Nl2Br} from "../pipes/Nl2Br";
import {LayoutNotLogged} from "../layouts/not-logged";

@Component({
    selector: "view-logout",
    templateUrl: "app/views/logout.html",
    pipes: [Nl2Br],
    directives: [LayoutNotLogged, CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class LogoutComponent {

    logoutError:string = null;

    logoutInProgress:boolean = false;

    constructor(private backEndService:BackEndService, private router: Router) {

        this.logout();

    }

    logout():void {
        this.logoutInProgress = true;
        this.backEndService.deleteToken()
            .then(() => {
                this.logoutInProgress = false;
                this.router.navigate(['/login']);
            })
            .catch(reason => {
                this.logoutInProgress = false;
                this.logoutError = "Current user cannot be signed out.\n" + reason;
            });
    }

    onCloseAlertClick():void {
        this.logoutError = null;
    }

}
