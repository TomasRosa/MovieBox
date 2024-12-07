import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { Film } from '../models/film';
import { User } from '../models/user';
import { BehaviorSubject, count } from 'rxjs';
import { SharedServicesService } from './shared-services.service';

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
  contadorSubject = new BehaviorSubject<number>(0);
  contador$ = this.contadorSubject.asObservable();
  contador = 0;

  flag = false;

  countdownsSubject = new BehaviorSubject<{ [key: number]: string }>({});
  countdowns$ = this.countdownsSubject.asObservable(); // Observable para suscribirse

  deudaIntervals: { [key: number]: any } = {}; // Intervalos independientes por película

  constructor(private http: HttpClient, private userService: UserService, private sharedServices: SharedServicesService) {
    userService.biblioteca$.subscribe(b => {
      if (b) {
        this.movieLibrary = b;
        if (this.movieLibrary.length != 0) {
          this.contadorPeliculasSinTiempo(this.movieLibrary);
          this.contador$.subscribe(c => {
            this.contador = c;
          })
        }
      }
    })
  }

  startDeudaPorPelicula(user: User, film: Film, montoPorIntervalo: number, isOne?: boolean) {
    if (this.deudaIntervals[film.id]) {
      return;
    }

    this.contador$.subscribe(c => {
      this.contador = c;
    })

    if (this.contador == this.movieLibrary.length) {
      this.clearInterval()
    }

    this.deudaIntervals[film.id] = setInterval(async () => {
      const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);

      let userAux = await this.userService.getUserById(user.id)

      if (userAux && userAux != user) {
        user = userAux;
      }

      if (timeRemaining === '00:00:00') {
        await this.sumarDeudaPorPelicula(user, film, montoPorIntervalo, isOne);
      }
    }, 10000);
  }

  async sumarDeudaPorPelicula(user: User, film: Film, montoPorIntervalo: number, isOne?: boolean) {
    this.deuda = user.deuda
    if (isOne == true) {
      this.deuda += montoPorIntervalo; // Suma al total de deuda
    }
    else {
      this.deuda += montoPorIntervalo * this.contador; // Suma al total de deuda
    }

    this.deudaSubject.next(this.deuda);

    console.log(`Deuda acumulada de ${user.firstName} por película ${film.id}: ${this.deuda}`);
    await this.updateDeudaUser(user); // Actualiza en el backend
  }

  stopDeudaPorPelicula(film: Film) {
    if (this.deudaIntervals[film.id]) {
      clearInterval(this.deudaIntervals[film.id]);
      delete this.deudaIntervals[film.id]; // Limpia el intervalo
    }
  }

  // async calcularDeuda(user: User | null) {
  //   if (user) {
  //     user.deuda = await this.getDeudaJSON(user.id);

  //     if (this.contador > 0) {
  //       // Solo iniciar acumulador si hay películas con tiempo agotado
  //       this.iniciarAcumuladorDeDeuda(user, 20, this.contador);
  //     }
  //   }
  // }

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

  // iniciarAcumuladorDeDeuda(user: User, montoPorIntervalo: number, cantPelis: number) {
  //   if (cantPelis == this.movieLibrary.length)
  //   {
  //     this.clearInterval()
  //   }

  //   this.deudaIntervalId = setInterval(async () => {
  //     let userAux = await this.userService.getUserById(user.id)

  //     if (userAux && userAux != user)
  //     {
  //       user = userAux;
  //     }
  //     await this.sumarDeuda(user, montoPorIntervalo, cantPelis);
  //   }, 10000); // Ejecutar cada 10 segundos
  // }

  // async sumarDeuda(user: User, montoPorIntervalo: number, cantPelis: number) {
  //   this.deuda = user.deuda;

  //   this.deuda += montoPorIntervalo;
  //   this.deudaSubject.next(this.deuda);
  //   console.log(`Nueva deuda: ${this.deuda}`);

  //   await this.updateDeudaUser(user);
  // }

  async getDeudaJSON(id: number) {
    try {
      const users = await this.http.get<User[]>(this.urlJSONServer).toPromise() || [];
      let user = users.find(user => user.id === id)
      if (user) {
        this.deudaSubject.next(user.deuda)
        return user.deuda
      }
      else {
        return -1;
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return -1;
    }
  }

  async updateDeudaUser(user: User) {
    const url = `${this.userService.urlJSONServer}/${user.id}`;

    user.deuda = this.deuda

    try {
      await this.http.patch(url, user).toPromise();
      // this.userService.usuarioActualSubject.next(user);
      // this.userService.saveUserToStorage(user);
    } catch (error) {
      console.error('Error al guardar la deuda', error);
    }
  }

  // getTiempoRestante(fechaDeAgregado: string): string {
  //   const hoy = new Date();
  //   const fechaAgregada = new Date(fechaDeAgregado);
  //   const diferencia = 7 * 24 * 60 * 60 * 1000 - (hoy.getTime() - fechaAgregada.getTime());

  //   if (diferencia <= 0) {
  //     clearInterval(this.intervalId);
  //     return '00:00:00';
  //   }

  //   const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  //   const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //   const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  //   const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

  //   if (dias > 0) {
  //     return `${dias} d ${horas} hs ${minutos} m ${segundos} s`;
  //   } else {
  //     return `${horas}:${minutos}:${segundos}`;
  //   }
  // }

  // startCountdown(movieLibrary: Film[]) 
  // {
  //   // Limpiar cualquier intervalo existente antes de iniciar uno nuevo, para evitar errores
  //   if (this.intervalId) {
  //     clearInterval(this.intervalId);
  //   }

  //   if (movieLibrary)
  //     {
  //       this.intervalId = setInterval(() => {
  //         movieLibrary.forEach(film => {
  //           const timeRemaining = this.getTiempoRestante(film.fechaDeAgregado!);
  //           this.countdowns[film.id] = timeRemaining;
  //         });
  //       }, 1000);
  //       return true;
  //     }

  //     return false
  // }

  getTiempoRestanteDiezSegundos(fechaDeAgregado: string): string {
    const hoy = new Date();
    const fechaAgregada = new Date(fechaDeAgregado);
    const diferencia = 10 * 1000 - (hoy.getTime() - fechaAgregada.getTime());

    if (diferencia <= 0) {
      return '00:00:00';
    }

    const segundos = Math.floor(diferencia / 1000);

    return `${segundos} s`;
  }

  startCountdownDiezSegundos(isOne?: boolean) {
    if (this.intervalId) {
      this.clearInterval();
    }

    this.contador$.subscribe((c) => {
      this.contador = c;
    });

    let user = this.userService.getUserFromStorage();

    this.userService.biblioteca$.subscribe(b => {
      if (b && b.length != this.movieLibrary.length) {
        this.movieLibrary = b;
      }
    })

    if (this.movieLibrary) {
      this.intervalId = setInterval(() => {
        this.contadorPeliculasSinTiempo(this.movieLibrary);

        this.movieLibrary.forEach((film) => {
          const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);
          this.countdowns[film.id] = timeRemaining;

          if (user) {
            // Iniciar el acumulador de deuda para cada película
            this.startDeudaPorPelicula(user, film, 20, isOne);
          }
        });
      }, 1000); // Ejecutar cada segundo
      return true;
    }
    return false;
  }

  async startDeudasDeUsuarios(isOne?: boolean) {

    if (this.intervalId) {
      this.clearInterval();
    }

    this.contador$.subscribe((c) => {
      this.contador = c;
    });

    let users = await this.userService.getUsersFromJSON()
    console.log ("USUARIOS: ", users)

    if (users) {
      for (let i = 0; i < users.length; i++)
      {
        if (users[i] && users[i].arrayPeliculas.length != 0)
        {
          this.movieLibrary = users[i].arrayPeliculas;
          if (this.movieLibrary) {
            this.intervalId = setInterval(() => {
              this.contadorPeliculasSinTiempo(this.movieLibrary);

              this.movieLibrary.forEach((film) => {
                const timeRemaining = this.getTiempoRestanteDiezSegundos(film.fechaDeAgregado!);
                this.countdowns[film.id] = timeRemaining;
                
                this.countdownsSubject.next(this.countdowns);

                if (users)
                {
                  // Iniciar el acumulador de deuda para cada película
                  this.startDeudaPorPelicula(users[i], film, 20, isOne);
                }
              });
              
            }, 1000); // Ejecutar cada segundo
          }
        }
      }
    }
  }

  async forceRefresh (isOne?: boolean)
  {
    this.flag = true;
    await this.startDeudasDeUsuarios(isOne);
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
