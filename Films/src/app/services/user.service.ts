import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarritoService } from './carrito.service';
import { User } from '../models/user';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlJSONServer = 'http://localhost:5000/users';
  private users: User[] = [];
  private usuarioActualSubject: BehaviorSubject<User | null>;
  public isLoggedIn = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private carritoService: CarritoService
  ) {
    this.usuarioActualSubject = new BehaviorSubject<User | null>(null);

    // Intenta cargar el usuario actual desde el almacenamiento local
    const storedUser = this.getUserFromStorage();
    if (storedUser) {
      this.usuarioActualSubject.next(storedUser);
      this.isLoggedIn = true;
    } else {
      this.loadUsersFromJSON();
    }
  }

  setUsuarioActual(usuario: User): void {
    this.saveUserToStorage(usuario);
    this.usuarioActualSubject.next(usuario);
    this.isLoggedIn = true;
  }

  getUserActual(): User | null {
    return this.usuarioActualSubject.value;
  }

  get usuarioActual$(): Observable<User | null> {
    return this.usuarioActualSubject.asObservable();
  }

  getUsers(): User[] {
    return this.users;
  }

  async loadUsersFromJSON() {
    try {
      if (this.users.length === 0) {
        const users = await this.http.get<User[]>(this.urlJSONServer).toPromise();
        this.users = users || [];
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      this.users = [];
    }
  }

  crearCarrito(usuario: User) 
  {
    usuario.arrayPeliculas = [];
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

  async cargarBiblioteca (user: User, carrito: Array<Film>): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    carrito.forEach(film =>{
      user.arrayPeliculas.push(film)
    }) /* AGREGAMOS LAS NUEVAS PELICULAS A SU BIBLIOTECA */

    try {
      await this.http.patch<User>(url, user).toPromise();
      return { success: true, message: '¡Compra realizada con exito!.' };
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      return { success: false, message: 'Error al realizar la compra. Por favor, inténtalo de nuevo más tarde.' };    
    }
  }

  async devolverFilm (userActual: User, newBiblioteca: Array<Film>){
    const url = `${this.urlJSONServer}/${userActual.id}`;
    userActual.arrayPeliculas = newBiblioteca
    try {
      await this.http.patch<User>(url, userActual).toPromise();
    } catch (error) {
      console.error('Error al realizar la compra:', error);
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

  async changeEmail(user: User, newEmail: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    user.email  = newEmail; /* ASIGNO EL NUEVO EMAIL AL USER. */
    try {
      await this.http.patch(url, user).toPromise();
      return { success: true, message: 'Email cambiado correctamente.' };
    } catch (error) {
      console.error('Error al cambiar el email del usuario:', error);
      return { success: false, message: 'Error al cambiar el email. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async changePassword (user: User, newPassword: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    user.password  = newPassword; /* ASIGNO LA NUEVA PASSWORD AL USER. */
    try {
      await this.http.patch(url, user).toPromise();
      return { success: true, message: 'Contrasenia cambiada correctamente.' };
    } catch (error) {
      console.error('Error al cambiar la contrasenia del usuario:', error);
      return { success: false, message: 'Error al cambiar la contrasenia. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  obtenerUserByEmail (email: string){
    return this.users.find (user => user.email == email)
  }

  verifyUser(inputEmail: string, inputPassword: string): boolean {
    const isUserValid = this.users.some(
      (user) => user.email === inputEmail && user.password === inputPassword
    );
  
    if (isUserValid) {
      const userActual = this.obtenerUserByEmail(inputEmail);
      this.setUsuarioActual(userActual ?? new User());
    }
  
    return isUserValid;
  }

  async loadUserBibliotecaById(userId: number): Promise<User | null> {
    const url = `${this.urlJSONServer}/${userId}`;
    try {
      const user = await this.http.get<User>(url).toPromise();
      if (user) {
        return user;
      } else {
        console.error('Usuario no encontrado.');
        return null;
      }
    } catch (error) {
      console.error('Error al cargar la biblioteca del usuario:', error);
      return null;
    }
  }

  private async loadUserBiblioteca() {
    const userActual = this.getUserActual();
    if (userActual) {
      const url = `${this.urlJSONServer}/${userActual.id}`;
      try {
        const updatedUser = await this.http.get<User>(url).toPromise();
        if (updatedUser) {
          userActual.arrayPeliculas = updatedUser.arrayPeliculas;
        }
      } catch (error) {
        console.error('Error al cargar la biblioteca del usuario:', error);
      }
    }
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('currentUser');
    this.carritoService.limpiarCarrito();
    this.router.navigate(['/inicio']);
  }

  private saveUserToStorage(usuario: User): void {
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }
}

