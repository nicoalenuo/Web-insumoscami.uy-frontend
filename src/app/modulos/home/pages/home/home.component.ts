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
import { Carousel, CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { Messages } from 'src/app/modulos/shared/Messages';
import { NgOptimizedImage } from '@angular/common';
import { ModificarItemComponent } from 'src/app/modulos/productos/pages/modificar-item/modificar-item.component';
import { Subject, takeUntil } from 'rxjs';
import { HomeService } from '../../home.service';

@Component({
    standalone: true,
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [
        ButtonModule,
        PaginatorModule,
        CarouselModule,
        RouterModule,
        NgOptimizedImage,
        ModificarItemComponent,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);
    private comprasService: ComprasService = inject(ComprasService);
    private sesionService: SesionService = inject(SesionService);
    private msgs: Messages = inject(Messages);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private homeService: HomeService = inject(HomeService);

    protected responsiveOptions:
        | { breakpoint: string; numVisible: number; numScroll: number }[]
        | undefined;

    cantidadItems: number = 12;
    cantidadTotalItems: number = 0;

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    protected itemSeleccionado: Product = {
        id: null,
        nombre: null,
        precio: null,
        descripcion: null,
        categorias: null,
        veces_vendido: null,
        stock_cantidad: null,
    };

    protected products: Product[];
    protected latest: Product[];
    protected best: Product[];

    protected publicacion: Product;

    protected query: string = '';

    private baseUrl: string = environment.baseUrl;

    protected isLogged: boolean;

    constructor() {
        this.isLogged = this.sesionService.isLogged();
    }

    ngOnInit(): void {
        Carousel.prototype.onTouchMove = () => {}; //Para que se pueda hacer swipe de arriba a abajo sobre el carrusel

        const aux = this.route.snapshot.data;

        this.products = aux['datosDeInicio'][0].items;
        this.cantidadTotalItems = aux['datosDeInicio'][0].total_items;
        this.latest = aux['datosDeInicio'][1].items;
        this.best = aux['datosDeInicio'][2].items;

        this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 3,
                numScroll: 1,
            },
            {
                breakpoint: '1150px',
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: '680px',
                numVisible: 1,
                numScroll: 1,
            },
        ];

        this.cdr.detectChanges();
        this.msgs.detenerCarga();
    }

    cambiarProducts() {
        this.msgs.iniciarCarga();

        this.homeService
            .getItems(1, this.cantidadTotalItems, '', [], 0)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (data: { items: Product[]; total_items: number }) => {
                    data.items.sort(
                        (a: any, b: any) => a.stock_cantidad - b.stock_cantidad
                    );
                    this.products = data.items;
                    this.cantidadTotalItems = 0; // para que no muestre la opción de paginación.
                    this.cdr.detectChanges();
                    this.msgs.detenerCarga();
                },
                error: (error) => {
                    if (error.error.message === 'NUMERO_PAGINA_NO_VALIDO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'El número de pagina ingresado no es valido'
                        );
                    } else if (
                        error.error.message === 'NUMERO_PAGINA_NO_INDICADO'
                    ) {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'Ingrese un número de página'
                        );
                    } else if (
                        error.error.message === 'ITEMS_POR_PAGINA_NO_INDICADO'
                    ) {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'Ingrese la cantidad de items por página'
                        );
                    } else if (
                        error.error.message === 'ITEMS_POR_PAGINA_NO_VALIDO'
                    ) {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'Cantidad de de items por página invalido'
                        );
                    } else if (error.error.message === 'QUERY_MUY_LARGO') {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'La busqueda es muy larga'
                        );
                    } else if (
                        error.error.message === 'CATEGORIAS_NO_VALIDAS'
                    ) {
                        this.msgs.detenerCargaConErrorTexto(
                            'Error',
                            'La categoría ingresada no es válida'
                        );
                    } else {
                        this.msgs.detenerCargaConErrorGenerico();
                    }
                },
            });
    }

    obtenerUrl(imagen: string): string {
        return this.baseUrl + imagen;
    }

    onSubmit(): void {
        this.router.navigate(['/search'], {
            queryParams: { query: this.query, page: 1 },
        });
    }

    onPageChange(event: any): void {
        const pagina = event.page + 1;
        this.router.navigate(['/search'], {
            queryParams: { query: '', page: pagina },
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

    //MODIFICACION

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
