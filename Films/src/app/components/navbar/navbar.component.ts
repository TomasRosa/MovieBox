import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Film } from 'src/app/models/film';
import { CarritoService } from 'src/app/services/carrito.service';
import { FilmSearchServiceService } from 'src/app/services/film-search-service.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isFocused: boolean = false;
  isLoggedIn: boolean | null = false;

  buscadorDeFilm: string ='';
  films: Array<Film> = [];
  filmsFiltradasPorBusqueda = new Array<Film>();
  formControl = new FormControl()
  
  router: string = '';

  constructor(
    private routerService: Router, 
    private userService: UserService, private filmsFromAPIService: FilmsFromAPIService, 
    private filmSearchService: FilmSearchServiceService,
    private carritoService: CarritoService) {
    this.routerService.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router = event.url;
      }
    });
  }

  async ngOnInit(): Promise<void> {
    /* Obtenemos todas las movies para luego filtrar por lo que se busca y enviar un array de movies 
    filtradas al FilmSearchService*/
    try {
      const fetchedFilms = this.filmsFromAPIService.getMovies ();
      if (fetchedFilms) {
        this.films = fetchedFilms;
        console.log(fetchedFilms)
      } 
      else{
          console.log('Array de peliculas nulo');
      }
    }catch (error) {
        console.error(error);
    }

    this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.isLoggedIn = isLoggedIn; 
    })
    
    this.formControl.valueChanges.subscribe(query => {
      this.buscarFilm(query);
    });
  }

  signIn(){
    this.navegar('login')
  }

  signUp(){
    this.navegar('registrarse')
  }

  buscarFilm(query: string) {
    this.filmsFiltradasPorBusqueda = [];
    if (query && this.formControl.value != '') {
      this.filmsFiltradasPorBusqueda = this.films.filter((film) => {
        return film.title.toLowerCase().includes(query.toLowerCase());
      });
    } else {
      this.filmsFiltradasPorBusqueda = this.films; // Si no hay búsqueda, mostrar todas
    }
    console.log ('FILTRANDO PELICULAS EN BUSQUEDA');
    console.log (this.filmsFiltradasPorBusqueda);
    this.filmSearchService.updateFilteredFilms(this.filmsFiltradasPorBusqueda);
  }

  navegar(componente: string) {
    this.routerService.navigate([componente]);
  }

  navegarPerfil (){
    if (this.isLoggedIn)
      this.routerService.navigate (['/perfil'])
    else
      this.routerService.navigate (['/login'])
  }

  navegarCarrito() {
    if (this.isLoggedIn) {
      // El usuario está autenticado, puedes permitir que agregue películas al carrito
      this.routerService.navigate(['/carrito']);
    } else {
      // El usuario no está autenticado, muestra una alerta
      alert('Debe iniciar sesión para comprar películas.');
    }
  }
  
}
