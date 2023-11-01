import { Injectable } from '@angular/core';
import { Film } from '../models/film';

const options = {
  headers: {
  accept: 'application/json',
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjk0MzIxNWVhNTZkYmQ0OGQ4ZTVjNDdlYzQwNWY1YSIsInN1YiI6IjY1MzZkYTUyMWY3NDhiMDEzZWI0Y2U4OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2gvHMEZWHcVkev35K5S8tIINp0HxmR5djO57J2A2SN4'
  }
};

@Injectable({
  providedIn: 'root'
})

export class FilmsFromAPIService {
  private url_API = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
  
  constructor() { }
  
  async getMovies (): Promise <any> {
      const response = await fetch (this.url_API, options);

      if (response.status != 200){
        console.log ("Error: " + response.text);
        return null;
      }

      return await response.json();
  }
}
