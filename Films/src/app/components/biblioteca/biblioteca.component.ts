import { Component } from '@angular/core';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeudaService } from 'src/app/services/deuda.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.css']
})
export class BibliotecaComponent 
{
  usuarioActual: User | null = null;
  bibliotecaVacia: boolean = true;
  movieLibrary:Film[] = [];
  isLoggedIn: Boolean | null = false
  isAdmin: Boolean | null = false
  deuda: number = 0;
  intervalId: any;
  countdowns: { [key: number]: string } = {};
  deudaSubscription: Subscription = new Subscription;
  

  constructor(
    private userService: UserService,
    private Flist: FavouriteListService,
    private sharedService: SharedServicesService,
    public deudaService: DeudaService,
    public router: Router,
    private route: ActivatedRoute // Importar el servicio de rutas activas
  ) { 
    this.deudaSubscription = this.deudaService.deuda$.subscribe(nuevaDeuda => {
      this.deuda = nuevaDeuda;
    });
  }
  
  async ngOnInit(){
    await this.initializateLibrary()
  }

  async initializateLibrary(): Promise<void> {
    this.userService.isLoggedIn$.subscribe((isLoggedIn: boolean | null) => {
      this.isLoggedIn = isLoggedIn;
    });
  
    if (this.userService.getAdminFromStorage ()){
      this.isAdmin = true;
    }
  
    if (!this.isAdmin && !this.isLoggedIn) {
      alert("Debe iniciar sesión para ver su biblioteca.");
      return;
    } else if (this.isAdmin) {
      // Obtener el userId desde los parámetros de la URL
      const userId = +this.route.snapshot.paramMap.get('userId')!;
      
      if (userId) {
        const loadedUser = await this.userService.loadUserBibliotecaById(userId);
        
        if (loadedUser) {
          this.usuarioActual = loadedUser;
          this.movieLibrary = [...this.usuarioActual.arrayPeliculas]; // Clonamos arrayPeliculas

          let flag = await this.deudaService.startCountdown(this.movieLibrary);
          if (flag)
          {
             this.intervalId = this.deudaService.intervalId;
          }
          this.validarBibliotecaVacia();
        }
      } else {
        alert("Usuario no encontrado.");
      }
    } else {
      // Caso para un usuario logueado no admin
      this.userService.usuarioActual$.subscribe(async (usuario: User | null) => {
        this.usuarioActual = usuario;
        
        if (this.usuarioActual) {
          const loadedUser = await this.userService.loadUserBibliotecaById(this.usuarioActual.id);
          
          if (loadedUser) {
            this.movieLibrary = [...loadedUser.arrayPeliculas]; // Clonamos arrayPeliculas

            // await this.deudaService.startCountdown(this.movieLibrary);
            // let flag = this.deudaService.startCountdownDiezSegundos(this.movieLibrary)
            // if (flag)
            // {
            //   this.intervalId = this.deudaService.intervalId;
            // }
          }
        }
        this.validarBibliotecaVacia();
      });
    }

    this.countdowns = this.deudaService.countdowns;
  }
  
  ngOnDestroy(): void 
  {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.deudaSubscription.unsubscribe();
  }


  validarBibliotecaVacia (){
    if (this.movieLibrary.length == 0) this.bibliotecaVacia = true
    else this.bibliotecaVacia = false
  }

  async devolverPelicula(film: Film | undefined): Promise<void> {
    if (this.usuarioActual && film) {
      const loadedUser = await this.userService.getUserById(this.usuarioActual.id);
      if (loadedUser) {
        this.usuarioActual = loadedUser;
        this.movieLibrary = [...loadedUser.arrayPeliculas];
      }
  
      const index = this.movieLibrary.findIndex(p => p.id === film.id);
      if (index !== -1) {
        this.movieLibrary.splice(index, 1);
        
        // Sincronizar la biblioteca en el servidor
        await this.userService.actualizarBiblioteca(this.usuarioActual.id, this.movieLibrary);
        if (this.movieLibrary.length === 0) {
          this.bibliotecaVacia = true;
        }
      }
    }
  }

  navegarFilmDetail(id: number) {
    this.sharedService.navegarFilmDetail (id);
  }

  getMovieGroups(movies: any[]): any[][] {
    return this.sharedService.getMovieGroups(movies);
  }  

  agregarALaListaDeFavoritos (film: Film) {
    this.Flist.agregarALaLista(film);
  }
  
  navegarFavouriteList() {
    this.sharedService.navegarFavouriteList();
  } 
  pagarDeuda ()
  {
    this.router.navigate(['/tarjeta']);
  }
}
