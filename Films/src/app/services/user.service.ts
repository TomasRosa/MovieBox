import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlJSONServer = 'http://localhost:5000/users';
  private users: User[] = [];
  isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUsersFromJSON();
  }

  getUsers(): User[] {
    return this.users;
  }

  async loadUsersFromJSON() {
    try {
      const users = await this.http.get<User[]>(this.urlJSONServer).toPromise();
      this.users = users || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      this.users = [];
    }
  }

  async addUser(user: User): Promise<User | undefined> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      const newUser = await this.http.post<User>(this.urlJSONServer, JSON.stringify(user), { headers }).toPromise();
      return newUser;
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      throw error;
    }
  }

  async deleteUser(user: User): Promise<void> {
    const url = `${this.urlJSONServer}/${user.id}`;
    try {
      await this.http.delete<User>(url).toPromise();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      throw error;
    }
  }

  verifyUser(inputEmail: string, inputPassword: string): boolean 
  {
    console.log(this.users);
    return this.users.some((user) => user.email === inputEmail && user.password === inputPassword);
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}

