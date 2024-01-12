import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { AuthguardServiceService } from './authguard-service.service';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const authenticationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,    ) => {

  const currentUser = inject(AuthguardServiceService).gettoken();

  // Redirects to another route
  const isAnonymous = !currentUser;
  if (isAnonymous) {
    return inject(Router).createUrlTree(["/", "auth"]);
  }
 

  const profilePageId = route.params["id"];

  // Grants or deny access to this route
  const attemptsToAccessItsOwnPage = currentUser !== profilePageId;
  return attemptsToAccessItsOwnPage;
};
