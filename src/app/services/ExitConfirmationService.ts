import { Injectable } from '@angular/core';

@Injectable()
export class ExitConfirmationService {

    protected _needExitConfirm: boolean;

    constructor() {
        this._needExitConfirm = false;
    }

    protected confirmationFunction(e: any) {
        const dialogText = 'Discard changes and exit?';
        e.returnValue = dialogText;
        return dialogText;
    }

    public confirmExit(): boolean {
        if (this._needExitConfirm) {
            window.onbeforeunload = null;
            const ret = confirm('Discard changes and exit?');
            if (!ret) {
                window.onbeforeunload = this.confirmationFunction;
            }

            return ret;
        }

        return true;
    }

    public setConfirmationEnabled(enabled: boolean) {
        this._needExitConfirm = enabled;

        if (this._needExitConfirm) {
            window.onbeforeunload = this.confirmationFunction;
        } else {
            window.onbeforeunload = null;
        }
    }

    public getConfirmationEnabled(): boolean {
        return this._needExitConfirm;
    }
}
