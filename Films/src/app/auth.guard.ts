import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const user = this.userService.getUserActual(); // Obtenemos el usuario actual del servicio
    const isAdmin = user?.role === 'admin'; // Verificamos si el usuario es un administrador

    // Rutas públicas que todos los usuarios pueden ver, sin importar su estado de login
    const publicRoutes = [
      '/inicio', '/sobre-nosotros', '/ofertas', '/not-found',
      '/film-detail', '/movies'
    ];

    // Rutas que solo pueden ver los usuarios logueados
    const loggedRoutes = [
      '/carrito', '/tarjeta', '/biblioteca', '/favourite-list'
    ];

    // Rutas que solo los administradores pueden ver
    const adminRoutes = [
      '/biblioteca/:userId', '/admin-code', '/showUsers',
      '/entregas-pendientes', '/entregas-pendientes/:id'
    ];

    // Rutas que solo los usuarios no logueados pueden ver (invitados)
    const guestRoutes = ['/login', '/registrarse', '/recuperar-contrasena'];

    // Ruta del perfil, solo accesible para usuarios logueados
    const profileRoute = ['/perfil'];

    const path = route.routeConfig?.path || ''; // Obtenemos la ruta actual

    return this.userService.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn: boolean | null) => {
        // Si isLoggedIn es null o false, significa que el usuario no está logueado
        const loggedInStatus = isLoggedIn !== null && isLoggedIn !== false;

        console.log(loggedInStatus);

        // Lógica de acceso para las rutas públicas: Accesibles para todos los usuarios
        if (publicRoutes.some(route => path.startsWith(route))) {
          return true; // Todos los usuarios pueden acceder a las rutas públicas
        }

        // Lógica de acceso para rutas de usuarios logueados
        if (loggedRoutes.some(route => path.startsWith(route))) {
          if (loggedInStatus) return true; // Solo los usuarios logueados pueden acceder
        }

        // Lógica de acceso para rutas de administradores
        if (adminRoutes.some(route => path.startsWith(route))) {
          if (isAdmin) return true; // Solo los administradores pueden acceder a estas rutas
        }

        // Lógica de acceso para rutas de usuarios no logueados (invitados)
        if (guestRoutes.some(route => path.startsWith(route))) {
          if (!loggedInStatus) return true; // Solo los usuarios no logueados pueden acceder
        }

        // Lógica de acceso para la ruta de perfil: Solo los usuarios logueados pueden acceder
        if (profileRoute.some(route => path.startsWith(route))) {
          if (loggedInStatus) return true; // Solo logueados pueden acceder al perfil
        }

        // Si no se cumple ninguna de las condiciones anteriores, redirigimos a la página de inicio
        this.router.navigate(['/inicio']);
        return false;
      })
    );
  }
}