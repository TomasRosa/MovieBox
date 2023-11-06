import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  router: string = '';

  constructor(private routerService: Router, private userService: UserService) {
    this.routerService.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router = event.url;
      }
    });
  }

  navegarInicio(componente: string) {
    this.routerService.navigate([componente]);
  }

  navegarCarrito() {
    if (this.userService.isLoggedIn) {
      // El usuario está autenticado, puedes permitir que agregue películas al carrito
      this.routerService.navigate(['/carrito']);
    } else {
      // El usuario no está autenticado, muestra una alerta
      alert('Debe iniciar sesión para comprar películas.');
    }
  }
  
}
