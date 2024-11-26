import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilmsFromAPIService } from './services/films-from-api.service';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedServicesService } from './services/shared-services.service';
import { UserService } from './services/user.service';
import { InicioComponent } from './components/inicio/inicio.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';
import { AlternativeOptionsComponent } from './components/alternative-options/alternative-options/alternative-options.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { MovieListComponentsComponent } from './components/movie-list-components/movie-list-components.component';
import { FilmDetailComponent } from './components/film-detail/film-detail.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { TarjetaFormComponent } from './components/tarjeta-form/tarjeta-form/tarjeta-form.component';
import { AdminCodeComponent } from './components/admin-code/admin-code.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { ShowUsersComponent } from './components/show-users/show-users.component';
import { EntregasPendientesComponent } from './components/entregas-pendientes/entregas-pendientes.component';
import { PagoDeudaComponent } from './components/pago-deuda/pago-deuda.component';
@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent,
    RegisterComponent,
    InicioComponent,
    TarjetaComponent,
    NavbarComponent,
    NotFoundComponent,
    CarritoComponent,
    OfertasComponent,
    PerfilComponent,
    BibliotecaComponent,
    AlternativeOptionsComponent,
    FooterComponent,
    MovieListComponentsComponent,
    FilmDetailComponent,
    FavouriteListComponent,
    TarjetaFormComponent,
    AdminCodeComponent,
    RecuperarContrasenaComponent,
    ShowUsersComponent,
    EntregasPendientesComponent,
    PagoDeudaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [FilmsFromAPIService, SharedServicesService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
