import { interval, Observable, Subscription } from 'rxjs';
import { Component, Injector, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Stream } from 'stream';
const jsQR = require('jsqr');

@Component({
    selector: 'bk-view-qr-reader',
    templateUrl: './qr-reader.html'
})
export class ReaderQrComponent extends _BaseMainComponent implements OnInit, OnDestroy {


    @ViewChild('video') video: ElementRef;
    @ViewChild('myCanvas') myCanvas: any;
    foundQR: boolean = false;
    scanLoop: Subscription;
    qrcode: string;
    qrStatus: string = 'Scanning QR code';
    frontcamera: false;
    videoStream: MediaStream;
    @Output()
    QrScanClose = new EventEmitter<string>();
    constructor(injector: Injector) {
        super(injector);


    };

    ngOnInit(): void {
        this.startCapture();
    }

    ngOnDestroy(): void {

    }

    startCapture() {
        let _video = this.video.nativeElement;
        let canvas = this.myCanvas.nativeElement;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: (this.frontcamera ? 'user' : 'environment') } })
                .then(stream => {
                    this.videoStream = stream;
                    _video.src = window.URL.createObjectURL(stream);
                    _video.play();
                    this.scanLoop = interval(500).subscribe(() => {
                        this.onCapture();
                    });
                });
        }
    }



    onCapture() {
        let video = this.video.nativeElement;
        let canvas = this.myCanvas.nativeElement;
        if ( video.readyState && video.HAVE_ENOUGH_DATA ) {
            let context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            if (imageData) {
                let decoded = jsQR(imageData.data, imageData.width, imageData.height);
                if (decoded) {
                    this.QrScanClose.emit(decoded.data)
                }
            }
        }
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
                        _video.src = '';
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
        this.onScanConfirm();
    }

}
