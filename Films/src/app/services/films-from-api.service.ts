import { Injectable } from '@angular/core';

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
  private url_API = 'https://similar-movies.p.rapidapi.com/similar?id=24168-titanic';
  
  constructor() { }
  
  async getMovies (){
      const response = await fetch (this.url_API, options);

      if (response.status != 200){
        console.log ("Error: " + response.text);
        return null;
      }

      const datos = await response.json();

      return datos;
  }
}
