import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Importa NavigationEnd

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
}

