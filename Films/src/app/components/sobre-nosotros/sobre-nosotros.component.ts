import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent implements AfterViewInit {
  @ViewChild('instagram') botonInstagram!: ElementRef;
  @ViewChild('Facebook') botonFacebook!: ElementRef;
  @ViewChild('Email') botonEmail!: ElementRef;

  ngAfterViewInit() {
    if (this.botonInstagram && this.botonInstagram.nativeElement) {
      this.botonInstagram.nativeElement.addEventListener('click', () => {
        console.log('Botón Instagram fue clickeado');
        window.location.href = 'https://www.instagram.com'; // Redirige a Instagram
      });
    }

    if (this.botonFacebook && this.botonFacebook.nativeElement) {
      this.botonFacebook.nativeElement.addEventListener('click', () => {
        console.log('Botón Facebook fue clickeado');
        window.location.href = 'https://www.facebook.com'; // Redirige a Facebook
      });
    }

    if (this.botonEmail && this.botonEmail.nativeElement) {
      this.botonEmail.nativeElement.addEventListener('click', () => {
        console.log('Botón Email fue clickeado');
        window.location.href = 'mailto:correo@ejemplo.com'; // Abre el cliente de correo predeterminado
      });
    }
  }
}
