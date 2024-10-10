import { Component } from '@angular/core';

@Component({
  selector: 'app-alternative-options',
  templateUrl: './alternative-options.component.html',
  styleUrls: ['./alternative-options.component.css']
})
export class AlternativeOptionsComponent {
  categories = ['Drama', 'Crime', 'Action', 'Biography', 'History', 'Adventure','Western','Romance','Sci-Fi','Fantasy','Animation','Mystery','Family','Thriller','War','Comedy','Music','Horror','Film-Noir','Musical'];
  isFocused = false;

  showCategories() {
    this.isFocused = true; 
  }

  hideCategories() {
    this.isFocused = false; 
  }
}
