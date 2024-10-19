import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tarjeta } from 'src/app/models/tarjeta';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ValidacionTarjeta } from 'src/app/validaciones/validacion-tarjeta';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';

@Component({
  selector: 'app-tarjeta-form',
  templateUrl: './tarjeta-form.component.html',
  styleUrls: ['./tarjeta-form.component.css']
})
export class TarjetaFormComponent {
  errorMessage: string = 'Revise el formulario! Los datos de la tarjeta no son los correspondientes.';
  successMessage: string = '';
  showError: boolean = false;
  usuarioActual: User | null = null;
  result: string = ''

  tarjetaForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    lastName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    nTarjeta: new FormControl('', [Validators.required,ValidacionTarjeta.soloNumeros(),ValidacionTarjeta.validarTarjetaLongitud()]),
    fechaVencimiento: new FormControl('',[Validators.required,ValidacionTarjeta.validarFechaNoExpirada(),ValidacionTarjeta.validarFormatoFechaVencimiento()]),
  });

  constructor(private userService: UserService, private routerService: Router){}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
    });
  }

  get firstName () {return this.tarjetaForm.get('firstName')}
  get lastName () {return this.tarjetaForm.get('lastName')}
  get nTarjeta () {return this.tarjetaForm.get('nTarjeta')}
  get fechaVencimiento () {return this.tarjetaForm.get('fechaVencimiento')}

  async onSubmit (){
    this.showError = false;
    if(this.tarjetaForm.valid){
      let tarjeta = new Tarjeta()
      
      if (this.firstName && this.lastName && this.nTarjeta  && this.fechaVencimiento){
        if (this.firstName.value != null) tarjeta.firstName = this.firstName.value
        if (this.lastName.value != null) tarjeta.lastName = this.lastName.value
        if (this.nTarjeta.value != null) tarjeta.nTarjeta = this.nTarjeta.value
        if (this.fechaVencimiento.value != null) tarjeta.fechaVencimiento = this.fechaVencimiento.value
      }

      if (tarjeta && this.usuarioActual?.tarjeta)
        this.usuarioActual.tarjeta = tarjeta
      await this.userService.addCard (this.usuarioActual, tarjeta);
      this.successMessage = 'Tarjeta agregada correctamente'; // Mensaje de éxito
      this.errorMessage = ''; // Limpiar el mensaje de error

      this.navegar ('perfil'); 
    }else{
      this.errorMessage = 'Error! Los datos de la tarjeta no son los correctos.'; // Mostrar mensaje de error
      this.showError = true; // Mostrar la sección de error
    }
  }

  navegar(componente: string) {
    this.routerService.navigate([componente]);
  }
}


