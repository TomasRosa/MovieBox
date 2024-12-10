import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-favourite-list',
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.css']
})
export class FavouriteListComponent implements OnInit {
  arrayFilms: Array<Film> = [];
  isLoggedIn: Boolean | null = false
  isAdmin: Boolean | null = false

  constructor(
    public Flist: FavouriteListService,
    private userService: UserService,
    private sharedService: SharedServicesService
  ) {
    Flist.getChangesObservable().subscribe (()=>{
      if (Flist.user)
      {
        this.arrayFilms = Flist.user.fav_list.arrayPeliculas;
      }
    })
  }

  ngOnInit(): void {
    this.Flist.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.isLoggedIn = isLoggedIn; 
    })

    if (this.Flist.userService.storedAdmin){
      this.isAdmin = true;
    }

    if (!this.isAdmin){
      if (!this.isLoggedIn){
        alert ("Debe iniciar sesión para ver su lista de favoritos.")
      }
    }else{
      alert ("Los administradores no tienen lista de favoritos.")
    }

    this.Flist.userService.getUserActualJSON().subscribe(() => {
      this.Flist.obtenerFilmsDeLista();
      this.Flist.obtenerNameDeLista();
      
      if (this.Flist.listaFav)
      {
        this.arrayFilms = this.Flist.listaFav.arrayPeliculas;
      }
      
      if (this.arrayFilms.length === 0) {
        console.log("No se encontraron películas en la lista.");
      } else {
        console.log("Películas encontradas: ", this.arrayFilms);
      }
    });
  
    this.Flist.getChangesObservable().subscribe(() => {
      this.arrayFilms = this.Flist.listaFav.arrayPeliculas;
    });
  }

  vaciarFavouriteList (){
    this.arrayFilms = []
    this.userService.quitarFilmDeLista (this.Flist.user!, this.arrayFilms)
  }
  
  async quitarFilmDeFlist (film: Film){
    await this.Flist.eliminarDeLaListaFavoritos(film);
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }

  navegarFilmDetail(id: number) {
    this.sharedService.navegarFilmDetail(id);
  }

  agregarPeliculaAlCarrito(film: Film) {
    if (this.isLoggedIn)
      this.sharedService.agregarPeliculaAlCarrito(film);
    else
      alert ('Debes iniciar sesion para agregar al carrito.')
  }
}
