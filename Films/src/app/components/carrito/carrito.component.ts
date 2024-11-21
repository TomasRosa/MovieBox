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
    isEmpty = true;
    isLoggedIn: Boolean | null = false; 

    constructor(private carritoService: CarritoService, public userService: UserService, private routerService: Router) {}

    ngOnInit(): void {
      this.carritoService.ngOnInit()
      this.carritoService.carrito$.subscribe(carrito => {
        this.carritoDeCompras = carrito;
        this.actualizarTotalCarrito();
      });

      console.log ("CARRITO DE COMPRAS QUE LLEGA A COMPONENT: ", this.carritoDeCompras)

      // this.carritoDeCompras = this.carritoService.loadCarritoFromStorage(this.userService.getUserFromStorage()!.id)
      // this.actualizarTotalCarrito();
      
      this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
        this.isLoggedIn = isLoggedIn; 
      })

      if (this.isLoggedIn)
        this.routerService.navigate(['/carrito']);
      else
        alert('Debe iniciar sesión para comprar películas.');

      if (this.carritoDeCompras.length > 0)
        this.isEmpty = false;
    }

    private actualizarTotalCarrito() {
      this.totalCarrito = this.carritoDeCompras.reduce((total, pelicula) => total + (pelicula.precio = this.verificarPrecioPelicula(pelicula)), 0);
    }

    verificarPrecioPelicula (pelicula: Film): number {
      if (pelicula.precio > 1500)
        pelicula.precio = pelicula.precio/2;
      return pelicula.precio;
    }

    eliminarDelCarrito(pelicula: Film) {
      this.carritoService.eliminarDelCarrito(pelicula);
      if (this.carritoDeCompras.length == 0) 
        this.isEmpty = true;
    }

    limpiarCarrito() {
      this.carritoService.limpiarCarrito();
      if (this.carritoDeCompras.length == 0)
        this.isEmpty = true;
    }

    logout(){
      this.userService.logout();
      this.carritoService.limpiarCarrito();
    }

    comprar() {
      this.routerService.navigate(['/tarjeta']);
    }
}
  