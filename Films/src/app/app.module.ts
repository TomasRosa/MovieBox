import { NgModule } from '@angular/core';
import { BrowserModule, platformBrowser } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
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
import { InicioComponent } from './components/inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent,
    RegisterComponent,
    AsideMenuComponent,
    SobreNosotrosComponent,
    InicioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [FilmsFromAPIService, SharedServicesService, SobreNosotrosComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
