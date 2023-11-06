import { Component, OnInit } from '@angular/core';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { Film } from 'src/app/models/film';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from 'src/app/services/carrito.service';

const options = {
  
};

@Component({
  selector: 'app-barra-de-busqueda',
  templateUrl: './barra-de-busqueda.component.html',
  styleUrls: ['./barra-de-busqueda.component.css']
})
export class BarraDeBusquedaComponent implements OnInit {
  films: Array<Film> = [];
  buscadorDeFilm: string ='';
  filmsFiltradasPorBusqueda = new Array<Film>();
  formControl = new FormControl()

  constructor(private filmsFromAPIService: FilmsFromAPIService, private carritoService: CarritoService, private http: HttpClient) {} 

  async ngOnInit(): Promise<void> {
    try {
      await this.filmsFromAPIService.initializeData();
      const fetchedFilms = this.filmsFromAPIService.getMovies ();
      if (fetchedFilms !== null) {
        this.films = fetchedFilms;
      } 
      else 
      {
          console.log('array nulo');
      }
    }catch (error) {
        console.error(error);
    }
    this.formControl.valueChanges.subscribe(query => {
      this.buscarFilm(query);
    });
  }

  buscarFilm(query: string) {
    this.filmsFiltradasPorBusqueda = [];
    if (query && this.formControl.value != '') {
      this.filmsFiltradasPorBusqueda = this.films.filter((film) => {
        return film.title.toLowerCase().includes(query.toLowerCase());
      });
    }
  }
  
  agregarPeliculaAlCarrito (film: Film){
    this.carritoService.agregarAlCarrito(film)
  }  
}
