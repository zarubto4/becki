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
import { AuthGuard, NonAuthGuard } from './services/AuthGuard';
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
import { MobileAddHardwareComponent } from './views/mobile-add-hardware';
import { ProjectsProjectHardwareAddWithQrComponent } from './views/projects-project-hardware-scan';

// Common dependencies
import { SharedModule } from './modules/shared';
import { HttpClientModule } from '@angular/common/http';
import { ValidatorErrorsService } from './services/ValidatorErrorsService';
import { TyrionBackendService } from './services/BackendService';
import { ExitConfirmGuard } from './services/ExitConfirmGuard';
import { BeckiImageLinks } from './helpers/BeckiImageLinks';
import { NotificationService } from './services/NotificationService';
import { StorageService } from './services/StorageService';
import { BlockUIService } from './services/BlockUIService';
import { ModalService } from './services/ModalService';
import { CurrentParamsService } from './services/CurrentParamsService';
import { BreadcrumbsService } from './services/BreadcrumbsService';
import { TabMenuService } from './services/TabMenuService';
import { MonacoEditorLoaderService } from './services/MonacoEditorLoaderService';
import { ExitConfirmationService } from './services/ExitConfirmationService';
import { GoPayLoaderService } from './services/GoPayLoaderService';
import { TranslationService } from './services/TranslationService';
import { FileDownloaderService } from './services/FileDownloaderService';

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

    { path: 'projects/:project/scanHardware', data: {breadName: 'Add hardware with QR code'}, component: ProjectsProjectHardwareAddWithQrComponent, canActivate: [AuthGuard]},

    { path: 'profile', data: { breadName: 'Profile' }, component: ProfileComponent, canActivate: [AuthGuard] },

    // FINANCIAL
    { path: 'financial', data: { breadName: 'Financial' }, loadChildren: './modules/financial-module#FinancialModule' },

    // HARDWARE
    { path: 'hardware', data: { breadName: 'Hardware types' }, loadChildren: './modules/hardware-module#HardwareModule' },

    // PROJECT PAGE
    { path: 'projects', data: { breadName: 'Projects' }, loadChildren: './modules/projects-module#ProjectsModule' },

    // PRODUCERS
    { path: 'producers', data: { breadName: 'Producers' }, loadChildren: './modules/producers-module#ProducersModule' },

    // SUPPORT
    { path: 'support', data: { breadName: 'Producers' }, loadChildren: './modules/support-module#SupportModule' }, // TODO - Rozpracováno koncept [TZ]

    // ADMIN PAGE
    { path: 'admin', data: { breadName: 'Admin Site' }, loadChildren: './modules/admin-module#AdminModule' },

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
        BrowserModule,
        SharedModule,
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
        HttpClientModule,
        JsonpModule
    ],
    providers: [
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
        { provide: ErrorHandler, useClass: BeckiErrorHandler },
        { provide: 'routes', useValue: routes },
        { provide: 'navigation', useValue: navigation },
        { provide: 'tabMenus', useValue: tabMenus },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

