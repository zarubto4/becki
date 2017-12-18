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
import { ModalsBlockoVersionSelectComponent } from './modals/blocko-version-select';
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
import { ProjectsProjectWidgetsComponent } from './views/projects-project-widgets';
import { ProjectsProjectWidgetsWidgetsComponent } from './views/projects-project-widgets-widgets';
import { ServerComponent } from './views/admin-server';
import { ModalsWidgetsWidgetPropertiesComponent } from './modals/widgets-widget-properties';
import { ProjectsProjectWidgetsWidgetsWidgetComponent } from './views/projects-project-widgets-widgets-widget';
import { MonacoEditorComponent } from './components/MonacoEditorComponent';
import { UpdateStateComponent } from './components/UpdateStateComponent';
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
import { TableListComponent } from './components/TableListComponent';
import { ModalsDeviceEditDeveloperParameterValueComponent } from './modals/device-edit-developer-parameter-value';
import { AdminDashboardComponent } from './views/admin-dashboard';
import { ModalsCreateHomerServerComponent } from './modals/homer-server-create';
import { ModalsCreateCompilationServerComponent } from './modals/compiler-server-create';
import { ModalsCreateProducerComponent } from './modals/create-producer';
import { ModalsCreateProcessorComponent } from './modals/create-processor';
import { ModalsCreateTypeOfBoardComponent } from './modals/type-of-board-create';
import { AdminHardwareComponent } from './views/admin-hardware-type';
import { ModalsSetAsMainComponent } from './modals/set-as-main';
import { ModalsBootloaderPropertyComponent } from './modals/bootloader-property';
import { ModalsPermissionGroupComponent } from './modals/permission-group';
import { RoleGroupComponent } from './views/admin-permission-group';
import { RoleGroupGroupComponent } from './views/admin-permission-group-group';
import { ModalsRolePermissionAddComponent } from './modals/role-permission-add';
import { ModalsPermissionPermissionPropertyComponent } from './modals/permission-permission-properties';
import { CommunityCProgramComponent } from './views/admin-cprograms';
import { GarfieldComponent } from './views/garfield';
import { ModalsGarfieldComponent } from './modals/garfield';
import { GarfieldGarfieldComponent } from './views/garfield-garfield';
import { ModalsFileUploadComponent } from './modals/file-upload';
import { ModalsPictureUploadComponent } from './modals/picture-upload';
import { ModalsAdminCreateHardwareComponent } from './modals/admin-create-hardware';
import { ModalsCreateTypeOfBoardBatchComponent } from './modals/type-of-board-batch-create';
import { ModalsTariffComponent } from './modals/tariff';
import { AdminFinancialComponent } from './views/admin-financial';
import { AdminFinancialTariffComponent } from './views/admin-financial-tariff';
import { ModalsExtensionComponent } from './modals/extension';
import { FormTextAreaComponent } from './components/FormTextAreaComponent';
import { FormJsonNiceTextAreaComponent } from './components/FormJsonNiceTextAreaComponent';
import { ModalsFinancialProductComponent } from './modals/financial-product';
import { ModalsBillingInformationComponent } from './modals/billing-information';
import { ModalsCompanyInformationComponent } from './modals/company-information';
import { ModalsPublicShareRequestComponent } from './modals/public-share-request';
import { ModalsPublicShareResponseComponent } from './modals/public-share-response';
import { FilterPagerComponent } from './components/FilterPagerComponent';
import { ReaderQrComponent } from './views/qr-reader';
import { MobileAddHardwareComponent } from './views/mobile-add-hardware';
import { ModalsWidgetsWidgetCopyComponent } from './modals/widgets-widget-copy';
import { ModalsBlockoBlockCopyComponent } from './modals/blocko-block-copy';
import { SupportComponent } from './views/support';
import { ServerRegistrationComponent } from './views/server-registration';
import { BeckiImageLinks } from './helpers/BeckiImageLinks';
import { MyDatePickerModule } from 'mydatepicker';
import { BugsComponent } from './views/admin-bugs';
import { BugsBugComponent } from './views/admin-bugs-bug';
import { TimePickerComponent } from './components/timePickerComponent';
import { DatePickerComponent } from './components/datePickerComponent';
import { ModalsHardwareGroupPropertiesComponent } from './modals/hardware-group-properties';
import { ModalsHardwareGroupDeviceSettingsComponent } from './modals/hardware-group-device-settings';
import { FormSwitchTwoListSelectComponent } from './components/FormSwitchTwoListSelectComponent';
import { ModalsUpdateReleaseFirmwareComponent } from './modals/update-release-firmware';
import { MultiSelectComponent } from './components/MultiSelectComponent';
import { TyrionComponent } from './views/admin-tyrion';
import { OnlineStateComponent } from './components/OnlineStateComponent';
import { TypeOfUpdateComponent } from './components/TypeOfUpdateComponent';
import { CompilationStatusComponent } from './components/CompilationStatusComponent';
import { ProjectsProjectActualizationProcedureComponent } from './views/projects-project-actualization-procedure';
import { FirmwareTypeComponent } from './components/FirmwareTypeComponent';
import { ModalPickHardwareTerminalComponent } from './modals/pick-hardware-terminal';
import { ModalsLogLevelComponent } from './modals/hardware-terminal-logLevel';


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

    { path: 'financial', data: { breadName: 'Financial' }, component: FinancialComponent, canActivate: [AuthGuard] },

    { path: 'financial/product-registration', data: { breadName: 'Product subscription' }, component: ProductRegistrationComponent, canActivate: [AuthGuard] },

    { path: 'financial/:product', data: { breadName: ':product' }, component: FinancialProductComponent, canActivate: [AuthGuard] },
    { path: 'financial/:product/extensions', data: { breadName: 'extensions' }, component: FinancialProductExtensionsComponent, canActivate: [AuthGuard] },
    { path: 'financial/:product/employees', data: { breadName: 'employees' }, component: FinancialProductExtensionsComponent, canActivate: [AuthGuard] },
    { path: 'financial/:product/invoices', data: { breadName: 'invoices' }, component: FinancialProductInvoicesComponent, canActivate: [AuthGuard] },
    { path: 'financial/:product/invoices/:invoice', data: { breadName: ':invoice' }, component: FinancialProductInvoicesInvoiceComponent, canActivate: [AuthGuard] },
    { path: 'financial/:product/billing', data: { breadName: 'billing' }, component: FinancialProductBillingComponent, canActivate: [AuthGuard] },

    { path: 'hardware', data: { breadName: 'Hardware types' }, component: HardwareComponent, canActivate: [AuthGuard] },
    { path: 'hardware/:hardware_type', data: { breadName: ':last' }, component: HardwareHardwareTypeComponent, canActivate: [AuthGuard] },
    { path: 'hardware/:hardware_type/:code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard] },
    { path: 'device/:hardware', data: { breadName: ':last' }, component: ProjectsProjectHardwareHardwareComponent, canActivate: [AuthGuard] },


    { path: 'projects', data: { breadName: 'Projects' }, component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project', data: { breadName: ':project' }, component: ProjectsProjectComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/hardware', data: { breadName: 'HARDWARE devices' }, component: ProjectsProjectHardwareComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/hardware/:hardware', data: { breadName: ':hardware' }, component: ProjectsProjectHardwareHardwareComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/blocko', data: { breadName: 'BLOCKO programs' }, component: ProjectsProjectBlockoComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/blocko/:blocko', data: { breadName: ':blocko' }, component: ProjectsProjectBlockoBlockoComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]  },
    { path: 'projects/:project/code', data: { breadName: 'CODE programs' }, component: ProjectsProjectCodeComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/code/:code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]  },
    { path: 'projects/:project/blocks', data: { breadName: 'BLOCKO blocks' }, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/blocks/:blocks', data: { breadName: ':blocks' }, component: ProjectsProjectBlocksBlocksComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/blocks/:blocks/:block', data: { breadName: ':block' }, component: ProjectsProjectBlocksBlocksBlockComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
    { path: 'projects/:project/libraries', data: { breadName: 'CODE libraries' }, component: ProjectsProjectLibrariesComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/libraries/:library', data: { breadName: ':library' }, component: ProjectsProjectLibrariesLibraryComponent, canActivate: [AuthGuard] , canDeactivate: [ExitConfirmGuard] },

    { path: 'projects/:project/actualization_procedure/:procedure', data: { breadName: ':last' }, component: ProjectsProjectActualizationProcedureComponent, canActivate: [AuthGuard] , canDeactivate: [ExitConfirmGuard] },

    { path: 'projects/:project/grid', data: { breadName: 'GRID projects' }, component: ProjectsProjectGridComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/grid/:grids', data: { breadName: ':grids' }, component: ProjectsProjectGridGridsComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/grid/:grids/:grid', data: { breadName: ':grid' }, component: ProjectsProjectGridGridsGridComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
    { path: 'projects/:project/instances', data: { breadName: 'CLOUD instances' }, component: ProjectsProjectInstancesComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/instances/:instance', data: { breadName: ':instance' }, component: ProjectsProjectInstancesInstanceComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/members', data: { breadName: 'Members' }, component: ProjectsProjectMembersComponent, canActivate: [AuthGuard] },

    { path: 'projects/:project/widgets', data: { breadName: 'GRID widgets' }, component: ProjectsProjectWidgetsComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/widgets/:widgets', data: { breadName: ':widgets' }, component: ProjectsProjectWidgetsWidgetsComponent, canActivate: [AuthGuard] },
    { path: 'projects/:project/widgets/:widgets/:widget', data: { breadName: ':widget' }, component: ProjectsProjectWidgetsWidgetsWidgetComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },

    { path: 'producers', data: { breadName: 'Producers' }, component: ProducersComponent, canActivate: [AuthGuard] },
    { path: 'producers/:producer', data: { breadName: ':producer' }, component: ProducersProducerComponent, canActivate: [AuthGuard] },

    { path: 'support', data: { breadName: 'Producers' }, component: SupportComponent, canActivate: [AuthGuard] }, // TODO - Rozpracováno koncept [TZ]
    { path: 'support/:ticket', data: { breadName: ':ticket' }, component: ProducersProducerComponent, canActivate: [AuthGuard] }, // TODO - Rozpracováno koncept [TZ]

    { path: 'server', data: { breadName: 'Server' }, component: ServerRegistrationComponent, canActivate: [AuthGuard] }, // TODO - Rozpracováno koncept [TZ]


    { path: 'admin', data: { breadName: 'Admin Site' }, component: AdminDashboardComponent, canActivate: [AuthGuard] },

    { path: 'admin/hardware', data: { breadName: 'Hardware' }, component: AdminHardwareComponent, canActivate: [AuthGuard] },
    { path: 'admin/hardware/code/:code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard] },
    { path: 'admin/hardware/libraries/:library', data: { breadName: ':library' }, component: ProjectsProjectLibrariesLibraryComponent, canActivate: [AuthGuard] },

    { path: 'admin/widgets', data: {breadName: 'Community Grid Widgets Group'}, component: ProjectsProjectWidgetsComponent, canActivate: [AuthGuard]},
    { path: 'admin/widgets/:widgets', data: {breadName: 'widgets'}, component: ProjectsProjectWidgetsWidgetsComponent, canActivate: [AuthGuard]},
    { path: 'admin/widgets/:widgets/:widget', data: {breadName: ':widget'}, component: ProjectsProjectWidgetsWidgetsWidgetComponent, canActivate: [AuthGuard]},
    { path: 'admin/widget/:widget', data: {breadName: ':widget'}, component: ProjectsProjectWidgetsWidgetsWidgetComponent, canActivate: [AuthGuard]},  // Only for community decisions - Link without project path


    { path: 'admin/blocks', data: {breadName: 'Blocko Groups'}, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard]},
    { path: 'admin/blocks/:blocks', data: {breadName: ':blocks'}, component: ProjectsProjectBlocksBlocksComponent, canActivate: [AuthGuard]},
    { path: 'admin/blocks/:blocks/:block', data: {breadName: ':block'}, component: ProjectsProjectBlocksBlocksBlockComponent, canActivate: [AuthGuard]},
    { path: 'admin/block/:block', data: {breadName: ':block'}, component: ProjectsProjectBlocksBlocksBlockComponent, canActivate: [AuthGuard]}, // Only for community decisions - Link without project path

    { path: 'admin/bugs', data: {breadName: 'Bugs'}, component: BugsComponent, canActivate: [AuthGuard]},
    { path: 'admin/bugs/:bug', data: {breadName: ':bug'}, component: BugsBugComponent, canActivate: [AuthGuard]},

    { path: 'admin/garfield', data: {breadName: 'Garfield'}, component: GarfieldComponent, canActivate: [AuthGuard]},
    { path: 'admin/garfield/:garfield', data: {breadName: ':garfield'}, component: GarfieldGarfieldComponent, canActivate: [AuthGuard]},

    { path: 'admin/financial', data: { breadName: 'Tariff' }, component: AdminFinancialComponent, canActivate: [AuthGuard] },
    { path: 'admin/financial/:tariff', data: { breadName: ':tariff' }, component: AdminFinancialTariffComponent, canActivate: [AuthGuard] },

    { path: 'admin/tyrion', data: { breadName: 'Tyrion' }, component: TyrionComponent, canActivate: [AuthGuard] },
    { path: 'admin/server', data: { breadName: 'Servers' }, component: ServerComponent, canActivate: [AuthGuard] },
    // {path: 'admin/server/homer/:homer_server', data: {breadName: ':homer_server'}, component: ServerComponent, canActivate: [AuthGuard]}, // TODO - USER / ADMIN (Breadcump je připraven)
    // {path: 'admin/server/compilation/:code_server', data: {breadName: ':code_server'}, component: ServerComponent, canActivate: [AuthGuard]}, // TODO - USER / ADMIN (Breadcump je připraven)

    { path: 'admin/permission-group', data: { breadName: 'Permission Group' }, component: RoleGroupComponent, canActivate: [AuthGuard] },
    { path: 'admin/permission-group/:group', data: { breadName: ':group' }, component: RoleGroupGroupComponent, canActivate: [AuthGuard] },

    { path: 'admin/c-program/c-program', data: { breadName: 'Community Management Code' }, component: CommunityCProgramComponent, canActivate: [AuthGuard] },

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
    // new LabeledLink('Support', ['/support'], 'medkit'),
    // new LabeledLink('Producers',  [' /producers'] , 'industry',
    // new LabeledLink('Store',  ['https://store.byzance.cz'] , 'shopping-cart', { outsideLink: true }),
    // new LabeledLink('Byzance Wiki', ['https://wiki.byzance.cz'], 'wikipedia-w', { outsideLink: true }),
    // new LabeledLink('Log out',  ['/logout'] , 'sign-out')

    // Admin Labes
    new LabeledLink('Platform Admin ', ['/admin'], 'tachometer', { adminNavigation: true }),
    new LabeledLink('Byzance Wiki', ['https://docu.byzance.cz'], 'wikipedia-w', { adminNavigation: true, outsideLink: true }),
    new LabeledLink('Youtrack Agile', ['https://youtrack.byzance.cz'], 'thumb-tack', { adminNavigation: true, outsideLink: true }),
    new LabeledLink('GitHub', ['https://youtrack.byzance.cz'], 'github', { adminNavigation: true, outsideLink: true }),
    new LabeledLink('Email', ['https://webmail.active24.com'], 'envelope', { adminNavigation: true, outsideLink: true }),

];

let tabMenus = {
    'projects-project': [
        new LabeledLink('Dashboard', ['/', 'projects', ':project'], null, { linkActiveExact: true }),
        new LabeledLink('Members', ['/', 'projects', ':project', 'members'], null),
        new LabeledLink(null, null),
        new LabeledLink('<strong class="font-color-hardware">HARDWARE</strong>', ['/', 'projects', ':project', 'hardware'], null, { styleClass: 'color-hardware' }),
        new LabeledLink('<strong class="font-color-code">CODE</strong>', null, null, {
            styleClass: 'color-code', items: [
                new LabeledLink('<strong class="font-color-code">CODE</strong> programs', ['/', 'projects', ':project', 'code'], null),
                new LabeledLink('<strong class="font-color-code">CODE</strong> libraries', ['/', 'projects', ':project', 'libraries'], null),
            ]
        }),
        new LabeledLink('<strong class="font-color-grid">GRID</strong>', null, null, {
            styleClass: 'color-grid font-color-grid-dark', items: [
                new LabeledLink('<strong class="font-color-grid">GRID</strong> projects', ['/', 'projects', ':project', 'grid'], null),
                new LabeledLink('<strong class="font-color-grid">GRID</strong> widgets', ['/', 'projects', ':project', 'widgets'], null),
            ]
        }),
        new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong>', null, null, {
            styleClass: 'color-blocko', items: [
                new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong> programs', ['/', 'projects', ':project', 'blocko'], null),
                new LabeledLink('<strong class="font-color-blocko">BLOCKO</strong> blocks', ['/', 'projects', ':project', 'blocks'], null),
            ]
        }),
        new LabeledLink('<strong class="font-color-cloud">CLOUD</strong>', ['/', 'projects', ':project', 'instances'], null, { styleClass: 'color-cloud font-color-cloud-dark' }),
    ],
    'tariffs-tariff': [
        new LabeledLink('Dashboard', ['/', 'financial', ':product'], 'tachometer', { linkActiveExact: true }),
        new LabeledLink('Extension services', ['/', 'financial', ':product', 'extensions'], 'database'),
        new LabeledLink('Employees', ['/', 'financial', ':product', 'employees'], 'users'),
        new LabeledLink('Invoices', ['/', 'financial', ':product', 'invoices'], 'dollar'),
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
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule.forRoot(routes),
        HttpModule,
        JsonpModule,
        MyDatePickerModule,
    ],
    providers: [
        { provide: ErrorHandler, useClass: BeckiErrorHandler },
        ValidatorErrorsService,
        BackendService,
        AuthGuard, // AuthGuard service must be after BackendService
        ExitConfirmGuard,
        BeckiImageLinks,
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
        { provide: 'routes', useValue: routes },
        { provide: 'navigation', useValue: navigation },
        { provide: 'tabMenus', useValue: tabMenus },
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
        MultiSelectComponent,
        MonacoEditorComponent,
        FormColorPickerComponent,
        FormFAIconSelectComponent,
        FormInputComponent,
        FormTextAreaComponent,
        FormSelectComponent,
        FormJsonNiceTextAreaComponent,
        BlockoViewComponent,
        FilterPagerComponent,
        CodeIDEComponent,
        TableListComponent,
        CProgramVersionSelectorComponent,
        DraggableDirective,
        FileTreeComponent,
        GridViewComponent,
        NotificationsOverlayComponent,
        NotificationsListComponent,
        ConsoleLogComponent,
        InstanceHistoryTimelineComponent,
        QRCodeComponent,
        DatePickerComponent,
        TimePickerComponent,
        FormSwitchTwoListSelectComponent,
        UpdateStateComponent,
        OnlineStateComponent,
        TypeOfUpdateComponent,
        // Views components
        AdminDashboardComponent,
        Error404Component,
        LoginComponent,
        LogoutComponent,
        AdminHardwareComponent,
        AdminFinancialComponent,
        AdminFinancialTariffComponent,
        BugsComponent,
        BugsBugComponent,
        DashboardComponent,
        CommunityCProgramComponent,
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
        GarfieldComponent,
        GarfieldGarfieldComponent,
        RoleGroupComponent,
        RoleGroupGroupComponent,
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
        ServerComponent,
        TyrionComponent,
        ProjectsProjectWidgetsWidgetsComponent,
        ProjectsProjectHardwareHardwareComponent,
        ProducersComponent,
        ProducersProducerComponent,
        ProjectsProjectLibrariesComponent,
        ProjectsProjectLibrariesLibraryComponent,
        ReaderQrComponent,
        MobileAddHardwareComponent,
        SupportComponent,
        ServerRegistrationComponent,
        CompilationStatusComponent,
        ProjectsProjectActualizationProcedureComponent,
        FirmwareTypeComponent,
        // Modals components
        ModalsLogLevelComponent,
        ModalsAdminCreateHardwareComponent,
        ModalsBillingInformationComponent,
        ModalsProjectPropertiesComponent,
        ModalsCreateHomerServerComponent,
        ModalsFinancialProductComponent,
        ModalsTariffComponent,
        ModalsPublicShareResponseComponent,
        ModalsCreateProcessorComponent,
        ModalsBootloaderPropertyComponent,
        ModalsCreateCompilationServerComponent,
        ModalsRemovalComponent,
        ModalsCreateProducerComponent,
        ModalsDeactivateComponent,
        ModalsCreateTypeOfBoardComponent,
        ModalsCreateTypeOfBoardBatchComponent,
        ModalsAddHardwareComponent,
        ModalsSelectHardwareComponent,
        ModalsFileUploadComponent,
        ModalsBlockoPropertiesComponent,
        ModalsCodePropertiesComponent,
        ModalsPictureUploadComponent,
        ModalsCompanyInformationComponent,
        ModalsPublicShareRequestComponent,
        ModalsCodeFileDialogComponent,
        ModalsSetAsMainComponent,
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
        ModalsRolePermissionAddComponent,
        ModalsBlocksTypePropertiesComponent,
        ModalsPermissionPermissionPropertyComponent,
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
        ModalsWidgetsWidgetCopyComponent,
        ModalsExtensionComponent,
        ModalsBlockoBlockCopyComponent,
        ModalsHardwareGroupPropertiesComponent,
        ModalsHardwareGroupDeviceSettingsComponent,
        ModalsUpdateReleaseFirmwareComponent,
        ModalPickHardwareTerminalComponent,

    ],
    exports: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
