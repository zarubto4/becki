import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthGuard, NonAuthGuard } from '../services/AuthGuard';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { CommonModule } from '@angular/common';

// Providers has to have empty array
@NgModule({
    imports: [ CommonModule ],
    declarations: []
})

export class AuthModule {

    static forRoot(): ModuleWithProviders {
        return  {
            // Pointing to AuthModule and providers
            ngModule: AuthModule,
            providers: [
                // AuthGuard,
                // NonAuthGuard,
                ValidatorErrorsService
            ]
        }
    }
}
