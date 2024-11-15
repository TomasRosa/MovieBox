import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../models/user';
import { Film } from '../models/film';
import { Tarjeta } from '../models/tarjeta';
import { Admin } from '../models/admin';
import { AdminService } from './admin.service';
import { SharedServicesService } from './shared-services.service';
import { useAnimation } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  urlJSONServer = 'http://localhost:5000/users';
  public urlJSONServerAdmins = 'http://localhost:5000/admins';
  private users: User[] = [];
  usuarioActualSubject: BehaviorSubject<User | null>;
  private adminActualSubject: BehaviorSubject<Admin | null>;
  public isLoggedInSubject: BehaviorSubject<boolean>;
  public storedUser: User | null = null;
  public storedAdmin: Admin | null = null;
  public showFormAddCard: BehaviorSubject <boolean | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private adminService: AdminService
  ) {
    this.usuarioActualSubject = new BehaviorSubject<User | null>(null);
    this.adminActualSubject = new BehaviorSubject<Admin | null>(null);
    this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    this.usuarioActualSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.adminActualSubject = new BehaviorSubject<Admin | null>(this.getAdminFromStorage());
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getUserFromStorage() || !!this.getAdminFromStorage());
    this.showFormAddCard = new BehaviorSubject<boolean | null>(null);

    this.loadUsersFromJSON();
    this.adminService.loadAdminsFromJSON();
  }

  saveUserToStorage(usuario: User | null): void {
    if (usuario) {
      this.usuarioActualSubject.next (usuario);
      localStorage.setItem('currentUser', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('currentUser');
    }
  }

  // Cargar usuario de localStorage
  getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Guardar administrador en localStorage
  private saveAdminToStorage(admin: Admin | null): void {
    if (admin) {
      this.adminActualSubject.next (admin)
      this.adminService.setAdminActual (admin);
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('currentAdmin');
    }
  }

  // Cargar administrador de localStorage
  getAdminFromStorage(): Admin | null {
    const storedAdmin = localStorage.getItem('currentAdmin');
    return storedAdmin ? JSON.parse(storedAdmin) : null;
  }

  setUsuarioActual(usuario: User | null): void {
    this.saveUserToStorage(usuario);
    this.usuarioActualSubject.next(usuario);
    this.isLoggedInSubject.next(true);
  }

  // Establecer administrador actual
  setAdminActual(admin: Admin | null): void {
    this.saveAdminToStorage(admin);
    this.adminActualSubject.next(admin);
    this.isLoggedInSubject.next(true);
  }

  
  getUserActual(): User | null {
    return this.usuarioActualSubject.value;
  }

  getAdminActual(): Admin | null {
    return this.adminActualSubject.value;
  }
  
  get isLoggedIn$ (): Observable<boolean | null > {
    return this.isLoggedInSubject.asObservable ();
  }

  get usuarioActual$(): Observable<User | null> {
    return this.usuarioActualSubject.asObservable();
  }

  get adminActual$(): Observable<Admin | null> {
    return this.adminActualSubject.asObservable();
  }

  navegarAdminCode (isAdmin: boolean){
    if (isAdmin){
      this.router.navigate(['admin-code']);
    }
  }

  loadFavouriteListFromServer(userId: number) {
    return this.http.get<User>(`http://localhost:5000/users/${userId}`).pipe(
      map(user => user.fav_list)
    );
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

  get showFormAddCard$(): Observable<boolean | null > {
    return this.showFormAddCard.asObservable ();
  }

  getUsers(): User[] {
    return this.users;
  }

  async getUsersFromJSON (): Promise<User[] | null>{
    try{
      const users = await this.http.get<User[]>(this.urlJSONServer).toPromise();
      return users ?? [];
    }catch (error){
      console.error('Error al obtener usuarios:', error);
    }
    return null;
  }

  async loadUsersFromJSON() {
    let usersReturn: User[] = [];
    console.log ('antes de if en load')
    try {
      if (this.users.length === 0) {
        console.log ('entro a if de 0 en load')
        const users = await this.http.get<User[]>(this.urlJSONServer).toPromise();
        usersReturn = users || [];
        this.users = users || [];
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      this.users = [];
      usersReturn = [];
    }
    return usersReturn;
  }

  async verifyUserOrAdmin(inputEmail: string, inputPassword: string): Promise<{ isUser: boolean, isAdmin: boolean, user?: User, admin?: Admin }> {
    return new Promise(async (resolve) => {
        // Verificar usuarios
        this.users = await this.loadUsersFromJSON();
        console.log ("USUARIOS QUE TOMA: ", this.users)

        const isUserValid = this.users.some(
            (user) => user.email === inputEmail && user.password === inputPassword
        );

        if (isUserValid) {
            const user = this.users.find(user => user.email === inputEmail);
            if (user) {
                this.setUsuarioActual(user);
                resolve({ isUser: true, isAdmin: false, user });
                return;
            }
        }

        try {
            // Verificar administradores
            const admins = await this.http.get<Admin[]>(`${this.urlJSONServerAdmins}`).toPromise();
            if (admins) {
              let isAdminValid = false;
                admins.forEach(a => {
                  if (a.email == inputEmail && a.password == inputPassword)
                  {
                    isAdminValid = true;
                  }
                })

                if (isAdminValid) {
                    const admin = admins.find(admin => admin.email == inputEmail);
                    if (admin) {
                        // this.setAdminActual (admin);
                        this.adminService.setAdminActual(admin); // Almacenar el admin
                        resolve({ isUser: false, isAdmin: true, admin });
                        return;
                    }
                }
            }

            resolve({ isUser: false, isAdmin: false });
        } catch (error) {
            console.error('Error al verificar administradores:', error);
            resolve({ isUser: false, isAdmin: false });
        }
    });
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

  async deleteUser(userToDelete: User): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${userToDelete.id}`;
    let flag = false;
    try {
      await this.http.delete<User>(url).toPromise();
      flag = true;
      if (flag){
        this.logout ()
        this.users = this.users.filter(user => user.id !== userToDelete.id);
      }
      return { success: true, message: 'Usuario eliminado correctamente.' };
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return { success: false, message: 'Error al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async deleteUserByAdmin (userIdToDelete: number): Promise<{ success: boolean, message: string }>{
    const url = `${this.urlJSONServer}/${userIdToDelete}`;
    let flag = false;
    try {
      await this.http.delete<User>(url).toPromise();
      flag = true;
      if (flag)
        this.users = this.users.filter(user => user.id !== userIdToDelete);   
      return { success: true, message: 'Usuario eliminado correctamente.' };
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      return { success: false, message: 'Error al eliminar el usuario. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  obtenerUserByEmail (email: string){
    return this.users.find (user => user.email == email)
  }

  async cargarBiblioteca(user: User, carrito: Array<Film>): Promise<{ success: boolean, message: string }> {
    const updatedUser = await this.getUserById(user.id);
    if (updatedUser) {
      user.arrayPeliculas = [...updatedUser.arrayPeliculas];
    }
  
    carrito.forEach(film => {
      film.fechaDeAgregado = new Date().toISOString();
      user.arrayPeliculas.push(film);
    });
  
    return await this.actualizarBiblioteca(user.id, user.arrayPeliculas);
  }

  async actualizarBiblioteca(userId: number, arrayPeliculas: Film[]): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${userId}`;
  
    try {
      await this.http.patch<User>(url, { arrayPeliculas }).toPromise();
      return { success: true, message: 'Biblioteca actualizada correctamente.' };
    } catch (error) {
      console.error('Error al actualizar la biblioteca:', error);
      return { success: false, message: 'Error al actualizar la biblioteca. Inténtalo de nuevo más tarde.' };
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

  /* METODOS DE CAMBIAR DATOS, OBTENER USERS BY, LOGOUT */
  
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
        this.showFormAddCard.next (false);
        this.saveUserToStorage(user);
        return { success: true, message: 'Tarjeta cargada correctamente.' };
      } catch (error) {
        console.error('Error al cargada la tarjeta:', error);
        return { success: false, message: 'Error al cargada la tarjeta. Por favor, inténtalo de nuevo más tarde.' };
      }
    }
    return { success: false, message: 'Error al cargar la tarjeta. Por favor, inténtalo de nuevo más tarde.' };
  }

  toggleShowFormAddCard(show: boolean) {
    this.showFormAddCard.next(show);
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

  async changeFirstNameAdmin(admin: Admin, newFirstName: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServerAdmins}/${admin.id}`;
    admin.firstName = newFirstName; 
    try {
      await this.http.patch(url, admin).toPromise();
      this.adminActualSubject.next(admin); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveAdminToStorage (admin);
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

  async changeLastNameAdmin(admin: Admin, newLastName: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServerAdmins}/${admin.id}`;
    admin.lastName  = newLastName; 
    try {
      await this.http.patch(url, admin).toPromise();
      this.adminActualSubject.next(admin); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveAdminToStorage (admin);
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

  async changeEmailAdmin(admin: Admin, newEmail: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServerAdmins}/${admin.id}`;
    admin.email = newEmail; 
    try {
      await this.http.patch(url, admin).toPromise();
      this.adminActualSubject.next(admin); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveAdminToStorage (admin);
      return { success: true, message: 'Email cambiado correctamente.' };
    } catch (error) {
      console.error('Error al cambiar el email del usuario:', error);
      return { success: false, message: 'Error al cambiar el email. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async changePassword (user: User, newPassword: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;
    user.password  = newPassword; 
    try {
      await this.http.patch(url, user).toPromise();
      this.usuarioActualSubject.next(user); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveUserToStorage(user); // Actualizamos el almacenamiento local
      return { success: true, message: 'Contraseña cambiada correctamente.' };
    } catch (error) {
      console.error('Error al cambiar la contraseña del usuario:', error);
      return { success: false, message: 'Error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async changePasswordAdmin (admin: Admin, newPassword: string): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServerAdmins}/${admin.id}`;
    admin.password  = newPassword; 
    try {
      await this.http.patch(url, admin).toPromise();
      this.adminActualSubject.next(admin); // Actualizamos el BehaviorSubject con el nuevo valor
      this.saveAdminToStorage (admin);
      return { success: true, message: 'Contraseña cambiada correctamente.' };
    } catch (error) {
      console.error('Error al cambiar la contraseña del usuario:', error);
      return { success: false, message: 'Error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.' };
      }
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

  getUserPorBiblioteca(movieLibrary: Film[]) {
    const users = this.getUsers();
    let j = 0;

    if (users.length != 0) 
    {
      for (let i = 0; i < users.length; i++)
      {
        if (users[i].arrayPeliculas.length == movieLibrary.length)
        {
          for (j = 0; j < users[i].arrayPeliculas.length; j++)
          {
              if (users[i].arrayPeliculas[j].rank != movieLibrary[j].rank)
              {
                break;
              }
          }
          if (j == movieLibrary.length)
            {
              return users[i];
            }
        }
      }
    }
    return null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.http.get<User[]>(this.urlJSONServer).toPromise() || [];
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return null; // Manejo de error: devolver null si ocurre un problema
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
        const users = await this.http.get<User[]>(this.urlJSONServer).toPromise() || [];
        console.log("Fetched Users:", users); // Verifica que se están obteniendo los usuarios
        return users.find(user => user.id === id) || null;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return null;
    }
  
  }
  async agregarEntregaPendiente(user: User, peliculas: Film[]): Promise<{ success: boolean, message: string }> {
    const url = `${this.urlJSONServer}/${user.id}`;

    if (!user.entregasPendientes) {
        user.entregasPendientes = [];
    }

    peliculas.forEach(p => {
        if (!user.entregasPendientes.find(ep => ep.id === p.id)) {
            user.entregasPendientes.push(p);
        }
    });

    try {
        await this.http.patch<User>(url, { entregasPendientes: user.entregasPendientes }).toPromise();
        return { success: true, message: 'Películas agregadas a entregas pendientes correctamente.' };
    } catch (error) {
        console.error('Error al agregar películas a entregas pendientes:', error);
        return { success: false, message: 'Error al agregar películas. Por favor, inténtalo de nuevo más tarde.' };
    }
  }

  async agregarPeliculaABiblioteca(userId: number, pelicula: Film): Promise<void> {
    const url = `${this.urlJSONServer}/${userId}`;
    const user = await this.getUserById(userId);
    
    if (!user) throw new Error('Usuario no encontrado');
  
    // Agregar la película a la biblioteca
    user.arrayPeliculas.push(pelicula);
  
    await this.http.patch<User>(url, { arrayPeliculas: user.arrayPeliculas }).toPromise();
  }
  
 // Eliminar película de entregas pendientes en el servidor
  async eliminarEntregaPendiente(userId: number, pelicula: Film): Promise<void> {
    const url = `${this.urlJSONServer}/${userId}`;
    const user = await this.getUserById(userId);
    if (!user) throw new Error('Usuario no encontrado');

    user.entregasPendientes = user.entregasPendientes.filter(p => p.id !== pelicula.id);
    await this.http.patch<User>(url, { entregasPendientes: user.entregasPendientes }).toPromise();
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAdmin');
    this.usuarioActualSubject.next(null);
    this.isLoggedInSubject.next(false);

    this.adminActualSubject.next(null);
    this.adminService.setAdminActual(null);
    this.adminService.isLoggedInSubject.next(false)

    this.router.navigate(['/inicio']);
  }
}

