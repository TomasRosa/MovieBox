  import { Component } from '@angular/core';
  import { Film } from 'src/app/models/film';
  import { FilmsFromApiCarritoService } from 'src/app/services/films-from-api-carrito.service';

  @Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
  })
  export class CarritoComponent {
    message: String = '';
    arrayDePeliculas: Array<Film> = [];
    carritoDeCompras: Array<Film> = []; 
    totalCarrito: number = 0; 

    constructor(private FilmsFromApiCarrito: FilmsFromApiCarritoService) 
    {     
      /*
      this.FilmsFromApiCarrito.getMovies().subscribe((data: any) => {
        this.arrayDePeliculas = data;
    );
    */
       this.arrayDePeliculas = this.FilmsFromApiCarrito.getMoviesJson(); 
    }
    agregarAlCarrito(pelicula: Film) 
    {
      this.carritoDeCompras.push(pelicula); // Agregar la película al carrito
      console.log('Película agregada al carrito:', pelicula);
      this.totalCarrito += pelicula.precio; // Actualizar el precio total del carrito
    }
    eliminarDelCarrito(pelicula: Film) 
    {
      const index = this.carritoDeCompras.indexOf(pelicula);
      if (index !== -1) {
        this.carritoDeCompras.splice(index, 1); // Eliminar la película del carrito
        this.totalCarrito -= pelicula.precio; // Actualizar el precio total del carrito
      }
    }
  }