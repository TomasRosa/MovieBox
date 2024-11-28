import { Injectable } from '@angular/core';
import { Film } from 'src/app/models/film';
import { BehaviorSubject, concat } from 'rxjs';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  carritoDeCompras: Array<Film> = [];
  private totalCarrito: number = 0;
  private carritoSubject = new BehaviorSubject<Array<Film>>([]);
  carrito$ = this.carritoSubject.asObservable();
  userId: number = 0;
  user: User | null = null
  carritos: Array<{ userId: Number, carrito: Film[] }> = [];

  constructor() 
  {
  }

  ngOnInit ()
  {
    this.user = this.getUserFromStorage()
    if (this.user)
    {
      this.userId = this.user.id
      this.carritoDeCompras = this.loadCarritoFromStorage(this.userId);
      this.carritoSubject.next(this.carritoDeCompras);
    }
  }

  verSiPoseeDeuda ()
  {
    this.user = this.getUserFromStorage()
    if (this.user!.deuda > 0)
    {
      return true;
    }
    return false;
  }

  agregarAlCarrito(pelicula: Film) 
  {
    let flag = this.verSiPoseeDeuda()

    if (flag)
    {
      alert ("No puede comprar peliculas. Primero salde su deuda")
      this.carritoDeCompras = [];
      return;
    }
    this.carritoDeCompras.push(pelicula);
    this.totalCarrito += pelicula.precio;
    this.saveCarritoToStorage(this.userId, this.carritoDeCompras);
  }

  eliminarDelCarrito(pelicula: Film) {
    const index = this.carritoDeCompras.findIndex((item) => item.rank === pelicula.rank);
    if (index !== -1) {
      this.carritoDeCompras.splice(index, 1);

      const userCarritoIndex = this.carritos.findIndex((item) => item.userId === this.userId);
      if (userCarritoIndex !== -1)
      {
        this.carritos[userCarritoIndex].carrito = this.carritoDeCompras;
      }
      this.totalCarrito -= pelicula.precio;
      this.carritoSubject.next(this.carritoDeCompras);
      this.saveCarritoToStorage(this.userId, this.carritoDeCompras);
    }
  }

  limpiarCarrito() {
    this.carritoDeCompras = []; // Borra todas las películas en el carrito
    this.totalCarrito = 0;
    this.carritos = this.carritos.filter((item) => item.userId == this.userId);
    this.carritoSubject.next (this.carritoDeCompras);
    this.saveCarritoToStorage(this.userId, this.carritoDeCompras);
  }

  obtenerCarrito() {
    return this.carritoDeCompras;
  }

  obtenerTotalCarrito() {
    return this.totalCarrito;
  }

  searchCarritoIndex (userId: Number)
  {
    let userCarritoIndex = -1;

    for (let i = 0; i < this.carritos.length; i++)
    {
      if (this.carritos[i].userId == userId)
      {
        userCarritoIndex = i;
        break;
      }
    }

    return userCarritoIndex;
  }

  private saveCarritoToStorage(userId: Number, carrito: Film[]) {
    const storedData = localStorage.getItem('carritoDeCompras');
  
    if (storedData) {
      this.carritos = JSON.parse(storedData);
    }

    let user = this.getUserFromStorage()
    if (user)
    {
      userId = user.id;
    }

    let userCarritoIndex = this.searchCarritoIndex(userId);

    if (userCarritoIndex !== -1) {
      this.carritos[userCarritoIndex].carrito = carrito;
      this.carritoSubject.next (carrito);
    } else {
      this.carritos.push({ userId, carrito });
      this.carritoSubject.next (carrito);
    }
    localStorage.setItem('carritoDeCompras', JSON.stringify(this.carritos));
  }

  loadCarritoFromStorage(userId: Number): Film[] {
    const storedData = localStorage.getItem('carritoDeCompras');
    if (!storedData) {
      return [];
    }
  
    this.carritos = JSON.parse(storedData);
  
    const userCarrito = this.carritos.find((item) => item.userId === userId);
  
    return userCarrito ? userCarrito.carrito : [];
  }

  getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}


