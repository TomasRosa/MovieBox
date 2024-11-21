import { Injectable } from "@angular/core";
import { Film } from "../models/film";
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject } from "rxjs";

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "c511835e7cmshaf0339d8caef3b7p1f89fbjsn313b21e2f891",
    "x-rapidapi-host": "imdb-top-100-movies.p.rapidapi.com",
  },
};
@Injectable({
  providedIn: "root",
})
export class FilmsFromAPIService {
  private url_API = "https://imdb-top-100-movies.p.rapidapi.com/";
  private url_JSON = "./assets/peliculas.json";
  private filmsData: Film[] = [];
  private precios: number[] = [
    150,
    200,
    300,
    450,
    250,
    180,
    280,
    900,
    350,
    500,
    1200,
    700,
    550,
    950,
    1100,
    1300,
    800,
    275,
    600,
    170,
    2100,
    400,
    750,
    1000,
    1700,
    1600,
    3000,
    2200,
    160,
    210,
    1150,
    700,
    1750,
    900,
    2000,
    130,
    1450,
    2500,
    1350,
    190,
    2800,
    1600,
    600,
    1100,
    1250,
    850,
    230,
    200,
    125,
    350,
    550,
    900,
    675,
    2400,
    1450,
    800,
    1800,
    1900,
    100,
    700,
    750,
    850,
    275,
    1150,
    2350,
    2750,
    475,
    1500,
    1000,
    2000,
    800,
    1300,
  ];

  movies = new BehaviorSubject<Film[]>([]);
  movies$ = this.movies.asObservable();
  
  constructor(private http: HttpClient) {}

  async ngOnInit ()
  {
    await this.initializeData();
  }
  
  async initializeData() {
    if (this.filmsData.length == 0) {
      const response = await fetch(this.url_JSON);

      if (response.status === 200) {
        const datos = await response.json();

        for (let i = 0; i < datos.length; i++) {
          this.filmsData.push({
            ...datos[i],
            precio: this.precios[i],
            ofertas: this.verSiEstaEnOferta(this.precios[i]),
          });
        }
        this.movies.next (this.filmsData)
      }
    }
  }
  getGenreOfMovies() {
    let allGenres = new Set<string>();
  
    fetch('https://imdb-top-100-movies.p.rapidapi.com/', options)
      .then(response => response.json())
      .then((movies: Film[]) => { // Define el tipo de 'movies' como un array de 'Movie'
        movies.forEach((movie: Film) => {
          movie.genre.forEach((genre: string) => allGenres.add(genre));
        });
      })
      .catch(err => console.error(err));

      return allGenres;
  }
  getGenreOfMoviesJSON() {
    let allGenres = new Set<string>();
  
    this.http.get<Film[]>(this.url_JSON).subscribe((movies: Film[]) => {
      movies.forEach((movie: Film) => {
        movie.genre.forEach((genre: string) => allGenres.add(genre));
      });
    });
  
    return allGenres;
  }
  getMovies() {
    return this.filmsData;
  }
  verSiEstaEnOferta(precio: number) {
    if (precio > 1500) {
      return true;
    }
    return false;
  }
}
