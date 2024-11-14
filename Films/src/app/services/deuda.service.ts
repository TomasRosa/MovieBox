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
  intervalId: any;
  countdowns: { [key: number]: string } = {};
  private deudaSubject = new BehaviorSubject<number>(0);
  deuda$ = this.deudaSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) 
  {

  }

  calcularDeuda(user: User) {
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

    console.log ("USER CALCULAR DEUDA: ", user)

    if (user.arrayPeliculas[0] && this.countdowns [user.arrayPeliculas[0].id] == '00:00:00')
    {
      this.iniciarAcumuladorDeDeuda (user, 20)
    }

    // this.updateDeudaUser(user);
  }

  pagarDeuda() {
    this.deuda = 0;
    // this.setStartTimeLocalStorage (new Date().getTime())
  }

  // setStartTimeLocalStorage (startTime: number)
  // {
  //   localStorage.setItem('startTime', startTime.toString());
  // }

  // getStartTimeFromLocalStorage(): number | null {
  //   const storedStartTime = localStorage.getItem('startTime');
  //   return storedStartTime ? parseInt(storedStartTime) : null;
  // }

  iniciarAcumuladorDeDeuda( user: User, montoPorIntervalo: number) {
    this.intervalId = setInterval(() => {
      this.deuda += montoPorIntervalo;
      this.deudaSubject.next(this.deuda);
      console.log(`Nueva deuda: ${this.deuda}`);
    }, 10000); // 10000 ms = 10 segundos
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
    // Limpiar cualquier intervalo existente antes de iniciar uno nuevo
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  
    if (movieLibrary) {
      this.intervalId = setInterval(() => {
        movieLibrary.forEach(film => {
          const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);
          this.countdowns[film.id] = timeRemaining;
          this.calcularDeuda(this.userService.getUserPorBiblioteca(movieLibrary)!)
        });
      }, 1000);
      return true;
    }
    
    return false;
  }
}
