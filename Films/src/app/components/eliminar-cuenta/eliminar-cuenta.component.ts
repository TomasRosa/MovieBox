import { Component, OnInit } from '@angular/core';
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

  constructor (private userService: UserService){}

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

  eliminarCuenta (){
    const contenedor = document.getElementById ('eliminar-cuenta')
    const opciones = document.getElementById ('opciones')
    const buttonCancelar = document.createElement ('button')
    const buttonConfirmar = document.createElement ('button')

    buttonConfirmar.textContent = 'Confirmar'
    buttonConfirmar.addEventListener ('click', async ()=>{
      await this.metodoAux()
      if (contenedor)
        contenedor.innerHTML = ''
    })

    buttonCancelar.textContent = 'Cancelar'
    buttonCancelar.addEventListener ('click', ()=>{
      if (opciones)
        opciones.innerHTML = '' /* RESETEO PARA QUE NO VEA LAS OPCIONES */
    })

    opciones?.appendChild(buttonConfirmar)
    opciones?.appendChild(buttonCancelar)
  }
}
