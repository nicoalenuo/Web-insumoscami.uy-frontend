import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'login',
                loadComponent: () =>
                    import('./pages/login/login.component').then(
                        (mod) => mod.LoginComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class SesionRoutingModule {}
