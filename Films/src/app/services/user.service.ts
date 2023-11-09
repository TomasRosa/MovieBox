import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { CarritoService } from './carrito.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private urlJSONServer = 'http://localhost:5000/users';
  private users: User[] = [];
  public isLoggedIn = false;

  private usuarioActualSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private carritoService: CarritoService) {
    this.loadUsersFromJSON();
  }

  setUsuarioActual(usuario: User): void {
    this.usuarioActualSubject.next(usuario);
  }

  getUserActual(): User | null {
    return this.usuarioActualSubject.value;
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

  async addUserWcarrito(user: User): Promise<User | undefined> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    try {
      const newUser = await this.http.post<User>(this.urlJSONServer, JSON.stringify(user), { headers }).toPromise();
      if (newUser) {
        this.crearCarrito(newUser); // Crea un carrito vacío para el nuevo usuario
      }
      return newUser;
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      return undefined; // Devuelve undefined en caso de error
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
    // Actualizar el estado del usuario
    this.isLoggedIn = isUserValid;

    if (this.isLoggedIn) {
      const userActual = this.obtenerUserByEmail(inputEmail);
      this.setUsuarioActual(userActual ?? new User());
    }

    return isUserValid;
  }
  logout() {
    this.isLoggedIn = false;
    this.carritoService.limpiarCarrito(); // Limpia el carrito al cerrar la sesión
    this.router.navigate(['/login']);
  }
}

