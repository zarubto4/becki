import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router';
import { BackendService } from './BackendService';
import { ExitConfirmationService } from './ExitConfirmationService';

@Injectable()
export class ExitConfirmGuard implements CanDeactivate<any> {

    constructor(private exitService: ExitConfirmationService) {
    }

    canDeactivate(target: any): Promise<boolean> {
        // console.log('AuthGuard#canActivate called');
        return new Promise<boolean>((resolve) => {
            resolve(this.exitService.confirmExit());
        });
    }
}
