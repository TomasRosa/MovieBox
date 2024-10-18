import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root',
})
export class Permisos 
{
  isLoggedIn: Boolean | null = false;

  constructor(private userService: UserService, private router: Router) {
    this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.isLoggedIn = isLoggedIn; 
    })
  }

  canActivate(): boolean 
  {
    if (this.isLoggedIn) 
    {
      return true;
    } else {
      alert('Usted no se encuentra logeado, por lo que no puede ingresar a ciertas rutas.');
      this.router.navigate(['inicio']);
      return false;
    }
  }
}
