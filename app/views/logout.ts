/**
 * Created by davidhradek on 03.08.16.
 */

import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {BackendService} from "../services/BackendService";

@Component({
    selector: "view-logout",
    templateUrl: "app/views/logout.html"
})
export class LogoutComponent {

    logoutError: string = null;

    logoutInProgress: boolean = false;

    constructor(private backendService: BackendService, private router: Router) {

        this.logout();

    }

    logout(): void {
        this.logoutInProgress = true;
        this.backendService.logout()
            .then(() => {
                this.logoutInProgress = false;
                this.router.navigate(['/login']);
            })
            .catch(reason => {
                this.logoutInProgress = false;
                this.logoutError = "Current user cannot be signed out.\n" + reason;
            });
    }

    onCloseAlertClick(): void {
        this.logoutError = null;
    }

}
