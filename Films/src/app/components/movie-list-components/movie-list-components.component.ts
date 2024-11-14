import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FilmsFromAPIService } from "src/app/services/films-from-api.service";
import { Film } from "src/app/models/film";
import { SharedServicesService } from "src/app/services/shared-services.service";
import { FavouriteListService } from "src/app/services/favourite-list.service";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-movie-list-components",
  templateUrl: "./movie-list-components.component.html",
  styleUrls: ["./movie-list-components.component.css"],
})
export class MovieListComponentsComponent {
  @Input() category: string = '';
  films: Film[] = this.filmsService.getMovies();
  filteredFilms: Film[] = [];
  favouriteFilms: Array<Film> = []; // Aseguramos que siempre sea un arreglo
  usuarioActual: User = new User();
  isLoggedIn: Boolean | null = false;

  constructor(
    private filmsService: FilmsFromAPIService, 
    private route: ActivatedRoute, 
    private sharedService: SharedServicesService,
    private Flist: FavouriteListService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.filmsService.initializeData().then(() => {
      this.route.paramMap.subscribe((params) => {
        this.category = params.get('category') || '';
        this.films = this.filmsService.getMovies(); // Obtén todas las películas
        this.filteredFilms = this.films.filter((film) => film.genre.includes(this.category)); // Filtra las películas por categoría
      });
    });

    if (this.isLoggedIn) {
      this.userService.usuarioActual$.subscribe((user) => {
        this.usuarioActual = user as User;
      
        // Verificar que usuarioActual y fav_list existan
        if (this.usuarioActual && this.usuarioActual.fav_list) {
          this.favouriteFilms = this.usuarioActual.fav_list.arrayPeliculas || [];
          this.Flist.loadFavouriteListFromServer(this.usuarioActual.id);
        } else {
          // Si no existe, inicializa el arreglo vacío
          this.favouriteFilms = [];
        }
      });
    }

    this.Flist.getChangesObservable().subscribe(() => {
      this.favouriteFilms = [...this.Flist.listaFav.arrayPeliculas];
    });
  }

  ngOnChanges() {
    // Filtra las películas si la categoría cambia
    this.filteredFilms = this.films.filter((film) => film.genre.includes(this.category));
  }

  isFavourite(film: Film): boolean {
    // Verificación de que `favouriteFilms` sea un arreglo
    if (!Array.isArray(this.favouriteFilms)) {
      this.favouriteFilms = []; // Si no es un arreglo, inicialízalo vacío
    }
    return this.favouriteFilms.some((favFilm) => favFilm.id === film.id);
  }

  async toggleFavourite(film: Film) {
    if (this.isFavourite(film)) {
      await this.Flist.eliminarDeLaListaFavoritos(film); // Quitar de favoritos
    } else {
      await this.Flist.agregarALaLista(film); // Agregar a favoritos
    }
    this.Flist.loadFavouriteListFromServer(this.usuarioActual.id);
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }

  navegarFilmDetail(rank: number) {
    this.sharedService.navegarFilmDetail(rank);
  }

  agregarPeliculaAlCarrito(film: Film) {
    if (this.isLoggedIn)
      this.sharedService.agregarPeliculaAlCarrito(film);
    else
      alert ('Debes iniciar sesion para agregar al carrito.')
  }

<<<<<<< HEAD
  agregarALaListaDeFavoritos(film: Film) {
=======

  agregarALaListaDeFavoritos (film: Film) {
>>>>>>> a376794829e97330bbf89935e12987ad30c25a1c
    this.Flist.agregarALaLista(film);
  }

  navegarFavouriteList() {
    this.sharedService.navegarFavouriteList();
  }
}
