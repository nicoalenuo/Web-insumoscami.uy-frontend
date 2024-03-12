import { Injectable } from '@angular/core';
import { ROLES } from './roles';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Messages } from '../Messages';

@Injectable({
    providedIn: 'root',
})
export class SesionService {
    private baseUrl: string = environment.baseUrl;

    constructor(
        private router: Router,
        private http: HttpClient,
        private Msgs: Messages
    ) {}

    public isLogged(): boolean {
        const expiry = localStorage.getItem('expiry');
        const token: string = localStorage.getItem('token');
        const tipoUsuario: string = localStorage.getItem('tipo_usuario');

        if (!expiry || !token || !tipoUsuario) {
            return false;
        }

        const fechaExpiry = new Date(expiry);
        const fechaActual = new Date();

        if (fechaExpiry < fechaActual) {
            return false;
        }

        return true;
    }

    public saveDataLogin(token: string, rolStr: string, expiry: string): void {
        localStorage.setItem('token', token);
        localStorage.setItem('expiry', expiry);
        localStorage.setItem('tipo_usuario', rolStr);
    }

    public removeDataLogin(): void {
        if (!!localStorage.getItem('expiry')) {
            localStorage.removeItem('token');
            localStorage.removeItem('expiry');
            localStorage.removeItem('tipo_usuario');
        }
    }

    public getRol(): ROLES {
        if (!this.isLogged()) {
            return ROLES.INVITADO;
        }

        return this.translateRolStrToRolEnum(
            localStorage.getItem('tipo_usuario')
        );
    }

    private translateRolStrToRolEnum(str: string): ROLES {
        let rol: ROLES = ROLES.INVITADO;
        switch (str) {
            case 'admin':
                rol = ROLES.ADMINISTRADOR
                break;
            default:
                rol = ROLES.INVITADO;
                break;
        }

        return rol;
    }

    public getToken(): string | undefined {
        const estaLoggeado = this.isLogged();
        if (!estaLoggeado) {
            const token = localStorage.getItem('token');
            this.removeDataLogin();
            if (!token) {
                return null;
            } else {
                this.Msgs.detenerCargaConMensajeSesionExpirada();
                this.router.navigate(['/sesion/login']);
            }
            return null;
        }

        return localStorage.getItem('token');
    }

    // ---------------------endopints----------------------------------------------

    logout(token: string) {
        const options = {
            headers: new HttpHeaders({ Authorization: `Token ${token}` }),
        };

        return this.http.post(this.baseUrl + '/auth/logout/', null, options);
    }
}
