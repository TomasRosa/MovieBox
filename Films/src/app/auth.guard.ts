import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './services/user.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AdminService } from './services/admin.service';
import { CarritoService } from './services/carrito.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private adminService: AdminService, private carritoService: CarritoService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const user = this.userService.getUserActual(); // Obtenemos el usuario actual del servicio
    let isAdminLoggedIn = this.userService.getAdminActual();
    let hadCarrito = false;
    if (!isAdminLoggedIn)
    {
      isAdminLoggedIn = this.adminService.getAdminActual()
    }
    if (user)
    {   
      let userCarrito = this.carritoService.loadCarritoFromStorage (user.id)

      if (userCarrito.length > 0)
      {
        hadCarrito = true;
      }
      else
      {
        hadCarrito = false;
      }
    }
    
    // Rutas públicas que todos los usuarios pueden ver, sin importar su estado de login
    const publicRoutes = [
      'inicio', 
      'ofertas', 
      'not-found',
      'film-detail', 
      'movies'
    ];

    // Rutas que solo pueden ver los usuarios logueados
    const loggedRoutes = [
      'carrito', 
      'tarjeta', 
      'biblioteca', 
      'favourite-list'
    ];

    // Rutas que solo los administradores pueden ver
    const adminRoutes = [
      'biblioteca/:id',
      'admin-code', 
      'showUsers',
      'entregas-pendientes',
      'pago-deuda/:id',
      'admin-code'
    ];

    // Rutas que solo los usuarios no logueados pueden ver (invitados)
    const guestRoutes = ['login', 'registrarse', 'recuperar-contrasena'];

    // Ruta del perfil, solo accesible para usuarios logueados
    const profileRoute = ['perfil'];

    const path = route.routeConfig?.path || ''; // Obtenemos la ruta actual
    // console.log ("PATH: ", path)

    return this.userService.isLoggedIn$.pipe(
      take(1),
      map((isLoggedIn: boolean | null) => {
        // Si isLoggedIn es null o false, significa que el usuario no está logueado
        const loggedInStatus = isLoggedIn !== null && isLoggedIn !== false;

        // console.log('Ruta actual:', path);
        // console.log('Estado de loggedInStatus:', loggedInStatus);

        // Lógica de acceso para las rutas públicas: Accesibles para todos los usuarios
        if (publicRoutes.some(route => path.startsWith(route))) {
          return true; // Devolver 'true' directamente
        }

         // Acceso a la biblioteca de un usuario específico por parte de un admin
         if (path.startsWith('biblioteca/') && isAdminLoggedIn) {
          console.log('Acceso concedido al administrador para ver la biblioteca de un usuario');
          return true;
        }

        // Bloquear acceso de administradores a la biblioteca sin un ID de usuario
        if (path === 'biblioteca' && isAdminLoggedIn) {
          console.log('Acceso denegado al administrador para ver la biblioteca de un usuario');
          this.router.navigate(['/inicio']);
          return false;
        }

         // Acceso para usuarios regulares a su propia biblioteca
         if (path === 'biblioteca' && loggedInStatus && !isAdminLoggedIn) {
          return true;
        }
        
        if (path === 'admin-code' && loggedInStatus)
        {
          console.log("Un usuario logueado no puede entrar a admin-code");
          this.router.navigate(['/inicio']);
          return false;
        }

        if (path === 'tarjeta' && hadCarrito == false)
        {
          console.log("Un usuario sin carrito no puede ir a compra");
          this.router.navigate(['/inicio']);
          return false;
        }

         // Bloquear acceso de administradores a rutas exclusivas de usuarios
        if (loggedRoutes.some(route => path.startsWith(route)) && isAdminLoggedIn) {
          this.router.navigate(['/inicio']);
          return false;
        }

        // Lógica de acceso para rutas de usuarios logueados
        if (loggedRoutes.some(route => path.startsWith(route))) {
          if (loggedInStatus) return true; // Solo los usuarios logueados pueden acceder
        }

        // Lógica de acceso para rutas de administradores
        if (adminRoutes.some(route => path.startsWith(route.replace(':id', '')))) {
          if (isAdminLoggedIn) return true;
        }
        
        // Lógica de acceso para rutas de usuarios no logueados (invitados)
        if (guestRoutes.some(route => path.startsWith(route))) {
          if (!loggedInStatus) return true; // Solo los usuarios no logueados pueden acceder
        }

        // Lógica de acceso para la ruta de perfil: Solo los usuarios logueados pueden acceder
        if (profileRoute.some(route => path.startsWith(route))) {
          if (loggedInStatus) return true; // Solo logueados pueden acceder al perfil
        }
        console.log('Redireccionando a inicio, no se cumplen las condiciones de acceso');
        // Si no se cumple ninguna de las condiciones anteriores, redirigimos a la página de inicio
        this.router.navigate(['/inicio']);
        return false; // Devolver 'false' directamente
      })
    );
  }
}
