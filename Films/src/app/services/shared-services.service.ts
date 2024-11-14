import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoService } from './carrito.service';
import { Router } from '@angular/router';
import { Film } from '../models/film';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
  
  private adminCodeVerified: boolean = false;

  constructor(
    private carritoService: CarritoService, 
    private router: Router
  ) {
  }

  agregarPeliculaAlCarrito(film: Film) {
    this.carritoService.agregarAlCarrito(film);
  }

  getadminCodeVerified(): boolean {
    return this.adminCodeVerified;
  }

  setAdminCodeVerified(value: boolean): void {
    this.adminCodeVerified = value;
  }

  get isLoggedIn$(): Observable<boolean | null> { 
    return this.isLoggedInSubject.asObservable();
  }

  setLogged(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }

  navegarFilmDetail(rank: number) {
    this.router.navigate(['film-detail', rank]);
  }

  navegarFavouriteList() {
    this.router.navigate(['favourite-list']);
  }

  navegarBiblioteca (){
    this.router.navigate(['biblioteca']) 
  }

  getMovieGroups(movies: any[]): any[][] {
    const groupedMovies: any[][] = [];
    for (let i = 0; i < movies.length; i += 5) {
      groupedMovies.push(movies.slice(i, i + 5));
    }
    return groupedMovies;
  }
}

