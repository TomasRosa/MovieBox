import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-alternative-options',
  templateUrl: './alternative-options.component.html',
  styleUrls: ['./alternative-options.component.css'],
})
export class AlternativeOptionsComponent {
  categories: Set<string> = this.filmsService.getGenreOfMoviesJSON();
  isFocused = false;
  selectedCategory: string = '';

  constructor(private filmsService: FilmsFromAPIService, private routerService: Router, private sharedService: SharedServicesService) {}

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
    this.routerService.navigate(['/movies', category]); // Navega a la ruta de la categoría
  }

  navegar(componente: string) {
    this.routerService.navigate([componente]);
  }

  navegarFavouriteList() {
    this.sharedService.navegarFavouriteList();
  }
  
  navegarBiblioteca (){
    this.sharedService.navegarBiblioteca ();
  }
}
