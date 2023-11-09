import { Component, OnInit } from '@angular/core';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})

export class CambiarPasswordComponent implements OnInit {
  usuarioActual: User | null = null;
  formGroup= new FormGroup({
    password: new FormControl ('', [Validators.required, Validators.minLength (6), ValidacionUserPersonalizada.minDosNumeros()])
  });
  result: string = ''
  mostrarFormulario: boolean = false; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      console.log (this.usuarioActual)
    });
  }

  get password() { return this.formGroup.get('password'); }

  private async metodoAux (){
    let newPassword /* VARIABLE PARA GUARDAR LA NUEVA PASSWORD */

    if (this.formGroup.valid) {
      try {
        if (this.password != null){
          newPassword = this.password.value;
        }
        if (newPassword) {
          const resultado = await this.userService.changePassword(this.usuarioActual as User, newPassword);
          
          if (resultado.success){
            this.result = resultado.message; 
          }
          else{ 
            this.result = resultado.message;
          }
        }
      } catch (error) {
        console.error('Error al cambiar el email del usuario:', error);
      }
    }
  }

  cancelar (){
    this.mostrarFormulario = false;
  }

  async confirmar (){
    await this.metodoAux()
    setTimeout(()=>{ /* LUEGO DE QUE SE MUESTRE EL RESULTADO, ESTE SE MUESTRA 3 SEGUNDOS Y SE QUITA. */
      this.mostrarFormulario = false
    }, 3000)
  }
}