/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

// Imports
import { NgModule, ErrorHandler } from '@angular/core';
import { JsonpModule } from '@angular/http';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app';
import { LabeledLink } from './helpers/LabeledLink';
import { LayoutNotLoggedComponent } from './layouts/not-logged';
import { TyrionBackendService } from './services/BackendService';
import { AuthGuard, NonAuthGuard } from './services/AuthGuard';
import { ModalService } from './services/ModalService';
import { TabMenuService } from './services/TabMenuService';
import { BreadcrumbsService } from './services/BreadcrumbsService';
import { ValidatorErrorsService } from './services/ValidatorErrorsService';
import { CurrentParamsService } from './services/CurrentParamsService';
import { NotificationService } from './services/NotificationService';
import { ProgramVersionSelectorComponent } from './components/VersionSelectorComponent';
import { FileTreeComponent } from './components/FileTreeComponent';
import { Error404Component } from './views/error404';
import { LoginComponent } from './views/login';
import { LogoutComponent } from './views/logout';
import { DashboardComponent } from './views/dashboard';
import { NotificationsComponent } from './views/notifications';
import { ProfileComponent } from './views/profile';
import { ForgotPasswordComponent } from './views/login-forgot-password';
import { PasswordRestartComponent } from './views/login-password-restart';
import { CreateUserComponent } from './views/create-user';
import { RedirectOkComponent } from './components/redirect-ok';
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
import { NotificationsOverlayComponent } from './components/NotificationsOverlayComponent';
import { NotificationsListComponent } from './components/NotificationsListComponent';
import { ModalsBlockoVersionSelectComponent } from './modals/blocko-version-select';
import { ModalsMembersAddComponent } from './modals/members-add';
import { StorageService } from './services/StorageService';
import { ModalsWidgetsWidgetPropertiesComponent } from './modals/widgets-widget-properties';
import { MonacoEditorLoaderService } from './services/MonacoEditorLoaderService';
import { ModalsBlockoBlockCodeEditorComponent } from './modals/blocko-block-code-editor';
import { ModalsSendInvoiceComponent } from './modals/financial-send-invoice';
import { ExitConfirmationService } from './services/ExitConfirmationService';
import { ExitConfirmGuard } from './services/ExitConfirmGuard';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { ModalsSelectHardwareComponent } from './modals/select-hardware';
import { GoPayLoaderService } from './services/GoPayLoaderService';
import { TranslationService } from './services/TranslationService';
import { Md2HtmlPipe } from './pipes/Md2HtmlPipe';
import { ModalsHardwareBootloaderUpdateComponent } from './modals/hardware-bootloader-update';
import { InstanceHistoryTimeLineComponent } from './components/InstanceHistoryTimeLineComponent';
import { QRCodeComponent } from './components/QRCodeComponent';
import { ModalsLibraryPropertiesComponent } from './modals/library-properties';
import { ModalsCodeAddLibraryComponent } from './modals/code-add-library';
import { ModalsCodeLibraryVersionComponent } from './modals/code-library-version';
import { ModalsHardwareCodeProgramVersionSelectComponent } from './modals/hardware-code-program-version-select';
import { ModalsDeactivateComponent } from './modals/deactivate';
import { HtmlSanitizeBypassPipe } from './pipes/HtmlSanitizeBypassPipe';
import { TableListComponent } from './components/TableListComponent';
import { ModalsDeviceEditDeveloperParameterValueComponent } from './modals/device-edit-developer-parameter-value';
import { ModalsCreateHomerServerComponent } from './modals/homer-server-create';
import { ModalsUpdateHomerServerComponent } from './modals/homer-server-update';
import { ModalsCreateCompilationServerComponent } from './modals/compiler-server-create';
import { ModalsCreateProducerComponent } from './modals/create-producer';
import { ModalsCreateProcessorComponent } from './modals/create-processor';
import { ModalsCreateHardwareTypeComponent } from './modals/type-of-board-create';
import { ModalsSetAsMainComponent } from './modals/set-as-main';
import { ModalsBootloaderPropertyComponent } from './modals/bootloader-property';
import { ModalsPermissionGroupComponent } from './modals/permission-group';
import { ModalsRolePermissionAddComponent } from './modals/role-permission-add';
import { ModalsPermissionPermissionPropertyComponent } from './modals/permission-permission-properties';
import { ModalsGarfieldComponent } from './modals/garfield';
import { ModalsFileUploadComponent } from './modals/file-upload';
import { ModalsPictureUploadComponent } from './modals/picture-upload';
import { ModalsAdminCreateHardwareComponent } from './modals/admin-create-hardware';
import { ModalsCreateHardwareTypeBatchComponent } from './modals/type-of-board-batch-create';
import { ModalsTariffComponent } from './modals/tariff';
import { ModalsExtensionComponent } from './modals/extension';
import { FormTextAreaComponent } from './components/FormTextAreaComponent';
import { ModalsPublicShareRequestComponent } from './modals/public-share-request';
import { ModalsPublicShareResponseComponent } from './modals/public-share-response';
import { ReaderQrComponent } from './views/qr-reader';
import { MobileAddHardwareComponent } from './views/mobile-add-hardware';
import { ModalsWidgetsWidgetCopyComponent } from './modals/widgets-widget-copy';
import { ModalsBlockoBlockCopyComponent } from './modals/blocko-block-copy';
import { BeckiImageLinks } from './helpers/BeckiImageLinks';
import { MyDatePickerModule } from 'mydatepicker';
import { ModalsHardwareGroupPropertiesComponent } from './modals/hardware-group-properties';
import { FormSwitchTwoListSelectComponent } from './components/FormSwitchTwoListSelectComponent';
import { ModalsUpdateReleaseFirmwareComponent } from './modals/update-release-firmware';
import { MultiSelectComponent } from './components/MultiSelectComponent';
import { TyrionComponent } from './views/admin-tyrion';
import { LogLevelComponent, OnlineStateComponent, PublicStateComponent } from './components/OnlineStateComponent';
import { TypeOfUpdateComponent } from './components/TypeOfUpdateComponent';
import { CompilationStatusComponent } from './components/CompilationStatusComponent';
import { GSMStatusComponent } from './components/GSMStatusComponent';
import { FirmwareTypeComponent } from './components/FirmwareTypeComponent';
import { ModalsHardwareRestartMQTTPassComponent } from './modals/hardware-restart-mqtt-pass';
import { ModalsLogLevelComponent } from './modals/hardware-terminal-logLevel';
import { ModalsHardwareChangeServerComponent } from './modals/hardware-change-server';
import { TimeZoneSelectorComponent } from './components/TimeZoneComponent';
import { BeckiClickOutsideDirective } from './helpers/ClickDetection';
import { ModalsCodeSelectComponent } from './modals/code-select';
import { BeckiBooleanButtonComponent } from './components/BooleanButtonComponent';
import { PortletPanelMenuComponent } from './components/PortletPanelMenu';
import { ModalsHardwareFindHashComponent } from './modals/hardware-find-hash';
import { ModalsInstanceCreateComponent } from './modals/instance-create';
import { TagComponent } from './components/TagComponent';
import { FileTreeLineComponent } from './components/FileTreeLineCompinent';
import { ProjectsProjectCodeCodeComponent } from './views/projects-project-code-code';
import { BlockoViewComponent } from './components/BlockoViewComponent';
import { IconComponent } from './components/FileTreeComponent';
import { IconFileComponent } from './components/FileTreeComponent';
import { ModalsProgramVersionSelectComponent } from './modals/program-version-select';
import { ModalsSnapShotInstanceComponent } from './modals/snapshot-properties';
import { ModalsSnapShotDeployComponent } from './modals/snapshot-deploy';
import { ModalsShowQRComponent } from './modals/show_QR';
import { ModalsGridProgramSettingsComponent } from './modals/instance-grid-program-settings';
import { FilterTableComponent } from './components/FilterTableComponent';
import { ModalsGridProjectSelectComponent } from './modals/grid-project-select';
import { ModalsBlockSelectComponent } from './modals/block-select';
import { ArticleComponent } from './components/ArticleComponent';
import { ModalsArticleComponent } from './modals/article';
import { ModalsAddGSMComponent } from './modals/add-gsm';
import { ModalsGsmPropertiesComponent } from './modals/gsm-properties';
import { ModalsVersionSelectComponent } from './modals/version-select';
// Common dependencies
import { SharedModule } from '../shared';
import { ModalsInstanceApiPropertiesComponent } from './modals/instance-api-properties';
import { BackNextButtonsComponent } from './components/BackNextButtonsComponent';
import { ModalsPaymentDetailsComponent } from './modals/payment-details';
import { FileDownloaderService } from './services/FileDownloaderService';
import { ModalsContactComponent } from './modals/contact';
import { ContactFormComponent } from './components/ContactFormComponent';
import { PaymentDetailsFormComponent } from './components/PaymentDetailsFormComponent';
import { HttpClientModule } from '@angular/common/http';
import { MonacoDiffComponent } from './components/MonacoDiffComponent';
import { ProjectsProjectDatabasesComponent } from './views/projects-project-databases';
import { ModalsDatabaseNewComponent } from './modals/database-new';
import { ModalsDatabaseRemoveComponent } from './modals/database-remove';

// @formatter:off
// DON'T USE children IN ROUTER YET!!!
/* tslint:disable:max-line-length */
let routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
    { path: 'logout', component: LogoutComponent },
    { path: 'create-user', component: CreateUserComponent, canActivate: [NonAuthGuard] },
    { path: 'create-user/:email', component: CreateUserComponent, canActivate: [NonAuthGuard] },

    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NonAuthGuard] },
    { path: 'password-restart/:token', component: PasswordRestartComponent, canActivate: [NonAuthGuard] },
    { path: 'redirect-ok', component: RedirectOkComponent, canActivate: [NonAuthGuard] },

    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    { path: 'dashboard', data: { breadName: 'Dashboard' }, component: DashboardComponent, canActivate: [AuthGuard] },

    { path: 'notifications', data: { breadName: 'Notifications' }, component: NotificationsComponent, canActivate: [AuthGuard] },

    { path: 'qr-reader-hardware', data: { breadName: 'qr-add-hardware' }, component: MobileAddHardwareComponent, canActivate: [AuthGuard] },

    { path: 'profile', data: { breadName: 'Profile' }, component: ProfileComponent, canActivate: [AuthGuard] },

    // FINANCIAL
    { path: 'financial', data: { breadName: 'Financial' }, loadChildren: './views/financial-module#FinancialModule' },

    // HARDWARE
    { path: 'hardware', data: { breadName: 'Hardware types' }, loadChildren: './views/hardware-module#HardwareModule' },

    // HARDWARE DEVICE
    { path: 'device/:hardware', data: { breadName: ':last' }, loadChildren: './views/hardware-device-module#HardwareDeviceModule' },

    // PROJECT PAGE
    { path: 'projects', data: { breadName: 'Projects' }, loadChildren: './views/projects-module#ProjectsModule' },

    // PRODUCERS
    { path: 'producers', data: { breadName: 'Producers' }, loadChildren: './views/producers-module#ProducersModule' },

    // SUPPORT
    { path: 'support', data: { breadName: 'Producers' }, loadChildren: './views/support-module#SupportModule' }, // TODO - Rozpracováno koncept [TZ]

    // ADMIN PAGE
    { path: 'admin', data: { breadName: 'Admin Site' }, loadChildren: './views/admin-module#AdminModule' },

    // Zatím není nic co ukázat  {path: 'admin/server/homer/:homer_server', data: {breadName: ':homer_server'}, component: ServerComponent, canActivate: [AuthGuard]}, // TODO - USER / ADMIN (Breadcump je připraven)
    // Zatím není nic co ukázat  {path: 'admin/server/compilation/:code_server', data: {breadName: ':code_server'}, component: ServerComponent, canActivate: [AuthGuard]}, // TODO - USER / ADMIN (Breadcump je připraven)

    { path: 'assets/', component: Error404Component },
    { path: '**', component: Error404Component },
];
// @formatter:on
/* tslint:enable */

let navigation = [

    new LabeledLink('Dashboard', ['/dashboard'], 'tachometer'),
    new LabeledLink('Financial', ['/financial'], 'dollar'),
    new LabeledLink('Projects', ['/projects'], 'briefcase'),
    new LabeledLink('Hardware types', ['/hardware'], 'microchip'),

    // Extermal
    new LabeledLink('External Sites', null, ''), // <- Head <H3>
    new LabeledLink('Byzance Wiki', ['https://docu.byzance.cz'], 'wikipedia-w', {outsideLink: true }),
    new LabeledLink('HW Store', ['https://store.byzance.cz'], 'shopping-cart', {outsideLink: true }),
    // new LabeledLink('Support', ['/support'], 'medkit'),
    // new LabeledLink('Producers',  [' /producers'] , 'industry',
    // new LabeledLink('Log out',  ['/logout'] , 'sign-out')

    // Admin Labes
    new LabeledLink('Byzance Admin', null, '', { adminNavigation: true }), // <- Head <H3>
    new LabeledLink('Platform Admin ', ['/admin'], 'tachometer', { adminNavigation: true }),
    // new LabeledLink('Byzance Wiki', ['https://docu.byzance.cz'], 'wikipedia-w', { adminNavigation: true, outsideLink: true }),
    new LabeledLink('Youtrack Agile', ['https://youtrack.byzance.cz'], 'thumb-tack', { adminNavigation: true, outsideLink: true }),
    new LabeledLink('GitHub', ['https://youtrack.byzance.cz'], 'github', { adminNavigation: true, outsideLink: true }),
    new LabeledLink('Email', ['https://webmail.active24.com'], 'envelope', { adminNavigation: true, outsideLink: true }),

];

let tabMenus = {
    'projects-project': [
        new LabeledLink('Dashboard', ['/', 'projects', ':project'], null, { linkActiveExact: true }),
        new LabeledLink('Members', ['/', 'projects', ':project', 'members'], null),
        new LabeledLink('Roles', ['/', 'projects', ':project', 'roles'], null),
        new LabeledLink(null, null),
        new LabeledLink('<strong class="font-color-hardware">HARDWARE</strong>', null, null, {
            styleClass: 'color-hardware', items: [
                new LabeledLink('<strong class="font-color-hardware">HARDWARE</strong> list',    ['/', 'projects', ':project', 'hardware'], null),
                new LabeledLink('<strong class="font-color-hardware">RELEASES</strong> updates', ['/', 'projects', ':project', 'actualization-procedures'], null),
                new LabeledLink('<strong class="font-color-hardware">CELLULAR</strong> modules', ['/', 'projects', ':project', 'gsm'], null),
            ]
        }),
        new LabeledLink('<strong class="font-color-code">CODE</strong>', null, null, {
            styleClass: 'color-code', items: [
                new LabeledLink('<strong class="font-color-code">CODE</strong> programs',  ['/', 'projects', ':project', 'code'],      null),
                new LabeledLink('<strong class="font-color-code">CODE</strong> libraries', ['/', 'projects', ':project', 'libraries'], null),
            ]
        }),
        new LabeledLink('<strong class="font-color-grid">GRID</strong>', null, null, {
            styleClass: 'color-grid font-color-grid-dark', items: [
                new LabeledLink('<strong class="font-color-grid">GRID</strong> projects', ['/', 'projects', ':project', 'grid'],    null),
                new LabeledLink('<strong class="font-color-grid">GRID</strong> widgets',  ['/', 'projects', ':project', 'widgets'], null),
            ]
        }),
        new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong>', null, null, {
            styleClass: 'color-blocko', items: [
                new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong> programs', ['/', 'projects', ':project', 'blocko'], null),
                new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong> blocks',   ['/', 'projects', ':project', 'blocks'], null),
            ]
        }),
        new LabeledLink('<strong class="font-color-cloud">CLOUD</strong>', null, null, {
            styleClass: 'color-cloud', items: [
                new LabeledLink('<strong class="font-color-cloud">CLOUD</strong> instances', ['/', 'projects', ':project', 'instances'], null, { styleClass: 'color-cloud font-color-cloud-dark' }),
                new LabeledLink('<strong class="font-color-cloud">CLOUD</strong> servers',   ['/', 'projects', ':project', 'servers'],   null, { styleClass: 'color-cloud font-color-cloud-dark' }),
                new LabeledLink('<strong class="font-color-cloud">CLOUD</strong> databases', ['/', 'projects', ':project', 'databases'], null, { styleClass: 'color-cloud font-color-cloud-dark' })
            ]
        }),
    ],
    'products-product': [
        new LabeledLink('Dashboard', ['/', 'financial', ':product'], 'tachometer', { linkActiveExact: true }),
        new LabeledLink('Extension services', ['/', 'financial', ':product', 'extensions'], 'database'),
        new LabeledLink('Employees', ['/', 'financial', ':product', 'employees'], 'users'),
        new LabeledLink('Invoices', ['/', 'financial', ':product', 'invoices'], 'dollar'),
        new LabeledLink('History', ['/', 'financial', ':product', 'history'], 'list-ul'),
        new LabeledLink('Billing Preferences', ['/', 'financial', ':product', 'billing'], 'bank'),
    ],
    'byzance-admin': [
        new LabeledLink('Dashboard', ['/admin'], 'tachometer', { linkActiveExact: true }),
        new LabeledLink(null, null),
        new LabeledLink('Platform Management', null, null, {
            styleClass: 'color-grid font-color-grid-dark', items: [
                new LabeledLink('Hardware Management', ['/admin/hardware'], 'microchip', {adminNavigation: true}),
                new LabeledLink('Blocko Management', ['/admin/block/00000000-0000-0000-0000-000000000001'], 'random', {adminNavigation: true}),
                new LabeledLink('Widget Management', ['/admin/widget/00000000-0000-0000-0000-000000000001'], 'desktop', {adminNavigation: true}),
                new LabeledLink('Servers Management', ['/admin/server'], 'server', {adminNavigation: true}),
                new LabeledLink('Financial Management', ['/admin/financial'], 'money', {adminNavigation: true}),
                new LabeledLink('Permission Management', ['/admin/permission-group'], 'users', {adminNavigation: true}),
                new LabeledLink('Tyrion Management', ['/admin/tyrion'], 'server', {adminNavigation: true}),
            ]
        }),
        new LabeledLink('Community Management', null, null, {
            styleClass: 'color-hardware font-color-grid-dark', items: [
                new LabeledLink('Embedded Code', ['/admin/c-program/c-program'], 'code', {adminNavigation: true}),
                new LabeledLink('Grid', ['/admin/widgets'], 'desktop', {adminNavigation: true}),
                new LabeledLink('Blocko', ['/admin/blocks'], 'random', {adminNavigation: true})
            ]
        }),
        new LabeledLink('Garfield', ['/admin/garfield'], 'fire'),
        new LabeledLink('Bugs', ['/admin/bugs'], 'bug'),
        new LabeledLink('Reports', ['/admin/reports'], 'book'),
        new LabeledLink(null, null),
        new LabeledLink('Help desk', ['/admin/help-desk'], 'ambulance'),
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
        SharedModule,
        BrowserModule,
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
        HttpClientModule,
        JsonpModule,
        MyDatePickerModule
    ],
    providers: [
        { provide: ErrorHandler, useClass: BeckiErrorHandler },
        ValidatorErrorsService,
        TyrionBackendService,
        AuthGuard, // AuthGuard service must be after TyrionBackendService
        ExitConfirmGuard,
        BeckiImageLinks,
        NonAuthGuard, // NonAuthGuard service must be after TyrionBackendService
        NotificationService, // NotificationService must be after TyrionBackendService
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
        FileDownloaderService,
        { provide: 'routes', useValue: routes },
        { provide: 'navigation', useValue: navigation },
        { provide: 'tabMenus', useValue: tabMenus },
    ],
    declarations: [
        // Generic app components
        LayoutNotLoggedComponent,
        // Other components
        ImageCropperComponent,
        // Pipes
        Md2HtmlPipe,
        HtmlSanitizeBypassPipe,
        IconFileComponent,
        // Components
        BackNextButtonsComponent,
        MultiSelectComponent,
        BeckiBooleanButtonComponent,
        IconComponent,
        FormTextAreaComponent,
        TableListComponent,
        ProgramVersionSelectorComponent,
        BeckiClickOutsideDirective,
        FileTreeComponent,
        NotificationsOverlayComponent,
        NotificationsListComponent,
        InstanceHistoryTimeLineComponent,
        QRCodeComponent,
        FormSwitchTwoListSelectComponent,
        TimeZoneSelectorComponent,
        TagComponent,
        PortletPanelMenuComponent,
        LogLevelComponent,
        FilterTableComponent,
        PublicStateComponent,
        Error404Component,
        LoginComponent,
        LogoutComponent,
        DashboardComponent,
        NotificationsComponent,
        ProfileComponent,
        ForgotPasswordComponent,
        PasswordRestartComponent,
        CreateUserComponent,
        RedirectOkComponent,
        ArticleComponent,
        ReaderQrComponent,
        MobileAddHardwareComponent,
        GSMStatusComponent,
        // Modals components
        ModalsLogLevelComponent,
        ModalsAdminCreateHardwareComponent,
        ModalsContactComponent,
        ModalsProjectPropertiesComponent,
        ModalsCreateHomerServerComponent,
        ModalsUpdateHomerServerComponent,
        ModalsTariffComponent,
        ModalsPublicShareResponseComponent,
        ModalsCreateProcessorComponent,
        ModalsGridProgramSettingsComponent,
        ModalsBootloaderPropertyComponent,
        ModalsCreateCompilationServerComponent,
        ModalsRemovalComponent,
        ModalsCreateProducerComponent,
        ModalsDeactivateComponent,
        ModalsCreateHardwareTypeComponent,
        ModalsCreateHardwareTypeBatchComponent,
        ModalsAddHardwareComponent,
        ModalsSelectHardwareComponent,
        ModalsFileUploadComponent,
        ModalsBlockoPropertiesComponent,
        ModalsCodePropertiesComponent,
        ModalsPictureUploadComponent,
        ModalsPublicShareRequestComponent,
        ModalsCodeFileDialogComponent,
        ModalsSetAsMainComponent,
        ModalsShowQRComponent,
        ModalsConfirmComponent,
        ModalsGarfieldComponent,
        ModalsVersionDialogComponent,
        ModalsBlockoBlockCodeEditorComponent,
        ModalsBlockoConfigPropertiesComponent,
        ModalsBlockoAddHardwareComponent,
        ModalsGridConfigPropertiesComponent,
        ModalsGridProjectPropertiesComponent,
        ModalsGridProgramPropertiesComponent,
        ModalsBlockoAddGridComponent,
        ModalsPermissionGroupComponent,
        ModalsPaymentDetailsComponent,
        ModalsRolePermissionAddComponent,
        ModalsBlocksTypePropertiesComponent,
        ModalsPermissionPermissionPropertyComponent,
        ModalsBlocksBlockPropertiesComponent,
        ModalsHighImportanceNotificationComponent,
        ModalsDeviceEditDescriptionComponent,
        ModalsDeviceEditDeveloperParameterValueComponent,
        ModalsInstanceEditDescriptionComponent,
        ModalsInstanceCreateComponent,
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
        ModalsWidgetsWidgetCopyComponent,
        ModalsExtensionComponent,
        ModalsBlockoBlockCopyComponent,
        ModalsHardwareGroupPropertiesComponent,
        ModalsUpdateReleaseFirmwareComponent,
        ModalsHardwareRestartMQTTPassComponent,
        ModalsHardwareChangeServerComponent,
        ModalsCodeSelectComponent,
        ModalsHardwareFindHashComponent,
        ModalsVersionSelectComponent,
        ModalsProgramVersionSelectComponent,
        ModalsSnapShotInstanceComponent,
        ModalsSnapShotDeployComponent,
        ModalsGridProjectSelectComponent,
        ModalsBlockSelectComponent,
        ModalsArticleComponent,
        ModalsAddGSMComponent,
        ModalsGsmPropertiesComponent,
        ModalsInstanceApiPropertiesComponent,
        ContactFormComponent,
        PaymentDetailsFormComponent
        ModalsDatabaseNewComponent,
        MonacoDiffComponent,
        ProjectsProjectDatabasesComponent,
        ModalsDatabaseRemoveComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
