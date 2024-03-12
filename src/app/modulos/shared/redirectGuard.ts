import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const redirectGuard: CanActivateFn = (route) => {
    const router: Router = inject(Router);

    const redirect = route.queryParams['redirectToPage'];

    if (!!redirect) {
        router.navigate([redirect], {
            queryParams: {
                yourParamName: null,
                youCanRemoveMultiple: null,
            },
            queryParamsHandling: 'merge',
        });
    }

    return true;
};
