/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, Input, OnInit, OnChanges, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
    selector: 'bk-qr-code',
    template: `
<div class="qr-code">
    <canvas #canvas></canvas>
</div>
`
})
export class QRCodeComponent implements OnInit, OnChanges {

    @Input()
    data: any = {};

    @ViewChild('canvas')
    canvasElement: ElementRef;

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        let data = changes['data'];

        const opt = {
            color: {
                dark: '#28A8E0FF',
                light: '#00000000'
            },
            scale: 14,
            width: 600,
            margin: 0
        };

        QRCode.toCanvas(this.canvasElement.nativeElement, data.currentValue, opt, (error: any) => {
            if (error) {
                console.error(error);
            }
        });

    }

}
