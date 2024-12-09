import { ChangeDetectorRef, Component } from '@angular/core';
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
  favouriteFilms: Array<Film> = [];  // Inicialización como arreglo vacío
  successMessage = "";

  constructor(
    private userService: UserService,
    private Flist: FavouriteListService,
    private sharedService: SharedServicesService,
    public deudaService: DeudaService,
    public router: Router,
    private route: ActivatedRoute // Importar el servicio de rutas activas
  ) { 
    this.deudaSubscription = this.deudaService.deuda$.subscribe(() => {

       userService.usuarioActual$.subscribe (async u  =>{
        if (u)
         {
          if (u.deuda != 0)
          {
            this.deuda = u.deuda
          }
          else
          {
            this.deuda = await deudaService.getDeudaJSON(u.id)
          }
         }
      })
    });

    this.deudaService.countdowns$.subscribe (c =>{
      this.countdowns = c;
    });
  }
  
  async ngOnInit(){
    await this.initializateLibrary();
    if (this.isLoggedIn && !this.userService.getAdminFromStorage()) {
      this.userService.usuarioActual$.subscribe(user => {
        this.usuarioActual = user as User;
        if (this.usuarioActual)
        {
          if (this.usuarioActual.fav_list)
            {
              this.favouriteFilms = this.usuarioActual.fav_list.arrayPeliculas || [];  // Asegurarse de que sea un arreglo
            }
            this.Flist.loadFavouriteListFromServer(this.usuarioActual.id);
        }
      });
    }

    this.Flist.getChangesObservable().subscribe(() => {
      this.favouriteFilms = [...this.Flist.listaFav.arrayPeliculas];
    });
  }

  // Verifica que favouriteFilms no sea undefined antes de intentar acceder a 'some'
  isFavourite(film: Film): boolean {
    if (!this.favouriteFilms) {
      return false; // Si favouriteFilms no está definido, devuelve false
    }
    return this.favouriteFilms.some((favFilm) => favFilm.id === film.id);
  }

  async toggleFavourite(film: Film) {
    if (!this.isLoggedIn){
      alert ('Debes iniciar sesion para agregar a favoritos una pelicula');
      return;
    }
    if (this.isFavourite(film)) {
      await this.Flist.eliminarDeLaListaFavoritos(film);  // Quitar de favoritos
    } else {
      await this.Flist.agregarALaLista(film); // Agregar a favoritos
    }
    if (this.usuarioActual)
      this.Flist.loadFavouriteListFromServer(this.usuarioActual.id);
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
    }
    else if (this.isAdmin) {
      // Obtener el userId desde los parámetros de la URL
      const userId = +this.route.snapshot.paramMap.get('userId')!;
      
      if (userId) {
        const loadedUser = await this.userService.loadUserBibliotecaById(userId);
        
        if (loadedUser) {
          this.usuarioActual = loadedUser;
          this.movieLibrary = [...this.usuarioActual.arrayPeliculas]; // Clonamos arrayPeliculas

          this.userService.bibliotecaSubject.next (this.movieLibrary)

          // if (this.movieLibrary.length != 0)
          //   {
          //     let flag = this.deudaService.startCountdownDiezSegundos()
          //     if (flag)
          //     {
          //       this.intervalId = this.deudaService.intervalId;
          //     }
              
          //   }
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
            this.userService.bibliotecaSubject.next (this.movieLibrary)
            
            // if (this.movieLibrary.length != 0)
            // {
            //   // await this.deudaService.startCountdown(this.movieLibrary);
            //   let flag = this.deudaService.startCountdownDiezSegundos()
            //   if (flag)
            //   {
            //     this.intervalId = this.deudaService.intervalId;
            //   } 
            // }
          }
        }
        this.validarBibliotecaVacia();
      });
    }
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

        await this.userService.actualizarBiblioteca(this.usuarioActual, this.movieLibrary);
        // this.deudaService.movieLibrary = [...this.movieLibrary];
        await this.deudaService.forceRefresh(false, this.movieLibrary, this.usuarioActual.id)

        const contador = this.deudaService.contadorPeliculasSinTiempo(this.movieLibrary);
        this.deudaService.contadorSubject.next (contador)

        if (this.deudaService.deudaIntervals[film.id]) {
          this.deudaService.stopDeudaPorPelicula (film);

          if (this.movieLibrary.length === 0 || contador === 0)
          {
            this.deudaService.clearInterval();
              
            clearInterval(this.intervalId)
            
            if (this.deudaService.deudaIntervals)
            {
              this.deudaService.deudaIntervals = [];
            }
            this.countdowns = [];
            this.deudaService.countdowns = [];
            this.intervalId = null;
          }
        }
        else if (this.movieLibrary.length == 0 && this.deudaService.deudaIntervalId)
        {
          clearInterval(this.deudaService.deudaIntervalId);
          this.deudaService.deudaIntervalId = null;
          this.countdowns = [];
          this.deudaService.countdowns = [];
        }

        if (this.movieLibrary.length === 0) {
          this.bibliotecaVacia = true;
        }
      }
    }
  }

  // async devolverPelicula(film: Film | undefined): Promise<void> {
  //   if (this.usuarioActual && film) {
  //     const loadedUser = await this.userService.getUserById(this.usuarioActual.id);
  //     if (loadedUser) {
  //       this.usuarioActual = loadedUser;
  //       this.movieLibrary = [...loadedUser.arrayPeliculas];
  //     }
  
  //     const index = this.movieLibrary.findIndex((p) => p.id === film.id);
  //     if (index !== -1) {
  //       this.movieLibrary.splice(index, 1);
  
  //       // Detener el intervalo de deuda asociado a la película
  //       if (this.deudaService.deudaIntervals[film.id]) {
  //         clearInterval(this.deudaService.deudaIntervals[film.id]);
  //         delete this.deudaService.deudaIntervals[film.id];
  //       }
  
  //       // Eliminar la película de los countdowns
  //       delete this.countdowns[film.id];
  //       delete this.deudaService.countdowns[film.id];
  
  //       this.deudaService.movieLibrary = [...this.movieLibrary];
  //       await this.userService.actualizarBiblioteca(this.usuarioActual, this.movieLibrary);
  
  //       // Verificar si quedan películas con tiempo agotado
  //       const contador = this.deudaService.contadorPeliculasSinTiempo(this.movieLibrary);
  
  //       if (contador === 0) {
  //         // Limpiar todos los intervalos si no hay más películas
  //         for (const key in this.deudaService.deudaIntervals) {
  //           clearInterval(this.deudaService.deudaIntervals[key]);
  //           delete this.deudaService.deudaIntervals[key];
  //         }
  
  //         this.countdowns = [];
  //         this.deudaService.countdowns = [];
  //       }
  //       else
  //       {
  //         this.deudaService.contador = contador;
  //         this.deudaService.contadorSubject.next (contador)
  //         this.userService.saveUserToStorage (this.usuarioActual);
  //         this.deudaService.sumarDeudaPorPelicula(this.usuarioActual, film, 20)
  //       }
  
  //       // Manejar biblioteca vacía
  //       if (this.movieLibrary.length === 0) {
  //         this.bibliotecaVacia = true;
  //       }
  //     }
  //   }
  // }

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
    // this.usuarioActual = this.userService.getUserFromStorage();
    if (this.usuarioActual)
    {
      this.usuarioActual.payDeuda = true;
      this.userService.saveUserToStorage (this.usuarioActual);
      this.userService.updateUserToJSON(this.usuarioActual);
      this.successMessage = "Deuda enviada para pagar, presentese al local para abonarla, seguira contando hasta que la salde!"
    }
    setTimeout( () =>{
      this.successMessage = ''
    }, 5000)
  }
}
