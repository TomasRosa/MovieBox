import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent 
{

  constructor (private router: Router)
  {
  }

  navegarGeneros(componente: string)
  {
     this.router.navigate([componente]);
  }
}
