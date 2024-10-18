import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-favourite-list',
  templateUrl: './favourite-list.component.html',
  styleUrls: ['./favourite-list.component.css']
})
export class FavouriteListComponent implements OnInit {
  arrayFilms: Array<Film> = [];

  constructor(
    private Flist: FavouriteListService,
    private sharedService: SharedServicesService
  ) {
    this.Flist.getChangesObservable().subscribe(() => {
      this.arrayFilms = this.Flist.listaFav.arrayPeliculas;
  });
  }

  ngOnInit(): void {
    this.Flist.userService.getUserActualJSON().subscribe((user) => {
      this.Flist.obtenerFilmsDeLista();
  
      this.arrayFilms = this.Flist.listaFav.arrayPeliculas;
      
      if (this.arrayFilms.length === 0) {
        console.log("No se encontraron películas en la lista.");
      } else {
        console.log("Películas encontradas: ", this.arrayFilms);
      }
    });
  
    this.Flist.getChangesObservable().subscribe(() => {
      this.arrayFilms = this.Flist.listaFav.arrayPeliculas;
      console.log("Lista de películas actualizada: ", this.arrayFilms);
    });
  }
  
  quitarFilmDeFlist (film: Film)
  {
    this.Flist.eliminarDeLaListaFavoritos(film);
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }

  navegarFilmDetail(id: number) {
    this.sharedService.navegarFilmDetail(id);
  }

  agregarPeliculaAlCarrito(film: Film) {
    this.sharedService.agregarPeliculaAlCarrito(film);
  }
}
