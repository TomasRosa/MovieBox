import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Importa NavigationEnd
import { FilmsFromAPIService } from './services/films-from-api.service';
import { CarritoService } from './services/carrito.service';
import { UserService } from './services/user.service';
import { DeudaService } from './services/deuda.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  constructor(private filmsFromApiService: FilmsFromAPIService, private carritoService: CarritoService, private userService: UserService, private deudaService: DeudaService)
  {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const button = document.querySelector('.scroll-to-top') as HTMLElement;
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const viewportHeight = window.innerHeight;
    
    // Mostrar el botón si el usuario ha desplazado más allá de la altura de la ventana
    if (scrollPosition > viewportHeight) {
      button.classList.add('show');
    } else {
      button.classList.remove('show');
    }
  }

  async ngOnInit() {
    await this.filmsFromApiService.initializeData()
    this.carritoService.ngOnInit()

    this.userService.biblioteca$.subscribe (async() =>{
      if (this.deudaService.flag == false)
      {
        await this.deudaService.startDeudasDeUsuarios();
      }
    })

    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(() => {
          this.onWindowScroll();
        }, 100);
      });
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToTopSmooth(duration: number) {
    const startPosition = window.scrollY;
    const distance = -startPosition;
    let startTime: number | null = null;
  
    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
  
      // Usamos una función de aceleración más suave
      const run = easeOutQuad(timeElapsed, startPosition, distance, duration);
  
      window.scrollTo(0, run);
  
      // Si no hemos llegado al final, continuamos la animación
      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        // Aseguramos que llegue exactamente al inicio
        window.scrollTo(0, 0);
      }
    };
  
    // Función de aceleración "easeOutQuad" para una animación más fluida
    const easeOutQuad = (t: number, b: number, c: number, d: number) => {
      t /= d;
      return -c * t * (t - 2) + b;
    };
  
    requestAnimationFrame(animateScroll);
  }
  

}

