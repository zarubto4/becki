/* 
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level 
 * directory of this distribution. 
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { NotificationService, FlashMessageWarning } from '../services/NotificationService';

import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';



@Component({
    selector: 'bk-file-upload',
    templateUrl: './FileUploadComponent.html'
})
export class FileUploadComponent implements OnInit {

    @ViewChild(ImageCropperComponent)
    cropper: ImageCropperComponent;

    cropperData: any = {};

    cropperSettings: CropperSettings;

    cropperLoaded = false;

    @Input()
    isPicture: boolean = true;

    @Input()
    cropSettings: CropperSettings = null;

    @Input()
    defaultPicture: any = null;

    @Output()
    fileOutput = new EventEmitter<any>();

    @Output()
    flashMesseageError = new EventEmitter<string>();

    @Output()
    flashMesseageSuccess = new EventEmitter<string>();


    constructor() {

    }

    ngOnInit() {

        if (this.isPicture) {
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


        } else {
            // nastavení file přenosu
        }
    }

    // TODO lepší file handling https://scotch.io/tutorials/angular-file-uploads-with-an-express-backend
    public fileChangeListener($event: any) {
        let file: File = $event.target.files[0];
        let fileReader: FileReader = new FileReader();
        fileReader.addEventListener("loadend", function (loadEvent: any) {
            fileReader.readAsDataURL(file);
        });
    };

    cropperFileChangeListener($event: any) {
        let image = new Image();
        let file: File = $event.target.files[0];
        if (file) {
            let myReader: FileReader = new FileReader();
            myReader.addEventListener('load', () => {
                image.addEventListener('load', () => {
                    if (image.width < 50 || image.height < 50) {
                        this.flashMesseageError.emit(('flash_image_too_small')); //this.fmWarning(this.translate('flash_image_too_small'));
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
        } else {
            this.cropperLoaded = false;
        }
    }

    sendFile(): void {
        if (this.isPicture) {
            if (!this.cropperLoaded || !this.cropperData.image) {
                return;
            }
            this.fileOutput.emit(this.cropper);
        } else {
            // TODO emittovat files
        }
        /* this.backendService.uploadPersonPicture({
             file: this.cropperData.image
         })
             .then((result) => {
                 this.fmSuccess(this.translate('flash_new_avatar_saved'));
                 this.backendService.refreshPersonInfo();
                 this.cropperLoaded = false;
             })
             .catch((error) => {
                 this.fmError(this.translate('flash_cant_save_avatar', error));
             }); */
    }

}
