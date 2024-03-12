import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../api/product';
import { SesionService } from '../shared/auth/sesion.service';
@Injectable({
    providedIn: 'root',
})
export class ProductosEndpointService {
    private readonly dirGetItem: string = '/items/consulta/';
    private readonly dirModificarPublicacion = '/items/modify/';

    constructor(
        private http: HttpClient,
        private sesionService: SesionService
    ) {}

    getItem(id: string) {
        return this.http.post(environment.baseUrl + this.dirGetItem, {
            id: id,
        });
    }

    modificar_publicacion(publicacion: Product) {
        const token = this.sesionService.getToken();
        const formData = new FormData();

        // Agregar cada campo al objeto FormData
        formData.append('id', publicacion.id.toString());
        formData.append('nombre', publicacion.nombre);
        formData.append('precio', publicacion.precio.toString());
        formData.append('descripcion', publicacion.descripcion);
        formData.append(
            'stock_cantidad',
            publicacion.stock_cantidad.toString()
        );

        // Agregar cada categoría al objeto FormData
        publicacion.categorias.forEach((categoria, index) => {
            formData.append(
                'categorias_lista',
                publicacion.categorias.join(',')
            );
        });

        formData.append('imagen', publicacion.imagen);

        // Configurar las opciones de la solicitud HTTP
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };

        // Enviar la solicitud HTTP
        return this.http.post(
            environment.baseUrl + this.dirModificarPublicacion,
            formData,
            options
        );
    }
}
