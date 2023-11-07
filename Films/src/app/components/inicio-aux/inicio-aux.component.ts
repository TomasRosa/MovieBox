import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { CarritoService } from 'src/app/services/carrito.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inicio-aux',
  templateUrl: './inicio-aux.component.html',
  styleUrls: ['./inicio-aux.component.css']
})

export class InicioAuxComponent implements OnInit{
  films: any;
  preciosGenerados: boolean = false;
  filteredFilms: any[] = [];

  constructor(private dataFilms: FilmsFromAPIService, private carritoService: CarritoService, private userService: UserService) {}

   ngOnInit(): void 
   {
    this.dataFilms.initializeData().then(() => {
      this.films = this.dataFilms.getMovies();
      this.filteredFilms = this.films.filter((film:Film) => film.precio <= 1500);
      this.mostrarPeliculasRandom();
    });
  }

  agregarPeliculaAlCarrito(film: Film) {
    if (this.userService.isLoggedIn) 
    {
      this.carritoService.agregarAlCarrito(film);
    } 
    else 
    {
      alert("Debes iniciar sesión para agregar películas al carrito.");
    }
  } 

  mostrarPeliculasRandom() {
    if (this.filteredFilms) 
    {
      const tabla = document.createElement("table");
      const contenedorTabla = document.getElementById("tablaPeliculas");
    
      let tbody = document.createElement("tbody");
      tabla.appendChild(tbody);
    
      for (let i = 0; i < this.filteredFilms.length; i++) 
      {
          if (i % 5 === 0) {
            let fila = document.createElement("tr");
            let filaBoton = document.createElement ("tr");
    
            for (let j = 0; j < 5; j++) {
              if (i + j >= this.filteredFilms.length) {
                break;
              }
    
              const celda = document.createElement("td");
              celda.innerHTML = `
                <img alt="Imagen no disponible" src="${this.filteredFilms[i + j].image}" width="200" height="300">
                <i><b style="font-size: 15px;">${this.filteredFilms[i + j].title}</b></i>
                <i><b style="font-size: 15px;">$${this.filteredFilms[i + j].precio}</b></i>
              `;

              const celdaBoton = document.createElement("td");
              const boton = document.createElement("button");
              boton.textContent = "🛒";
              boton.addEventListener("click", () => this.agregarPeliculaAlCarrito(this.filteredFilms[i + j]));

              fila.appendChild(celda);
              celdaBoton.appendChild(boton);
              filaBoton.appendChild(celdaBoton);
            }
    
            tbody.appendChild(fila);
            tbody.appendChild (filaBoton);
          }
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
