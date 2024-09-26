// src/app/guards/role.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];
  const currentRole = userService.getRole();

  if (currentRole !== expectedRole) {
    // Redirect to a not authorized page or home
    router.navigate(['not-authorized']);
    return false;
  }
  return true;
};
