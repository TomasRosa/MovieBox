import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';

@Component({
  selector: 'app-alternative-options',
  templateUrl: './alternative-options.component.html',
  styleUrls: ['./alternative-options.component.css'],
})
export class AlternativeOptionsComponent {
  categories: Set<string> = this.filmsService.getGenreOfMoviesJSON();
  isFocused = false;
  selectedCategory: string = '';

  showCategories()
  {
    this.isFocused= true;
  }

  hideCategories()
  {
    this.isFocused = false;
  }

  selectCategory(category: string) {
    this.selectedCategory = category; // Establece la categoría seleccionada
    this.router.navigate(['/movies', category]); // Navega a la ruta de la categoría
  }

  constructor(private filmsService: FilmsFromAPIService, private router: Router) {
  }
}
