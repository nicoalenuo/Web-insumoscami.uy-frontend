import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { VendedoresService } from '../../vendedores.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Messages } from 'src/app/modulos/shared/Messages';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { Pedido } from 'src/app/modulos/api/pedido';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-pedidos',
    standalone: true,
    templateUrl: './pedidos.component.html',
    styleUrl: './pedidos.component.scss',
    imports: [TableModule, PaginatorModule, ButtonModule, CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    protected pedidos_pendientes: Pedido[];
    protected pedidos_aceptados_rechazados: Pedido[];

    constructor(
        private vendedoresService: VendedoresService,
        private msgs: Messages,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.msgs.iniciarCarga();

        this.vendedoresService
            .listarPedidos(1)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (data: {pedidos: Pedido[]}) => {
                    console.log(data);

                    this.pedidos_pendientes = data.pedidos
                        .filter(
                            (pedido: Pedido) =>
                                pedido.estado === 'pendiente' &&
                                ((pedido.es_online == true &&
                                    pedido.pago_correcto_mercadopago) ||
                                    pedido.es_online == false)
                        )
                        .sort((a, b) => {
                            return (
                                new Date(a.fechaCreacion).getTime() -
                                new Date(b.fechaCreacion).getTime()
                            );
                        });

                    this.pedidos_aceptados_rechazados = data.pedidos
                        .filter(
                            (pedido: Pedido) => pedido.estado !== 'pendiente'
                        )
                        .sort((a, b) => {
                            return (
                                new Date(a.fechaCreacion).getTime() -
                                new Date(b.fechaCreacion).getTime()
                            );
                        });

                    this.cdr.detectChanges();
                    this.msgs.detenerCarga();
                },
                error: (error) => {
                    this.cdr.detectChanges();
                    this.msgs.detenerCargaConErrorGenerico();
                },
            });
    }

    obtenerUrl(imagen: string): string {
        return environment.baseUrl + imagen;
    }

    rechazarPedido(pedido: Pedido): void {
        this.msgs.iniciarCarga();
        this.vendedoresService
            .rechazarPedido(pedido)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: () => {
                    this.msgs.detenerCargaConCorrectoGenerico();
                    window.location.reload();
                },
                error: (error) => {
                    this.msgs.detenerCargaConErrorGenerico();
                },
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    aceptarPedido(pedido: Pedido): void {
        this.msgs.iniciarCarga();
        this.vendedoresService
            .aceptarPedido(pedido)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: () => {
                    this.msgs.detenerCargaConCorrectoGenerico();
                    window.location.reload();
                },
                error: (error) => {
                    this.msgs.detenerCargaConErrorGenerico();
                },
            });
    }
}
