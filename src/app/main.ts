/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

// Imports
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app';
import { ModalComponent } from './modals/modal';
import { LabeledLink } from './helpers/LabeledLink';
import { Nl2BrPipe } from './pipes/Nl2BrPipe';
import { UnixTimeFormatPipe } from './pipes/UnixTimeFormatPipe';
import { LayoutMainComponent } from './layouts/main';
import { LayoutNotLoggedComponent } from './layouts/not-logged';
import { BackendService } from './services/BackendService';
import { AuthGuard, NonAuthGuard } from './services/AuthGuard';
import { ModalService } from './services/ModalService';
import { TabMenuService } from './services/TabMenuService';
import { BreadcrumbsService } from './services/BreadcrumbsService';
import { ValidatorErrorsService } from './services/ValidatorErrorsService';
import { CurrentParamsService } from './services/CurrentParamsService';
import { NotificationService } from './services/NotificationService';
import { HomerService } from './services/HomerService';
import { FormColorPickerComponent } from './components/FormColorPickerComponent';
import { FormFAIconSelectComponent } from './components/FormFAIconSelectComponent';
import { FormInputComponent } from './components/FormInputComponent';
import { FormSelectComponent } from './components/FormSelectComponent';
import { BlockoViewComponent } from './components/BlockoViewComponent';
import { CodeIDEComponent } from './components/CodeIDEComponent';
import { CProgramVersionSelectorComponent } from './components/CProgramVersionSelectorComponent';
import { DraggableDirective } from './components/DraggableDirective';
import { FileTreeComponent } from './components/FileTreeComponent';
import { GridViewComponent } from './components/GridViewComponent';
import { Error404Component } from './views/error404';
import { LoginComponent } from './views/login';
import { LogoutComponent } from './views/logout';
import { DashboardComponent } from './views/dashboard';
import { ProjectsComponent } from './views/projects';
import { ProjectsProjectComponent } from './views/projects-project';
import { ProjectsProjectHardwareComponent } from './views/projects-project-hardware';
import { ProjectsProjectBlockoComponent } from './views/projects-project-blocko';
import { ProjectsProjectCodeComponent } from './views/projects-project-code';
import { ProjectsProjectBlockoBlockoComponent } from './views/projects-project-blocko-blocko';
import { ProjectsProjectCodeCodeComponent } from './views/projects-project-code-code';
import { NotificationsComponent } from './views/notifications';
import { ProfileComponent } from './views/profile';
import { ForgotPasswordComponent } from './views/login-forgot-password';
import { PasswordRestartComponent } from './views/login-password-restart';
import { ProjectsProjectBlocksComponent } from './views/projects-project-blocks';
import { ProjectsProjectBlocksBlocksBlockComponent } from './views/projects-project-blocks-blocks-block';
import { CreateUserComponent } from './views/create-user';
import { ProjectsProjectGridComponent } from './views/projects-project-grid';
import { RedirectOkComponent } from './views/redirect-ok';
import { ProductRegistrationComponent } from './views/financial-product-registration';
import { ModalsProjectPropertiesComponent } from './modals/project-properties';
import { ModalsRemovalComponent } from './modals/removal';
import { ModalsAddHardwareComponent } from './modals/add-hardware';
import { ModalsBlockoPropertiesComponent } from './modals/blocko-properties';
import { ModalsCodePropertiesComponent } from './modals/code-properties';
import { ModalsCodeFileDialogComponent } from './modals/code-file-dialog';
import { ModalsConfirmComponent } from './modals/confirm';
import { ModalsVersionDialogComponent } from './modals/version-dialog';
import { ModalsBlockoConfigPropertiesComponent } from './modals/blocko-config-properties';
import { ModalsBlockoAddHardwareComponent } from './modals/blocko-add-hardware';
import { ModalsGridConfigPropertiesComponent } from './modals/grid-config-properties';
import { ModalsGridProjectPropertiesComponent } from './modals/grid-project-properties';
import { ModalsGridProgramPropertiesComponent } from './modals/grid-program-properties';
import { ModalsBlockoAddGridComponent } from './modals/blocko-add-grid';
import { ModalsBlockoAddGridEmptyComponent } from './modals/blocko-add-grid-emtpy';
import { ModalsBlocksTypePropertiesComponent } from './modals/blocks-type-properties';
import { ModalsBlocksBlockPropertiesComponent } from './modals/blocks-block-properties';
import { ModalsHighImportanceNotificationComponent } from './modals/high-importance-notification';
import { ModalsDeviceEditDescriptionComponent } from './modals/device-edit-description';
import { ModalsInstanceEditDescriptionComponent } from './modals/instance-edit-description';
import { ModalsWidgetsTypePropertiesComponent } from './modals/widgets-type-properties';
import { BlockUIService } from './services/BlockUIService';
import { BlockUIComponent } from './components/BlockUIComponent';
import { ProjectsProjectBlocksBlocksComponent } from './views/projects-project-blocks-blocks';
import { ProjectsProjectGridGridsComponent } from './views/projects-project-grid-grids';
import { ProjectsProjectGridGridsGridComponent } from './views/projects-project-grid-grids-grid';
import { FinancialComponent } from './views/financial';
import { NotificationsOverlayComponent } from './components/NotificationsOverlayComponent';
import { NotificationsListComponent } from './components/NotificationsListComponent';
import { ModalsBlockoVersionSelectComponent  } from './modals/blocko-version-select';
import { FinancialProductComponent } from './views/financial-product';
import { ProjectsProjectInstancesComponent } from './views/projects-project-instances';
import { ProjectsProjectInstancesInstanceComponent } from './views/projects-project-instances-instance';
import { HardwareComponent } from './views/hardware';
import { HardwareHardwareTypeComponent } from './views/hardware-hardware_type';
import { ProjectsProjectMembersComponent } from './views/projects-project-members';
import { ModalsMembersAddComponent } from './modals/members-add';
import { FinancialProductExtensionsComponent } from './views/financial-product-extensions';
import { FinancialProductInvoicesComponent } from './views/financial-product-invoices';
import { FinancialProductInvoicesInvoiceComponent } from './views/financial-product-invoices-invoice';
import { FinancialProductBillingComponent } from './views/financial-product-billing';
import { StringReplacerPipe } from './pipes/StringReplacerPipe';
import { StorageService } from './services/StorageService';
import { ProjectsProjectWidgetsComponent  } from './views/projects-project-widgets';
import { ProjectsProjectWidgetsWidgetsComponent  } from './views/projects-project-widgets-widgets';
import { ModalsWidgetsWidgetPropertiesComponent } from './modals/widgets-widget-properties';
import { ProjectsProjectWidgetsWidgetsWidgetComponent } from './views/projects-project-widgets-widgets-widget';
import { MonacoEditorComponent } from './components/MonacoEditorComponent';
import { MonacoEditorLoaderService } from './services/MonacoEditorLoaderService';
import { ModalsBlockoBlockCodeEditorComponent } from './modals/blocko-block-code-editor';
import { ConsoleLogComponent } from './components/ConsoleLogComponent';
import { ProjectsProjectHardwareHardwareComponent } from './views/projects-project-hardware-hardware';
import { ProducersComponent } from './views/producers';
import { ProducersProducerComponent } from './views/producers-producer';
import { ModalsSendInvoiceComponent } from './modals/financial-send-invoice';
import { ExitConfirmationService } from './services/ExitConfirmationService';
import { ExitConfirmGuard } from './services/ExitConfirmGuard';
import { ImageCropperComponent } from 'ng2-img-cropper';
import { ModalsSelectHardwareComponent } from './modals/select-hardware';
import { GoPayLoaderService } from './services/GoPayLoaderService';
import { TranslationService } from './services/TranslationService';
import { TranslateTablePipe } from './pipes/TranslationTablePipe';
import { TranslatePipe } from './pipes/TranslationPipe';
import { Md2HtmlPipe } from './pipes/Md2HtmlPipe';
import { ModalsHardwareBootloaderUpdateComponent } from './modals/hardware-bootloader-update';
import { InstanceHistoryTimelineComponent } from './components/InstanceHistoryTimelineComponent';
import { QRCodeComponent } from './components/QRCodeComponent';
import { ProjectsProjectLibrariesComponent } from './views/projects-project-libraries';
import { ModalsLibraryPropertiesComponent } from './modals/library-properties';
import { ProjectsProjectLibrariesLibraryComponent } from './views/projects-project-libraries-library';
import { ModalsCodeAddLibraryComponent } from './modals/code-add-library';
import { ModalsCodeLibraryVersionComponent } from './modals/code-library-version';
import { ModalsHardwareCodeProgramVersionSelectComponent } from './modals/hardware-code-program-version-select';
import { ModalsDeactivateComponent } from './modals/deactivate';
import { HtmlSanitizeBypassPipe } from './pipes/HtmlSanitizeBypassPipe';
import { ModalsDeviceEditDeveloperParameterValueComponent } from './modals/device-edit-developer-parameter-value';

// @formatter:off
// DON'T USE children IN ROUTER YET!!!
/* tslint:disable:max-line-length */
let routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [NonAuthGuard]},
    {path: 'logout', component: LogoutComponent},
    {path: 'create-user', component: CreateUserComponent, canActivate: [NonAuthGuard]},
    {path: 'create-user/:email', component: CreateUserComponent, canActivate: [NonAuthGuard]},

    {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NonAuthGuard]},
    {path: 'password-restart/:token', component: PasswordRestartComponent, canActivate: [NonAuthGuard]},
    {path: 'redirect-ok', component: RedirectOkComponent, canActivate: [NonAuthGuard]},

    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},

    {path: 'dashboard', data: {breadName: 'Dashboard'}, component: DashboardComponent, canActivate: [AuthGuard]},

    {path: 'notifications', data: {breadName: 'Notifications'}, component: NotificationsComponent, canActivate: [AuthGuard]},

    {path: 'profile', data: {breadName: 'Profile'}, component: ProfileComponent, canActivate: [AuthGuard]},

    {path: 'financial', data: {breadName: 'Financial'}, component: FinancialComponent, canActivate: [AuthGuard]},

    {path: 'financial/product-registration', data: {breadName: 'Product subscription'}, component: ProductRegistrationComponent, canActivate: [AuthGuard]},

    {path: 'financial/:product', data: {breadName: ':product'}, component: FinancialProductComponent, canActivate: [AuthGuard]},
    {path: 'financial/:product/extensions', data: {breadName: 'extensions'}, component: FinancialProductExtensionsComponent, canActivate: [AuthGuard]},
    {path: 'financial/:product/invoices', data: {breadName: 'invoices'}, component: FinancialProductInvoicesComponent, canActivate: [AuthGuard]},
    {path: 'financial/:product/invoices/:invoice', data: {breadName: ':invoice'}, component:  FinancialProductInvoicesInvoiceComponent, canActivate: [AuthGuard]},
    {path: 'financial/:product/billing', data: {breadName: 'billing'}, component:  FinancialProductBillingComponent, canActivate: [AuthGuard]},

    {path: 'hardware', data: {breadName: 'Hardware types'}, component: HardwareComponent, canActivate: [AuthGuard]},
    {path: 'hardware/:hardware_type', data: {breadName: ':last'}, component: HardwareHardwareTypeComponent, canActivate: [AuthGuard]},

    {path: 'projects', data: {breadName: 'Projects'}, component: ProjectsComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project', data: {breadName: ':project'}, component: ProjectsProjectComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/hardware', data: {breadName: 'HARDWARE devices'}, component: ProjectsProjectHardwareComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/hardware/:hardware', data: {breadName: ':last'}, component: ProjectsProjectHardwareHardwareComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/blocko', data: {breadName: 'BLOCKO programs'}, component: ProjectsProjectBlockoComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/blocko/:blocko', data: {breadName: ':blocko'}, component: ProjectsProjectBlockoBlockoComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/code', data: {breadName: 'CODE programs'}, component: ProjectsProjectCodeComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/code/:code', data: {breadName: ':code'}, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/blocks', data: {breadName: 'BLOCKO blocks'}, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/blocks/:blocks', data: {breadName: ':blocks'}, component: ProjectsProjectBlocksBlocksComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/blocks/:blocks/:block', data: {breadName: ':block'}, component: ProjectsProjectBlocksBlocksBlockComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]},
    {path: 'projects/:project/libraries', data: {breadName: 'CODE libraries'}, component: ProjectsProjectLibrariesComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/libraries/:library', data: {breadName: ':library'}, component: ProjectsProjectLibrariesLibraryComponent, canActivate: [AuthGuard]},

    {path: 'projects/:project/grid', data: {breadName: 'GRID projects'}, component: ProjectsProjectGridComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/grid/:grids', data: {breadName: ':grids'}, component: ProjectsProjectGridGridsComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/grid/:grids/:grid', data: {breadName: ':grid'}, component: ProjectsProjectGridGridsGridComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/instances', data: {breadName: 'CLOUD instances'}, component: ProjectsProjectInstancesComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/instances/:instance', data: {breadName: ':instance'}, component: ProjectsProjectInstancesInstanceComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/members', data: {breadName: 'Members'}, component: ProjectsProjectMembersComponent, canActivate: [AuthGuard]},

    {path: 'projects/:project/widgets', data: {breadName: 'GRID widgets'}, component: ProjectsProjectWidgetsComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/widgets/:widgets', data: {breadName: ':widgets'}, component: ProjectsProjectWidgetsWidgetsComponent, canActivate: [AuthGuard]},
    {path: 'projects/:project/widgets/:widgets/:widget', data: {breadName: ':widget'}, component: ProjectsProjectWidgetsWidgetsWidgetComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]},

    {path: 'producers', data: {breadName: 'Producers'}, component: ProducersComponent, canActivate: [AuthGuard]},
    {path: 'producers/:producer', data: {breadName: ':last'}, component: ProducersProducerComponent, canActivate: [AuthGuard]},

    {path: '**', component: Error404Component},
];
// @formatter:on
/* tslint:enable */

let navigation = [
    new LabeledLink('Dashboard', ['/dashboard'], 'tachometer'),
    new LabeledLink('Financial', ['/financial'],  'dollar'),
    new LabeledLink('Projects', ['/projects'], 'briefcase'),
    new LabeledLink('Hardware types', ['/hardware'], 'microchip'),
    // new LabeledLink('Producers',  ['/producers'] , 'industry'),
    /* new LabeledLink("Devices", ["/user/devices"], "rocket"),
    new LabeledLink("System", ["/system"], "globe"), */
    // new LabeledLink('Log out',  ['/logout'] , 'sign-out')
];

let tabMenus = {
    'projects-project': [
        new LabeledLink('Dashboard', ['/', 'projects', ':project'], null, {linkActiveExact: true}),
        new LabeledLink('Members', ['/', 'projects', ':project', 'members'], null),
        new LabeledLink(null, null),
        new LabeledLink('<strong class="font-color-hardware">HARDWARE</strong>', ['/', 'projects', ':project', 'hardware'], null, {styleClass: 'color-hardware'}),
        new LabeledLink('<strong class="font-color-code">CODE</strong>', null, null, {styleClass: 'color-code', items:  [
            new LabeledLink('<strong class="font-color-code">CODE</strong> programs', ['/', 'projects', ':project', 'code'], null),
            new LabeledLink('<strong class="font-color-code">CODE</strong> libraries', ['/', 'projects', ':project', 'libraries'], null),
        ]}),
        new LabeledLink('<strong class="font-color-grid">GRID</strong>', null, null, {styleClass: 'color-grid font-color-grid-dark', items:  [
            new LabeledLink('<strong class="font-color-grid">GRID</strong> projects', ['/', 'projects', ':project', 'grid'], null),
            new LabeledLink('<strong class="font-color-grid">GRID</strong> widgets', ['/', 'projects', ':project', 'widgets'], null),
        ]}),
        new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong>', null, null, {styleClass: 'color-blocko', items:  [
            new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong> programs', ['/', 'projects', ':project', 'blocko'], null),
            new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong> blocks', ['/', 'projects', ':project', 'blocks'], null),
        ]}),
        new LabeledLink('<strong class="font-color-cloud">CLOUD</strong>', ['/', 'projects', ':project', 'instances'], null, {styleClass: 'color-cloud font-color-cloud-dark'}),
    ],
    'tariffs-tarrif':  [
        new LabeledLink('Dashboard', ['/', 'financial', ':product'], 'tachometer', {linkActiveExact: true}),
        new LabeledLink('Extension services', ['/', 'financial', ':product',  'extensions'], 'database'),
        new LabeledLink('Invoices', ['/', 'financial', ':product',  'invoices'], 'dollar'),
        new LabeledLink('Billing Preferences', ['/', 'financial', ':product', 'billing'], 'bank'),
    ]
};

class BeckiErrorHandler implements ErrorHandler {

    handleError(error: any) {
        // TODO: production error catch
        if (error && error.rejection && error.rejection.originalError) {
            console.error(error.rejection.originalError);
        } else {
            console.error(error);
        }
    }

}


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forRoot(routes),
        HttpModule,
        JsonpModule,
    ],
    providers: [
        {provide: ErrorHandler, useClass: BeckiErrorHandler},
        ValidatorErrorsService,
        BackendService,
        AuthGuard, // AuthGuard service must be after BackendService
        ExitConfirmGuard,
        NonAuthGuard, // NonAuthGuard service must be after BackendService
        NotificationService, // NotificationService must be after BackendService
        StorageService,
        BlockUIService,
        ModalService,
        CurrentParamsService,
        BreadcrumbsService,
        TabMenuService,
        MonacoEditorLoaderService,
        ExitConfirmationService,
        GoPayLoaderService,
        TranslationService,
        HomerService,
        {provide: 'routes', useValue: routes},
        {provide: 'navigation', useValue: navigation},
        {provide: 'tabMenus', useValue: tabMenus},
    ],
    declarations: [
        // Generic app components
        AppComponent,
        ModalComponent,
        BlockUIComponent,
        // Layouts components
        LayoutMainComponent,
        LayoutNotLoggedComponent,
        // Other components
        ImageCropperComponent,
        // Pipes
        Md2HtmlPipe,
        Nl2BrPipe,
        UnixTimeFormatPipe,
        StringReplacerPipe,
        TranslatePipe,
        TranslateTablePipe,
        HtmlSanitizeBypassPipe,
        // Components
        MonacoEditorComponent,
        FormColorPickerComponent,
        FormFAIconSelectComponent,
        FormInputComponent,
        FormSelectComponent,
        BlockoViewComponent,
        CodeIDEComponent,
        CProgramVersionSelectorComponent,
        DraggableDirective,
        FileTreeComponent,
        GridViewComponent,
        NotificationsOverlayComponent,
        NotificationsListComponent,
        ConsoleLogComponent,
        InstanceHistoryTimelineComponent,
        QRCodeComponent,
        // Views components
        Error404Component,
        LoginComponent,
        LogoutComponent,
        DashboardComponent,
        FinancialComponent,
        FinancialProductComponent,
        FinancialProductExtensionsComponent,
        FinancialProductInvoicesComponent,
        FinancialProductInvoicesInvoiceComponent,
        FinancialProductBillingComponent,
        ProjectsComponent,
        ProjectsProjectComponent,
        ProjectsProjectHardwareComponent,
        ProjectsProjectBlockoComponent,
        ProjectsProjectBlockoBlockoComponent,
        ProjectsProjectCodeComponent,
        ProjectsProjectCodeCodeComponent,
        NotificationsComponent,
        ProfileComponent,
        ForgotPasswordComponent,
        PasswordRestartComponent,
        ProjectsProjectBlocksComponent,
        CreateUserComponent,
        RedirectOkComponent,
        ProjectsProjectBlocksBlocksComponent,
        ProjectsProjectBlocksBlocksBlockComponent,
        ProjectsProjectGridComponent,
        ProjectsProjectGridGridsComponent,
        ProjectsProjectGridGridsGridComponent,
        ProductRegistrationComponent,
        ProjectsProjectInstancesComponent,
        ProjectsProjectInstancesInstanceComponent,
        HardwareComponent,
        HardwareHardwareTypeComponent,
        ProjectsProjectMembersComponent,
        ProjectsProjectWidgetsComponent,
        ProjectsProjectWidgetsWidgetsWidgetComponent,
        ProjectsProjectWidgetsWidgetsComponent,
        ProjectsProjectHardwareHardwareComponent,
        ProducersComponent,
        ProducersProducerComponent,
        ProjectsProjectLibrariesComponent,
        ProjectsProjectLibrariesLibraryComponent,
        // Modals components
        ModalsProjectPropertiesComponent,
        ModalsRemovalComponent,
        ModalsDeactivateComponent,
        ModalsAddHardwareComponent,
        ModalsSelectHardwareComponent,
        ModalsBlockoPropertiesComponent,
        ModalsCodePropertiesComponent,
        ModalsCodeFileDialogComponent,
        ModalsConfirmComponent,
        ModalsVersionDialogComponent,
        ModalsBlockoBlockCodeEditorComponent,
        ModalsBlockoConfigPropertiesComponent,
        ModalsBlockoAddHardwareComponent,
        ModalsGridConfigPropertiesComponent,
        ModalsGridProjectPropertiesComponent,
        ModalsGridProgramPropertiesComponent,
        ModalsBlockoAddGridComponent,
        ModalsBlocksTypePropertiesComponent,
        ModalsBlocksBlockPropertiesComponent,
        ModalsHighImportanceNotificationComponent,
        ModalsDeviceEditDescriptionComponent,
        ModalsDeviceEditDeveloperParameterValueComponent,
        ModalsInstanceEditDescriptionComponent,
        ModalsBlockoVersionSelectComponent,
        ModalsMembersAddComponent,
        ModalsWidgetsTypePropertiesComponent,
        ModalsWidgetsWidgetPropertiesComponent,
        ModalsSendInvoiceComponent,
        ModalsBlockoAddGridEmptyComponent,
        ModalsHardwareBootloaderUpdateComponent,
        ModalsLibraryPropertiesComponent,
        ModalsCodeAddLibraryComponent,
        ModalsCodeLibraryVersionComponent,
        ModalsHardwareCodeProgramVersionSelectComponent,
    ],
    exports: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
