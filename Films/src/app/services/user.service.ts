import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private urlJSONServer = 'http://localhost:5000/users'
  mensaje: String = ''
  mensajeDelete: String = ''

  constructor(private http: HttpClient) { }

  getUsers (): Observable<User[]>{
    return this.http.get<User[]>(this.urlJSONServer)
  }

  verificarUserEnJson(inputEmail: string, inputPassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.getUsers().subscribe((users: User[]) => {
        let flag = false;
        users.forEach((user: User) => {
          if (user.email === inputEmail && user.password === inputPassword) {
            flag = true;
          }
        });
        resolve(flag);
      });
    });
  }

  async addUser (user: User): Promise<any>{
    try {
      const res = await fetch (this.urlJSONServer, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json'
        },
        body: JSON.stringify (user)
      });
      if (res.status == 200) this.mensaje = 'Eliminado con exito' 
      else this.mensaje = 'Oops! Ha ocurrido un error al intentar eliminar su cuenta.' // Si la solicitud es exitosa, actualiza el mensaje
    } catch (error) {
      this.mensaje = 'Oops! Error al intentar registrarse.'; // Si hay un error en la solicitud, actualiza el mensaje
      console.error('Error al hacer la solicitud POST:', error);
    }
  }

  buscarUserPorDNI(dni: string): Observable<User | undefined> {
    return this.getUsers().pipe(
      map(users => users.find(user => user.dni === dni))
    );
  }

  async deleteUser (user: User){
    const res = this.buscarUserPorDNI(user.dni);
    if (res != undefined){
      try{
        const res = await fetch (this.urlJSONServer, {
          method: 'DELETE',
          headers: {
            'Content-Type':  'application/json'
          },
          body: JSON.stringify (user)
        })
        if (res.status == 200) this.mensajeDelete = 'Eliminado con exito' 
        else this.mensajeDelete = 'Oops! Ha ocurrido un error al intentar eliminar su cuenta.'
      }catch(err){
        this.mensajeDelete = 'Oops! Ha ocurrido un error al intentar eliminar su cuenta.'
        console.error('Ha ocurrido un error al intentar eliminar la cuenta' + err)
      }
    }
  }

  buscarUserPorEmail (email: string): Observable<User | undefined>{
    return this.getUsers().pipe(
      map(users => users.find(user => user.email === email))
    );
  }
}
