import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SesionService } from '../shared/auth/sesion.service';
import { Product } from '../api/product';
import { lastValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { CartItem } from '../api/cart_item';
import { Pedido } from '../api/pedido';

@Injectable({
    providedIn: 'root',
})
export class VendedoresService {
    baseUrl: string = environment.baseUrl;

    private readonly dirListarPedidos = '/mercado_pago/listar_compras/';

    constructor(
        private http: HttpClient,
        private sesionService: SesionService
    ) {}

    getPublicaciones() {
        const token = this.sesionService.getToken();
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };
        return this.http.get(
            environment.baseUrl + '/items/publicaciones/',
            options
        );
    }

    agregar_publicacion(
        publicacion: Product,
        nombre_tienda: string,
        categorias: any
    ) {
        const token = this.sesionService.getToken();
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };

        const formData = new FormData();
        formData.append('imagen', publicacion.imagen); // Ajusta el nombre según la propiedad en tu interfaz

        formData.append(
            'categorias_lista',
            JSON.stringify({ categorias: categorias })
        );
        // Agregar otros campos de la publicación si es necesario
        formData.append('nombre', publicacion.nombre);
        formData.append('precio', publicacion.precio.toString());
        formData.append('precio_compra', "100");

        formData.append('descripcion', publicacion.descripcion);

        // Agregar el nombre de la tienda como un campo adicional
        formData.append('tienda', nombre_tienda);
        formData.append('stock_cantidad', publicacion.stock_cantidad.toString());
        formData.append('sku', publicacion.sku);
        // Configurar los encabezados, incluido el token de autorización

        // Realizar la solicitud utilizando FormData
        return this.http.post(
            environment.baseUrl + '/items/create/',
            formData,
            options
        );
    }

    getItem(id: string) {
        return this.http.post(`${this.baseUrl}/items/consulta/`, { id: id });
    }
    getItemSKU(id: string) {
        const token = this.sesionService.getToken();
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };
        return this.http.post(`${this.baseUrl}/items/sku/`, { sku: id }, options);
    }

    listarPedidos(pagina: number) {
        const token = this.sesionService.getToken();

        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };

        return this.http.post(
            environment.baseUrl + this.dirListarPedidos,
            { numero_pagina: pagina, items_por_pagina: 10 },
            options
        );
    }

    modificar_stock(list: any,aumentarStock:boolean){
        const token = this.sesionService.getToken();
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };
        return this.http.post(environment.baseUrl + '/mercado_pago/modificar_stock/', {"items":list,"aumentar": aumentarStock}, options);
    }


    aceptarPedido(pedido:Pedido) {
        const token = this.sesionService.getToken();
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };
        return this.http.post(
            environment.baseUrl + '/mercado_pago/aceptar_pedido/',
            pedido,
            options
        );
    }

    rechazarPedido(pedido:Pedido){
        const token = this.sesionService.getToken();
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };
        return this.http.post(
            environment.baseUrl + '/mercado_pago/rechazar_pedido/',
            pedido,
            options
        );
    }

}
