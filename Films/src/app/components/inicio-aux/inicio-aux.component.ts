import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-inicio-aux',
  templateUrl: './inicio-aux.component.html',
  styleUrls: ['./inicio-aux.component.css']
})

export class InicioAuxComponent implements OnInit{
  films: any;
  preciosGenerados: boolean = false;
  filteredFilms: any[] = [];

  constructor(private dataFilms: FilmsFromAPIService, private sharedService: SharedServicesService) {}

   ngOnInit(): void 
   {
    this.dataFilms.initializeData().then(() => {
      this.films = this.dataFilms.getMovies();
      this.filteredFilms = this.films.filter((film:Film) => film.precio <= 1500);
    });
  }

  agregarPeliculaAlCarrito(film: Film) {
    this.sharedService.agregarPeliculaAlCarrito (film);
  } 

  navegarFilmDetail(id: number) {
    this.sharedService.navegarFilmDetail (id);
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }  
}
