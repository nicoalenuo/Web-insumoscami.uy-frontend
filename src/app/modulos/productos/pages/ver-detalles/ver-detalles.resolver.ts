import { ResolveFn } from '@angular/router';
import { catchError, EMPTY, forkJoin, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { ComprasService } from 'src/app/services/compras.service';
import { Messages } from 'src/app/modulos/shared/Messages';
import { ProductosEndpointService } from '../../productos-endpoint.service';

export const VerDetallesResolver: ResolveFn<Observable<any>> = (route, __) => {
    const productosService: ProductosEndpointService = inject(
        ProductosEndpointService
    );
    const msgs: Messages = inject(Messages);

    const observableArray: Observable<any>[] = [
        productosService.getItem(route.paramMap.get('id')),
    ];

    msgs.iniciarCarga();

    return forkJoin(observableArray).pipe(
        catchError((error) => {
            msgs.detenerCargaConErrorGenerico();
            return EMPTY;
        })
    );
};
