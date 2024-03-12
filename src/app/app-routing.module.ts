import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';
import {
    isAuthenticatedAndRol,
    isNotAuthenticated,
} from './modulos/shared/auth/permisosGuard';
import { ROLES } from './modulos/shared/auth/roles';
import { redirectGuard } from './modulos/shared/redirectGuard';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    canActivate: [redirectGuard],
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './modulos/home/home-routing.module'
                                ).then((m) => m.HomeRoutingModule),
                        },
                        {
                            path: 'vendedores',
                            loadChildren: () =>
                                import(
                                    './modulos/vendedores/vendedores-routing.module'
                                ).then((m) => m.VendedoresRoutingModule),
                            canActivate: [
                                isAuthenticatedAndRol([ROLES.ADMINISTRADOR]),
                            ],
                        },
                        {
                            path: 'productos',
                            loadChildren: () =>
                                import(
                                    './modulos/productos/productos-routing.module'
                                ).then((m) => m.ProductosRoutingModule),
                        },
                        {
                            path: 'sesion',
                            loadChildren: () =>
                                import(
                                    './modulos/sesion/sesion-routing.module'
                                ).then((m) => m.SesionRoutingModule),
                            canActivate: [isNotAuthenticated()],
                        },
                    ],
                },
                { path: '**', redirectTo: '' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
