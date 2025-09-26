import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { inject } from '@angular/core';

/**
 * Guard para proteger rotas de usuários comuns.
 * Redireciona administradores para dashboard admin e não autenticados para login.
 */
export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);

  const isAuthenticated = authenticationService.isAuthenticated();
  
  if (!isAuthenticated) {
    router.navigate(['account/sign-in']);
    return false;
  }

  const currentUser = authenticationService.getCurrentUser();
  
  // Redireciona admins para dashboard administrativo
  if (currentUser && currentUser.userType === 'admin') {
    router.navigate(['main/admin/dashboard']);
    return false;
  }

  return true;
};