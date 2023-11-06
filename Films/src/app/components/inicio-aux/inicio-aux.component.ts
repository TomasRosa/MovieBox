import { Component, OnInit } from '@angular/core';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';

@Component({
  selector: 'app-inicio-aux',
  templateUrl: './inicio-aux.component.html',
  styleUrls: ['./inicio-aux.component.css']
})

export class InicioAuxComponent implements OnInit{
  films: any;
  preciosGenerados: boolean = false; 

  constructor (private dataFilms: FilmsFromAPIService)
  {
    
  }

  async ngOnInit(): Promise<void>
  {
    await this.dataFilms.initializeData();
    this.films = this.dataFilms.getMovies ();
    this.mostrarPeliculasRandom();
   }

  mostrarPeliculasRandom() {
    if (this.films) {
      const tabla = document.createElement("table");
      const contenedorTabla = document.getElementById("tablaPeliculas");
      let filaImagenes = document.createElement("tr");
      let filaTitulos = document.createElement("tr");
      let filaPrecios = document.createElement("tr");
      
      for (let i = 0; i < this.films.length; i++) {
        if (i % 5 === 0) {
          filaImagenes = document.createElement("tr");
          filaTitulos = document.createElement("tr");
          filaPrecios = document.createElement("tr");

          tabla.appendChild(filaImagenes);
          tabla.appendChild(filaTitulos);
          tabla.appendChild(filaPrecios);
        }
        const celdaImagenes = document.createElement("td");
        const celdaTitulos = document.createElement("td");
        const celdaPrecios = document.createElement("td");
        
        celdaImagenes.innerHTML = `<img alt="Imagen no disponible" src='${this.films[i].image}' width="200" height="300">`;
        celdaTitulos.innerHTML = `<i><b style="font-size: 15px;">${this.films[i].title}</b></i>`;
        celdaPrecios.innerHTML = `<i><b style="font-size: 15px;">$${this.films[i].precio}</b></i>`;
        
        filaImagenes.appendChild(celdaImagenes);
        filaTitulos.appendChild(celdaTitulos);
        filaPrecios.appendChild(celdaPrecios);
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