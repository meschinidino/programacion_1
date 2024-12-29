import { CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRoles = route.data['expectedRole'];
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);

    return authService.getCurrentUser(userId).pipe(
        map(user => {
            console.log('Current User Role:', user?.role); // Para debugging
            console.log('Expected Roles:', expectedRoles); // Para debugging
            
            const hasAccess = Array.isArray(expectedRoles) 
                ? expectedRoles.includes(user?.role)
                : expectedRoles === user?.role;

            if (!hasAccess) {
                router.navigate(['/not-authorized']);
                return false;
            }
            return true;
        }),
        catchError((error) => {
            console.error('Error:', error);
            router.navigate(['/login']);
            return of(false);
        })
    );
};

export const canActivate = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRoles = route.data['expectedRole'];
    
    return authService.getCurrentUserRole().pipe(
        map(userRole => {
            const hasAccess = Array.isArray(expectedRoles) 
                ? expectedRoles.includes(userRole)
                : expectedRoles === userRole;
            return hasAccess;
        })
    );
};