import { Component } from '@angular/core';
import { FilmsFromAPIService } from '../services/films-from-api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  datosService: any
  constructor (private servicePrueba: FilmsFromAPIService)
  {
    
  }
}
