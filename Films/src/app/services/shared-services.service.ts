import { Injectable} from '@angular/core';
import { CarritoService } from './carrito.service';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService{
  
  addFilmToCart : Boolean | null = false;

  constructor(
    private carritoService: CarritoService, 
    private userService: UserService, 
    private router: Router
  ) 
  {
    this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.addFilmToCart = isLoggedIn; 
    })
  }

  navegarFilmDetail(rank: number) {
    this.router.navigate(['film-detail', rank]);
  }

  agregarPeliculaAlCarrito(film: Film) {
    if (this.addFilmToCart) {
      this.carritoService.agregarAlCarrito(film);
    } else {
      alert("Debes iniciar sesión para agregar películas al carrito.");
    }
  }

  getMovieGroups(movies: any[]): any[][] {
    const groupedMovies: any[][] = [];
    for (let i = 0; i < movies.length; i += 5) {
      groupedMovies.push(movies.slice(i, i + 5));
    }
    return groupedMovies;
  }
}
