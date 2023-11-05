import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Film } from '../models/film';

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

export class FilmsFromAPIService {
  private url_API = 'assets/films.json';
  
  constructor() { }
  
   async getMovies (){
      const response = await fetch (this.url_API);

      if (response.status != 200){
        console.log ("Error: " + response.text);
        return null;
      }
      console.log (response)
      const datos = await response.json();

      const datosConPrecio = datos.map((film: Film) => ({
        ...film,
        precio: Math.round(Math.random() * 100),
      }));

      return datosConPrecio;
  } 
}
