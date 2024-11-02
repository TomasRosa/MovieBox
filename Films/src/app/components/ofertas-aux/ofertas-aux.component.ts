import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { CarritoService } from 'src/app/services/carrito.service';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ofertas-aux',
  templateUrl: './ofertas-aux.component.html',
  styleUrls: ['./ofertas-aux.component.css']
})
export class OfertasAuxComponent implements OnInit {
  private films: any;
  private originalFilms: any;
  filteredFilms: any[] = [];
  isLoggedIn: Boolean | null = false;

  constructor(
    private dataFilms: FilmsFromAPIService, 
    private carritoService: CarritoService, 
    private userService: UserService,
    private sharedService: SharedServicesService,
    private Flist: FavouriteListService) {}

  async ngOnInit(): Promise<void> {
    await this.dataFilms.initializeData();
    this.originalFilms = this.dataFilms.getMovies();
    this.films = [...this.originalFilms];
    this.filteredFilms = this.films.filter((film: Film) => film.precio > 1500);
    
    this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.isLoggedIn = isLoggedIn; 
    })
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }  

  navegarFilmDetail(id: number) {
    this.sharedService.navegarFilmDetail (id);
  }

  agregarALaListaDeFavoritos (film: Film) {
    this.Flist.agregarALaLista(film);
  }
  
  navegarFavouriteList() {
    this.sharedService.navegarFavouriteList();
  } 

  agregarPeliculaAlCarrito (film: Film){
    if(this.isLoggedIn){
      this.carritoService.agregarAlCarrito(film)
    }
    else{
      alert("Debes iniciar sesion para agregar peliculas al carrito. ");
    }
  } 
}
