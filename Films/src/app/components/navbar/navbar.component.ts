import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Film } from 'src/app/models/film';
import { CarritoService } from 'src/app/services/carrito.service';
import { FilmSearchServiceService } from 'src/app/services/film-search-service.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/services/admin.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isFocused: boolean = false;
  isAdmin: boolean = false;
  isLoggedIn: boolean | null;
  adminCodeVerified: boolean = false;

  showNoResults: boolean = false;
  buscadorDeFilm: string = '';
  films: Array<Film> = [];
  filmsFiltradasPorBusqueda = new Array<Film>();
  formControl = new FormControl();
  
  router: string = '';

  constructor(
    private routerService: Router, 
    private userService: UserService, private filmsFromAPIService: FilmsFromAPIService, 
    private filmSearchService: FilmSearchServiceService,
    private carritoService: CarritoService,
    private sharedService: SharedServicesService,
    private adminService: AdminService
  ) {
    this.routerService.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router = event.url;
      }
    });

    this.isLoggedIn = false
  }

  async ngOnInit(): Promise<void> {
    try {
      const fetchedFilms = this.filmsFromAPIService.getMovies ();
      if (fetchedFilms) {
        this.films = fetchedFilms;
        console.log(fetchedFilms)
      } 
      else{
          console.log('Array de peliculas nulo');
      }
    } catch (error) {
      console.error(error);
    }

    this.sharedService.isLoggedIn$.subscribe((isLoggedIn: boolean | null) => {
      this.isLoggedIn = isLoggedIn || false;
    });

    this.adminService.isLoggedIn$.subscribe((isAdminLoggedIn: boolean | null) => {
      this.isAdmin = isAdminLoggedIn || false;
    });
    
    this.formControl.valueChanges.subscribe(query => {
      this.buscarFilm(query);
    });
  }

  getadminCodeVerified(): boolean {
    return this.sharedService.getadminCodeVerified();
  }

  getIsLoggedIn(): boolean | null{
    this.sharedService.isLoggedIn$.subscribe((isLoggedIn: boolean | null) => {
      this.isLoggedIn = isLoggedIn || false;
    });
    return this.isLoggedIn;
  }

  signIn() {
    this.navegar('login');
  }

  signUp() {
    this.navegar('registrarse');
  }

  buscarFilm(query: string) {
    this.filmsFiltradasPorBusqueda = [];
    this.showNoResults = true;
    if (query && this.formControl.value != '') {
      this.filmsFiltradasPorBusqueda = this.films.filter((film) => {
        return film.title.toLowerCase().includes(query.toLowerCase());
      });
    } else {
      this.filmsFiltradasPorBusqueda = new Array ();
      this.showNoResults = false;
    }
    this.filmSearchService.updateFilteredFilms(this.filmsFiltradasPorBusqueda);
  }

  navegar(componente: string) {
    this.routerService.navigate([componente]);
  }

  navegarFilmDetail(id: number) {
    this.filmsFiltradasPorBusqueda = new Array ();
    this.showNoResults = false;
    this.formControl.setValue('');
    this.sharedService.navegarFilmDetail (id);
  }

  navegarPerfil() {
    if (this.isLoggedIn)
      this.routerService.navigate(['/perfil']);
    else
      this.routerService.navigate(['/login']);
  }

  navegarCarrito() {
    if (this.isLoggedIn && !this.isAdmin) {
      this.routerService.navigate(['/carrito']);
    } else {
      alert('Los administradores no tienen acceso al carrito.');
    }
  }
}


