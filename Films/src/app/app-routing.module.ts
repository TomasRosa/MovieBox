import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { InicioComponent } from './components/inicio/inicio.component';

const routes: Routes = [
  {path: 'inicio', component:InicioComponent},
  {path: 'sobre-nosotros', component: SobreNosotrosComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
