import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Lets only a signed-in admin into /admin; everyone else goes to the login page. */
export const adminGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isLoggedIn()) return true;
  return inject(Router).createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
};
