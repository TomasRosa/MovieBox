import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmsFromAPIService } from 'src/app/services/films-from-api.service';
import { Film } from 'src/app/models/film';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { Review } from 'src/app/models/review';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { FavouriteListService } from 'src/app/services/favourite-list.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-film-detail',
  templateUrl: './film-detail.component.html',
  styleUrls: ['./film-detail.component.css']
})
export class FilmDetailComponent {
  private arrayFilms: Film[] = [];
  private filmRank: number = 0;
  movie: Film | undefined;
  favouriteFilms: Array<Film> = [];
  reviews: { movieId: number; reviews: Review[] }[] = [];

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
  private Flist: FavouriteListService,
  private sharedService: SharedServicesService) {}

  ngOnInit(): void {
    combineLatest([
      this.films.movies$,
      this.films.moviesEnOferta$
    ]).subscribe(([movies, moviesEnOferta]) => {
        // Combina las dos listas y crea copias para evitar modificar datos originales
        const allMovies = [...movies.map(film => ({ ...film })), ...moviesEnOferta.map(film => ({ ...film }))];
    
        // Filtra las películas por categoría
        this.arrayFilms = [...allMovies.map(film => ({ ...film }))]
        this.getFilmRank();
    });
    
    this.userService.isLoggedIn$.subscribe ((isLoggedIn: boolean | null) =>{
      this.isLoggedIn = isLoggedIn; 
    })
    
    if (this.userService.getAdminFromStorage ()){
      this.isAdmin = true;
    }

    if (this.isLoggedIn && !this.isAdmin) {
      this.userService.usuarioActual$.subscribe(async user => {
        this.userActual = user as User;
        if (this.userActual)
        {
          if (this.userActual.fav_list){
              this.favouriteFilms = this.userActual.fav_list.arrayPeliculas || [];  // Asegurarse de que sea un arreglo
          }
          this.Flist.loadFavouriteListFromServer(this.userActual.id);
        }
      });
    }

    this.Flist.getChangesObservable().subscribe(() => {
      this.favouriteFilms = [...this.Flist.listaFav.arrayPeliculas];
    });
  }

   // Verifica que favouriteFilms no sea undefined antes de intentar acceder a 'some'
   isFavourite(film: Film): boolean {
    if (!this.favouriteFilms) {
      return false; // Si favouriteFilms no está definido, devuelve false
    }
    return this.favouriteFilms.some((favFilm) => favFilm.id === film.id);
  }

  async toggleFavourite(film: Film) {
    if (!this.isLoggedIn){
      alert ('Debes iniciar sesion para agregar a favoritos una pelicula');
      return;
    }
    if (this.isFavourite(film)) {
      await this.Flist.eliminarDeLaListaFavoritos(film);  // Quitar de favoritos
    } else {
      await this.Flist.agregarALaLista(film); // Agregar a favoritos
    }
    if (this.userActual)
      this.Flist.loadFavouriteListFromServer(this.userActual.id);
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
        this.movie!.reviews = this.loadReviewsFromStorage(this.movie!.rank); // Cargar reseñas desde localStorage
      } else {
        console.log('No se encontró el parámetro "rank".');
      }
    });
  }

  deleteReview() {
    if (this.movie && this.reviewToDelete) {
      let reviewsFromFilm = this.loadReviewsFromStorage (this.movie!.rank)
      if (reviewsFromFilm){
        reviewsFromFilm = reviewsFromFilm.filter ( review => review.idReview !== this.reviewToDelete!.idReview);
        this.movie.reviews = reviewsFromFilm;
        this.saveReviewsToStorage(this.movie.rank, reviewsFromFilm);
        this.reviewToDelete = null;
      }
    }
  }

  cancelDelete() {
    this.reviewToDelete = null; // Descartar la reseña a eliminar
  }

  confirmEditReview() {
    if (this.reviewToEdit && this.movie) {
      let reviewASerEditada = this.getReviewById (this.reviewToEdit.idReview);
      let reviewsFromFilm = this.loadReviewsFromStorage (this.movie!.rank)
      if (reviewASerEditada){
        for (let i=0; i<reviewsFromFilm.length; i++){
          if (reviewsFromFilm[i].idReview === reviewASerEditada.idReview){
            reviewsFromFilm[i].content = this.newReview;
            this.movie.reviews = reviewsFromFilm;
            this.saveReviewsToStorage(this.movie.rank, reviewsFromFilm);
          }
        }
        
      }
      this.newReview = ''; 
      this.editingReview = false; // Finalizar edición
    }
  }

  getReviewById(reviewId: number): Review|undefined{
    let reviewsFromFilm = this.loadReviewsFromStorage (this.movie!.rank)
    return reviewsFromFilm.find ((item) => item.idReview === reviewId)
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
      console.log ('entre a if q on se que hace')
      foundFilm.reviews = []; // Asegurarse de que el array de reseñas esté inicializado
    }
  
    return foundFilm;
  }

  addReview() {
    if (!this.isLoggedIn || !this.userActual) {
      this.errorResena = 'Debes iniciar sesión para realizar una reseña';
      setTimeout(() => {
        this.errorResena = '';
      }, 2000);
      return;
    }
  
    if (this.movie && this.newReview.trim() !== '') {
      const newReviewObj: Review = {
        firstName: `${this.userActual.firstName}`,
        lastName:  `${this.userActual.lastName}`,
        idUser: `${this.userActual.id}`,
        userEmail: this.userActual.email || '',
        content: this.newReview,
        idReview: this.loadReviewsFromStorage (this.movie!.rank).length + 1
      };
  
      // Guardar reseña en localStorage
      this.saveReviewToStorage(this.movie.rank, newReviewObj);
      this.newReview = ''; // Limpiar el campo de entrada
      this.movie.reviews = this.loadReviewsFromStorage(this.movie.rank); // Actualizar reseñas
    }
  }

  searchReviewIndex(movieId: number): number {
    let movieIndex = -1;
    for (let i = 0; i < this.reviews.length; i++) {
      if (this.reviews[i].movieId === movieId) {
        movieIndex = i;
        break;
      }
    }
    return movieIndex;
  }

  private saveReviewsToStorage (movieId: number, newReviews: Array<Review>){
    const storedData = localStorage.getItem('reviewsData');

    if (storedData) {
      this.reviews = JSON.parse(storedData);
    }

    let movieIndex = this.searchReviewIndex(movieId);

    if (movieIndex !== -1) {
      this.reviews[movieIndex].reviews = newReviews;
    }

    localStorage.setItem('reviewsData', JSON.stringify(this.reviews));
  }
  
  private saveReviewToStorage(movieId: number, review: Review) {
    const storedData = localStorage.getItem('reviewsData');
    
    if (storedData) {
      this.reviews = JSON.parse(storedData);
    } else {
      this.reviews = [];
    }
  
    let movieIndex = this.searchReviewIndex(movieId);
  
    if (movieIndex !== -1) {
      this.reviews[movieIndex].reviews.push(review);
    } else {
      this.reviews.push({ movieId, reviews: [review] });
    }
  
    localStorage.setItem('reviewsData', JSON.stringify(this.reviews));
  }
  
  loadReviewsFromStorage(movieId: number): Review[] {
    const storedData = localStorage.getItem('reviewsData');
    if (!storedData) {
      return [];
    }
  
    this.reviews = JSON.parse(storedData);
    
    let movieReviews: Review [] = [];

    for (let i = 0; i < this.reviews.length; i++) {
      if (this.reviews[i].movieId === movieId) {
        movieReviews = this.reviews[i].reviews;
        break;
      }
    }

    return movieReviews;
  }
  







}
