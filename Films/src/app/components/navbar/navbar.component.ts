import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  router: string = '';

  constructor(private routerService: Router) {
    this.routerService.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router = event.url;
      }
    });
  }

  navegarInicio(componente: string) {
    this.routerService.navigate([componente]);
  }

  navegarCarrito(componente: string) {
    this.routerService.navigate([componente]);
  }
}
