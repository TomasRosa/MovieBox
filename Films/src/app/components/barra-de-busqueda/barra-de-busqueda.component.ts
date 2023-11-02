import { Component, OnInit } from '@angular/core';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { Film } from 'src/app/models/film';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-barra-de-busqueda',
  templateUrl: './barra-de-busqueda.component.html',
  styleUrls: ['./barra-de-busqueda.component.css']
})
export class BarraDeBusquedaComponent implements OnInit{
  films = new Array <Film> ();
  buscadorDeFilm: string ='';
  filmsFiltradasPorBusqueda = new Array<Film>();
  formControl = new FormControl()

  constructor(private FilmsFromAPIService: FilmsFromAPIService) {}

  ngOnInit(): void {
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
}
