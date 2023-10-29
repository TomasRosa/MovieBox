import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private urlAPI = 'http://localhost:5000/users'

  constructor(private http: HttpClient) { }

  getUsers (): Observable<User[]>{
    return this.http.get<User[]>(this.urlAPI)
  }

  async addUser (user: User){
    await fetch (this.urlAPI, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json'
      },
      body: JSON.stringify (user)
    })
  }
  verificarUserEnJson(inputEmail: string, inputPassword: string): boolean {
    let flag = false;
    
    this.getUsers().subscribe((users: User[]) => {
      users.forEach((user: User) => {
        if (user.email === inputEmail && user.password === inputPassword) {
          flag = true;
        }
      });
    });
  
    return flag;
  }  
}
