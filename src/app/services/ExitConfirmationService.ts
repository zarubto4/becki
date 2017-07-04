import { Injectable } from '@angular/core';
import { TranslationService } from '../services/TranslationService';

@Injectable()
export class ExitConfirmationService {

    protected _needExitConfirm: boolean;

    constructor(private translationService: TranslationService) {
        this._needExitConfirm = false;
    }


    protected confirmationFunction(e: any) {
        const dialogText = this.translationService.translate('dialog_discard_changes', this, null);
        e.returnValue = dialogText;
        return dialogText;
    }

    public confirmExit(): boolean {
        if (this._needExitConfirm) {
            window.onbeforeunload = null;
            const ret = confirm(this.translationService.translate('confirm_discard_changes', this, null));
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
