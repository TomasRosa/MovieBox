import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilmsFromAPIService {
  private url_API = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';

  private apiURL = 'https://utn-avanzada2-students.herokuapp.com/api/student'
  constructor(private http: HttpClient) { }
  
  getAll(): Promise<any>{
    return this.http.get(this.apiURL)
      .toPromise();
  }



}
