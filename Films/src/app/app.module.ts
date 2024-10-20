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
import { SobreNosotrosComponent } from './components/sobre-nosotros/sobre-nosotros.component';
import { SharedServicesService } from './services/shared-services.service';
import { UserService } from './services/user.service';
import { InicioComponent } from './components/inicio/inicio.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { InicioAuxComponent } from './components/inicio-aux/inicio-aux.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { OfertasAuxComponent } from './components/ofertas-aux/ofertas-aux.component';
import { DetallesDelPerfilComponent } from './components/detalles-del-perfil/detalles-del-perfil.component';
import { EliminarCuentaComponent } from './components/eliminar-cuenta/eliminar-cuenta.component';
import { CambiarEmailComponent } from './components/cambiar-email/cambiar-email.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BibliotecaComponent } from './components/biblioteca/biblioteca.component';
import { AlternativeOptionsComponent } from './components/alternative-options/alternative-options/alternative-options.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { MovieListComponentsComponent } from './components/movie-list-components/movie-list-components.component';
import { FilmDetailComponent } from './components/film-detail/film-detail.component';
import { FavouriteListComponent } from './components/favourite-list/favourite-list.component';
import { TarjetaFormComponent } from './components/tarjeta-form/tarjeta-form/tarjeta-form.component';
import { AdminCodeComponent } from './components/admin-code/admin-code.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent,
    RegisterComponent,
    SobreNosotrosComponent,
    InicioComponent,
    TarjetaComponent,
    NavbarComponent,
    NotFoundComponent,
    CarritoComponent,
    InicioAuxComponent,
    OfertasComponent,
    OfertasAuxComponent,
    DetallesDelPerfilComponent,
    EliminarCuentaComponent,
    CambiarEmailComponent,
    CambiarPasswordComponent,
    PerfilComponent,
    BibliotecaComponent,
    AlternativeOptionsComponent,
    FooterComponent,
    MovieListComponentsComponent,
    FilmDetailComponent,
    FavouriteListComponent,
    TarjetaFormComponent,
    AdminCodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [FilmsFromAPIService, SharedServicesService, UserService, OfertasAuxComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
