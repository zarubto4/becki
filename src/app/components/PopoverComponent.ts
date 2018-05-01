import {Component, HostListener, AfterViewInit, Input, EmbeddedViewRef, OnInit, } from '@angular/core';
import {TyrionBackendService} from "../services/BackendService";

@Component({
    selector: 'bk-popover',
    /* tslint:disable:max-line-length */

    template: `  
        <div>
            <popover-content #myPopover 
                             title="{{title}}"
                             placement="{{placement}}"
                             [closeOnClickOutside]="true"
            >
                {{content}}... <a target="_blank" href="https://docu.byzance.cz/{{link_to_documentation}}">Show more</a></popover-content>
                <button [popover]="myPopover" (click)="request()"
                        >click this button to see a popover</button>
        </div>
    `
    /* tslint:enable */
})
export class PopoverComponent implements OnInit {


    @Input()
    title: string;

    @Input()
    link_to_documentation: string;

    @Input()
    placement: string;

    @Input()
    content: string;

    constructor(protected backendService: TyrionBackendService){

    }

    ngOnInit(): void {
    }

    request(): void {

        this.backendService.requestRestPath("GET", 'https://docu.byzance.cz/portal-tools/grid', {}, [200])
            .then((odpoved: any) => {
                console.log('odpoved: ', odpoved)
            })
    }


}




