import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { CarritoService } from 'src/app/services/carrito.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

  @Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
  })
  
  export class CarritoComponent implements OnInit {
    carritoDeCompras: Array<Film> = [];
    totalCarrito: number = 0;

    constructor(private carritoService: CarritoService, public authService: AuthServiceService) {}

    ngOnInit(): void {
      this.carritoService.carrito$.subscribe(carrito => {
        this.carritoDeCompras = carrito;
        this.actualizarTotalCarrito();
      });
    }

    private actualizarTotalCarrito() {
      this.totalCarrito = this.carritoDeCompras.reduce((total, pelicula) => total + pelicula.precio, 0);
    }

    eliminarDelCarrito(pelicula: Film) {
      this.carritoService.eliminarDelCarrito(pelicula);
    }

    limpiarCarrito() {
      this.carritoService.limpiarCarrito();
    }
}
  