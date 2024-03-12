import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SesionService } from '../shared/auth/sesion.service';
@Injectable({
    providedIn: 'root',
})
export class HomeService {
    private readonly dirGetItems: string = '/items/list/';
    private readonly dirGetLatest: string = '/items/latest/';
    private readonly dirGetBest: string = '/items/best/';
    private readonly dirGetItem: string = '/items/consulta/';

    constructor(
        private http: HttpClient,
        private sesionService: SesionService
    ) {}

    getItems(
        numero_pagina: number,
        item_por_pagina: number,
        query: string,
        categoria: string[],
        and_or: number
    ) {
        const token = this.sesionService.getToken();
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };

        return token
            ? this.http.post(
                  environment.baseUrl + this.dirGetItems,
                  {
                      numero_pagina: numero_pagina,
                      items_por_pagina: item_por_pagina,
                      query: query,
                      categoria: categoria,
                      and_or: and_or,
                  },
                  options
              )
            : this.http.post(environment.baseUrl + this.dirGetItems, {
                  numero_pagina: numero_pagina,
                  items_por_pagina: item_por_pagina,
                  query: query,
                  categoria: categoria,
                  and_or: and_or,
              });
    }

    getItem(id: string) {
        return this.http.post(environment.baseUrl + this.dirGetItem, {
            id: id,
        });
    }

    getLatest(cant: number) {
        return this.http.post(environment.baseUrl + this.dirGetLatest, {
            n: cant,
        });
    }

    getBest(cant: number) {
        return this.http.post(environment.baseUrl + this.dirGetBest, {
            n: cant,
        });
    }
}
