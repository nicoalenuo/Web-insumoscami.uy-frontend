import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ComprasService } from '../services/compras.service';
import { Subject, takeUntil } from 'rxjs';
import { LayoutService } from './service/app.layout.service';
import { CartItem } from '../modulos/api/cart_item';
import { Messages } from '../modulos/shared/Messages';

@Component({
    selector: 'app-carrito',
    templateUrl: './app.carrito.component.html',
})
export class AppCarritoComponent implements OnInit, OnDestroy {
    protected carrito: CartItem[];
    protected user_email_online: string = '';
    protected user_email_pedido: string = '';

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private comprasService: ComprasService,
        public layoutService: LayoutService,
        private msgs: Messages
    ) {}

    ngOnInit(): void {
        this.comprasService.carrito$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((productos_en_carrito: string) => {
                this.carrito = Object.values(
                    productos_en_carrito ? JSON.parse(productos_en_carrito) : {}
                ) as CartItem[];
            });

        window.addEventListener('storage', (event) => {
            if (event.key === 'cart') {
                const cart: string = localStorage.getItem('cart');
                this.carrito = Object.values(
                    cart ? JSON.parse(cart) : {}
                ) as CartItem[];
            }
        });
    }

    protected vaciarCarrito(): void {
        this.comprasService.eliminarTodoDelCarrito();
    }

    protected async linkPago(): Promise<void> {
        this.msgs.iniciarCarga();

        if (!this.user_email_online) {
            this.msgs.detenerCargaConErrorTexto(
                'Error',
                'Debes ingresar tu email'
            );
            return;
        }
        if (this.comprasService.cantidadEnCarrito === 0) {
            this.msgs.detenerCargaConErrorTexto(
                'Error',
                'Tu carrito está vacio'
            );
            return;
        }
        (await this.comprasService.linkPago(this.user_email_online))
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (data) => {
                    this.comprasService.eliminarTodoDelCarrito();
                    this.user_email_online = '';
                    this.msgs.detenerCargaConCorrectoTexto(
                        'Correcto',
                        'Tu compra se ha procesado, serás redirigido'
                    );
                    localStorage.setItem('pedido_id', data.pedido.id);
                    window.location.href = data.link.init_point;
                },
                error: (error) => {
                    if (error.error.message === 'MAIL_NO_DEFINIDO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'Debes ingresar tu email'
                        );
                    } else if (error.error.message === 'CAMPO_INVALIDO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El email no es valido'
                        );
                    } else if (error.error.message === 'PEDIDO_NO_VALIDO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El pedido no es valido'
                        );
                    } else if (error.error.message === 'PEDIDO_NO_EXISTE') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El pedido no existe'
                        );
                    } else if (error.error.message === 'PEDIDO_YA_ACEPTADO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El pedido ya fue aceptado'
                        );
                    } else if (
                        error.error.message === 'ITEM_SIN_STOCK_SUFICIENTE'
                    ) {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'Uno de los items en el carrito no tiene stock suficiente'
                        );
                    } else {
                        this.msgs.detenerCargaConErrorGenerico();
                    }
                },
            });
    }

    protected async generarPedido(): Promise<void> {
        this.msgs.iniciarCarga();

        if (!this.user_email_pedido) {
            this.msgs.detenerCargaConErrorTexto(
                'Error',
                'Debes ingresar tu email'
            );
            return;
        }
        if (this.comprasService.cantidadEnCarrito === 0) {
            this.msgs.detenerCargaConErrorTexto(
                'Error',
                'Tu carrito está vacio'
            );
            return;
        }
        (await this.comprasService.altaPedido(this.user_email_pedido))
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: () => {
                    this.comprasService.eliminarTodoDelCarrito();
                    this.user_email_pedido = '';
                    this.msgs.detenerCargaConCorrectoTexto(
                        'Correcto',
                        'Tu pedido se ha enviado, te avisaremos por mail cuando esté listo para retirar'
                    );
                },
                error: (error) => {
                    if (error.error.message === 'MAIL_NO_DEFINIDO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'Debes ingresar tu email'
                        );
                    } else if (error.error.message === 'CAMPO_INVALIDO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El email no es valido'
                        );
                    } else if (error.error.message === 'PEDIDO_NO_VALIDO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El pedido no es valido'
                        );
                    } else if (error.error.message === 'PEDIDO_NO_EXISTE') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El pedido no existe'
                        );
                    } else if (error.error.message === 'PEDIDO_YA_ACEPTADO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El pedido ya fue aceptado'
                        );
                    } else if (
                        error.error.message === 'ITEM_SIN_STOCK_SUFICIENTE'
                    ) {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'Uno de los items en el carrito no tiene stock suficiente'
                        );
                    } else {
                        this.msgs.detenerCargaConErrorGenerico();
                    }
                },
            });
    }

    obtenerImagen(imagen: string): string {
        return environment.baseUrl + imagen;
    }

    agregarCant(item: CartItem): void {
        item.cantidad = 1; //esto es para que agregue solamente 1 mas, sino agrega cantidad mas.
        this.comprasService.agregarAlCarrito(item);
    }

    restarCant(cart_item: CartItem): void {
        this.comprasService.restarCantidad(cart_item);
    }

    precio(item: CartItem): number {
        return item.cantidad * item.precio;
    }

    total(): number {
        var total = 0;
        this.carrito.forEach((item: CartItem) => {
            total += item.cantidad * item.precio;
        });
        return total;
    }

    quitarDelCarrito(item: CartItem): void {
        this.comprasService.eliminarDelCarrito(item);
    }

    cerrar_carrito(): void {
        this.layoutService.cerrar_carrito();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
