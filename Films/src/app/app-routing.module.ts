import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';
import { FilmDetailComponent } from './components/film-detail/film-detail.component';
import { MovieListComponentsComponent } from './components/movie-list-components/movie-list-components.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { AdminCodeComponent } from './components/admin-code/admin-code.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { ShowUsersComponent } from './components/show-users/show-users.component';
import { EntregasPendientesComponent } from './components/entregas-pendientes/entregas-pendientes.component';
import { AuthGuard } from './auth.guard';
import { PagoDeudaComponent } from './components/pago-deuda/pago-deuda.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent }, // Ruta pública sin AuthGuard
  { path: 'sobre-nosotros', component: SobreNosotrosComponent }, // Ruta pública sin AuthGuard
  { path: 'login', component: LoginComponent }, // Ruta pública sin AuthGuard
  { path: 'registrarse', component: RegisterComponent }, // Ruta pública sin AuthGuard
  { path: 'ofertas', component: OfertasComponent }, // Ruta pública sin AuthGuard
  { path: 'not-found', component: NotFoundComponent }, // Ruta pública sin AuthGuard
  { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'tarjeta', component: TarjetaComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'biblioteca', component: BibliotecaComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'biblioteca/:userId', component: BibliotecaComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'film-detail/:rank', component: FilmDetailComponent }, // Ruta pública sin AuthGuard
  { path: 'favourite-list', component: FavouriteListComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }, // Redirección a la página de inicio
  { path: 'movies/:category', component: MovieListComponentsComponent }, // Ruta pública sin AuthGuard
  { path: 'admin-code', component: AdminCodeComponent}, // Ruta protegida por admin
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent }, // Ruta pública sin AuthGuard
  { path: 'showUsers', component: ShowUsersComponent, canActivate: [AuthGuard] }, // Ruta protegida por admin
  { path: 'entregas-pendientes', component: EntregasPendientesComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'entregas-pendientes/:id', component: EntregasPendientesComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'pago-deuda/:id', component: PagoDeudaComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: '**', component: NotFoundComponent } // Ruta para errores
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
