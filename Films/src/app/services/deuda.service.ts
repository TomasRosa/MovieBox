import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {
  private deuda: number = 0;
  intervalId: any;
  countdowns: { [key: number]: string } = {};

  constructor(private http: HttpClient, private userService: UserService) {
  }

  calcularDeuda() {
    const hoy = new Date();

    this.userService.storedUser!.arrayPeliculas.forEach(pelicula => {
      if (pelicula.fechaDeAgregado) {
        const fechaAgregada = new Date(pelicula.fechaDeAgregado);

        const diferenciaTiempo = Math.floor((hoy.getTime() - fechaAgregada.getTime()) / (1000 * 3600 * 24)); // días

        if (diferenciaTiempo > 7) {
          const diasDeDeuda = diferenciaTiempo - 7;
          if (diferenciaTiempo == 0)
          {
            this.deuda = diferenciaTiempo + 20;
          }
          this.deuda += diasDeDeuda * 20;
        }
      }
    });

    this.updateDeudaUser();
  }

  pagarDeuda() {
    this.deuda = 0;
    this.setStartTimeLocalStorage (new Date().getTime())
  }

  setStartTimeLocalStorage (startTime: number)
  {
    localStorage.setItem('startTime', startTime.toString());
  }

  getStartTimeFromLocalStorage(): number | null {
    const storedStartTime = localStorage.getItem('startTime');
    return storedStartTime ? parseInt(storedStartTime) : null;
  }

  async updateDeudaUser ()
  {
    const url = `${this.userService.urlJSONServer}/${this.userService.storedUser!.id}`;

    this.userService.storedUser!.deuda = this.deuda

    try {
      await this.http.patch(url, this.userService.storedUser!).toPromise();
      this.userService.usuarioActualSubject.next(this.userService.storedUser!);
      this.userService.saveUserToStorage(this.userService.storedUser!);
    } catch (error) {
      console.error('Error al cambiar el nombre del usuario:', error);
    }
  }

  getTiempoRestante(fechaDeAgregado: string): string {
    const hoy = new Date();
    const fechaAgregada = new Date(fechaDeAgregado);
    const diferencia = 7 * 24 * 60 * 60 * 1000 - (hoy.getTime() - fechaAgregada.getTime());

    if (diferencia <= 0) {
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

  startCountdown(movieLibrary: Film[]) {
    // Limpiar cualquier intervalo existente antes de iniciar uno nuevo
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
}

