import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CarritoService } from './carrito.service';
import { User } from '../models/user';
import { Film } from '../models/film';
import { Tarjeta } from '../models/tarjeta';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private urlJSONServer = 'http://localhost:5000/users';
  private users: User[] = [];
  private usuarioActualSubject: BehaviorSubject<User | null>;
  public isLoggedInSubject: BehaviorSubject<boolean | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private carritoService: CarritoService
  ) {
    this.usuarioActualSubject = new BehaviorSubject<User | null>(null);
    this.isLoggedInSubject = new BehaviorSubject<boolean | null>(null);

  const storedUser = this.getUserFromStorage();
  if (storedUser) {
    this.usuarioActualSubject.next(storedUser);
    this.isLoggedInSubject.next (true);

    if (!storedUser.fav_list) {
      this.loadFavouriteListFromServer(storedUser.id).subscribe(favList => {
        storedUser.fav_list = favList;
        this.setUsuarioActual(storedUser);
      });
    }
  } else {
    this.loadUsersFromJSON();
  }
  }

  loadFavouriteListFromServer(userId: number) {
    return this.http.get<User>(`http://localhost:5000/users/${userId}`).pipe(
      map(user => user.fav_list)
    );
  }

  setUsuarioActual(usuario: User): void {
    this.saveUserToStorage(usuario);
    this.usuarioActualSubject.next(usuario);
    this.isLoggedInSubject.next (true);
  }

  getUserActual(): User | null {
    const currentUser = this.usuarioActualSubject.value;
    console.log("Usuario recuperado:", currentUser);
    return currentUser;
  }

  getUserActualJSON(): Observable<User | null> {
    const currentUser = this.usuarioActualSubject.value;
    
    if (currentUser) {
      return this.http.get<User>(`http://localhost:5000/users/${currentUser.id}`).pipe(
        map(userFromServer => {
          this.usuarioActualSubject.next(userFromServer); // Actualizamos el BehaviorSubject con el valor actualizado.
          return userFromServer;
        })
      );
    } else {
      return this.http.get<User>(`http://localhost:5000/users/1`).pipe( // Ajusta el ID de usuario si es necesario.
        map(userFromServer => {
          this.usuarioActualSubject.next(userFromServer);
          return userFromServer;
        })
      );
    }
  }

  getIsLoggedIn (){
    return true;
  }

  get isLoggedIn$ (): Observable<boolean | null > {
    return this.isLoggedInSubject.asObservable ();
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

  crearCarrito(usuario: User) {
    usuario.arrayPeliculas = [];
  }

  checkEmailExists(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.urlJSONServer}?email=${email}`);
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

  async quitarFilmDeLista (userActual: User, newList: Array<Film>){
    const url = `${this.urlJSONServer}/${userActual.id}`;
    userActual.fav_list.arrayPeliculas = newList
    try {
      await this.http.patch<User>(url, userActual).toPromise();
    } catch (error) {
      console.error('Error al quitar la pelicula de la lista:', error);
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

  async changeDataCard (user: User|null, newCard: Tarjeta){
    if (user!=null){
      const url = `${this.urlJSONServer}/${user.id}`;
      user.tarjeta = newCard;
      try {
        await this.http.patch(url, user).toPromise();
        this.usuarioActualSubject.next (user);
        this.saveUserToStorage(user); // Actualizamos el almacenamiento local
        return { success: true, message: 'Tarjeta cambiada correctamente.' };
      } catch (error) {
        console.error('Error al cambiar los datos de la tarjeta:', error);
        return { success: false, message: 'Error al cambiar los datos de la tarjeta. Por favor, inténtalo de nuevo más tarde.' };
      }
    }
    return { success: false, message: 'Error al eliminar la tarjeta. Por favor, inténtalo de nuevo más tarde.' };
  }

  async addCard (user: User | null, newCard: Tarjeta){
    if (user!=null){
      const url = `${this.urlJSONServer}/${user.id}`;
      user.tarjeta = newCard;
      try {
        await this.http.patch(url, user).toPromise();
        this.usuarioActualSubject.next (user);
        this.saveUserToStorage(user); 
        return { success: true, message: 'Tarjeta cargada correctamente.' };
      } catch (error) {
        console.error('Error al cargada la tarjeta:', error);
        return { success: false, message: 'Error al cargada la tarjeta. Por favor, inténtalo de nuevo más tarde.' };
      }
    }
    return { success: false, message: 'Error al cargar la tarjeta. Por favor, inténtalo de nuevo más tarde.' };
  }

  async deleteCard (user: User|null): Promise<{ success: boolean, message: string }> {
    if (user!=null){
      const url = `${this.urlJSONServer}/${user.id}`;
      user.tarjeta = new Tarjeta ()
      try {
        await this.http.patch(url, user).toPromise();
        this.usuarioActualSubject.next (user);
        this.saveUserToStorage(user); // Actualizamos el almacenamiento local
        return { success: true, message: 'Tarjeta eliminada correctamente.' };
      } catch (error) {
        console.error('Error al eliminar la tarjeta:', error);
        return { success: false, message: 'Error al eliminar la tarjeta. Por favor, inténtalo de nuevo más tarde.' };
      }
    }
    return { success: false, message: 'Error al eliminar la tarjeta. Por favor, inténtalo de nuevo más tarde.' };
  }


  async changeFirstName(user: User, newFirstName: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    user.firstName  = newFirstName; 
    try {
      await this.http.patch(url, user).toPromise();
      this.usuarioActualSubject.next(user); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveUserToStorage(user); // Actualizamos el almacenamiento local
      return { success: true, message: 'Nombre cambiado correctamente.' };
    } catch (error) {
      console.error('Error al cambiar el nombre del usuario:', error);
      return { success: false, message: 'Error al cambiar el nombre. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async changeLastName(user: User, newLastName: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    user.lastName  = newLastName; 
    try {
      await this.http.patch(url, user).toPromise();
      this.usuarioActualSubject.next(user); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveUserToStorage(user); // Actualizamos el almacenamiento local
      return { success: true, message: 'Apellido cambiado correctamente.' };
    } catch (error) {
      console.error('Error al cambiar el apellido del usuario:', error);
      return { success: false, message: 'Error al cambiar el apellido. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async changeDNI(user: User, newDNI: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    user.dni  = newDNI; 
    try {
      await this.http.patch(url, user).toPromise();
      this.usuarioActualSubject.next(user); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveUserToStorage(user); // Actualizamos el almacenamiento local
      return { success: true, message: 'DNI cambiado correctamente.' };
    } catch (error) {
      console.error('Error al cambiar el DNI del usuario:', error);
      return { success: false, message: 'Error al cambiar el DNI. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async changeAddress(user: User, newAddress: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    user.address  = newAddress; 
    try {
      await this.http.patch(url, user).toPromise();
      this.usuarioActualSubject.next(user); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveUserToStorage(user); // Actualizamos el almacenamiento local
      return { success: true, message: 'Direccion cambiada correctamente.' };
    } catch (error) {
      console.error('Error al cambiar la direccion del usuario:', error);
      return { success: false, message: 'Error al cambiar la direccion. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async changeEmail(user: User, newEmail: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    user.email  = newEmail; 
    try {
      await this.http.patch(url, user).toPromise();
      this.usuarioActualSubject.next(user); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveUserToStorage(user); // Actualizamos el almacenamiento local
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
      this.usuarioActualSubject.next(user); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveUserToStorage(user); // Actualizamos el almacenamiento local
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
    this.isLoggedInSubject.next (false);
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

