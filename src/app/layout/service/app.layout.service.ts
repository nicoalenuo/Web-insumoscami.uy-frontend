import { Injectable } from '@angular/core';

interface LayoutState {
    staticMenuMobileActive: boolean;
    mostrando_carrito: boolean;
    loading: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    public state: LayoutState = {
        staticMenuMobileActive: false,
        mostrando_carrito: false,
        loading: false,
    };

    constructor() {
        const preSelected_colorScheme: string =
            localStorage.getItem('colorScheme');

        if (preSelected_colorScheme) {
            this.changeColorScheme(preSelected_colorScheme);
        }
    }

    public changeColorScheme(scheme: string): void {
        this.replaceThemeLink('/assets/styles/scheme_' + scheme + '.css');
    }

    private replaceThemeLink(href: string): void {
        const id = 'scheme-css';
        let themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(
            cloneLinkElement,
            themeLink.nextSibling
        );
        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
        });
    }

    public blockBodyScroll(): void {
        document.body.style.overflow = 'hidden';
    }

    public unblockBodyScroll(): void {
        document.body.style.overflow = '';
    }

    public abrir_carrito(): void {
        this.state.mostrando_carrito = true;
        this.blockBodyScroll();
    }

    public cerrar_carrito(): void {
        this.state.mostrando_carrito = false;
        this.unblockBodyScroll();
    }
}
