import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeResolver } from './pages/home/home.resolver';
import { SearchResolver } from './pages/search/search.resolver';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                loadComponent: () =>
                    import('./pages/home/home.component').then(
                        (mod) => mod.HomeComponent
                    ),
                resolve: { datosDeInicio: HomeResolver },
            },
            {
                path: 'search',
                loadComponent: () =>
                    import('./pages/search/search.component').then(
                        (mod) => mod.SearchComponent
                    ),
                resolve: { datosDeInicio: SearchResolver },
                runGuardsAndResolvers: 'always',
            },
            {
                path: 'success_payment',
                loadComponent: () =>
                    import('./pago/success/success.component').then(
                        (mod) => mod.SuccessComponent
                    ),
            },
            {
                path: 'failure_payment',
                loadComponent: () =>
                    import('./pago/failure/failure.component').then(
                        (mod) => mod.FailureComponent
                    ),
            },
            {
                path: 'pending_payment',
                loadComponent: () =>
                    import('./pago/pending/pending.component').then(
                        (mod) => mod.PendingComponent
                    ),
            }
            
        ]),
    ],

    exports: [RouterModule],
})
export class HomeRoutingModule {}
