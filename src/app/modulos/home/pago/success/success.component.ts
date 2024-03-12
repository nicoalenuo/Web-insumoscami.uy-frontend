import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComprasService } from 'src/app/services/compras.service';

@Component({
    selector: 'app-success',
    standalone: true,
    imports: [],
    templateUrl: './success.component.html',
    styleUrl: './success.component.scss',
})
export class SuccessComponent implements OnInit, OnDestroy {
    private paymentSubscription: Subscription;
    constructor(private comprasService: ComprasService) {}
    ngOnInit(): void {
        this.paymentSubscription = this.comprasService
            .payment_success(localStorage.getItem('pedido_id'))
            .subscribe(() => {});
    }
    ngOnDestroy(): void {
        if (this.paymentSubscription) {
            this.paymentSubscription.unsubscribe();
        }
    }
}
