import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Review } from 'src/app/models/review';
import { SharedServicesService } from 'src/app/services/shared-services.service';

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
  isLoggedIn: Boolean | null = false;
  isAdmin: Boolean | null = false;
  errorResena: string = '';

  editingReview: boolean = false; // Indicador para saber si estamos editando
  reviewToEdit: Review | null = null; // Almacenar la reseña que se está editando
  reviewToDelete: Review | null = null; // Almacenar la reseña a eliminar

  constructor(private route: ActivatedRoute, 
  private films: FilmsFromAPIService,
  private userService: UserService,
  private sharedService: SharedServicesService) {}

  ngOnInit(): void {
    this.films.initializeData().then(() => {
      this.arrayFilms = this.films.getMovies();
      this.getFilmRank();
    });
    
    this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.isLoggedIn = isLoggedIn; 
    })
    
    if (this.userService.storedAdmin)
    {
      this.isAdmin = true;
    }

    // Obtener el usuario actual
    this.userActual = this.userService.getUserActual();
  }
  
  agregarPeliculaAlCarrito(film: Film) {
    this.sharedService.agregarPeliculaAlCarrito (film);
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

  deleteReview() {
    if (this.movie && this.reviewToDelete) {
      this.movie.reviews = this.movie.reviews?.filter(review => review !== this.reviewToDelete);
      this.saveReviews(); // Actualizar localStorage
      this.reviewToDelete = null; // Limpiar la reseña que estamos eliminando
    }
  }

  cancelDelete() {
    this.reviewToDelete = null; // Descartar la reseña a eliminar
  }

  confirmEditReview() {
    if (this.reviewToEdit && this.movie) {
      // Actualizar el contenido de la reseña
      this.reviewToEdit.content = this.newReview;
      this.saveReviews(); // Guardar las reseñas en localStorage
      this.newReview = ''; // Limpiar el campo de entrada
      this.editingReview = false; // Finalizar edición
    }
  }

  cancelEdit() {
    this.newReview = ''; // Limpiar el campo de entrada
    this.editingReview = false;
    this.reviewToEdit = null; // Descartar la reseña en edición
  }

  confirmDeleteReview(review: Review) {
    this.reviewToDelete = review;
  }
  
  editReview(review: Review) {
    this.newReview = review.content; // Cargar la reseña en el campo de entrada para editar
    this.editingReview = true;
    this.reviewToEdit = review; // Guardar la reseña que estamos editando
  }
  
  searchFilmWithRank(): Film | undefined {
    const foundFilm = this.arrayFilms.find(film => film.rank === this.filmRank);
    
    if (foundFilm && !foundFilm.reviews) {
      foundFilm.reviews = []; // Asegurarse de que el array de reseñas esté inicializado
    }
  
    return foundFilm;
  }

  addReview() {
    // Verificar si el usuario está logueado antes de permitir agregar una reseña
    if (!this.isLoggedIn || !this.userActual) {
      this.errorResena = 'Debes iniciar sesión para realizar una reseña';
      setTimeout(() => {
        this.errorResena = '';
      }, 2000);
      return;
    }
  
    if (this.movie && this.newReview.trim() !== '') {
      if (!this.movie.reviews) {
        this.movie.reviews = [];
      }
  
      // Crear objeto de reseña solo si el usuario actual es válido
      const newReviewObj: Review = {
        userName: `${this.userActual.firstName} ${this.userActual.lastName}`,
        userEmail: this.userActual.email || '', // Asegurarse de que el correo no sea undefined
        content: this.newReview
      };
  
      this.movie.reviews.push(newReviewObj);
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
