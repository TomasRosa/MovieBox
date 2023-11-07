import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detalles-del-perfil',
  templateUrl: './detalles-del-perfil.component.html',
  styleUrls: ['./detalles-del-perfil.component.css']
})
export class DetallesDelPerfilComponent {
  usuarioActual: User | null = null;
  
  constructor (private userService: UserService){}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      console.log ('hola')
      console.log (this.usuarioActual)
    });
  }
}
