import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Injectable({
    providedIn: 'root',
})
export class Messages {
    constructor(
        private messageService: MessageService,
        private layoutService: LayoutService
    ) {}

    msgAgregadoAlCarrito() {
        this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Correcto',
            detail: 'El producto se ha agregado al carrito',
        });
    }

    iniciarCarga() {
        this.messageService.clear();
        this.layoutService.state.loading = true;
        this.messageService.add({
            key: 'bc',
            severity: 'info',
            summary: 'Cargando',
            sticky: true,
        });
    }

    detenerCarga() {
        this.layoutService.state.loading = false;
        this.messageService.clear();
    }

    detenerCargaConCorrectoGenerico() {
        this.layoutService.state.loading = false;
        this.messageService.clear();

        this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: 'Correcto',
        });
    }

    detenerCargaConCorrectoTexto(titulo: string, subtitulo: string) {
        this.layoutService.state.loading = false;
        this.messageService.clear();

        this.messageService.add({
            key: 'bc',
            severity: 'success',
            summary: titulo,
            detail: subtitulo,
            life: 7000
        });
    }

    detenerCargaConErrorTexto(titulo: string, subtitulo: string) {
        this.layoutService.state.loading = false;
        this.messageService.clear();
        this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: titulo,
            detail: subtitulo,
            sticky: true,
        });
    }

    detenerCargaConErrorGenerico() {
        this.layoutService.state.loading = false;
        this.messageService.clear();
        this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error, por favor, intentelo de nuevo más tarde',
            sticky: true,
        });
    }

    detenerCargaConMensajeSesionExpirada() {
        this.layoutService.state.loading = false;
        this.messageService.clear();
        this.messageService.add({
            key: 'bc',
            severity: 'warn',
            summary: 'Error',
            detail: 'Tu sesión ha expirado, por favor, ingresa nuevamente',
            sticky: true,
        });
    }
}
