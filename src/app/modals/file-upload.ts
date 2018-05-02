
import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FlashMessage } from '../services/NotificationService';
import { ModalModel } from '../services/ModalService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { TranslationService } from '../services/TranslationService';


export class ModalsFileUploadModel extends ModalModel {
    constructor(
        public fileTypeTitle: string = '',
        public fileTypeDescription: string = '',
        public acceptFileType: string[] = [],
        public file: any = '',
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-file-upload',
    templateUrl: './file-upload.html'
})
export class ModalsFileUploadComponent implements OnInit {

    data: any = null;

    @Input()
    modalModel: ModalsFileUploadModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @Output()
    flashMesseage = new EventEmitter<FlashMessage>();

    form: FormGroup;

    constructor(private translationService: TranslationService, private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'fileTypeTitle': [''],
            'fileTypeDescription': [''],
            'acceptFileType': [''],
        });
    }

    ngOnInit() {

    }

    fileChange($event: any) {
        let file: File = $event.target.files[0];
        if (file) {
            let myReader: FileReader = new FileReader();
            myReader.addEventListener('load', () => {
                this.data = myReader.result;
            }, false);
            myReader.readAsDataURL(file);

        }
    }

    sendFile(): void {
        if (this.data) {
            this.modalModel.file = this.data;
            this.modalClose.emit(true);
        }
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
