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
      const body = document.getElementById('body')

      for (let i = 0; i < this.filteredFilms.length; i++) 
      {
          if (i % 5 === 0) {
            let fila = document.createElement("tr");
            let filaBoton = document.createElement ("tr");
    
            for (let j = 0; j < 5; j++) {
              if (i + j >= this.filteredFilms.length) {
                break;
              }
              
              let celda = document.createElement ("td");
              celda.className = "recuadroCelda"
              celda.innerHTML = `
                     <img alt="Imagen no disponible" src="${this.filteredFilms[i + j].image}" width="200" height="300">
                      <b style="font-size: 15px;">${this.filteredFilms[i + j].title}</b>
                      <br>
                      <!-- <i><b style="font-size: 15px;">$${this.filteredFilms[i + j].precio}</b></i> -->
                  `;

              fila.appendChild(celda);
              const celdaBoton = document.createElement("td");

              const botonFicha = document.createElement("button");
              botonFicha.textContent = "Ficha técnica"
              botonFicha.className="btn btn-primary"
              botonFicha.style.marginRight = "10px";

              const botonCarrito = document.createElement("button");
              botonCarrito.textContent = "🛒";
              botonCarrito.addEventListener("click", () => this.agregarPeliculaAlCarrito(this.filteredFilms[i + j]));
              botonCarrito.className="btn btn-primary"
              
              celdaBoton.className = "celdaBotonEspaciado";
              celdaBoton.appendChild (botonFicha);
              celdaBoton.appendChild(botonCarrito);

              filaBoton.appendChild(celdaBoton);
            }
            if(body){
              body.appendChild(fila);
              body.appendChild (filaBoton);
            }
          }
      }
    } else {
      console.error("No se encontraron datos de películas.");
    }
  }    
}
