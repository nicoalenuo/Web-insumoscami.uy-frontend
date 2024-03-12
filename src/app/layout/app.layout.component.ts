import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent {
    constructor(public layoutService: LayoutService, public router: Router) {}

    cerrar_carrito(): void {
        this.layoutService.cerrar_carrito();
    }

    get containerClass() {
        return {
            'layout-mobile-active':
                this.layoutService.state.staticMenuMobileActive,
            'layout-loading': this.layoutService.state.loading,

            'layout-carrito': this.layoutService.state.mostrando_carrito,
        };
    }
}
