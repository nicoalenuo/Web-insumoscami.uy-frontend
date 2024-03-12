import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    inject,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/modulos/api/product';
import { Messages } from 'src/app/modulos/shared/Messages';
import { ProductosEndpointService } from '../../productos-endpoint.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-modificar-item',
    standalone: true,
    templateUrl: './modificar-item.component.html',
    styleUrl: './modificar-item.component.scss',

    imports: [
        InputTextModule,
        InputTextareaModule,
        MultiSelectModule,
        FormsModule,
        ButtonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModificarItemComponent implements OnDestroy {
    private msgs: Messages = inject(Messages);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private productosService: ProductosEndpointService = inject(
        ProductosEndpointService
    );

    categorias: string[] = [
        'Reposteria',
        'Descartables',
        'Cotillon',
        'Personalizados',
        'Cotillon',
        'Herramientas',
        'Elaboracion',
        'Sprinkles',
        'Moldes acetato y silicona',
        'Asaderas',
        'Láminas y cake toppers',
        'Productos sin gluten',
        'Cajas',
        'Envases plásticos',
        'Envases cartón',
        'Envases espuma',
        'Globos',
        'Sorpresitas',
        'Temáticos',
        'Velas',
        'Otros',
        'Cumpleaños',
        'Regalos',
    ];

    @Input() protected itemSeleccionado: Product = {
        id: null,
        nombre: null,
        precio: null,
        descripcion: null,
        categorias: null,
        veces_vendido: null,
    };

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor() {}

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        this.itemSeleccionado.imagen = file;
    }

    onFileSelectedSecundarias(event: any, index: number): void {
        const file = event?.target?.files[0];
        this.itemSeleccionado.imagenes_secundarias[index] = file;
    }

    modificarPublicacion(): void {
        this.msgs.iniciarCarga();

        this.productosService
            .modificar_publicacion(this.itemSeleccionado)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: () => {
                    this.msgs.detenerCargaConCorrectoGenerico();
                    this.productosService
                        .getItem(this.itemSeleccionado.id)
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe({
                            next: (data: { item: Product }) => {
                                this.itemSeleccionado = data.item;
                                this.msgs.detenerCarga();
                                this.cdr.detectChanges();
                            },
                            error: (error) => {
                                this.msgs.detenerCargaConErrorGenerico();
                            },
                        });
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
}
