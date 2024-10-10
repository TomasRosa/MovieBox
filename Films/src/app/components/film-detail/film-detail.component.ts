import { Component, OnInit } from '@angular/core';
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

  constructor(private route: ActivatedRoute, private films: FilmsFromAPIService) {}

  ngOnInit(): void
  {
    this.arrayFilms = this.films.getMovies();
    this.getFilmRank();
    this.showFilm();
  }

  getFilmRank() {
    this.route.paramMap.subscribe(params => {
      const rankParam = params.get('rank');

      if (rankParam !== null) {
        this.filmRank = +rankParam;
      } else {
        console.error('No se encontró el parámetro "rank".');
      }
    });
  }

  searchFilmWithRank (): Film
  {
    let i;
    for (i = 0; i < this.arrayFilms.length; i++)
    {
      if (this.filmRank == this.arrayFilms[i].rank)
      {
        break;
      }
    }

    return this.arrayFilms[i];
  }

  showFilm ()
  {
    let image = document.getElementById ("film")
    let movie: Film = this.searchFilmWithRank();

    if (image)
    {
      image.innerHTML = `
        <img alt="Imagen no disponible" src="${movie.image}" width="200" height="300">
      `
    }
  }

}

