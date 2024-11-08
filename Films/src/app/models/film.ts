import { Review } from "./review";

export class Film {
    rank: number = 0;
    title: string = '';
    description: string = '';
    image: string = '';
    big_image: string = '';
    genre: string[] = [];
    thumbnail: string = '';
    rating: number = 0;
    id: number = 0;
    year: number = 0;
    imdb: string = '';
    imdb_link: string = '';
    precio: number = 0;
    reviews?: Review[]; // Se marca como opcional, ya que no siempre viene de la API
    fechaDeAgregado?: string;
}
