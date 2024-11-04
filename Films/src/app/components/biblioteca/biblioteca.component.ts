import { Component } from '@angular/core';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private userService: UserService,
    private Flist: FavouriteListService,
    private sharedService: SharedServicesService,
    private route: ActivatedRoute // Importar el servicio de rutas activas
  ) { }
  
  async ngOnInit(): Promise<void> {
    this.userService.isLoggedIn$.subscribe((isLoggedIn: boolean | null) => {
      this.isLoggedIn = isLoggedIn;
    });
  
    if (this.userService.storedAdmin) {
      this.isAdmin = true;
    }
  
    if (!this.isAdmin && !this.isLoggedIn) {
      alert("Debe iniciar sesión para ver su biblioteca.");
      return;
    } else if (this.isAdmin) {
      // Obtener el userId desde los parámetros de la URL
      let userId =+ this.route.snapshot.paramMap.get('userId')!;
      console.log ("USER ID: ", userId)
      if (userId) {
        const loadedUser = await this.userService.loadUserBibliotecaById(userId);
        console.log ("LOADED USER: ", loadedUser)
        if (loadedUser) {
          this.usuarioActual = loadedUser;
          this.movieLibrary = loadedUser.arrayPeliculas;
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
            this.movieLibrary = loadedUser.arrayPeliculas;
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

  async devolverPelicula (film: Film | undefined){
    if (this.movieLibrary && film){
      const index = this.movieLibrary.indexOf(film); 
      if (index !== -1) {
        this.movieLibrary.splice(index, 1);
        await this.userService.devolverFilm (this.usuarioActual as User, this.movieLibrary)
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

}
