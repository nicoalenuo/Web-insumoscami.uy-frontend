import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartItem } from '../modulos/api/cart_item';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ComprasService {
    private cantidadEnCarritoSubject: BehaviorSubject<number> =
        new BehaviorSubject<number>(
            (localStorage.getItem('cantidadEnCarrito') as unknown as number) ||
                0
        );

    private carritoSubject: BehaviorSubject<string> =
        new BehaviorSubject<string>(
            (localStorage.getItem('cart') as unknown as string) || ''
        );

    public cantidadEnCarrito$ = this.cantidadEnCarritoSubject.asObservable();
    public carrito$ = this.carritoSubject.asObservable();

    constructor(private http: HttpClient) {}

    restarCantidad(item: CartItem): void {
        const carrito_string: string = localStorage.getItem('cart');
        const carrito: CartItem[] = carrito_string
            ? JSON.parse(carrito_string)
            : {};
        if (carrito) {
            if (carrito[item.id].cantidad > 1) {
                carrito[item.id].cantidad--;
            }
            localStorage.setItem('cart', JSON.stringify(carrito));
            this.cantidadEnCarritoSubject.next(
                localStorage.getItem('cantidadEnCarrito') as unknown as number
            );
            this.carritoSubject.next(
                localStorage.getItem('cart') as unknown as string
            );
        }
    }

    agregarAlCarrito(item: CartItem): void {
        // Obtener el carrito actual desde localStorage
        const carrito_string: string = localStorage.getItem('cart');
        const carrito: CartItem[] = carrito_string
            ? JSON.parse(carrito_string)
            : {};
        let cantidadEnCarrito =
            Number(localStorage.getItem('cantidadEnCarrito')) || 0;

        // Añadir o incrementar la cantidad del producto en el carrito
        if (!carrito[item.id]) {
            cantidadEnCarrito += 1;
            localStorage.setItem(
                'cantidadEnCarrito',
                cantidadEnCarrito.toString()
            );
        }
        carrito[item.id] = {
            id: item.id,
            cantidad: (carrito[item.id]?.cantidad || 0) + item.cantidad,
            precio: item.precio,
            nombre: item.nombre,
            imagen: item.imagen,
        };

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(carrito));
        this.cantidadEnCarritoSubject.next(
            localStorage.getItem('cantidadEnCarrito') as unknown as number
        );

        this.carritoSubject.next(
            localStorage.getItem('cart') as unknown as string
        );
    }

    eliminarDelCarrito(item: CartItem): void {
        const carrito_string: string = localStorage.getItem('cart');
        const carrito: CartItem[] = carrito_string
            ? JSON.parse(carrito_string)
            : {};
        delete carrito[item.id];
        localStorage.setItem('cart', JSON.stringify(carrito));
        let cantidadEnCarrito =
            Number(localStorage.getItem('cantidadEnCarrito')) || 0;
        cantidadEnCarrito -= 1;
        localStorage.setItem('cantidadEnCarrito', cantidadEnCarrito.toString());
        this.cantidadEnCarritoSubject.next(
            localStorage.getItem('cantidadEnCarrito') as unknown as number
        );
        this.carritoSubject.next(
            localStorage.getItem('cart') as unknown as string
        );
    }

    eliminarTodoDelCarrito(): void {
        localStorage.removeItem('cart');
        localStorage.setItem('cantidadEnCarrito', '0');
        this.cantidadEnCarritoSubject.next(
            localStorage.getItem('cantidadEnCarrito') as unknown as number
        );
        this.carritoSubject.next(
            localStorage.getItem('cart') as unknown as string
        );
    }

    async linkPago(email: string): Promise<Observable<any>> {
        var carrito: any = localStorage.getItem('cart');
        const carritoArray = carrito ? Object.values(JSON.parse(carrito)) : [];
        carrito = carrito ? JSON.parse(carrito) : {};

        const procesarItem = async (item: any) => {
            const cantidadItem = carrito[item.id].cantidad;

            const data: any = await lastValueFrom(this.getItem(item.id));

            return {
                item_id: data.item.id,
                title: data.item.nombre,
                quantity: cantidadItem,
                unit_price: data.item.precio,
                currency_id: 'UYU',
            };
        };

        const it = await Promise.all(carritoArray.map(procesarItem));

        return this.http.post(environment.baseUrl + '/mercado_pago/checkout/', {
            items: it,
            user_mail: email,
        });
    }

    public async altaPedido(email: string): Promise<Observable<any>> {
        let carrito: any = localStorage.getItem('cart');
        const carritoArray = carrito ? Object.values(JSON.parse(carrito)) : [];
        carrito = carrito ? JSON.parse(carrito) : {};

        const procesarItem = async (item: CartItem) => {
            var cantidadItem = carrito[item.id].cantidad;

            const data: any = await lastValueFrom(this.getItem(item.id));

            return {
                item_id: data.item.id,
                title: data.item.nombre,
                quantity: cantidadItem,
                unit_price: data.item.precio,
                currency_id: 'UYU',
            };
        };

        let it = await Promise.all(carritoArray.map(procesarItem));

        return this.http.post(
            environment.baseUrl + '/mercado_pago/alta_pedido/',
            {
                items: it,
                user_mail: email,
            }
        );
    }

    public get cantidadEnCarrito(): number {
        return Number(localStorage.getItem('cantidadEnCarrito')) || 0;
    }

    getItem(id: string) {
        return this.http.post(environment.baseUrl + '/items/consulta/', {
            id: id,
        });
    }

    payment_success(id: any) {
       return this.http.post(environment.baseUrl + '/mercado_pago/reporte_pago_correcto/', {id: id});
    }
}
