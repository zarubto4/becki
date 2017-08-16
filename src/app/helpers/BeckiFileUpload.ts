/* 
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level 
 * directory of this distribution. 
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { NotificationService, FlashMessageWarning, FlashMessage, FlashMessageError } from '../services/NotificationService';

import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';



@Component({
    selector: 'bk-file-upload',
    templateUrl: './BeckiFileUpload.html'
})
export class FileUploadComponent implements OnInit {

    @ViewChild(ImageCropperComponent)
    cropper: ImageCropperComponent;

    data: any = {};


    @Input()
    defaultData: any = null;

    @Output()
    pictureOutput = new EventEmitter<any>();

    @Output()
    flashMesseage = new EventEmitter<FlashMessage>();


    constructor() {

    }

    ngOnInit() {


    }

    cropperFileChangeListener($event: any) {
        let image = new Image();
        let file: File = $event.target.files[0];
    }

    sendFile(): void {
        if (this.data) {
            this.pictureOutput.emit(this.data);
        }
    }

}
