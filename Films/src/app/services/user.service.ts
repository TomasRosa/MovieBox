import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService implements OnInit {
  constructor(private http: HttpClient) { }
  private urlJSONServer = 'http://localhost:5000/users'
  mensaje: String = ''
  mensajeDelete: String = ''
  users = new Observable<User[]> ();

  getUsersFromJSON (): Observable<User[]>{
    return this.http.get<User[]>(this.urlJSONServer)
  }
  
  ngOnInit(): void {
    this.getUsersFromJSON ()
  }

  getUsers (): Observable<User[]>{
    return this.users;
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

  addUser(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.urlJSONServer, user, { headers })
      .pipe(
        catchError(error => {
          // Puedes manejar el error aquí según tus necesidades
          this.mensaje = 'Oops! Error al intentar registrarse.';
          console.error('Error al hacer la solicitud POST:', error);
          throw error; // Reenvía el error para que los componentes que llaman a este método puedan manejarlo también
        })
      );
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

  buscarUserPorEmail(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.users.subscribe((users: User[]) => {
        const existe = users.some((user: User) => user.email === email);
        resolve(existe);
      });
    });
  }
}
