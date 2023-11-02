import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit
{
  films = new Array <Film> ();

  constructor (private dataFilms: FilmsFromAPIService)
  {
  }

  ngOnInit(): void{
    this.dataFilms.getMovies().then((json) => {
      if (json) {
        this.films = json.results;
      }
    })
  } 

  mostrarPeliculas() {
    console.log (this.films);
  }
}
