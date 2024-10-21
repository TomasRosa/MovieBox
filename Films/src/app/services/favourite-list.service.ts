import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Film } from '../models/film';
import { FavouriteList } from '../models/f-list';
import { User } from '../models/user';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavouriteListService {
  public user: User | null = new User;
  public listaFav: FavouriteList = new FavouriteList;

  constructor(public userService: UserService, private http: HttpClient) { 
    this.userService.getUserActualJSON().subscribe(
      (user) => {
        this.user = user;
        if (this.user) {
          this.loadFavouriteListFromServer(this.user.id);
        }
      }
    );
  }
  
  agregarALaLista(film: Film) {
    this.listaFav.arrayPeliculas.push(film);
  
    if (this.user) {
      const updatedUser = { ...this.user, fav_list: this.listaFav };
  
      this.http.put(`http://localhost:5000/users/${this.user.id}`, updatedUser)
        .subscribe(
          () => {
            console.log("Lista de favoritos actualizada en el servidor.");
            if (this.user)
            {
              this.loadFavouriteListFromServer(this.user.id);
            }
          },
          (error) => {
            console.error("Error al actualizar la lista de favoritos en el servidor: ", error);
          }
        );
    }
  }

  ngOnInit() {
    this.loadFavouriteListFromServer(this.user!.id); // Cargar al inicializar
  }
  

  async eliminarDeLaListaFavoritos(film: Film) {
    const index = this.listaFav.arrayPeliculas.findIndex(f => f.id === film.id);

    if (index !== -1) {
        this.listaFav.arrayPeliculas.splice(index, 1);
        await this.userService.quitarFilmDeLista(this.user!, this.listaFav.arrayPeliculas);
        this.notifyChanges();
    }
  }

  private changesSubject = new Subject<void>();

  notifyChanges() {
    this.changesSubject.next();
  }

  getChangesObservable(): Observable<void> {
    return this.changesSubject.asObservable();
  }

  obtenerFilmsDeLista() 
  {
    if (this.listaFav.arrayPeliculas.length == 0)
    {
       this.listaFav.arrayPeliculas = this.user!.fav_list.arrayPeliculas
    }
  }
  
  obtenerNameDeLista() {
    return this.listaFav.name;
  }

  async updateUserOnServer(user: User): Promise<void> {
    const url = `http://localhost:5000/users/${user.id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    try {
      await this.http.put<User>(url, user, { headers }).toPromise();
    } catch (error) {
      console.error('Error al actualizar el usuario en el servidor:', error);
      throw error;
    }
  }

  loadFavouriteListFromServer(userId: number) {
    this.http.get<User>(`http://localhost:5000/users/${userId}`).subscribe(
      userFromServer => {
        if (userFromServer.fav_list && userFromServer.fav_list.arrayPeliculas) {
          this.listaFav = userFromServer.fav_list;
          this.listaFav.name = "Tu lista de favoritos"
        } else {
          this.listaFav = { name: 'Tu lista de favoritos', arrayPeliculas: [] };
        }
      },
      error => {
        console.error("Error al cargar la lista de favoritos del servidor:", error);
      }
    );
  }
}
