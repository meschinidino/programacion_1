
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRole = route.data['expectedRole'];
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);

    return authService.getCurrentUser(userId).pipe(
        map(user => {
            console.log('Current User:', user); // Debugging line
            console.log('Expected Role:', expectedRole); // Debugging line
            if (!user || user.role !== expectedRole) {
                router.navigate(['not-authorized']);
                return false;
            }
            return true;
        }),
        catchError((error) => {
            console.error('Error fetching user:', error); // Debugging line
            router.navigate(['login']);
            return of(false);
        })
    );
};