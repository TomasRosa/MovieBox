import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Film } from '../models/film';

@Injectable({
  providedIn: 'root'
})
export class FilmSearchServiceService {

  private filteredFilmsSource = new BehaviorSubject<Film[]>([]);
  filteredFilms$ = this.filteredFilmsSource.asObservable();

  constructor() { }

  updateFilteredFilms(films: Film[]) {
    this.filteredFilmsSource.next(films);
  }
}
