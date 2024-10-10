import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  showIgBubbles = false;
  showLinkedinBubbles = false;

  toggleIgBubbles() {
    this.showIgBubbles = !this.showIgBubbles;
    if (this.showIgBubbles) {
      this.showLinkedinBubbles = false; // Ocultar las burbujas de LinkedIn si se muestra Instagram
    }
  }

  toggleLinkedinBubbles() {
    this.showLinkedinBubbles = !this.showLinkedinBubbles;
    if (this.showLinkedinBubbles) {
      this.showIgBubbles = false; // Ocultar las burbujas de Instagram si se muestra LinkedIn
    }
  }

  hideBubbles() {
    this.showIgBubbles = false;
    this.showLinkedinBubbles = false;
  }
}
