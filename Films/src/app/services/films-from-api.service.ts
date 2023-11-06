import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Film } from '../models/film';
import { AnonymousSubject } from 'rxjs/internal/Subject';

const options = {
  method: 'GET',
	headers: {
		'X-RapidAPI-Key': '168918779bmsh773c0ea22aed822p18cce3jsn5f8c1d7815d2',
		'X-RapidAPI-Host': 'similar-movies.p.rapidapi.com'
	}
};

@Injectable({
  providedIn: 'root'
})

export class FilmsFromAPIService{
  private url_API = 'assets/films.json';
  private filmsData: Film [] = [];
  private arrayFilmsBien: Film [] = [];
  
  constructor() {
   }

  async initializeData() {
    if (this.filmsData.length === 0) {
      const response = await fetch(this.url_API);
      if (response.status === 200) {
        const datos = await response.json();

        this.filmsData = datos.map((film: Film) => ({
          ...film,
          precio: Math.round(Math.random() * 100),
          ofertas: false,
        }));
        this.arrayFilmsBien = this.pasarDatosAUnArray (this.filmsData);
      }
    }
  }

  getMovies ()
  {
    return this.arrayFilmsBien;
  }
  
   /* async getMovies (): Promise <any>{
       const response = await fetch (this.url_API);

      if (response.status != 200){
        console.log ("Error: " + response.text);
        return null;
      }
      const datos = await response.json(); 

      const datosConPrecio = datos.map((film: Film) => ({
        ...film,
        precio: Math.round(Math.random() * 100),
        ofertas: false,
      }));
      let arrayConImagenes: Array<Film> = this.pasarDatosAUnArray(datosConPrecio);
      return arrayConImagenes;
  }  */
  
  pasarDatosAUnArray(datos: any)
  {
    let arrayAPasar: Array<Film> = [];

    let i;

    for(i = 0; i < datos.length; i++)
    {
      if(i == 2 || i == 5)
      {
        i++;
      }
      if (i == 6)
      {
        i++
      }
      if (i == 7 || i == 51)
      {
        i++;
      }
      arrayAPasar.push(datos[i]);
    }
    return arrayAPasar;
  }
}
