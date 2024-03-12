import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, forkJoin, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { HomeService } from '../../home.service';
import { Messages } from 'src/app/modulos/shared/Messages';

export const SearchResolver: ResolveFn<Observable<any>> = (route, __) => {
    const homeService: HomeService = inject(HomeService);
    const msgs: Messages = inject(Messages);
    const router: Router = inject(Router);

    let cantidadItems = 12;
    let filtroCategoria = [];

    const query = route.queryParamMap.get('query');
    const page = Number(route.queryParamMap.get('page'));
    const categoria = route.queryParamMap.get('categoria');

    if (categoria) {
        filtroCategoria.push(categoria);
    }

    msgs.iniciarCarga();

    const observableArray: Observable<any>[] = [
        homeService.getItems(page, cantidadItems, query, filtroCategoria, 0),
    ];

    return forkJoin(observableArray).pipe(
        catchError(() => {
            router.navigate(['/']);
            return EMPTY;
        })
    );
};
