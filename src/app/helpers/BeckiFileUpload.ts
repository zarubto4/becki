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
    fileOutput = new EventEmitter<any>();

    @Output()
    flashMesseage = new EventEmitter<FlashMessage>();


    constructor() {

    }

    ngOnInit() {


    }

    fileChange(event: any) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            let formData: FormData = new FormData();
            formData.append('uploadFile', file, file.name);
            let headers = new Headers();
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
            this.data = formData;
            //TODO dodělat až to bude endpoint na testování https://stackoverflow.com/questions/40214772/file-upload-in-angular-2

            // let options = new RequestOptions({ headers: headers });
            /*
            this.http.post(`${this.apiEndPoint}`, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error))
                .subscribe(
                data => console.log('success'),
                error => console.log(error)
                )*/
        }
    }

    sendFile(): void {
        if (this.data) {
            this.fileOutput.emit(this.data);
        }
    }

}
