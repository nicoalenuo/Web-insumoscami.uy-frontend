import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { Product } from 'src/app/modulos/api/product';
import { SesionService } from 'src/app/modulos/shared/auth/sesion.service';
import { ComprasService } from 'src/app/services/compras.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { environment } from 'src/environments/environment';
import { ButtonModule } from 'primeng/button';
import { Messages } from 'src/app/modulos/shared/Messages';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ModificarItemComponent } from 'src/app/modulos/productos/pages/modificar-item/modificar-item.component';
import { HomeService } from '../../home.service';

@Component({
    standalone: true,
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    imports: [
        ButtonModule,
        PaginatorModule,
        RouterModule,
        NgOptimizedImage,
        CommonModule,
        ModificarItemComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private comprasService: ComprasService = inject(ComprasService);
    private sesionService: SesionService = inject(SesionService);
    private msgs: Messages = inject(Messages);
    private homeService: HomeService = inject(HomeService);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    cantidadTotalItems: number = 0;

    protected products: Product[];

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    protected query: string;
    protected page: number;
    protected categoria: string;

    protected isLogged: boolean;

    constructor() {
        this.isLogged = this.sesionService.isLogged();
    }

    ngOnInit(): void {
        this.route.queryParamMap
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => {
                const aux = this.route.snapshot.data;

                this.products = aux['datosDeInicio'][0].items;
                this.cantidadTotalItems = aux['datosDeInicio'][0].total_items;

                this.query = this.route.snapshot.queryParamMap.get('query');
                this.page = Number(
                    this.route.snapshot.queryParamMap.get('page')
                );
                this.categoria =
                    this.route.snapshot.queryParamMap.get('categoria');
                this.cdr.detectChanges();
                this.msgs.detenerCarga();
            });
    }

    obtenerUrl(imagen: string): string {
        return environment.baseUrl + imagen;
    }

    onPageChange(event: any): void {
        this.page = event.page + 1;

        this.router.navigate(['/search'], {
            queryParams: {
                query: this.query,
                page: this.page,
                categoria: this.categoria,
            },
        });
    }

    onSearch(): void {
        this.router.navigate(['/search'], {
            queryParams: {
                query: this.query,
                page: 1,
                categoria: this.categoria,
            },
        });
    }

    agregarCarrito(event: Event, item: Product): void {
        event.preventDefault();
        event.stopPropagation();
        this.comprasService.agregarAlCarrito({
            id: item.id,
            precio: item.precio,
            cantidad: 1,
            nombre: item.nombre,
            imagen: item.imagen_recortada,
        });

        this.msgs.msgAgregadoAlCarrito();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    // MODIFICACION DE PRODUCTOS

    protected itemSeleccionado: Product = {
        id: null,
        nombre: null,
        precio: null,
        descripcion: null,
        categorias: null,
        veces_vendido: null,
        stock_cantidad: null,
    };

    protected visible_modificacion: boolean = false;

    protected modificarItem(event: Event, id: string): void {
        event.preventDefault();
        event.stopPropagation();
        this.msgs.iniciarCarga();

        this.homeService
            .getItem(id)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (data: { item: Product }) => {
                    this.itemSeleccionado = data.item;
                    this.visible_modificacion = true;
                    this.cdr.detectChanges();
                    this.msgs.detenerCarga();
                },
                error: (error) => {
                    if (error.error.message === 'ITEM_NO_EXISTE') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El item seleccionado no existe'
                        );
                    } else if (error.error.message === 'ITEM_NO_DEINIDO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El item no fue definido'
                        );
                    } else {
                        this.msgs.detenerCargaConErrorGenerico();
                    }
                },
            });
    }

    closePopup() {
        this.visible_modificacion = false;
        const index = this.products.findIndex(
            (item) => item.id === this.itemSeleccionado.id
        );
        if (index !== -1) {
            this.products[index] = this.itemSeleccionado;
            const imagenNueva = new Image();
            imagenNueva.onload = () => {
                // Reemplazar la imagen existente con la nueva imagen
                const imagenExistente = document.getElementById(
                    'imagen-' + this.itemSeleccionado.id
                ) as HTMLImageElement;
                if (imagenExistente) {
                    imagenExistente.src = imagenNueva.src;
                }
            };
            imagenNueva.src =
                this.obtenerUrl(this.itemSeleccionado.imagen_recortada) +
                '?timestamp=' +
                new Date().getTime();
        }
    }
}
