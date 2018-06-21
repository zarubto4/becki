import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { RoleGroupComponent } from './admin-permission-group';
import { RoleGroupGroupComponent } from './admin-permission-group-group';


// routes
export const ADMIN_PERMISSION_GROUP_ROUTES: Routes = [

    { path: '', component: RoleGroupComponent, canActivate: [AuthGuard] },
    { path: ':group', data: { breadName: ':group' }, component: RoleGroupGroupComponent, canActivate: [AuthGuard] },

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ADMIN_PERMISSION_GROUP_ROUTES)
    ],
    declarations: [

    ],
    exports: [ RouterModule ]
})

export class AdminPermissionGroupModule { }
