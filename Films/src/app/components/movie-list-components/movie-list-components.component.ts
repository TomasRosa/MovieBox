import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FilmsFromAPIService } from "src/app/services/films-from-api.service";
import { Film } from "src/app/models/film";

@Component({
  selector: "app-movie-list-components",
  templateUrl: "./movie-list-components.component.html",
  styleUrls: ["./movie-list-components.component.css"],
})
export class MovieListComponentsComponent {
  @Input() category: string = '';
  films: Film[] = this.filmsService.getMovies();
  filteredMovies: Film[] = [];

  constructor(private filmsService: FilmsFromAPIService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.filmsService.initializeData().then(() => {
      this.route.paramMap.subscribe(params => {
        this.category = params.get('category') || '';
        console.log("Categoría desde la ruta:", this.category); // Verificar que se obtiene correctamente
        this.films = this.filmsService.getMovies(); // Obtén todas las películas
        this.filteredMovies = this.films.filter(film => film.genre.includes(this.category)); // Filtra las películas por categoría
        console.log("Películas filtradas:", this.filteredMovies); // Verificar películas filtradas
      });
    });
  }
  
  ngOnChanges() {
    // Filtra las películas si la categoría cambia
    this.filteredMovies = this.films.filter(film => film.genre.includes(this.category));
    console.log("categoria 2",this.category)
    console.log("2",this.filteredMovies);
  }
}
