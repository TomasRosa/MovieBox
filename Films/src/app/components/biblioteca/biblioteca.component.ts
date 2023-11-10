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

  private filmSubject = new BehaviorSubject<Array<Film>>([]);

  constructor (private userService: UserService)
  {

  }

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

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      console.log (this.usuarioActual)
    });
  }

  devolverPelicula (film: Film | undefined)
  {
    if (this.usuarioActual?.arrayPeliculas && film)
    {
      const index = this.usuarioActual?.arrayPeliculas.indexOf(film); 

    if (index !== -1) 
    {
      this.usuarioActual?.arrayPeliculas.splice(index, 1);
      this.filmSubject.next(this.usuarioActual?.arrayPeliculas);
    }
  }
}

}
