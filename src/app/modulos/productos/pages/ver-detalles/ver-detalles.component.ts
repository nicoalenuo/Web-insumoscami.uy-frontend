import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComprasService } from 'src/app/services/compras.service';
import { environment } from 'src/environments/environment';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Messages } from 'src/app/modulos/shared/Messages';
import { RippleModule } from 'primeng/ripple';
import { Product } from 'src/app/modulos/api/product';

@Component({
    selector: 'app-ver-detalles',
    standalone: true,
    templateUrl: './ver-detalles.component.html',
    styleUrl: './ver-detalles.component.scss',
    imports: [
        GalleriaModule,
        InputTextModule,
        InputTextareaModule,
        ButtonModule,
        RippleModule,
        FormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerDetallesComponent {
    images:
        | {
              itemImageSrc: string;
              thumbnailImageSrc: string;
          }[]
        | undefined;

    private baseUrl: string = environment.baseUrl;
    protected cantidad: number = 1;
    protected item: Product;

    constructor(
        private comprasService: ComprasService,
        private route: ActivatedRoute,
        private msgs: Messages,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        const aux = this.route.snapshot.data;
        this.item = aux['datosDeInicio'][0].item;

        this.images = this.item.imagenes_secundarias.map((obj) => ({
            itemImageSrc: this.baseUrl + obj,
            thumbnailImageSrc: this.baseUrl + obj,
        }));
        this.images.push({
            itemImageSrc: this.item.imagen
                ? this.baseUrl + this.item.imagen
                : '/assets/shared/default-product.webp',
            thumbnailImageSrc: this.item.imagen
                ? this.baseUrl + this.item.imagen
                : '/assets/shared/default-product.webp',
        });

        this.msgs.detenerCarga();
        this.cdr.detectChanges();
    }

    addCantidad() {
        this.cantidad++;
    }

    removeCantidad() {
        if (this.cantidad > 1) {
            this.cantidad--;
        }
    }

    agregarCarrito() {
        this.comprasService.agregarAlCarrito({
            id: this.item.id,
            precio: this.item.precio,
            cantidad: this.cantidad,
            nombre: this.item.nombre,
            imagen: this.item.imagen_recortada,
        });

        this.msgs.msgAgregadoAlCarrito();
    }
}
