import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.css']
})
export class BibliotecaComponent 
{
  usuarioActual: User | null = null;
  bibliotecaVacia: boolean = true;

  constructor (private userService: UserService) {}

  get filas() {
    if (!this.usuarioActual?.arrayPeliculas) {
      return [];
    }

    const filas = [];
    const peliculas = this.usuarioActual.arrayPeliculas;

    for (let i = 0; i < peliculas.length; i += 5) {
      filas.push(peliculas.slice(i, i + 5));
    }

    return filas;
  }

  async ngOnInit(): Promise<void> {
    this.userService.usuarioActual$.subscribe(async (usuario: User | null) => {
      this.usuarioActual = usuario;
  
      // Cargar la biblioteca del usuario actual solo si hay un usuario autenticado
      if (this.usuarioActual) {
        const loadedUser = await this.userService.loadUserBibliotecaById(this.usuarioActual.id);
        if (loadedUser) {
          this.usuarioActual.arrayPeliculas = loadedUser.arrayPeliculas;
        }
      }
  
      this.validarBibliotecaVacia();
    });
  }

  validarBibliotecaVacia (){
    if (this.usuarioActual?.arrayPeliculas.length == 0) this.bibliotecaVacia = true
    else this.bibliotecaVacia = false
  }

  async devolverPelicula (film: Film | undefined)
  {
    if (this.usuarioActual?.arrayPeliculas && film)
    {
      const index = this.usuarioActual?.arrayPeliculas.indexOf(film); 
      if (index !== -1) {
        this.usuarioActual?.arrayPeliculas.splice(index, 1);
        await this.userService.devolverFilm (this.usuarioActual, this.usuarioActual.arrayPeliculas)
      }
    }
  }
}
