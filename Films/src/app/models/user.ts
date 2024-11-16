import { FavouriteList } from "./f-list";
import { Film } from "./film";
import { Tarjeta } from "./tarjeta";
//user.ts es models
export class User {
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    password: string = '';
    address: string = '';
    dni: string = '';
    id: number = 0;
    fav_list: FavouriteList = new FavouriteList();
    arrayPeliculas: Array<Film> = [];
    deuda: number = 0;
    tarjeta: Tarjeta = new Tarjeta();
    role: 'user' | 'admin' = 'user';  // Rol del usuario
    adminCode?: string;  // Código para admins (opcional)
    entregasPendientes: Array<Film> = [];
}

