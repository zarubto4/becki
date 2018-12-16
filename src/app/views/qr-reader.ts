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
    @ViewChild('myCanvas') myCanvas: ElementRef;
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
        this.blockUI();
    }

    ngOnDestroy(): void {
        this.videoStream.getTracks().forEach((track) => {
            track.stop()
        });
        this.video.nativeElement.stop();
        this.unblockUI();
    }

    startCapture() {
        let _video = this.video.nativeElement;
        let canvas = this.myCanvas.nativeElement;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: (this.frontcamera ? 'user' : 'environment') } })
                .then(stream => {
                    this.videoStream = stream;
                    _video.srcObject = stream;
                    _video.play();
                    this.unblockUI();
                    this.scanLoop = interval(1000).subscribe(() => {
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
}
