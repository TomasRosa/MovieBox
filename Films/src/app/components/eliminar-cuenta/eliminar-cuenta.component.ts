import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-eliminar-cuenta',
  templateUrl: './eliminar-cuenta.component.html',
  styleUrls: ['./eliminar-cuenta.component.css']
})
export class EliminarCuentaComponent implements OnInit {
  usuarioActual: User | null = null;
  result: string = ''
  mostrarOpciones: boolean = false;

  constructor (private userService: UserService, private routerService: Router){}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      console.log (this.usuarioActual)
    });
  }

  private async metodoAux (){
    const resultado = await this.userService.deleteUser(this.usuarioActual as User);
    if (resultado.success) {
      this.result = resultado.message;
      // Realizar acciones adicionales si es necesario, como redireccionar al usuario o mostrar un mensaje de éxito
    } else {
      this.result = resultado.message;
      // Manejar el caso de error, por ejemplo, mostrar un mensaje de error al usuario
    }
  }

  navegarInicio(componente: string) {
    this.routerService.navigate([componente]);
  }

  async confirmar (){
    await this.metodoAux()
    setTimeout(()=>{
      this.mostrarOpciones=false;
      this.navegarInicio('inicio');
      this.userService.logout();
    }, 3000)
  }

  cancelar (){
    this.mostrarOpciones=false;
  }
  
}
