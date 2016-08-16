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

    canActivate() {
        console.log('AuthGuard#canActivate called');
        if (!this.backEndService.tokenExist()) {
            this.router.navigate(['/login']);
            return false
        }
        return true;
    }
}