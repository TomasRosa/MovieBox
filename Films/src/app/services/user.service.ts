import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private urlAPI = 'http://localhost:5000/users'
  mensaje: String = ''

  constructor(private http: HttpClient) { }

  getUsers (): Observable<User[]>{
    return this.http.get<User[]>(this.urlAPI)
  }

  async addUser (user: User): Promise<any>{
    try {
      await fetch (this.urlAPI, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json'
        },
        body: JSON.stringify (user)
      });
      this.mensaje = 'Te has registrado exitosamente!'; // Si la solicitud es exitosa, actualiza el mensaje
    } catch (error) {
      this.mensaje = 'Oops! Error al intentar registrarse.'; // Si hay un error en la solicitud, actualiza el mensaje
      console.error('Error al hacer la solicitud POST:', error);
    }
  }
}
