import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DeudaService } from 'src/app/services/deuda.service';

@Component({
  selector: 'app-entregas-pendientes',
  templateUrl: './entregas-pendientes.component.html',
  styleUrls: ['./entregas-pendientes.component.css']
})
export class EntregasPendientesComponent implements OnInit {
  usuarioActual: User | null = null;
  entregasPendientes: Film[] = [];
  isAdmin: boolean | null = false;
  isLoggedIn: Boolean | null = false;
  users: User[] = [];
  isLoggedInSubscription: Subscription = new Subscription();
  biblioteca: Film[] = []
  totalCarrito: number = 0;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private deudaService: DeudaService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.isAdmin = !!this.userService.getAdminActual();

    if (!this.isAdmin) {
      alert("No tienes permisos para ver las entregas pendientes.");
      return;
    }

    const userId = +this.route.snapshot.paramMap.get('id')!;
    if (userId) {
      await this.loadUserData(userId);  // Cargar datos iniciales del usuario
      if (this.usuarioActual) {
        this.calcularTotalCarrito(this.usuarioActual.entregasPendientes);
      }
    } else {
      alert("ID de usuario no válido.");
    }
  }

  async loadUserData(userId: number): Promise<void> {
    const user = await this.userService.getUserById(userId);
    if (user) {
      this.usuarioActual = user;
      this.entregasPendientes = user.entregasPendientes;
      this.biblioteca = user.arrayPeliculas;
      this.userService.saveUserToStorage(user)
    } else {
      console.error('Error: Usuario no encontrado');
    }
  }

  async aceptarEntrega(pelicula: Film) {

    if (this.usuarioActual) {
      let user = await this.userService.getUserById(this.usuarioActual.id);
      if (this.usuarioActual != user) {
        this.usuarioActual = user;
      }
    }
    if (this.usuarioActual) {
      let peliculas: Film[] = []
      peliculas.push(pelicula)
      // Recargar usuario actualizado después de la aceptación
      await this.userService.cargarBiblioteca(this.usuarioActual, peliculas)

      await this.userService.eliminarEntregaPendiente(this.usuarioActual.id, pelicula)
      await this.loadUserData(this.usuarioActual.id);
      this.calcularTotalCarrito(this.usuarioActual.entregasPendientes);
      this.entregasPendientes = this.usuarioActual.entregasPendientes;

      this.deudaService.forceRefresh(true);
    }
  }

  async aceptarTodasLasEntregas() {
    try {
      if (this.usuarioActual) {
        await this.userService.cargarBiblioteca(this.usuarioActual, this.entregasPendientes)
        this.usuarioActual.entregasPendientes = []
        await this.userService.updateUserToJSON(this.usuarioActual)
        await this.loadUserData(this.usuarioActual.id);
        this.entregasPendientes = [];
        this.totalCarrito = 0;

        this.deudaService.forceRefresh();
      }

      console.log("Todas las entregas aceptadas y actualizadas en la biblioteca del usuario.");
    } catch (error) {
      console.error("Error al aceptar todas las entregas:", error);
      alert("Hubo un problema al aceptar todas las entregas.");
    }
  }

  async rechazarTodasLasEntregas() {
    try {
      for (const film of this.entregasPendientes) {
        await this.rechazarEntrega(film);
      }
      console.log("Todas las entregas rechazadas y actualizadas en la biblioteca del usuario.");
    } catch (error) {
      console.error("Error al rechazar todas las entregas:", error);
      alert("Hubo un problema al aceptar todas las entregas.");
    }
  }

  async rechazarEntrega(pelicula: Film) {
    if (this.usuarioActual) {
      await this.userService.eliminarEntregaPendiente(this.usuarioActual.id, pelicula);
      await this.loadUserData(this.usuarioActual.id);
      this.calcularTotalCarrito(this.usuarioActual.entregasPendientes);
      this.entregasPendientes = this.usuarioActual.entregasPendientes;
    }
  }

  calcularTotalCarrito(carrito: Array<Film>) {
    this.totalCarrito = carrito.reduce((total, film) => total + (film.precio || 0), 0);
  }

}
