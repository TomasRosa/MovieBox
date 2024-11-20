import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Film } from 'src/app/models/film';
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

  private precios: number[] = [
    150,200,300,450,250,180,280,900,350,500,1200,700,550,950,1100,1300,800,275,
    600,170,2100,400,750,1000,1700,1600,3000,2200,160,210,1150,700,1750,900,2000,130,1450,2500,1350,190,
    2800,1600,600,1100,1250,850,230,200,125,350,550,900,675,2400,1450,800,1800,
    1900,100,700,750,850,275,1150,2350,2750,475,1500,1000, 2000,800,1300,
  ];

  constructor(
    private routerService: Router, 
    private userService: UserService, 
    private filmsFromAPIService: FilmsFromAPIService, 
    private filmSearchService: FilmSearchServiceService,
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
      let fetchedFilms = this.filmsFromAPIService.getMovies ();
      if (fetchedFilms)   
        this.films = fetchedFilms;
      else
          console.log('Array de peliculas nulo');
    } catch (error) {
      console.error(error);
    }

    this.userService.isLoggedIn$.subscribe((isLoggedIn: boolean | null) => {
      this.isLoggedIn = isLoggedIn || false;
      if (this.isLoggedIn){
        if (this.userService.getAdminFromStorage ()){
          this.isAdmin = true;
          this.adminService.isLoggedInSubject.next (true);
        }else
        {
          this.isAdmin = false
          this.adminService.isLoggedInSubject.next (false);
        }
      }
    });

    this.formControl.valueChanges.subscribe(query => {
      this.buscarFilm(query);
    });
  }

  getadminCodeVerified(): boolean {
    return this.sharedService.getadminCodeVerified();
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
    if (this.isLoggedIn) {
      this.routerService.navigate(['/carrito']);
    } else {
      alert('Los administradores no tienen acceso al carrito.');
    }
  }
}


