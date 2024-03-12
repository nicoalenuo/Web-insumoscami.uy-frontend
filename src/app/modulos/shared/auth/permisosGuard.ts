import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { SesionService } from './sesion.service';
import { inject } from '@angular/core';
import { ROLES } from './roles';

export function isAuthenticatedAndRol(rolesAllow: ROLES[]): CanActivateFn {
    return (aRoute: ActivatedRouteSnapshot, rState: RouterStateSnapshot) => {
        const sesionService: SesionService = inject(SesionService);
        const route: Router = inject(Router);

        const fullUrl: string = rState.url;

        if (!sesionService.isLogged()) {
            route.navigate(['/sesion/login'], {
                queryParams: { redirectTo: fullUrl },
            });
            return false;
        }

        const permitidoPaso: boolean =
            sesionService.isLogged() &&
            rolesAllow.includes(sesionService.getRol());

        if (!permitidoPaso) {
            route.navigate(['/']);
        }

        return permitidoPaso;
    };
}

export function isNotAuthenticated(): CanActivateFn {
    return () => {
        const sesionService = inject(SesionService);
        const route: Router = inject(Router);

        if (sesionService.isLogged()) {
            route.navigate(['/']);
            return false;
        }
        return true;
    };
}
