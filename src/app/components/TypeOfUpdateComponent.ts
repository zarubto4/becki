import { Component, Input } from '@angular/core';

@Component({
    selector: 'bk-type-of-update',
    templateUrl: './TypeOfUpdateComponent.html'
})
export class TypeOfUpdateComponent {

    @Input()
    state: string = '';

}
