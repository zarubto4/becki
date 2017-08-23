/**
 * Created by davidhradek on 15.08.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IPermission } from '../backend/TyrionAPI';
import { BackendService } from '../services/BackendService';
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

    constructor(private backendService: BackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'permission': ['']
        });
    }

    ngOnInit() {

        this.permission_options = this.modalModel.permissions.map((pv) => {
            return {
                label: pv.permission_key + ' ' + (pv.description !== 'description' ? pv.description : ''),
                value: pv.permission_key,
                data: pv
            };
        });

        (<FormControl>(this.form.controls['permission'])).setValue(null);

    }

    onAddClick(): void {

        let permissionKey: string = this.form.controls['permission'].value;

        for (let perm in this.modalModel.permissions) {
            if (this.modalModel.permissions.hasOwnProperty(perm)) {
                if (this.modalModel.permissions[perm].permission_key === permissionKey) {
                    this.formPermissions.push(this.modalModel.permissions[perm]);
                }
            }
        }

    }

    onRemoveClick(permissionKey: string) {
        for (let perm in this.formPermissions) {
            if (this.formPermissions.hasOwnProperty(perm)) {
                if (this.formPermissions[perm].permission_key === permissionKey) {
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
                this.modalModel.permissionsForAdd.push(this.formPermissions[perm].permission_key);
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
