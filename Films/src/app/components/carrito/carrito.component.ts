import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { CarritoService } from 'src/app/services/carrito.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

  @Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
  })
  
  export class CarritoComponent implements OnInit {
    carritoDeCompras: Array<Film> = [];
    totalCarrito: number = 0;

    constructor(private carritoService: CarritoService, public userService: UserService, private routerService: Router) {}

    ngOnInit(): void {
      this.carritoService.carrito$.subscribe(carrito => {
        this.carritoDeCompras = carrito;
        this.actualizarTotalCarrito();
      });
      
      if (this.userService.isLoggedIn) 
      {
        this.routerService.navigate(['/carrito']);
      } 
      else 
      {
        alert('Debe iniciar sesión para comprar películas.');
      }
      
    }

    private actualizarTotalCarrito() 
    {
      this.totalCarrito = this.carritoDeCompras.reduce((total, pelicula) => total + (pelicula.precio = this.verificarPrecioPelicula(pelicula)), 0);
    }

    verificarPrecioPelicula (pelicula: Film): number
    {
      if (pelicula.precio > 1500)
      {
        pelicula.precio = pelicula.precio/2;
      }

      return pelicula.precio;
    }

    eliminarDelCarrito(pelicula: Film) {
      this.carritoService.eliminarDelCarrito(pelicula);
    }

    limpiarCarrito() {
      this.carritoService.limpiarCarrito();
    }

    logout()
    {
      this.userService.logout();
      this.carritoService.limpiarCarrito();
    }

    comprar(){
      this.routerService.navigate(['/tarjeta']);
    }
}
  