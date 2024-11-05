import { Component, OnInit } from '@angular/core';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    // Suscribirse a la observable de login para saber si el usuario está logueado
    this.userService.isLoggedIn$.subscribe((isLoggedIn: boolean | null) => {
      this.isLoggedIn = isLoggedIn;
    });
  
    // Verificar si el usuario es administrador
    this.isAdmin = !!this.userService.storedAdmin;
  
    // Si no es admin ni está logueado, mostrar alerta
    if (!this.isAdmin) {
      alert("No tienes permisos para ver las entregas pendientes.");
      return;
    } 
  
    // Obtener el userId desde los parámetros de la URL
    const userId = +this.route.snapshot.paramMap.get('id')!;
    console.log("USER ID: ", userId);
  
    if (userId) {
      // Cargar el usuario por ID
      const loadedUser = await this.userService.loadUserBibliotecaById(userId);
      console.log("LOADED USER: ", loadedUser);
      
      if (loadedUser) {
        this.usuarioActual = loadedUser; // Asignar el usuario cargado
        this.entregasPendientes = loadedUser.entregasPendientes || []; // Cargar entregas pendientes
        console.log("Entregas pendientes:", this.entregasPendientes);
      } else {
        alert("Usuario no encontrado.");
      }
    } else {
      alert("ID de usuario no válido.");
    }
  }

  async cargarUsuarios(userId: number) {
    try {
      const loadedUser = await this.userService.getUserById(userId);
      console.log("Usuario cargado:", loadedUser); // Verifica qué usuario se está cargando
      if (loadedUser) {
        this.usuarioActual = loadedUser; // Se obtiene todas las propiedades del usuario
        this.entregasPendientes = loadedUser.entregasPendientes || [];
        console.log("Entregas pendientes:", this.entregasPendientes);
      } else {
        alert("Usuario no encontrado.");
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      alert("Hubo un problema al cargar los usuarios.");
    }
  }

  async aceptarEntrega(pelicula: Film) {
    await this.userService.agregarPeliculaABiblioteca(this.usuarioActual!.id, pelicula); // Esperar a que se agregue
    await this.eliminarEntregaPendiente(pelicula); // Esperar a que se elimine
  }

  rechazarEntrega(pelicula: Film) {
    this.eliminarEntregaPendiente(pelicula);
  }

  async eliminarEntregaPendiente(pelicula: Film) {
    await this.userService.eliminarEntregaPendiente(this.usuarioActual!.id, pelicula);
    this.entregasPendientes = this.entregasPendientes.filter(p => p.id !== pelicula.id);
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe(); // Asegúrate de limpiar la suscripción
  }
}
