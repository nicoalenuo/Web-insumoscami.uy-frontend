import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SesionService } from '../shared/auth/sesion.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SesionEndpointService {
    private readonly dirLogin: string = '/auth/login/';

    constructor(private http: HttpClient, private sesion: SesionService) {}

    login(email: string, password: string) {
        return this.http.post(environment.baseUrl + this.dirLogin, {
            email,
            password,
        });
    }
}
