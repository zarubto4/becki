/* 
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level 
 * directory of this distribution. 
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { NotificationService, FlashMessageWarning, FlashMessage, FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';

import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { TranslationService } from '../services/TranslationService';
import { TranslatePipe } from '../pipes/TranslationPipe';



@Component({
    selector: 'bk-picture-upload',
    templateUrl: './BeckiPictureUpload.html'
})
export class PictureUploadComponent implements OnInit {

    @ViewChild(ImageCropperComponent)
    cropper: ImageCropperComponent;

    cropperData: any = {};

    cropperSettings: CropperSettings;

    cropperLoaded = false;

    @Input()
    cropSettings: CropperSettings = null;

    @Input()
    defaultPicture: any = null;

    @Input()
    saved: boolean = false;

    @Output()
    pictureOutput = new EventEmitter<any>();

    @Output()
    flashMesseage = new EventEmitter<FlashMessage>();


    constructor(private translationService: TranslationService) {

    }

    ngOnInit() {


        if (this.cropSettings) {
            this.cropperSettings = this.cropSettings;
        } else {
            // image cropper settings
            this.cropperSettings = new CropperSettings();
            this.cropperSettings.noFileInput = true;
            this.cropperSettings.width = 256;
            this.cropperSettings.height = 256;
            this.cropperSettings.croppedWidth = 256;
            this.cropperSettings.croppedHeight = 256;
            this.cropperSettings.canvasWidth = 512;
            this.cropperSettings.canvasHeight = 512;
            this.cropperSettings.minWidth = 50;
            this.cropperSettings.minHeight = 50;
        }

    }

    cropperFileChangeListener($event: any) {
        let image = new Image();
        let file: File = $event.target.files[0];
        if (file) {
            let myReader: FileReader = new FileReader();
            myReader.addEventListener('load', () => {
                image.addEventListener('load', () => {
                    if (image.width < 50 || image.height < 50) {
                        this.flashMesseage.emit(new FlashMessageError(this.translationService.translate('flash_image_too_small', this)));
                        this.cropperLoaded = false;
                    } else {
                        this.cropperLoaded = true;
                        this.cropper.setImage(image);

                        // this hack fixes refresh bug in Safari ... think about better component for crop [DH]
                        setTimeout(() => {
                            this.cropper.onMouseDown(null);
                            this.cropper.onMouseUp(null);
                        }, 10);
                    }

                });
                image.src = myReader.result;

            }, false);
            myReader.readAsDataURL(file);
            this.saved = false;
        } else {
            this.cropperLoaded = false;
        }
    }

    sendFile(): void {
        if (this.cropperData) {
            this.pictureOutput.emit(this.cropperData.image);
            this.flashMesseage.emit(new FlashMessageSuccess(this.translationService.translate('flash_image_changed',this)));

        }
    }

}
