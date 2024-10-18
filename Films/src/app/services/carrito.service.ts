import { Injectable } from '@angular/core';
import { Film } from 'src/app/models/film';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoDeCompras: Array<Film> = [];
  private totalCarrito: number = 0;
  addFilmToCart: boolean | null = false;
  private carritoSubject = new BehaviorSubject<Array<Film>>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor() {
    this.loadCarritoFromStorage();
  }

  agregarAlCarrito(pelicula: Film) {
    this.carritoDeCompras.push({ ...pelicula }); // Hacer una copia de la película
    this.totalCarrito += pelicula.precio;
    this.carritoSubject.next(this.carritoDeCompras);
    this.saveCarritoToStorage();
  }

  eliminarDelCarrito(pelicula: Film) {
    const index = this.carritoDeCompras.indexOf(pelicula);
    if (index !== -1) {
      this.carritoDeCompras.splice(index, 1);
      this.totalCarrito -= pelicula.precio;
      this.carritoSubject.next(this.carritoDeCompras);
      this.saveCarritoToStorage();
    }
  }

  limpiarCarrito() {
    this.carritoDeCompras = []; // Borra todas las películas en el carrito
    this.totalCarrito = 0;
    this.carritoSubject.next(this.carritoDeCompras);
    this.saveCarritoToStorage();
  }

  obtenerCarrito() {
    return this.carritoDeCompras;
  }

  obtenerTotalCarrito() {
    return this.totalCarrito;
  }

  private saveCarritoToStorage() {
    localStorage.setItem('carritoDeCompras', JSON.stringify(this.carritoDeCompras));
  }

  private loadCarritoFromStorage() {
    const storedCarrito = localStorage.getItem('carritoDeCompras');
    if (storedCarrito) {
      this.carritoDeCompras = JSON.parse(storedCarrito);
      this.carritoSubject.next(this.carritoDeCompras);
    }
  }
}


