import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FilmsFromAPIService } from "src/app/services/films-from-api.service";
import { Film } from "src/app/models/film";
import { SharedServicesService } from "src/app/services/shared-services.service";
import { FavouriteListService } from "src/app/services/favourite-list.service";

@Component({
  selector: "app-movie-list-components",
  templateUrl: "./movie-list-components.component.html",
  styleUrls: ["./movie-list-components.component.css"],
})
export class MovieListComponentsComponent {
  @Input() category: string = '';
  films: Film[] = this.filmsService.getMovies();
  filteredFilms: Film[] = [];

  constructor(private filmsService: FilmsFromAPIService, 
    private route: ActivatedRoute, 
    private sharedService: SharedServicesService,
    private Flist: FavouriteListService) {}

  ngOnInit() {
    this.filmsService.initializeData().then(() => {
      this.route.paramMap.subscribe(params => {
        this.category = params.get('category') || '';
        this.films = this.filmsService.getMovies(); // Obtén todas las películas
        this.filteredFilms = this.films.filter(film => film.genre.includes(this.category)); // Filtra las películas por categoría
      });
    });
  }
  
  ngOnChanges() {
    // Filtra las películas si la categoría cambia
    this.filteredFilms = this.films.filter(film => film.genre.includes(this.category));
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }

  navegarFilmDetail(rank: number) {
    this.sharedService.navegarFilmDetail(rank);
  }

  agregarPeliculaAlCarrito(film: Film) {
    this.sharedService.agregarPeliculaAlCarrito(film);
  }

  agregarALaListaDeFavoritos (film: Film) {
    this.Flist.agregarALaLista(film);
  }
  
  navegarFavouriteList() {
    this.sharedService.navegarFavouriteList();
  } 

}
