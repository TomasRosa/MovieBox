import { Injectable } from '@angular/core';
import { Film } from 'src/app/models/film';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoDeCompras: Array<Film> = [];
  private totalCarrito: number = 0;

  private carritoSubject = new BehaviorSubject<Array<Film>>([]);
  carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  agregarAlCarrito(pelicula: Film) {
    this.carritoDeCompras.push({ ...pelicula }); // Hacer una copia de la película
    this.totalCarrito += pelicula.precio;
    this.carritoSubject.next(this.carritoDeCompras);
  }

  eliminarDelCarrito(pelicula: Film) {
    const index = this.carritoDeCompras.indexOf(pelicula);
    if (index !== -1) {
      this.carritoDeCompras.splice(index, 1);
      this.totalCarrito -= pelicula.precio;
      this.carritoSubject.next(this.carritoDeCompras);
    }
  }

  limpiarCarrito() {
    this.carritoDeCompras = []; // Borra todas las películas en el carrito
    this.totalCarrito = 0;
    this.carritoSubject.next(this.carritoDeCompras);
  }

  obtenerCarrito() {
    return this.carritoDeCompras;
  }

  obtenerTotalCarrito() {
    return this.totalCarrito;
  }
}

