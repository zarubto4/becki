import { Component, Input } from '@angular/core';

@Component({
    selector: 'bk-update-state',
    templateUrl: './UpdateStateComponent.html'
})
export class UpdateStateComponent {

    @Input()
    updateState: string = 'WAITING_FOR_DEVICE';

    @Input()
    error_code: number = null;

    @Input()
    error: string = '';
}
