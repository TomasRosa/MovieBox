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
import { Permisos } from './permisos.guard';
import { VerificarContenidoCarrito } from './verificar-contenido-carrito.guard';
import { FilmDetailComponent } from './components/film-detail/film-detail.component';
import { MovieListComponentsComponent } from './components/movie-list-components/movie-list-components.component';

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
  { path: 'film-detail/:rank', component: FilmDetailComponent},
  { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  { path: 'movies/:category', component: MovieListComponentsComponent },
  { path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
