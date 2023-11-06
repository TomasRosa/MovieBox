import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service'; // Asegúrate de que la importación sea correcta y tenga la ubicación correcta

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn) {
      return true; // El usuario está autenticado, permite el acceso a la página
    } else {
      this.router.navigate(['/login']); // El usuario no está autenticado, redirige a la página de inicio de sesión
      return false;
    }
  }
}

