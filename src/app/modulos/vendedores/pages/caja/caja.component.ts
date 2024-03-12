import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { VendedoresService } from '../../vendedores.service';
import { environment } from 'src/environments/environment';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
@Component({
    selector: 'app-caja',
    standalone: true,
    imports: [TableModule, FormsModule, ButtonModule, ToggleButtonModule],
    templateUrl: './caja.component.html',
    styleUrl: './caja.component.scss',
})
export class CajaComponent implements OnInit {
    products: any = [];
    total: number = 0;
    input: string = '';
    aumentarStock = false; //aumentarStock = true es aumentarStock. aumentarStock = false es disminuirStock
    constructor(private vendedoresService: VendedoresService) {}

    ngOnInit(): void {
        // Add your initialization logic here
    }

    finalizar() {
        const lista: any[] = [];
        this.products.forEach((item: any) => {
            const obj = {
                id: item.id,
                stock_cantidad: item.cantidad,
            };
            lista.push(obj);
        });
        this.vendedoresService
            .modificar_stock(lista, this.aumentarStock)
            .subscribe((data: any) => {
                this.products = [];
                this.total = 0;
            });
    }

    cambio() {
        if (this.input.endsWith(' ')) {
            this.input = this.input.substring(0, this.input.length - 1);
            const input = this.input; // hay que hacerlo asi sino jode la asincronia.
            if (
                this.products.filter((item: any) => item.sku == this.input)
                    .length > 0
            ) {
                this.products.filter(
                    (item: any) => item.sku == this.input
                )[0].cantidad += 1;
                this.total += parseInt(
                    this.products.filter(
                        (item: any) => item.sku == this.input
                    )[0].precio
                );
            } else {
                this.vendedoresService
                    .getItemSKU(this.input)
                    .subscribe((data: any) => {
                        data.cantidad = 1;
                        data.sku = input;
                        this.products.push(data);
                        this.total += parseInt(data.precio);
                    });
            }

            this.input = '';
        }
    }

    obtenerUrl(imagen: string): string {
        return environment.baseUrl + imagen;
    }

    eliminar(producto: any) {
        this.total -= producto.precio * producto.cantidad;
        this.products = this.products.filter(
            (item: any) => item.id != producto.id
        );
    }
}
