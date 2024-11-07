import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { FilmSearchServiceService } from 'src/app/services/film-search-service.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inicio-aux',
  templateUrl: './inicio-aux.component.html',
  styleUrls: ['./inicio-aux.component.css']
})

export class InicioAuxComponent implements OnInit{
  films: any;
  preciosGenerados: boolean = false;
  filteredFilms: any[] = [];
  searchFilms: Film [] = [];
  isLoggedIn: Boolean | null = false;
  isAdmin: Boolean | null = false;

  constructor(
    private dataFilms: FilmsFromAPIService, 
    private sharedService: SharedServicesService, 
    private Flist: FavouriteListService,
    private filmSearchService: FilmSearchServiceService,
    private userService: UserService
  ) {}

   ngOnInit(): void 
   {
    this.userService.isLoggedIn$.subscribe ( (isLoggedIn) =>{
      this.isLoggedIn = isLoggedIn
    })
    
    if (this.userService.storedAdmin)
    {
      this.isAdmin = true;
    }

    this.dataFilms.initializeData().then(() => {
      this.films = this.dataFilms.getMovies();
      this.filteredFilms = this.films.filter((film:Film) => film.precio <= 1500);
    });

    this.filmSearchService.filteredFilms$.subscribe(films => {
      this.searchFilms = films;
    });
  }

  agregarPeliculaAlCarrito(film: Film) {
    this.sharedService.agregarPeliculaAlCarrito (film);
  } 

  navegarFilmDetail(id: number) {
    this.sharedService.navegarFilmDetail (id);
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }  

  isFilled: boolean = false;

  onMouseEnter() {
    this.isFilled = true;
  }

  onMouseLeave() {
    this.isFilled = false;
  }

  changeButtonStar () {
    const boton = document.getElementById ("buttonStar");
    if (boton) {
      boton.textContent = "★"
      this.isFilled = true
    }
  }

  agregarALaListaDeFavoritos (film: Film) {
    this.Flist.agregarALaLista(film);
  }
  
  navegarFavouriteList() {
    this.sharedService.navegarFavouriteList();
  } 
}
