import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { Film } from 'src/app/models/film';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent {
  private arrayFilms: Film[] = [];
  private filmRank: number = 0;
  movie: Film | undefined;

  constructor(private route: ActivatedRoute, private films: FilmsFromAPIService) {}

  ngOnInit(): void
  {
    this.films.initializeData().then(() => {
      this.arrayFilms = this.films.getMovies();
      this.getFilmRank();
    });
  }

  getFilmRank() {
    this.route.paramMap.subscribe(params => {
      const rankParam = params.get('rank');

      if (rankParam !== null) {
        this.filmRank = +rankParam;
        this.movie = this.searchFilmWithRank();
      } else {
        console.log('No se encontró el parámetro "rank".');
      }
    });
  }

  searchFilmWithRank (): Film | undefined
  {
    return this.arrayFilms.find(film => film.rank === this.filmRank);
  }

  // showFilm ()
  // {
  //   let image = document.getElementById ("film")
  //   this.movie = this.searchFilmWithRank();

  //   if (image && this.movie)
  //   {
  //     image.innerHTML = `
  //       <img alt="Imagen no disponible" src="${this.movie.image}" width="200" height="300">
  //     `
  //   }
  // }

}

