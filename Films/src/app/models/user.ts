import { Film } from "./film";
import { Tarjeta } from "./tarjeta";
//user.ts es models
export class User {
    firstName:string ='';
    lastName:string ='';
    email: string ='';
    password: string='';
    address:string='';
    dni: string='';
    id: number=0;
    arrayPeliculas: Array<Film> = [];
    tarjeta: Tarjeta = new Tarjeta();
}
