import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    inject,
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/modulos/api/product';
import { Messages } from 'src/app/modulos/shared/Messages';
import { ProductosEndpointService } from '../../productos-endpoint.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { VendedoresService } from 'src/app/modulos/vendedores/vendedores.service';
@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        InputTextModule,
        InputTextareaModule,
        MultiSelectModule,
        FormsModule,
        ButtonModule,
    ],
    templateUrl: './create.component.html',
    styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit, OnDestroy {
    private msgs: Messages = inject(Messages);
    private vendedoresService: VendedoresService = inject(VendedoresService);
    private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor() {}

    ngOnInit(): void {}

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

    protected itemSeleccionado: Product = {
        id: null,
        nombre: null,
        precio: null,
        descripcion: null,
        categorias: null,
        veces_vendido: null,
        sku: null,
    };

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        this.itemSeleccionado.imagen = file;
    }

    onFileSelectedSecundarias(event: any, index: number): void {
        const file = event?.target?.files[0];
        this.itemSeleccionado.imagenes_secundarias[index] = file;
    }

    crearPublicacion() {
        this.msgs.iniciarCarga();
        this.vendedoresService
            .agregar_publicacion(
                this.itemSeleccionado,
                'insumoscami',
                this.itemSeleccionado.categorias
            )
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: (res) => {
                    this.msgs.detenerCargaConCorrectoGenerico();
                    this.itemSeleccionado = {
                        id: null,
                        nombre: null,
                        precio: null,
                        descripcion: null,
                        categorias: null,
                        veces_vendido: null,
                        sku: null,
                    };
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
