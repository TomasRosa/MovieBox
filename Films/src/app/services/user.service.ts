import { Injectable } from '@angular/core';
/*import Model de User*/
import { HttpClient } from '@angular/common/http'; // Importa HttpClient para hacer solicitudes HTTP si es necesario



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers()
  {
    return this.http.get('/src/app/files/usersFile.json');
  }
}
