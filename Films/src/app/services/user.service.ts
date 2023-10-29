import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private urlAPI = 'http://localhost:5000/users'

  constructor() { }
}
