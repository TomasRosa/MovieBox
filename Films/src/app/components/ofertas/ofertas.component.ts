import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.css']
})
export class OfertasComponent implements OnInit
{
  filteredFilms: any[] = [];
  isLoggedIn: Boolean | null = false;
  usuarioActual: User = new User ();
  favouriteFilms: Array<Film> = [];
  isAdmin: Boolean | null = false;

  constructor(
    private dataFilms: FilmsFromAPIService, 
    private userService: UserService,
    private sharedService: SharedServicesService,
    private Flist: FavouriteListService) {}

  async ngOnInit(): Promise<void> 
  {

    this.dataFilms.moviesEnOferta$.subscribe((m) => {
      this.filteredFilms = m.map(film => ({ ...film }));;
      console.log ("FILMS EN OFERTA: ", this.filteredFilms)
    })
    
    this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.isLoggedIn = isLoggedIn; 
    })

    if (this.userService.getAdminFromStorage ()){
      this.isAdmin = true;
    }

    if (this.isLoggedIn){
      this.userService.usuarioActual$.subscribe ((user)=>{
        this.usuarioActual = user as User;
        this.favouriteFilms = this.usuarioActual.fav_list.arrayPeliculas;
        this.Flist.loadFavouriteListFromServer (this.usuarioActual.id)
      })
    }

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
    if (this.isLoggedIn)
      this.sharedService.agregarPeliculaAlCarrito(film);
    else
      alert ('Debes iniciar sesion para agregar al carrito.')
  }
}  

