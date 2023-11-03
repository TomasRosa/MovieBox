import { Component, OnInit } from '@angular/core';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';

@Component({
  selector: 'app-inicio-aux',
  templateUrl: './inicio-aux.component.html',
  styleUrls: ['./inicio-aux.component.css']
})
export class InicioAuxComponent implements OnInit{
  films: any;

  constructor (private dataFilms: FilmsFromAPIService)
  {
  }

  async ngOnInit(): Promise<void>{
    try {
      this.films = await this.obtenerMovies();
      this.mostrarPeliculasRandom();
    } catch (error) {
      console.error("Error al obtener las películas:", error);
    }
  }

  async obtenerMovies ()
  {
    try {
      const data = await this.dataFilms.getMovies();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error al obtener datos de películas:", error);
      throw error;
    }
  }

  mostrarPeliculasRandom ()
  {
    if (this.films && this.films.movies && Array.isArray(this.films.movies[0])) {
      const tabla = document.createElement("table");
      const contenedorTabla = document.getElementById("tablaPeliculas");
  
      for (let i = 0; i < 5; i++) {
        const numeroRandom = Math.floor(Math.random() * this.films.movies[0].length);
        console.log(numeroRandom);
  
        const pelicula = this.films.movies[0][numeroRandom];
  
        const filas = document.createElement("tr");
        filas.innerHTML = `
          <td><img src="${pelicula.img}"></td>
          <td>${pelicula.title}</td>
        `;
  
        tabla.appendChild(filas);
        contenedorTabla?.appendChild(tabla);
      }
    } else {
      console.error("No se encontraron datos de películas.");
    }
  }
}
