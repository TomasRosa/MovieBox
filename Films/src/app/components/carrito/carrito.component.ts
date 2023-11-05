  import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
  import { Film } from 'src/app/models/film';
import { ComunicacionCarritoBarraDeBusquedaService } from 'src/app/services/comunicacion-carrito-barra-de-busqueda.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';

  @Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
  })
  
  export class CarritoComponent implements OnInit {
    message: String = '';
    arrayDePeliculas: Array<Film> = [];
    carritoDeCompras: Array<Film> = []; 
    totalCarrito: number = 0; 

    constructor(private comunicacionConCarrito: ComunicacionCarritoBarraDeBusquedaService, private filmsFromAPIService: FilmsFromAPIService) 
    {     
      this.comunicacionConCarrito.agregarPeliculaAlCarrito$.subscribe(pelicula => {
        this.agregarAlCarrito(pelicula);
      });
    }

    async ngOnInit(): Promise<void> {
      try {
        const fetchedFilms = await this.filmsFromAPIService.getMovies();
        if (fetchedFilms !== null) {
          this.arrayDePeliculas = fetchedFilms;
        } 
        else 
        {
          console.log('array nulo carrito ');
        }
      } catch (error) {
        console.error(error);
      }
    }

    agregarAlCarrito(pelicula: Film) {
      console.log ('PELICULA QUE SE AGREGA'+ pelicula)
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