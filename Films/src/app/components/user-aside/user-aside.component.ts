import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-aside',
  templateUrl: './user-aside.component.html',
  styleUrls: ['./user-aside.component.css']
})
export class UserAsideComponent 
{
  prendido: boolean = false;

  constructor (private router: Router, public userService: UserService)
  {
  }

  navegarLogin (componente: string)
  {
     this.router.navigate([componente]);
  }

  navegarRegister (componente: string)
  {
    this.router.navigate([componente]);
  }

  navegarPerfil (componente: string)
  {
    this.router.navigate([componente]);
  }

  navegarBiblioteca (componente: string)
  {
    this.router.navigate([componente]);
  }

  toggleMenu ()
  {
    if (this.prendido == false)
    {
      this.prendido = true;
    }
    else if (this.prendido == true)
    {
      this.prendido = false;
    }
  }
  
  logout()
  {
     this.userService.logout();
     this.router.navigate(['/inicio']);
  }

  @HostListener('document:click', ['$event'])
    onClick(event: Event) {
      if (this.prendido) {
        const target = event.target as HTMLElement;
        if (!target.closest('.recuadro') && !target.closest('.menuLateral')) {
          this.prendido = false;
        }
      }
    }
}

