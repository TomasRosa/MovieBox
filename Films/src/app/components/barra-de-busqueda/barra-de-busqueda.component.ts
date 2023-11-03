import { Component, OnInit } from '@angular/core';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { Film } from 'src/app/models/film';
import { FormControl } from '@angular/forms';

const options = {
  
};

@Component({
  selector: 'app-barra-de-busqueda',
  templateUrl: './barra-de-busqueda.component.html',
  styleUrls: ['./barra-de-busqueda.component.css']
})
export class BarraDeBusquedaComponent /* implements OnInit */{
  /* private imageBaseUrl = 'https://image.tmdb.org/t/p/';
  films = new Array <Film> ();
  buscadorDeFilm: string ='';
  filmsFiltradasPorBusqueda = new Array<Film>();
  formControl = new FormControl()

  constructor(private FilmsFromAPIService: FilmsFromAPIService) {} */

  /* ngOnInit(): void {
    this.FilmsFromAPIService.getMovies().then((json) => {
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
  }  */
}
