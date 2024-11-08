import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {
  private deuda: number = 0;

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
}

