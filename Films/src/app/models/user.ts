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
<<<<<<< HEAD
    tarjeta: Tarjeta = new Tarjeta();
    role: 'user' | 'admin' = 'user';  // Rol del usuario
    adminCode?: string;  // Código para admins (opcional)
  }
=======
    tarjeta: Tarjeta = new Tarjeta ();
}
>>>>>>> ff07b6f7fc14815e8ba29b01d76c696acd23acb6
