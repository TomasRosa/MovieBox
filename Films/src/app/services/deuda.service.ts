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
  isCountingDown: boolean = false;
  isAlreadyCount: boolean = false;
  deudaIntervalId: any;
  movieLibrary: Film[] = [];
  private contadorSubject = new BehaviorSubject<number>(0);
  contador$ = this.contadorSubject.asObservable();
  contador = 0;

  constructor(private http: HttpClient, private userService: UserService) 
  {
    userService.biblioteca$.subscribe ( b => {
      if (b)
      {
        this.movieLibrary = b;
        if (this.movieLibrary.length != 0)
        {
          this.contadorPeliculasSinTiempo(this.movieLibrary);
          this.contador$.subscribe (c => {
            this.contador = c;
          })
        }
      }
    })
  }

  async calcularDeuda(user: User | null) {
    if (user) {
      user.deuda = await this.getDeudaJSON(user.id);
  
      if (this.contador > 0) {
        // Solo iniciar acumulador si hay películas con tiempo agotado
        this.iniciarAcumuladorDeDeuda(user, 20, this.contador);
      }
    }
  }

  contadorPeliculasSinTiempo(movieLibrary: Film[]): number {
    let cont = 0;
    for (let i = 0; i < movieLibrary.length; i++) {
      if (this.countdowns[movieLibrary[i].id] === "00:00:00") {
        cont++;
      }
    }

    this.contadorSubject.next(cont); 
    return cont;
  }

  iniciarAcumuladorDeDeuda(user: User, montoPorIntervalo: number, cantPelis: number) {
    if (this.deudaIntervalId) {
      clearInterval(this.deudaIntervalId);
    }

    if (this.contador == this.movieLibrary.length)
    {
      this.clearInterval()
    }
  
    this.deudaIntervalId = setInterval(async () => {
      let userAux = await this.userService.getUserById(user.id)

      if (userAux && userAux != user)
      {
        user = userAux;
      }
      await this.sumarDeuda(user, montoPorIntervalo, cantPelis);
    }, 10000); // Ejecutar cada 10 segundos
  }
  
  async sumarDeuda(user: User, montoPorIntervalo: number, cantPelis: number) {
    this.deuda = user.deuda;
    const deudaPorIntervalo = montoPorIntervalo * cantPelis;
  
    this.deuda += deudaPorIntervalo;
    this.deudaSubject.next(this.deuda);
    console.log(`Nueva deuda: ${this.deuda}`);
  
    await this.updateDeudaUser(user);
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
      return '00:00:00';
    }
  
    const segundos = Math.floor(diferencia / 1000);
    const milisegundos = diferencia % 1000;
  
    return `${segundos} s ${Math.floor(milisegundos / 100)} ms`;
  }

  startCountdownDiezSegundos() {
    if (this.intervalId) {
      this.clearInterval();
    }

    if (this.isCountingDown) {
      console.log("El intervalo ya está activo.");
      return false;
    }
    
    this.isCountingDown = true;

    let user = this.userService.getUserFromStorage();
  
    this.contador$.subscribe (c => {
       this.contador = c;
    })
  
    if (this.movieLibrary) {
      this.intervalId = setInterval(async () => {
        this.contadorPeliculasSinTiempo(this.movieLibrary)

        this.movieLibrary.forEach(film => {
          const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);
          this.countdowns[film.id] = timeRemaining;
        });

        // Calcular y acumular deuda con el contador resultante
        if (user) {
          await this.calcularDeuda(user);
        }
      }, 1000); // Ejecutar cada segundo
      return true;
    }
    return false;
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
