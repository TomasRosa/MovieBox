import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FilmsFromAPIService } from "src/app/services/films-from-api.service";
import { Film } from "src/app/models/film";
import { SharedServicesService } from "src/app/services/shared-services.service";

@Component({
  selector: "app-movie-list-components",
  templateUrl: "./movie-list-components.component.html",
  styleUrls: ["./movie-list-components.component.css"],
})
export class MovieListComponentsComponent {
  @Input() category: string = '';
  films: Film[] = this.filmsService.getMovies();
  filteredMovies: Film[] = [];

  constructor(private filmsService: FilmsFromAPIService, private route: ActivatedRoute, public service: SharedServicesService) {}

  ngOnInit() {
    this.filmsService.initializeData().then(() => {
      this.route.paramMap.subscribe(params => {
        this.category = params.get('category') || '';
        this.films = this.filmsService.getMovies(); // Obtén todas las películas
        this.filteredMovies = this.films.filter(film => film.genre.includes(this.category)); // Filtra las películas por categoría
      });
    });
  }
  
  ngOnChanges() {
    // Filtra las películas si la categoría cambia
    this.filteredMovies = this.films.filter(film => film.genre.includes(this.category));
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.service.getMovieGroups(movies);
  }

  navegarFilmDetail(rank: number) {
    this.service.navegarFilmDetail(rank);
  }

  agregarPeliculaAlCarrito(film: Film) {
    this.service.agregarPeliculaAlCarrito(film);
  }
}
