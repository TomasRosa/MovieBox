import { Component, OnInit } from '@angular/core';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { Film } from 'src/app/models/film';
import { FormControl } from '@angular/forms';

const options = {
  headers: {
  accept: 'application/json',
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjk0MzIxNWVhNTZkYmQ0OGQ4ZTVjNDdlYzQwNWY1YSIsInN1YiI6IjY1MzZkYTUyMWY3NDhiMDEzZWI0Y2U4OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2gvHMEZWHcVkev35K5S8tIINp0HxmR5djO57J2A2SN4'
  }
};

@Component({
  selector: 'app-barra-de-busqueda',
  templateUrl: './barra-de-busqueda.component.html',
  styleUrls: ['./barra-de-busqueda.component.css']
})
export class BarraDeBusquedaComponent implements OnInit{
  private imageBaseUrl = 'https://image.tmdb.org/t/p/';
  films = new Array <Film> ();
  buscadorDeFilm: string ='';
  filmsFiltradasPorBusqueda = new Array<Film>();
  formControl = new FormControl()

  constructor(private FilmsFromAPIService: FilmsFromAPIService) {}

  ngOnInit(): void {
    this.FilmsFromAPIService.getMovies().then((json) => {
      console.log(json);
      if (json) {
        this.films = json.results;
      }
    }).then (()=>{
      this.formControl.valueChanges.subscribe(query => {
        this.buscarFilm(query);
      });
    });
  }

  buscarFilm(query: string) {
    console.log('entre a buscar');
    this.filmsFiltradasPorBusqueda = []
    if (this.formControl.value != '')
    this.filmsFiltradasPorBusqueda = this.films.filter((film) => {
      return film.title.toLowerCase().includes(query.toLowerCase());
    });
  }

  async getImageUrl(posterPath: string): Promise<String> {
    if (posterPath) {
      const res = await fetch((this.imageBaseUrl + 'w500' + posterPath), options);
      return res.url;
    }
    return 'ruta/por/defecto/sin/imagen.jpg'; // Ruta de imagen por defecto si posterPath es nulo o vacío
  } 
}
