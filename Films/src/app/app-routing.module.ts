import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
/* import { CanActivate } from '@angular/router';
import { AuthGuard } from './auth.guard';  */

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registrarse', component: RegisterComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'carrito', component: CarritoComponent,  /* canActivate: [AuthGuard] */ },
  { path: '', redirectTo: '/inicio', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
