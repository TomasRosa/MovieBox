import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { CarritoService } from 'src/app/services/carrito.service';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ofertas-aux',
  templateUrl: './ofertas-aux.component.html',
  styleUrls: ['./ofertas-aux.component.css']
})
export class OfertasAuxComponent implements OnInit {
  private films: any;
  private originalFilms: any;
  filteredFilms: any[] = [];
  isLoggedIn: Boolean | null = false;
  usuarioActual: User = new User ();
  favouriteFilms: Array<Film> = [];

  constructor(
    private dataFilms: FilmsFromAPIService, 
    private carritoService: CarritoService, 
    private userService: UserService,
    private sharedService: SharedServicesService,
    private Flist: FavouriteListService) {}

  async ngOnInit(): Promise<void> {
    await this.dataFilms.initializeData();
    this.originalFilms = this.dataFilms.getMovies();
    this.films = [...this.originalFilms];
    this.filteredFilms = this.films.filter((film: Film) => film.precio > 1500);
    
    this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.isLoggedIn = isLoggedIn; 
    })

    this.userService.usuarioActual$.subscribe((user) => {
      this.usuarioActual = user as User;
      
      // Asegúrate de que 'usuarioActual' y 'fav_list' no sean nulos
      if (this.usuarioActual && this.usuarioActual.fav_list) {
        this.favouriteFilms = this.usuarioActual.fav_list.arrayPeliculas || []; // Si fav_list es nulo, asigna un arreglo vacío
      } else {
        this.favouriteFilms = []; // Si 'fav_list' no existe, inicializa como arreglo vacío
      }
    
      // Cargar la lista de favoritos desde el servidor
      if (this.usuarioActual && this.usuarioActual.id) {
        this.Flist.loadFavouriteListFromServer(this.usuarioActual.id);
      }
    });

    this.Flist.getChangesObservable().subscribe(() => {
      this.favouriteFilms = [...this.Flist.listaFav.arrayPeliculas];
    });
  }

  isFavourite(film: Film): boolean {
    // Verificamos que favouriteFilms sea un arreglo antes de usar .some
    if (!Array.isArray(this.favouriteFilms)) {
      this.favouriteFilms = [];  // En caso de que no sea un arreglo, lo inicializamos vacío
    }
    return this.favouriteFilms.some((favFilm) => favFilm.id === film.id);
  }

  async toggleFavourite(film: Film) {
    if (this.isFavourite(film)) {
      await this.Flist.eliminarDeLaListaFavoritos(film);  // Quitar de favoritos
    } else {
      await this.Flist.agregarALaLista(film); // Agregar a favoritos
    }
    this.Flist.loadFavouriteListFromServer(this.usuarioActual.id);
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }  

  navegarFilmDetail(id: number) {
    this.sharedService.navegarFilmDetail (id);
  }

  agregarALaListaDeFavoritos(film: Film) {
    this.Flist.agregarALaLista(film);
  }

  navegarFavouriteList() {
    this.sharedService.navegarFavouriteList();
  }

  agregarPeliculaAlCarrito(film: Film) {
<<<<<<< HEAD
    if(this.isLoggedIn){
      this.carritoService.agregarAlCarrito(film);
    }
    else{
      alert("Debes iniciar sesión para agregar películas al carrito.");
    }
=======
    if (this.isLoggedIn)
      this.sharedService.agregarPeliculaAlCarrito(film);
    else
      alert ('Debes iniciar sesion para agregar al carrito.')
>>>>>>> a376794829e97330bbf89935e12987ad30c25a1c
  }
}
