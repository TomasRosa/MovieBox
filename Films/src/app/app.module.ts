import { NgModule } from '@angular/core';
import { BrowserModule, platformBrowser } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilmsFromAPIService } from './services/films-from-api.service';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { AsideMenuComponent } from './components/aside-menu/aside-menu.component';
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { SharedServicesService } from './services/shared-services.service';
import { UserService } from './services/user.service';
import { InicioComponent } from './components/inicio/inicio.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BarraDeBusquedaComponent } from './components/barra-de-busqueda/barra-de-busqueda.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { InicioAuxComponent } from './components/inicio-aux/inicio-aux.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { PerfilComponent } from './components/perfil/perfil.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent,
    RegisterComponent,
    AsideMenuComponent,
    SobreNosotrosComponent,
    InicioComponent,
    TarjetaComponent,
    NavbarComponent,
    NotFoundComponent,
    BarraDeBusquedaComponent,
    CarritoComponent,
    BarraDeBusquedaComponent,
    InicioAuxComponent,
    OfertasComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [FilmsFromAPIService, SharedServicesService, SobreNosotrosComponent, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
