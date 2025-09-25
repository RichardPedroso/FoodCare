import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { inject } from '@angular/core';

/**
 * Guard para proteger rotas que requerem autenticação.
 * Redireciona usuários não autenticados para login.
 */
export const authenticationGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authenticationService = inject(AuthenticationService);
  const isAuthenticated = authenticationService.isAuthenticated();

  if (isAuthenticated) {
    return true;
  }

  // Redireciona para página apropriada se não autenticado
  if (router.url === 'account/sign-up') {
    router.navigate(['account/sign-up'])
    return false;
  }
  router.navigate(['account/sign-in'])
  return false;
};
