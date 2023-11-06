import { Injectable } from '@angular/core';
import { Film } from '../models/film';

const options = {
  method: 'GET',
	headers: {
		'X-RapidAPI-Key': '168918779bmsh773c0ea22aed822p18cce3jsn5f8c1d7815d2',
		'X-RapidAPI-Host': 'similar-movies.p.rapidapi.com'
	}
};

@Injectable({
  providedIn: 'root'
})

export class FilmsFromAPIService{
  private url_API = 'assets/films.json';
  private filmsData: Film [] = [];
  private arrayFilmsBien: Film [] = [];
  private precios: number[] = [
    150, 200, 300, 450, 250, 180, 280, 900, 350, 500,
    1200, 700, 550, 950, 1100, 1300, 800, 275, 600, 170,
    2100, 400, 750, 1000, 1700, 1600, 3000, 2200, 160, 210,
    1150, 700, 1750, 900, 2000, 130, 1450, 2500, 1350, 190,
    2800, 1600, 600, 1100, 1250, 850, 230, 200, 125, 350,
    550, 900, 675, 2400, 1450, 800, 1800, 1900, 100, 700,
    750, 850, 275, 1150, 2350, 2750, 475, 1500, 1000, 2000,
    800, 1300
  ];
  
  constructor() {
   }

  async initializeData() {
    if (this.filmsData.length == 0) {
      const response = await fetch(this.url_API);
      if (response.status === 200) {
        const datos = await response.json();

        for (let i = 0; i < datos.length; i++) {
          this.filmsData.push({
            ...datos[i],
            precio: this.precios[i],
            ofertas: this.verSiEstaEnOferta (this.precios[i]),
          });
      }
      this.pasarDatosAUnArray();
    }
  }
}

  getMovies ()
  {
    return this.arrayFilmsBien;
  }
  
  pasarDatosAUnArray()
  {
    let i;

    for(i = 0; i < this.filmsData.length; i++)
    {
      if(i == 2 || i == 5)
      {
        i++;
      }
      if (i == 6)
      {
        i++
      }
      if (i == 7 || i == 51)
      {
        i++;
      }
      this.arrayFilmsBien.push(this.filmsData[i]);
    }
  }

  verSiEstaEnOferta (precio: number)
  {
    if (precio > 1500)
    {
      return true;
    }
    return false;
  }
}
