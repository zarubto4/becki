import { Component, Input } from '@angular/core';

@Component({
    selector: 'bk-online-state',
    templateUrl: './OnlineStateComponent.html'
})
export class OnlineStateComponent {

    @Input()
    online_state: string = 'SYNCHRONIZATION_IN_PROGRESS';

}
