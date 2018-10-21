import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'bk-back-next-buttons',
    templateUrl: './BackNextButtonsComponent.html'
})
export class BackNextButtonsComponent {

    @Input() backId = 'back';

    @Input() nextId = 'next';

    @Input() visibleBack = true;

    @Input() visibleNext = true;

    @Input() disableBack = false;

    @Input() disableNext = false;

    @Input() backText = null;

    @Input() nextText = null;

    @Output() click = new EventEmitter<string>();

    @Output() back = new EventEmitter();

    @Output() next =  new EventEmitter();

    constructor() {}

    backClicked() {
        this.click.emit(this.backId);
        this.back.emit();
    }

    nextClicked() {
        this.click.emit(this.nextId);
        this.next.emit();
    }
}

