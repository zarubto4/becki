/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BackendService } from './BackendService';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private backendService: BackendService, private router: Router) {
    }

    canActivate(): Promise<boolean> {
        // console.log('AuthGuard#canActivate called');
        return new Promise<boolean>((resolve) => {
            this.backendService.isLoggedIn()
                .then(loggedIn => {
                    // console.log('AuthGuard#loggedIn = ' + loggedIn);
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

    constructor(private backendService: BackendService, private router: Router) {
    }

    canActivate(): Promise<boolean> {
        // console.log('NonAuthGuard#canActivate called');
        return new Promise<boolean>((resolve) => {
            this.backendService.isLoggedIn()
                .then(loggedIn => {
                    // console.log('NonAuthGuard#loggedIn = ' + loggedIn);
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
