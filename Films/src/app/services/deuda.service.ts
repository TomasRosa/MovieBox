import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Film } from '../models/film';
import { User } from '../models/user';
import { BehaviorSubject, count } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {
  deuda: number = 0;
  urlJSONServer = 'http://localhost:5000/users';
  intervalId: any;
  countdowns: { [key: number]: string } = {};
  deudaSubject = new BehaviorSubject<number>(0);
  deuda$ = this.deudaSubject.asObservable();
  private isCountingDown: boolean = false;

  constructor(private http: HttpClient, private userService: UserService) 
  {

  }

  async calcularDeuda(user: User | null, movieLibrary: Film[]) {
    // const hoy = new Date();

    // this.userService.storedUser!.arrayPeliculas.forEach(pelicula => {
    //   if (pelicula.fechaDeAgregado) {
    //     const fechaAgregada = new Date(pelicula.fechaDeAgregado);

    //     const diferenciaTiempo = Math.floor((hoy.getTime() - fechaAgregada.getTime()) / (1000 * 3600 * 24)); // días

    //     if (diferenciaTiempo > 7) {
    //       const diasDeDeuda = diferenciaTiempo - 7;
    //       if (diferenciaTiempo == 0)
    //       {
    //         this.deuda = diferenciaTiempo + 20;
    //       }
    //       this.deuda += diasDeDeuda * 20;
    //     }
    //   }
    // });

    if (user)
    {
      user.deuda = await this.getDeudaJSON(user.id);
      if (user.arrayPeliculas)
      {
        let contador = this.contadorPeliculasSinTiempo(movieLibrary)
        this.iniciarAcumuladorDeDeuda (user, 20, contador)
      }
    }
  }

  contadorPeliculasSinTiempo (movieLibrary: Film[])
  {
    let cont = 0;
    for (let i = 0; i < movieLibrary.length; i++)
    {
      if (this.countdowns [movieLibrary[i].id] == '00:00:00')
      {
        cont++;
      }
    }

    return cont;
  }

  iniciarAcumuladorDeDeuda(user: User, montoPorIntervalo: number, cantPelis: number) {
    this.intervalId = setInterval(async () => {
      this.deuda = user.deuda;
      this.deuda += montoPorIntervalo * cantPelis;
      this.deudaSubject.next(this.deuda);
      console.log(`Nueva deuda: ${this.deuda}`);
      await this.updateDeudaUser(user)
    }, 10000); // 10000 ms = 10 segundos
  }

  async getDeudaJSON(id: number) 
  {
    try {
        const users = await this.http.get<User[]>(this.urlJSONServer).toPromise() || [];
        let user = users.find(user => user.id === id)
        if (user)
        {
          this.deudaSubject.next(user.deuda)
          return user.deuda
        }
        else
        {
          return -1;
        }
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return -1;
    }
  }

  async updateDeudaUser (user: User)
  {
    const url = `${this.userService.urlJSONServer}/${user.id}`;

    user.deuda = this.deuda

    try {
      await this.http.patch(url, user).toPromise();
      this.userService.usuarioActualSubject.next(user);
      this.userService.saveUserToStorage(user);
    } catch (error) {
      console.error('Error al guardar la deuda', error);
    }
  }

  getTiempoRestante(fechaDeAgregado: string): string {
    const hoy = new Date();
    const fechaAgregada = new Date(fechaDeAgregado);
    const diferencia = 7 * 24 * 60 * 60 * 1000 - (hoy.getTime() - fechaAgregada.getTime());

    if (diferencia <= 0) {
      clearInterval(this.intervalId);
      return '00:00:00';
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    if (dias > 0) {
      return `${dias} d ${horas} hs ${minutos} m ${segundos} s`;
    } else {
      return `${horas}:${minutos}:${segundos}`;
    }
  }

  startCountdown(movieLibrary: Film[]) 
  {
    // Limpiar cualquier intervalo existente antes de iniciar uno nuevo, para evitar errores
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  
    if (movieLibrary)
      {
        this.intervalId = setInterval(() => {
          movieLibrary.forEach(film => {
            const timeRemaining = this.getTiempoRestante(film.fechaDeAgregado!);
            this.countdowns[film.id] = timeRemaining;
          });
        }, 1000);
        return true;
      }
      
      return false
  }

  getTiempoRestanteDiezSegundos(fechaDeAgregado: string): string {
    const hoy = new Date();
    const fechaAgregada = new Date(fechaDeAgregado);
    const diferencia = 10 * 1000 - (hoy.getTime() - fechaAgregada.getTime());
  
    if (diferencia <= 0) {
      clearInterval(this.intervalId);
      return '00:00:00';
    }
  
    const segundos = Math.floor(diferencia / 1000);
    const milisegundos = diferencia % 1000;
  
    return `${segundos} s ${Math.floor(milisegundos / 100)} ms`;
  }

  startCountdownDiezSegundos(movieLibrary: Film[]) {
    
    if (this.intervalId) {
      this.clearInterval();
    }

    if (this.isCountingDown) {
      console.log("El intervalo ya está activo.");
      return false;
    }

    this.isCountingDown = true;

    let user = this.userService.getUserFromStorage()
  
    if (movieLibrary) {
      this.intervalId = setInterval(() => 
      {
        this.setTimeToFilms (user!, movieLibrary)
        this.contadorPeliculasSinTiempo(movieLibrary)
      }, 1000);
      return true;
    }
    
    return false;
  }

  setTimeToFilms (user: User, movieLibrary: Film [])
  {
    movieLibrary.forEach(async film => {
      const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);
      this.countdowns[film.id] = timeRemaining;
      await this.calcularDeuda(user, movieLibrary)
    });
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
