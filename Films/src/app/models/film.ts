export class Film {
    adult: boolean = false;
    backdrop_path: string= '';
    genre_ids: Array<Number> =[];
    original_language: string = '';
    original_title: string='';
    overview:string='';
    popularity: number=0;
    poster_path: string='';
    release_date: string = Date.now().toString();
    title: string = '';
    video: boolean = false;
    vote_average:number = 0;
    vote_count: number=0;
}
