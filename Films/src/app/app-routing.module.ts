import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { AventuraComponent } from './components/categorias/aventura/aventura.component';
import { AccionComponent } from './components/categorias/accion/accion.component';
import { FantasiaComponent } from './components/categorias/fantasia/fantasia.component';
import { DramaComponent } from './components/categorias/drama/drama.component';
import { ComediaComponent } from './components/categorias/comedia/comedia.component';
import { FamiliarComponent } from './components/categorias/familiar/familiar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';
import { Permisos } from './permisos.guard';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrarse', component: RegisterComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'carrito', component: CarritoComponent,  canActivate: [Permisos] },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'aventura', component: AventuraComponent },
  { path: 'accion', component: AccionComponent },
  { path: 'fantasia', component: FantasiaComponent },
  { path: 'drama', component: DramaComponent },
  { path: 'comedia', component: ComediaComponent },
  { path: 'familiar', component: FamiliarComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [Permisos]  },
  { path: 'tarjeta', component: TarjetaComponent, canActivate: [Permisos]  },
  { path: 'biblioteca', component: BibliotecaComponent, canActivate: [Permisos]  },
  { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
