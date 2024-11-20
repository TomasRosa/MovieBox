import { Injectable } from '@angular/core';
import { Film } from 'src/app/models/film';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoDeCompras: Array<Film> = [];
  private totalCarrito: number = 0;
  private carritoSubject = new BehaviorSubject<Array<Film>>([]);
  carrito$ = this.carritoSubject.asObservable();
  userId: Number = 0;
  user: User | null = null

  constructor() 
  {
  }

  ngOnInit ()
  {
    this.user = this.getUserFromStorage()
    if (this.user)
    {
      this.userId = this.user.id
      this.loadCarritoFromStorage();
    }
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

  private saveCarritoToStorage() 
  {
    const dataToStore = {
      userId: this.userId,
      carrito: this.carritoDeCompras,
    };
    localStorage.setItem('carritoDeCompras', JSON.stringify(dataToStore));
  }

  private loadCarritoFromStorage() {
    const storedData = localStorage.getItem('carritoDeCompras');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.userId == this.userId)
      {
        this.carritoDeCompras = parsedData.carrito || [];
      }
      else
      {
        this.carritoDeCompras = []
      }
      this.carritoSubject.next(this.carritoDeCompras);
    }
  }

  getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}


