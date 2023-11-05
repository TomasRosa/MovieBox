import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionCarritoBarraDeBusquedaService {
  constructor() { }
  private agregarPeliculaAlCarritoSubject = new Subject<any>();

  agregarPeliculaAlCarrito$ = this.agregarPeliculaAlCarritoSubject.asObservable();

  agregarPeliculaAlCarrito(pelicula: any) {
    this.agregarPeliculaAlCarritoSubject.next(pelicula);
  }
}
