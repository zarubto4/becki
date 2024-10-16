/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IPermission } from '../backend/TyrionAPI';
import { TyrionBackendService } from '../services/BackendService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { ModalModel } from '../services/ModalService';

export class ModalsRolePermissionAddModel extends ModalModel {
    constructor(
        public permissions: IPermission[],
        public permissionsForAdd: string[] = []
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-role-permission-add',
    templateUrl: './role-permission-add.html'
})
export class ModalsRolePermissionAddComponent implements OnInit {

    @Input()
    modalModel: ModalsRolePermissionAddModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    formPermissions: IPermission[] = [];

    permission_options: FormSelectComponentOption[] = null;
    form: FormGroup;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'permission': ['']
        });
    }

    ngOnInit() {

        this.permission_options = this.modalModel.permissions.map((pv) => {
            return {
                label: pv.entity_type + ' - ' + pv.action,
                value: pv.id,
                data: pv
            };
        });

        (<FormControl>(this.form.controls['permission'])).setValue(null);

    }

    onAddClick(): void {

        let permissionKey: string = this.form.controls['permission'].value;

        for (let perm in this.modalModel.permissions) {
            if (this.modalModel.permissions.hasOwnProperty(perm)) {
                if (this.modalModel.permissions[perm].id === permissionKey) {
                    this.formPermissions.push(this.modalModel.permissions[perm]);
                }
            }
        }

    }

    onRemoveClick(permissionKey: string) {
        for (let perm in this.formPermissions) {
            if (this.formPermissions.hasOwnProperty(perm)) {
                if (this.formPermissions[perm].id === permissionKey) {
                    let index = this.formPermissions.indexOf(this.formPermissions[perm]);

                    if (index > -1) {
                        this.formPermissions.splice(index, 1);
                    }
                }
            }
        }
    }

    valid(): boolean {
        return this.formPermissions.length > 0;
    }

    onSubmitClick(): void {

        for (let perm in this.formPermissions) {
            if (this.formPermissions.hasOwnProperty(perm)) {
                this.modalModel.permissionsForAdd = [];
                this.modalModel.permissionsForAdd.push(this.formPermissions[perm].id);
            }
        }

        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
