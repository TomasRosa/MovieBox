import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent {
  private arrayFilms: Film[] = [];
  private filmRank: number = 0;
  movie: Film | undefined;

  newReview: string = ''; // Para almacenar la nueva reseña

  userActual: User | null = null;
  isLoggedIn: boolean = false;
  errorResena: string = '';


  constructor(private route: ActivatedRoute, 
  private films: FilmsFromAPIService,
  private userService: UserService) {}

  ngOnInit(): void {
    this.films.initializeData().then(() => {
      this.arrayFilms = this.films.getMovies();
      this.getFilmRank();
    });
  
    // Obtener el usuario actual
    this.userActual = this.userService.getUserActual();
    this.isLoggedIn = this.userActual !== null;
  }
  

  getFilmRank() {
    this.route.paramMap.subscribe(params => {
      const rankParam = params.get('rank');

      if (rankParam !== null) {
        this.filmRank = +rankParam;
        this.movie = this.searchFilmWithRank();
        this.loadReviews(); // Cargar reseñas desde localStorage
      } else {
        console.log('No se encontró el parámetro "rank".');
      }
    });
  }

  searchFilmWithRank(): Film | undefined {
    const foundFilm = this.arrayFilms.find(film => film.rank === this.filmRank);
    
    if (foundFilm && !foundFilm.reviews) {
      foundFilm.reviews = []; // Asegurarse de que el array de reseñas esté inicializado
    }
  
    return foundFilm;
  }

  addReview() {
    if (!this.isLoggedIn) {
      this.errorResena = 'Debes iniciar sesión para realizar una reseña';
      setTimeout(() => {
        this.errorResena = '';
      }, 2000);
      return;
    }
  
    if (this.movie && this.newReview) {
      if (!this.movie.reviews) {
        this.movie.reviews = [];
      }
      
      // Agregar nombre y apellido del usuario a la reseña
      const userName = `${this.userActual?.firstName} ${this.userActual?.lastName}`;
      const reviewWithUser = `${userName}: ${this.newReview}`;
      
      this.movie.reviews.push(reviewWithUser);
      this.saveReviews(); // Guardar las reseñas en localStorage
      this.newReview = ''; // Limpiar el campo de entrada
    }
  }
  
  saveReviews() {
    if (this.movie) {
      localStorage.setItem(`reviews_${this.movie.rank}`, JSON.stringify(this.movie.reviews));
    }
  }

  loadReviews() {
    if (this.movie) {
      const storedReviews = localStorage.getItem(`reviews_${this.movie.rank}`);
      if (storedReviews) {
        this.movie.reviews = JSON.parse(storedReviews);
      }
    }
  }
}
