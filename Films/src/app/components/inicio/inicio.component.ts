import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent
{
  films: any;

  constructor (private dataFilms: FilmsFromAPIService)
  {
  }

  async obtenerMovies ()
  {
    this.films = await this.dataFilms.getMovies();
  }
  
  mostrarPeliculas() {
    console.log (this.films);
  }
}
