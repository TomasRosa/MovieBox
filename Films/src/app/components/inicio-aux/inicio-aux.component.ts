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
      if (this.films)
      {
        this.mostrarPeliculasRandom();
      }
    } catch (error) {
      console.error("Error al obtener las películas:", error);
    }
  }

  async obtenerMovies ()
  {
    this.dataFilms.getMovies().subscribe((data) => {
      this.films = data;
      console.log(this.films);
      // Aquí puedes realizar cualquier otra operación con los datos
      this.mostrarPeliculasRandom();
    });
     /* try {
      const data = await this.dataFilms.getMovies();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error al obtener datos de películas:", error);
      throw error;
    }  */
  }

  mostrarPeliculasRandom ()
  {
    if (this.films) {
      const tabla = document.createElement("table");
      const contenedorTabla = document.getElementById("tablaPeliculas");
  
      for (let i = 0; i < 5; i++) {
        const numeroRandom = Math.floor(Math.random() * 30);
        const filas = document.createElement("tr");
        filas.innerHTML = `
          <td><img src="${this.films[0].movies[numeroRandom].img}"></td>
          <td>${this.films[0].movies[numeroRandom].title}</td>
        `;
  
        tabla.appendChild(filas);
      }
  
      if (contenedorTabla) {
        contenedorTabla.appendChild(tabla);
      } else {
        console.error("No se encontró el contenedor de la tabla.");
      }
    } else {
      console.error("No se encontraron datos de películas.");
    }
}
}