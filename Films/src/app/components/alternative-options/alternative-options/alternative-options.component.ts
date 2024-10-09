import { Component } from '@angular/core';

@Component({
  selector: 'app-alternative-options',
  templateUrl: './alternative-options.component.html',
  styleUrls: ['./alternative-options.component.css']
})
export class AlternativeOptionsComponent {
  categories = ['Aventura', 'Accion', 'Comedia', 'Drama', 'Familiar', 'Fantasy'];
  isFocused = false;

  showCategories() {
    this.isFocused = true; 
  }

  hideCategories() {
    this.isFocused = false; 
  }
}
