import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'pedidos',
                loadComponent: () =>
                    import('./pages/pedidos/pedidos.component').then(
                        (mod) => mod.PedidosComponent
                    ),
            },
            {
                path: 'menu',
                loadComponent: () =>
                    import('./pages/menu/menu.component').then(
                        (mod) => mod.MenuComponent
                    ),
            },

            {
                path: 'caja',
                loadComponent: () =>
                    import('./pages/caja/caja.component').then(
                        (mod) => mod.CajaComponent
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class VendedoresRoutingModule {}
