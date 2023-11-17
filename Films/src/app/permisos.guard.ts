import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root',
})
export class Permisos implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    console.log(this.userService.isLoggedIn)
    if (this.userService.isLoggedIn) {
      return true;
    } else {
      alert('Usted no se encuentra logeado, por lo que no puede ingresar a ciertas rutas.');
      this.router.navigate(['inicio']);
      return false;
    }
  }
}
