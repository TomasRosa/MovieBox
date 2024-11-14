import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './services/user.service';
import { Observable, of } from 'rxjs';
import { map, take, filter, switchMap, defaultIfEmpty } from 'rxjs/operators';
import { User } from './models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const path = route.routeConfig?.path || ''; // Obtener la ruta actual
    console.log("path de entrar a la suscripcion; " + path);
  
    return this.userService.isLoggedIn$.pipe(
      take(1),
      defaultIfEmpty(null),  // Si no emite ningún valor, emite 'null'
      filter((isLoggedIn): isLoggedIn is boolean => isLoggedIn !== null), // Filtramos el valor nulo
      switchMap((isLoggedIn: boolean) => {
        const loggedInStatus = isLoggedIn === true;
  
        // Verificación de rutas públicas
        const publicRoutes = ['/inicio', '/sobre-nosotros', '/ofertas', '/not-found', '/film-detail', '/movies'];
  
        // Verificación de rutas protegidas para usuarios logueados
        const loggedRoutes = ['/carrito', '/tarjeta', '/biblioteca', '/favourite-list','perfil'];
  
        // Verificación de rutas para administradores
        const adminRoutes = ['/admin-code', '/showUsers', '/entregas-pendientes'];
  
        // Verificación de rutas para usuarios no logueados
        const guestRoutes = ['/login', '/registrarse', '/recuperar-contrasena'];
  
        // Si la ruta está en las rutas públicas, no se requiere autenticación
        if (publicRoutes.some(route => path.startsWith(route))) {
          return of(true); // Devolver 'true' directamente
        }
  
        // Si la ruta requiere estar logueado y el usuario no está logueado
        if (loggedRoutes.some(route => path.startsWith(route))) {
          if (loggedInStatus) {
            return of(true); // Devolver 'true' directamente
          }
          this.router.navigate(['/inicio']);
          return of(false); // Devolver 'false' directamente
        }
  
        // Si la ruta requiere ser admin y el usuario es admin
        const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path; // Eliminar barra final si existe
        const pathWithSlash = `/${cleanPath}`; // Asegúrate de que haya una barra al principio

        console.log("Ruta limpia con barra:", pathWithSlash);
        if (adminRoutes.includes(pathWithSlash)) {
          return this.userService.usuarioActual$.pipe(
            take(1),
            defaultIfEmpty(null), // Si no hay elementos, emite null
            map((usuario: User | null) => {
              if (usuario && usuario.role === 'admin') {
                console.log("ENTREE");
                return true; // Devolver 'true' directamente
              } else {
                console.log("No tienes permisos de administrador");
                this.router.navigate(['/inicio']);
                return false; // Devolver 'false' directamente
              }
            })
          );
        } else {
          console.log("NO ENTRO ADMIN ROUTES");
        }
  
        // Si la ruta requiere ser un invitado (usuario no logueado)
        if (guestRoutes.some(route => path.startsWith(route))) {
          if (!loggedInStatus) {
            return of(true); // Devolver 'true' directamente
          }
          this.router.navigate(['/inicio']);
          return of(false); // Devolver 'false' directamente
        }
  
        // Si no se cumple ninguna de las condiciones anteriores, redirigimos a inicio
        this.router.navigate(['/inicio']);
        return of(false); // Devolver 'false' directamente
      })
    );
  }
}
