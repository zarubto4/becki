
import { Component, Injector, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { QRCodeComponent } from '../components/QRCodeComponent';
import { Observable } from 'rxjs/Rx';
import { StringReplacerPipe } from '../pipes/StringReplacerPipe';
import * as Rx from 'rxjs';
const jsQR = require('jsqr');

@Component({
    selector: 'bk-view-qr-reader',
    templateUrl: './qr-reader.html'
})
export class ReaderQrComponent extends BaseMainComponent implements OnInit {


    @ViewChild('video') video: ElementRef;
    @ViewChild('myCanvas') myCanvas: any;
    foundQR: boolean = false;
    scanLoop: any;
    qrcode: string;
    qrStatus: string = 'Scanning QR code';
    frontcamera: false;

    @Output()
    QrScanClose = new EventEmitter<string>();

    constructor(injector: Injector) {
        super(injector);

        this.scanLoop = Observable.interval(100).subscribe(() => {
            this.onCapture();
        });

    };

    ngOnInit(): void {
        this.startCapture();
    }

    startCapture() {
        let _video = this.video.nativeElement;
        let canvas = this.myCanvas.nativeElement;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: (this.frontcamera ? 'user' : 'environment') } })
                .then(stream => {
                    _video.src = window.URL.createObjectURL(stream);
                    _video.play();
                });
        }


    }



    onCapture() {
        let video = this.video.nativeElement;
        let canvas = this.myCanvas.nativeElement;
        let context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (context.getImageData) {
            let imageData = context.getImageData(0, 0, 280, 260);
            let decoded = jsQR.decodeQRFromImage(imageData.data, imageData.width, imageData.height);
            if (decoded) {

                if (decoded.slice(0, 3) === 'HWR') {
                    this.confirmedCapture(decoded);
                } else {
                    this.qrStatus = this.translate('not_valid_byzance_qr_code');
                }
            }
        }

    }


    onScanAgain() {
        this.video.nativeElement.play();
        this.foundQR = false;
        this.scanLoop = Observable.interval(100).subscribe(() => {
            this.onCapture();
        });
        this.qrStatus = '';
    }

    onScanConfirm() {
        if (this.foundQR && this.qrcode) {

            let _video = this.video.nativeElement;
            let canvas = this.myCanvas.nativeElement;

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        let track = stream.getTracks()[0]; // TODO camera is still on, dunno if chrome bug or just bad code [DK]
                        track.stop();
                        _video.src = "";
                        _video.pause();
                    });
            }


            this.QrScanClose.emit(this.qrcode);
        }

    }

    confirmedCapture(decoded: string) {
        this.video.nativeElement.pause();
        this.foundQR = true;
        this.scanLoop.unsubscribe();
        this.qrStatus = this.translate('byzance_qr_code_found');


        this.qrcode = decoded;
    }

}
