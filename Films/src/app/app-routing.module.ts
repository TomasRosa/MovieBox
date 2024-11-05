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

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrarse', component: RegisterComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'carrito', component: CarritoComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'tarjeta', component: TarjetaComponent},
  { path: 'biblioteca', component: BibliotecaComponent},
  { path: 'biblioteca/:userId', component: BibliotecaComponent },
  { path: 'film-detail/:rank', component: FilmDetailComponent},
  { path: 'favourite-list', component: FavouriteListComponent},
  { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  { path: 'movies/:category', component: MovieListComponentsComponent },
  { path: 'admin-code', component: AdminCodeComponent},
  { path: 'recuperar-contrasena',component:RecuperarContrasenaComponent},
  { path: 'showUsers',component:ShowUsersComponent},
  { path: 'entregas-pendientes',component:EntregasPendientesComponent},
  { path: 'entregas-pendientes/:id',component:EntregasPendientesComponent},
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
