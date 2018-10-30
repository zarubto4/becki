///<reference path="projects-project-code.ts"/>
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';
import { AuthGuard } from '../services/AuthGuard';

import { ProjectsComponent } from './projects';
import { ProjectsProjectComponent } from './projects-project';
import { ProjectsProjectMembersComponent } from './projects-project-members';
import { ProjectsProjectLibrariesComponent } from './projects-project-libraries';
import { ProjectsProjectHardwareComponent } from './projects-project-hardware';
import { ProjectsProjectHardwareHardwareComponent } from './projects-project-hardware-hardware';
import { ProjectsProjectActualizationProceduresComponent } from './projects-project-actualization-procedures';
import { ProjectsProjectActualizationProceduresProcedureComponent } from './projects-project-actualization-procedures-procedure';
import { ProjectsProjectGSMSComponent } from './projects-project-gsms';
import { ProjectsProjectGSMSGSMComponent } from './projects-project-gsms-gsm';
import { ProjectsProjectBlockoComponent } from './projects-project-blocko';
import { ProjectsProjectBlockoBlockoComponent } from './projects-project-blocko-blocko';
import { ProjectsProjectBlocksComponent } from './projects-project-blocks';
import { ProjectsProjectBlocksBlockComponent } from './projects-project-blocks-block';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';
import { ProjectsProjectCodeComponent } from './projects-project-code';
import { ProjectsProjectCodeCodeComponent } from './projects-project-code-code';
import { ProjectsProjectGridComponent } from './projects-project-grid';
import { ProjectsProjectGridGridsComponent } from './projects-project-grid-grids';
import { ProjectsProjectGridGridsGridComponent } from './projects-project-grid-grids-grid';
import { ProjectsProjectServersComponent } from './projects-project-servers';
import { ProjectsProjectInstancesComponent } from './projects-project-instances';
import { ProjectsProjectInstancesInstanceComponent } from './projects-project-instances-instance';
import { ProjectsProjectWidgetsComponent } from './projects-project-widgets';
import { ProjectsProjectWidgetsWidgetComponent } from './projects-project-widgets-widget';


// routes
export const PROJECTS_ROUTES: Routes = [

    { path: '', data: { breadName: 'Projects' }, component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: ':project', data: { breadName: ':project' }, component: ProjectsProjectComponent, canActivate: [AuthGuard] },

    // // Project ACTUALIZATION PROCEDURE
    // { path: ':project/actualization_procedures', data: { breadName: ':last' }, loadChildren: './project-actualization_procedure-module#ProjectActulizationProcedureModule' },
    //
    // // Project GSM
    // { path: ':project/gsm', data: { breadName: 'CELLULAR modules' }, loadChildren: './project-gsms-module#ProjectGSMSModule' },
    //
    // // Project MEMBERS
    // { path: ':project/members', data: { breadName: 'Members' }, component: ProjectsProjectMembersComponent, canActivate: [AuthGuard] },
    //
    // // Project Code Libraries
    // { path: ':project/libraries', data: { breadName: 'CODE libraries' }, component: ProjectsProjectLibrariesComponent, canActivate: [AuthGuard] },
    //
    // // Project HARDWARE
    // { path: ':project/hardware', data: { breadName: 'HARDWARE devices' }, loadChildren: './project-hardware-module#ProjectHardwareModule' },
    //
    // // Project CODE
    // { path: ':project/code', data: { breadName: 'CODE programs' }, loadChildren: './project-code-module#ProjectCodeModule' },
    //
    // // Project GRID
    // { path: ':project/grid', data: { breadName: 'GRID projects' }, loadChildren: './project-grid-module#ProjectGridModule' },
    //
    // // Project WIDGET
    // { path: ':project/widgets', data: { breadName: 'WIDGET projects' }, loadChildren: './project-widget-module#ProjectWidgetModule' },
    //
    // // Project BLOCKO
    // { path: ':project/blocko', data: { breadName: 'BLOCKO programs' }, loadChildren: './project-blocko-module#ProjectBlockoModule' },
    //
    // // Project BLOCKO - BLOCKS
    // { path: ':project/blocks', data: { breadName: 'BLOCKO blocks' }, loadChildren: './project-blocko-blocks-module#ProjectBlockoBlocksModule'},
    //
    // // Project CLOUD - SERVERS
    // { path: ':project/servers', data: { breadName: 'CLOUD servers' }, loadChildren: './project-cloud-module#ProjectCloudModule' },
    //
    // // Project CLOUD - INSTANCES
    // { path: ':project/instances', data: { breadName: 'CLOUD instances' }, loadChildren: './project-instances-module#ProjectInstancesModule'},

    { path: ':project', data: { breadName: ':project' }, component: ProjectsProjectComponent, canActivate: [AuthGuard] },
    { path: ':project/hardware', data: { breadName: 'HARDWARE devices' }, component: ProjectsProjectHardwareComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/hardware/:hardware', data: { breadName: ':hardware' }, component: ProjectsProjectHardwareHardwareComponent, canActivate: [AuthGuard] },

    { path: ':project/actualization-procedures', data: { breadName: 'Actualization procedures' }, component: ProjectsProjectActualizationProceduresComponent, canActivate: [AuthGuard] },
    { path: ':project/actualization_procedures/:procedure', data: { breadName: ':last' }, component: ProjectsProjectActualizationProceduresProcedureComponent, canActivate: [AuthGuard]},

    { path: ':project/gsm', data: { breadName: 'CELLULAR modules' }, component: ProjectsProjectGSMSComponent, canActivate: [AuthGuard]},
    { path: ':project/gsm/:gsm',  data: { breadName: ':last' }, component: ProjectsProjectGSMSGSMComponent, canActivate: [AuthGuard]},

    { path: ':project/blocko', data: { breadName: 'BLOCKO programs' }, component: ProjectsProjectBlockoComponent, canActivate: [AuthGuard] },
    { path: ':project/blocko/:blocko', data: { breadName: ':blocko' }, component: ProjectsProjectBlockoBlockoComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]  },

    { path: ':project/blocks', data: { breadName: 'BLOCKO blocks' }, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard] },
    { path: ':project/blocks/:block', data: { breadName: ':block' }, component: ProjectsProjectBlocksBlockComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },

    { path: ':project/code', data: { breadName: 'CODE programs' }, component: ProjectsProjectCodeComponent, canActivate: [AuthGuard] },
    { path: ':project/code/:code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]  },

    { path: ':project/libraries', data: { breadName: 'CODE libraries' }, component: ProjectsProjectLibrariesComponent, canActivate: [AuthGuard] },
    // { path: 'projects/:project/libraries/:library', data: { breadName: ':library' }, component: ProjectsProjectLibrariesLibraryComponent, canActivate: [AuthGuard] , canDeactivate: [ExitConfirmGuard] },



    { path: ':project/grid', data: { breadName: 'GRID projects' }, component: ProjectsProjectGridComponent, canActivate: [AuthGuard]},
    { path: ':project/grid/:grids', data: { breadName: ':grids' }, component: ProjectsProjectGridGridsComponent, canActivate: [AuthGuard]},
    { path: ':project/grid/:grids/:grid', data: { breadName: ':grid' }, component: ProjectsProjectGridGridsGridComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },

    { path: ':project/servers', data: { breadName: 'CLOUD servers' }, component: ProjectsProjectServersComponent, canActivate: [AuthGuard] },
    { path: ':project/instances', data: { breadName: 'CLOUD instances' }, component: ProjectsProjectInstancesComponent, canActivate: [AuthGuard] },
    { path: ':project/instances/:instance', data: { breadName: ':instance' }, component: ProjectsProjectInstancesInstanceComponent, canActivate: [AuthGuard] },

    { path: ':project/members', data: { breadName: 'Members' }, component: ProjectsProjectMembersComponent, canActivate: [AuthGuard] },

    { path: ':project/widgets', data: { breadName: 'GRID widgets' }, component: ProjectsProjectWidgetsComponent, canActivate: [AuthGuard] },
    { path: ':project/widgets/:widget', data: { breadName: ':widget' }, component: ProjectsProjectWidgetsWidgetComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECTS_ROUTES)
    ],
    declarations: [
        ProjectsComponent,
        ProjectsProjectComponent,
        ProjectsProjectMembersComponent,
        ProjectsProjectLibrariesComponent,
        ProjectsProjectHardwareComponent,
        ProjectsProjectActualizationProceduresComponent,
        ProjectsProjectActualizationProceduresProcedureComponent,
        ProjectsProjectGSMSComponent,
        ProjectsProjectGSMSGSMComponent,
        ProjectsProjectBlockoComponent,
        ProjectsProjectBlockoBlockoComponent,
        ProjectsProjectCodeComponent,
        ProjectsProjectGridComponent,
        ProjectsProjectGridGridsComponent,
        ProjectsProjectGridGridsGridComponent,
        ProjectsProjectServersComponent,
        ProjectsProjectInstancesComponent,
        ProjectsProjectInstancesInstanceComponent,
        ProjectsProjectMembersComponent,
    ],
    exports: [ RouterModule ]
})

export class ProjectsModule { }

