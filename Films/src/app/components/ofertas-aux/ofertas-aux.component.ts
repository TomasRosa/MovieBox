import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { CarritoService } from 'src/app/services/carrito.service';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ofertas-aux',
  templateUrl: './ofertas-aux.component.html',
  styleUrls: ['./ofertas-aux.component.css']
})
export class OfertasAuxComponent implements OnInit {
  private films: any;
  private originalFilms: any;
  filteredFilms: any[] = [];

  constructor(private dataFilms: FilmsFromAPIService, private carritoService: CarritoService, private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    await this.dataFilms.initializeData();
    this.originalFilms = this.dataFilms.getMovies();
    this.films = [...this.originalFilms];
    this.filteredFilms = this.films.filter((film: Film) => film.precio > 1500);
    this.mostrarPeliculasEnOferta();
  }

  agregarPeliculaAlCarrito (film: Film){
    if(this.userService.isLoggedIn)
    {
      this.carritoService.agregarAlCarrito(film)
    }
    else
    {
      alert("Debes iniciar sesion para agregar peliculas al carrito. ");
    }
  } 

  mostrarPeliculasEnOferta() 
  {
    if (this.filteredFilms) 
    {
      const tabla = document.createElement("table");
      const contenedorTabla = document.getElementById("peliculasEnOferta");
  
      let tbody = document.createElement("tbody");
      tabla.appendChild(tbody);
  
      for (let i = 0; i < this.filteredFilms.length; i++) {
        if (i % 5 === 0) 
        {
            let fila = document.createElement("tr");
            let nuevaFila = document.createElement ("tr");
            let filaBoton = document.createElement ("tr");
  
            for (let j = 0; j < 5; j++) {
              if (i + j >= this.filteredFilms.length) {
                break;
              }

              let precioAnterior = this.filteredFilms[i + j].precio;
  
              const celda = document.createElement("td");
              celda.innerHTML = `
                <img alt="Imagen no disponible" src="${this.filteredFilms[i + j].image}" width="200" height="300">
                <i><b style="font-size: 15px;">${this.filteredFilms[i + j].title}</b></i>
                <i><b style="font-size: 15px;"><s>${precioAnterior}</s></b></i>
              `;

              const nuevaCelda = document.createElement("td");
              nuevaCelda.innerHTML = `
                <i><b style="font-size: 15px;" class = "classNuevoPrecio">Nuevo precio: $${this.filteredFilms[i + j].precio/2}</b></i>
              `;

              const celdaBoton = document.createElement("td");
              const boton = document.createElement("button");
              boton.textContent = "🛒";
              boton.addEventListener("click", () => this.agregarPeliculaAlCarrito(this.filteredFilms[i + j]));
              boton.className="btn btn-primary"
              celdaBoton.appendChild(boton);
              this.filteredFilms[i + j].ofertas = true;
              
              fila.appendChild(celda);
              nuevaFila.appendChild (nuevaCelda);
              filaBoton.appendChild (celdaBoton);
            }
            const body = document.getElementById ('body')

            if(body){
              body.appendChild(fila);
              body.appendChild (nuevaFila);
              body.appendChild (filaBoton);
            }
          }
          if (contenedorTabla) {
            contenedorTabla.appendChild(tabla);
          } else {
            console.error("No se encontró el contenedor de la tabla.");
          }
          console.log("FILTERED FILMS OFERTAS: ");
          console.log(this.filteredFilms);
      }
    } else {
      console.error("No se encontraron datos de películas.");
    }
  }
}
