import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

export class FilmsFromApiCarritoService
{
    private url_API = 'https://similar-movies.p.rapidapi.com/similar?id=24168-titanic';
    private url_json = 'films.json'
    films: Array<Film> = [];

  constructor(private http: HttpClient) { }
  
  getMovies(): Observable<any[]> {
    return new Observable((observer) => {
      let data; // Declaración de la variable data fuera del bloque then
  
      fetch(this.url_API, options)
        .then(async (response) => {
          if (response.status !== 200) 
          {
            console.log("Error: " + response.text());
            observer.error("Error al obtener datos");
          } 
          else 
          {
            data = await response.json();
            observer.next(data);
          }
          observer.complete();
        })
        .catch((error) => {
          console.error("Error en la solicitud: " + error);
          observer.error("Error al obtener datos");
          observer.complete();
        });
    });
  }
  getMoviesJson() : Array<Film>
  {
    this.http.get('assets/films.json').subscribe((data: any) => {
    this.films = data;
      });
      return this.films;
  }
}