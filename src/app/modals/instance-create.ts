/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IBProgramList, IHomerServerList } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { TranslationService } from '../services/TranslationService';


export class ModalsInstanceCreateModel extends ModalModel {
    constructor(public project_id: string = '') {
        super();
    }
}

@Component({
    selector: 'bk-modals-instance-create',
    templateUrl: './instance-create.html'
})
export class ModalsInstanceCreateComponent implements OnInit {

    @Input()
    modalModel: ModalsInstanceCreateModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    public homerList: IHomerServerList = null;
    public bProgram: IBProgramList = null;

    servers_options: FormSelectComponentOption[] = null;
    bProgram_options: FormSelectComponentOption[] = null;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, public translationService: TranslationService) {

        this.form = this.formBuilder.group({
            'name': ['', [Validators.required, Validators.minLength(4)]],
            'description': ['', [Validators.required]],
            'b_program_id': ['', [Validators.required]],
            'main_server_id': ['', [Validators.required]],
            'backup_server_id': [''],
        });
    }

    ngOnInit() {
        // Find Homer Server
        this.tyrionBackendService.homerServersGetList(0, {
            server_types : ['PRIVATE'],
            project_id: this.modalModel.project_id
        })
            .then((value) => {
                this.homerList = value;
                this.servers_options = this.homerList.content.map((pv) => {

                    let status = this.translationService.translateTable(pv.server_type, this, 'server_type');
                    return {
                        label: pv.name + ' (' + status + ')',
                        value: pv.id,
                    };
                });
            })
            .catch((reason) => {
            });

        // Find B_Programs
        this.tyrionBackendService.bProgramGetByFilter(0, {
            project_id: this.modalModel.project_id
        })
            .then((value) => {
                this.bProgram = value;
                this.bProgram_options = this.bProgram.content.map((pv) => {
                    return {
                        label: pv.name + '(' + pv.description + ')',
                        value: pv.id,
                    };
                });
            })
            .catch((reason) => {
            });
    }


    onSubmitClick(): void {

        this.tyrionBackendService.instanceCreate({
            project_id: this.modalModel.project_id,
            name: this.form.controls['name'].value,
            description: this.form.controls['description'].value,
            b_program_id: this.form.controls['b_program_id'].value,
            main_server_id: this.form.controls['main_server_id'].value,
            backup_server_id: this.form.controls['backup_server_id'].value
        })
            .then((value) => {
                this.onCloseClick();
            })
            .catch((reason) => {

            });
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
