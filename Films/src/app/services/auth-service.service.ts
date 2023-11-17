import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  public isLoggedIn = false; // Inicializa isLoggedIn en false

  constructor(private http: HttpClient) {}

  private urlJSONServer = 'http://localhost:5000/users';

  async login (email: string, password: string): Promise<boolean> {
    try {
      const data: any = await this.http.get(this.urlJSONServer).toPromise();
      const user = data.users.find((user: any) => user.email === email && user.password === password);
      if (user) {
        // Las credenciales son válidas, establece isLoggedIn en verdadero
        this.isLoggedIn = true;
        return true;
      } else {
        // Las credenciales son incorrectas
        this.isLoggedIn = false;
        return false;
      }
    } catch (error) 
    {
      // Ocurrió un error al cargar los datos
      this.isLoggedIn = false;
      console.error('Error al cargar los datos:', error);
      return false;
    }
  }
}
