import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { FilmSearchServiceService } from 'src/app/services/film-search-service.service';
import { UserService } from 'src/app/services/user.service';
import { FavouriteList } from 'src/app/models/f-list';
import { User } from 'src/app/models/user';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-inicio-aux',
  templateUrl: './inicio-aux.component.html',
  styleUrls: ['./inicio-aux.component.css']
})

export class InicioAuxComponent implements OnInit {
  films: any;
  usuarioActual: User = new User();
  preciosGenerados: boolean = false;
  filteredFilms: any[] = [];
  favouriteFilms: Array<Film> = [];  // Inicialización como arreglo vacío
  searchFilms: Film[] = [];
  isLoggedIn: Boolean | null = false;
  isAdmin: Boolean | null = false;

  constructor(
    private dataFilms: FilmsFromAPIService, 
    private sharedService: SharedServicesService, 
    private Flist: FavouriteListService,
    private filmSearchService: FilmSearchServiceService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    if (this.userService.getAdminFromStorage ()){
      this.isAdmin = true;
    }

    this.dataFilms.movies$.subscribe (m => {
      this.films = m;
      this.filteredFilms = this.films.filter((film: Film) => film.precio <= 1500);
    })

    if (this.isLoggedIn && !this.isAdmin) {
      this.userService.usuarioActual$.subscribe(async user => {
        this.usuarioActual = user as User;
        if (this.usuarioActual)
        {
          if (this.usuarioActual.fav_list)
            {
              this.favouriteFilms = this.usuarioActual.fav_list.arrayPeliculas || [];  // Asegurarse de que sea un arreglo
            }
            this.Flist.loadFavouriteListFromServer(this.usuarioActual.id);
        }
      });
    }

    this.Flist.getChangesObservable().subscribe(() => {
      this.favouriteFilms = [...this.Flist.listaFav.arrayPeliculas];
    });

    this.filmSearchService.filteredFilms$.subscribe(films => {
      this.searchFilms = films;
    });
  }

  // Verifica que favouriteFilms no sea undefined antes de intentar acceder a 'some'
  isFavourite(film: Film): boolean {
    if (!this.favouriteFilms) {
      return false; // Si favouriteFilms no está definido, devuelve false
    }
    return this.favouriteFilms.some((favFilm) => favFilm.id === film.id);
  }

  async toggleFavourite(film: Film) {
    if (!this.isLoggedIn){
      alert ('Debes iniciar sesion para agregar a favoritos una pelicula');
      return;
    }
    if (this.isFavourite(film)) {
      await this.Flist.eliminarDeLaListaFavoritos(film);  // Quitar de favoritos
    } else {
      await this.Flist.agregarALaLista(film); // Agregar a favoritos
    }
    this.Flist.loadFavouriteListFromServer(this.usuarioActual.id);
  }

  agregarPeliculaAlCarrito(film: Film) {
    if (this.isLoggedIn)
      this.sharedService.agregarPeliculaAlCarrito(film);
    else
      alert ('Debes iniciar sesion para agregar al carrito.')
  }

  navegarFilmDetail(id: number) {
    this.sharedService.navegarFilmDetail(id);
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }

  isFilled: boolean = false;

  onMouseEnter() {
    this.isFilled = true;
  }

  onMouseLeave() {
    this.isFilled = false;
  }

  changeButtonStar() {
    const boton = document.getElementById("buttonStar");
    if (boton) {
      boton.textContent = "★";
      this.isFilled = true;
    }
  }

  agregarALaListaDeFavoritos(film: Film) {
    this.Flist.agregarALaLista(film);
  }

  navegarFavouriteList() {
    this.sharedService.navegarFavouriteList();
  }
}