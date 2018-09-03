/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FlashMessage, FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalModel } from '../services/ModalService';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { TranslationService } from '../services/TranslationService';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';


export class ModalsPictureUploadModel extends ModalModel {
    // If picture is avatar (style img-circle)
    constructor( public file: any = '', public defaultPicture: any = '', public avatar_picture: boolean = false ) {
        super();
    }
}


@Component({
    selector: 'bk-modals-picture-upload',
    templateUrl: './picture-upload.html'
})
export class ModalsPictureUploadComponent implements OnInit {

    @Input()
    modalModel: ModalsPictureUploadModel;

    @ViewChild(ImageCropperComponent)
    cropper: ImageCropperComponent;

    cropperData: any = {};

    cropperSettings: CropperSettings;

    cropperLoaded = false;

    @Input()
    cropSettings: CropperSettings = null;

    @Input()
    saved: boolean = false;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @Output()
    flashMessage = new EventEmitter<FlashMessage>();

    form: FormGroup;

    constructor(private translationService: TranslationService, private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'defaultPicture': [''],
            'avatar_picture': [''],
        });
    }

    ngOnInit() {

        if (this.cropSettings) {
            this.cropperSettings = this.cropSettings;
        } else {
            // image cropper settings
            this.cropperSettings = new CropperSettings();
            this.cropperSettings.noFileInput = true;
            this.cropperSettings.width = 512;
            this.cropperSettings.height = 512;
            this.cropperSettings.croppedWidth = 1024;
            this.cropperSettings.croppedHeight = 1024;
            this.cropperSettings.canvasWidth = 512;
            this.cropperSettings.canvasHeight = 512;
            this.cropperSettings.minWidth = 50;
            this.cropperSettings.minHeight = 50;
        }

        (<FormControl>(this.form.controls['defaultPicture'])).setValue(this.modalModel.defaultPicture);
        (<FormControl>(this.form.controls['avatar_picture'])).setValue(this.modalModel.avatar_picture);

    }

    cropperFileChangeListener($event: any) {
        let image = new Image();
        let file: File = $event.target.files[0];
        if (file) {
            let myReader: FileReader = new FileReader();
            myReader.addEventListener('load', () => {
                image.addEventListener('load', () => {
                    if (image.width < 50 || image.height < 50) {

                        // TODO - zprávu nastavit do templatu!
                        this.flashMessage.emit(new FlashMessageError(this.translationService.translate('flash_image_too_small', this)));

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
                image.src = <string>myReader.result;

            }, false);
            myReader.readAsDataURL(file);
            this.saved = false;
        } else {
            this.cropperLoaded = false;
        }
    }

    sendFile(): void {
        if (this.cropperData) {
            this.modalModel.file = this.cropperData.image;
            this.modalClose.emit(true);
        }
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

}
