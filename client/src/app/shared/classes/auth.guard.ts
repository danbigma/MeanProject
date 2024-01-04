import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> {
    if (this.auth.isAuthenticated()) {
      return of(true);
    } else {
      // Almacenar la URL intentada para futura redirección
      const url = state.url;
      this.router.navigate(['/login'], {
        queryParams: {
          accessDenied: true,
          redirectUrl: url // opcional, dependiendo de cómo manejes las redirecciones post-login
        },
      });
      return of(false);
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> {
    return this.canActivate(route, state);
  }
}
