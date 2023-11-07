import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private urlJSONServer = 'http://localhost:5000/users';
  private users: User[] = [];
  public isLoggedIn = false;

  private usuarioActualSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUsersFromJSON();
  }

  setUserActual(usuario: User): void {
    this.usuarioActualSubject.next(usuario);
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

  async deleteUser(user: User): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    try {
      await this.http.delete<User>(url).toPromise();
      return { success: true, message: 'Usuario eliminado correctamente.' };
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return { success: false, message: 'Error al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  obtenerUserByEmail (email: string){
    return this.users.find (user => user.email == email)
  }

  verifyUser(inputEmail: string, inputPassword: string): boolean {
    const isUserValid = this.users.some(
      (user) => user.email === inputEmail && user.password === inputPassword
    );
    // Actualizar el estado del usuario
    this.isLoggedIn = isUserValid;

    if (this.isLoggedIn){
      const userActual = this.obtenerUserByEmail(inputEmail)
      this.setUserActual(userActual ?? new User())
    }

    return isUserValid;
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}

