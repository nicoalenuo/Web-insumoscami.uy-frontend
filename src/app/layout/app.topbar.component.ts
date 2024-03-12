import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { SesionService } from '../modulos/shared/auth/sesion.service';
import { ComprasService } from '../services/compras.service';
import { Subscription } from 'rxjs';
import { Messages } from '../modulos/shared/Messages';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
    private sesionService: SesionService = inject(SesionService);
    private comprasService: ComprasService = inject(ComprasService);
    private layoutService: LayoutService = inject(LayoutService);
    private Msgs: Messages = inject(Messages);

    protected actual_colorScheme: string = localStorage.getItem('colorScheme');

    protected model: {
        label: string;
        routerLink: string;
        items: { label: string; routerLink: string }[];
    }[];

    protected isLogged!: boolean;

    @ViewChild('expandable') expandable!: ElementRef;

    protected cantidadCarrito: number = 0;
    private cantidadSubscription: Subscription;

    constructor() {
        this.isLogged = this.sesionService.isLogged();
    }

    protected shown: boolean[] = [false, false, false, false, false];
    protected heightValues: string[] = [
        '30rem',
        '19rem',
        '23rem',
        '12rem',
        '5rem',
    ]; //actualizar estos valores si se agregan categorias o subcategorias, perdon a la persona que tenga que entender este codigo

    protected expandido: boolean = false; //para celulares
    protected showing: boolean = false;

    expandir(i: number): void {
        this.expandable.nativeElement.style.height = this.heightValues[i];
        this.layoutService.state.staticMenuMobileActive = true;
    }

    contraer_sin_timeout(): void {
        this.expandido = false;
        this.showing = false;
        this.expandable.nativeElement.style.height = '5rem';
        this.layoutService.state.staticMenuMobileActive = false;

        for (let i = 0; i < this.shown.length; i++) {
            this.shown[i] = false;
        }

        this.layoutService.unblockBodyScroll();
    }

    show(i: number): void {
        this.showing = true;
        this.shown[i] = true;
    }

    close(i: number): void {
        this.showing = false;
        this.shown[i] = false;
    }

    toggle_contraido(): void {
        //Celulares
        if (!this.expandido) {
            this.expandido = true;
            this.expandable.nativeElement.style.height = '100vh';
            this.layoutService.blockBodyScroll();
        } else {
            this.expandido = false;
            this.showing = false;
            for (let i = 0; i < this.shown.length; i++) {
                this.shown[i] = false;
            }
            this.expandable.nativeElement.style.height = '5rem';
            this.layoutService.unblockBodyScroll();
        }
    }

    abrir_carrito(): void {
        this.layoutService.abrir_carrito();
    }

    ngOnInit(): void {
        this.cantidadSubscription =
            this.comprasService.cantidadEnCarrito$.subscribe((cantidad) => {
                this.cantidadCarrito = cantidad;
            });

        window.addEventListener('storage', (event) => {
            if (event.key === 'cantidadEnCarrito') {
                this.cantidadCarrito = Number(
                    localStorage.getItem('cantidadEnCarrito')
                );
            }
        });

        this.model = [
            {
                label: 'REPOSTERÍA',
                routerLink: 'Reposteria',
                items: [
                    {
                        label: 'Herramientas',
                        routerLink: 'Herramientas',
                    },
                    {
                        label: 'Elaboración',
                        routerLink: 'Elaboracion',
                    },

                    {
                        label: 'Sprinkles',
                        routerLink: 'Sprinkles',
                    },
                    {
                        label: 'Moldes acetato y silicona',
                        routerLink: 'Moldes acetato y silicona',
                    },
                    {
                        label: 'Asaderas',
                        routerLink: 'Asaderas',
                    },
                    {
                        label: 'Láminas y cake toppers',
                        routerLink: 'Laminas y cake toppers',
                    },
                    {
                        label: 'Productos sin gluten',
                        routerLink: 'Productos sin gluten',
                    },
                ],
            },
            {
                label: 'DESCARTABLES',
                routerLink: 'Descartables',
                items: [
                    {
                        label: 'Cajas',
                        routerLink: 'Cajas',
                    },

                    {
                        label: 'Envases plásticos',
                        routerLink: 'Envases plasticos',
                    },

                    {
                        label: 'Envases cartón',
                        routerLink: 'Envases carton',
                    },
                    {
                        label: 'Envases espuma',
                        routerLink: 'Envases espuma',
                    },
                ],
            },
            {
                label: 'COTILLÓN',
                routerLink: 'Cotillon',
                items: [
                    {
                        label: 'Globos',
                        routerLink: 'Globos',
                    },
                    {
                        label: 'Sorpresitas',
                        routerLink: 'Sorpresitas',
                    },
                    {
                        label: 'Temáticos',
                        routerLink: 'Tematicos',
                    },
                    {
                        label: 'Velas',
                        routerLink: 'Velas',
                    },
                    {
                        label: 'Otros',
                        routerLink: 'Otros',
                    },
                ],
            },
            {
                label: 'PERSONALIZADOS',
                routerLink: 'Personalizados',
                items: [
                    {
                        label: 'Cumpleaños',
                        routerLink: 'Cumpleaños',
                    },
                    {
                        label: 'Regalos',
                        routerLink: 'Regalos',
                    },
                ],
            },
            {
                label: 'GOLOSINAS',
                routerLink: 'Golosinas',
                items: [],
            },
        ];
    }

    protected logout(): void {
        const tok: string = this.sesionService.getToken();
        if (tok !== null) {
            this.sesionService.logout(tok).subscribe({
                next: () => {
                    this.sesionService.removeDataLogin();
                    window.location.href = '';
                },
                error: (error) => {
                    if (error.error.detail === 'Invalid token.') {
                        this.sesionService.removeDataLogin();
                        window.location.href = '';
                    } else {
                        this.Msgs.detenerCargaConErrorGenerico();
                    }
                },
            });
        } else {
            this.sesionService.removeDataLogin();
            window.location.href = '';
        }
    }

    protected change_colorScheme(): void {
        if (this.actual_colorScheme === 'light') {
            this.actual_colorScheme = 'dark';
            localStorage.setItem('colorScheme', 'dark');
            this.layoutService.changeColorScheme('dark');
        } else {
            this.actual_colorScheme = 'light';
            localStorage.setItem('colorScheme', 'light');
            this.layoutService.changeColorScheme('light');
        }
    }

    ngOnDestroy(): void {
        if (this.cantidadSubscription) {
            this.cantidadSubscription.unsubscribe();
        }
    }
}
