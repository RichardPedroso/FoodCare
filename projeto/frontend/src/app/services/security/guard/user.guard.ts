import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);

  const isAuthenticated = authenticationService.isAuthenticated();
  
  if (!isAuthenticated) {
    router.navigate(['account/sign-in']);
    return false;
  }

  const currentUser = authenticationService.getCurrentUser();
  
  if (currentUser && (currentUser.userType === 'admin' || currentUser.user_type === 'admin')) {
    router.navigate(['main/admin/dashboard']);
    return false;
  }

  return true;
};