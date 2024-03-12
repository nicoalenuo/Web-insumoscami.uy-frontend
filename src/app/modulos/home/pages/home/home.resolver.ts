import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, forkJoin, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { HomeService } from '../../home.service';
import { Messages } from 'src/app/modulos/shared/Messages';

export const HomeResolver: ResolveFn<Observable<any>> = (route, __) => {
    const homeService: HomeService = inject(HomeService);
    const msgs: Messages = inject(Messages);
    const router: Router = inject(Router);

    let cantidadItems = 12;
    let filtroCategoria = [];

    if (route.paramMap.has('pk')) {
        filtroCategoria.push(route.paramMap.get('pk'));
    }

    msgs.iniciarCarga();

    const observableArray: Observable<any>[] = [
        homeService.getItems(1, cantidadItems, null, filtroCategoria, 0),
        homeService.getLatest(6),
        homeService.getBest(6),
    ];

    return forkJoin(observableArray).pipe(
        catchError(() => {
            router.navigate(['/']);
            return EMPTY;
        })
    );
};
