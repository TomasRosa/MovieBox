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
  constructor(private http: HttpClient) 
  {
    this.users = this.getUsersFromJSON();
  }
  private urlJSONServer = 'http://localhost:5000/users'
  
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

  async addUser(user: User): Promise<User|undefined> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    try {
      const newUser = await this.http.post<User>(this.urlJSONServer, JSON.stringify(user), { headers }).toPromise();
      return newUser;
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      throw error; // Reenviar el error para que los componentes que llaman a este método puedan manejarlo también
    }
  }

  async deleteUser(user: User): Promise<void> {
    const url = `${this.urlJSONServer}/${user.id}`;
    try {
      await this.http.delete<User>(url).toPromise();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error; // Lanza el error para que los componentes que llaman a este método puedan manejarlo también
    }
  }

  verificarUserEnJson(inputEmail: string, inputPassword: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.users.subscribe(
        (users: User[]) => {
          let flag = false;
          users.forEach((user: User) => {
            if (user.email === inputEmail && user.password === inputPassword) {
              flag = true;
            }
          });
          resolve(flag);
        },
        (error) => {
          console.error('Error al obtener usuarios:', error);
          resolve(false); // Manejar el error estableciendo el resultado en false
        }
      );
    });
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
