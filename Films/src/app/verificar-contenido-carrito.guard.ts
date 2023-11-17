import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from './services/carrito.service';
import { Film } from './models/film';

@Injectable({
  providedIn: 'root',
})
export class VerificarContenidoCarrito 
{
  private carritoDeCompras: Array<Film> = [];
  constructor(private carritoService: CarritoService, private router: Router) {
  }

  canActivate(): boolean 
  {
    this.carritoDeCompras = this.carritoService.obtenerCarrito ();
    console.log (this.carritoDeCompras);
    if (this.carritoDeCompras.length > 0) 
    {
      return true;
    } else {
      alert('No lleva peliculas, por ende no puede ejecutar la compra');
      this.router.navigate(['inicio']);
      return false;
    }
  }
}