import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerDetallesResolver } from './pages/ver-detalles/ver-detalles.resolver';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'ver-detalles/:id',
                loadComponent: () =>
                    import('./pages/ver-detalles/ver-detalles.component').then(
                        (mod) => mod.VerDetallesComponent
                    ),

                resolve: { datosDeInicio: VerDetallesResolver },
            },
            {
                path: 'create',
                loadComponent: () =>
                    import('./pages/create/create.component').then(
                        (mod) => mod.CreateComponent
                    ),
            },
            {
                path: 'modificar-item/:id',
                loadComponent: () =>
                    import(
                        './pages/modificar-item/modificar-item.component'
                    ).then((mod) => mod.ModificarItemComponent),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ProductosRoutingModule {}
