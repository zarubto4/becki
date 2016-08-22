/**
 * Created by davidhradek on 03.08.16.
 */

import { Injectable }     from '@angular/core';
import {CanActivate, Router}    from '@angular/router';
import {BackEndService} from "./BackEndService";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private backEndService:BackEndService, private router:Router) {
    }

    canActivate():Promise<boolean> {
        console.log('AuthGuard#canActivate called');
        return new Promise<boolean>((resolve) => {
            this.backEndService.isLoggedIn()
                .then(loggedIn => {
                    console.log("AuthGuard#loggedIn = "+loggedIn);
                    if (loggedIn) {
                        resolve(true);
                    } else {
                        this.router.navigate(['/login']);
                        resolve(false);
                    }
                });
        });
    }
}

@Injectable()
export class NonAuthGuard implements CanActivate {

    constructor(private backEndService:BackEndService, private router:Router) {
    }

    canActivate():Promise<boolean> {
        console.log('NonAuthGuard#canActivate called');
        return new Promise<boolean>((resolve) => {
            this.backEndService.isLoggedIn()
                .then(loggedIn => {
                    console.log("NonAuthGuard#loggedIn = "+loggedIn);
                    if (!loggedIn) {
                        resolve(true);
                    } else {
                        this.router.navigate(['/']);
                        resolve(false);
                    }
                });
        });
    }
}