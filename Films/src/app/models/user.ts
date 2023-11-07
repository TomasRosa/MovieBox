import { Film } from "./film";
import { Tarjeta } from "./tarjeta";

export class User {
    nombre:string ='';
    apellido:string ='';
    email: string ='';
    password: string='';
    address:string='';
    dni: string='';
    id: number=0;
    arrayPeliculas: Array<Film> = [];
    tarjeta: Tarjeta = new Tarjeta();
}
