import { Component } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';
import { ValidacionTarjeta } from 'src/app/validaciones/validacion-tarjeta';
import { Tarjeta } from 'src/app/models/tarjeta';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent {
  errorMessage: string = '';
  successMessage: string = '';

  tarjetaForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    lastName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    nTarjeta: new FormControl('', [Validators.required,ValidacionTarjeta.soloNumeros(),ValidacionTarjeta.validarTarjetaLongitud()]),
    fechaVencimiento: new FormControl ('',[Validators.required,ValidacionTarjeta.validarFechaNoExpirada(),ValidacionTarjeta.validarFormatoFechaVencimiento()]),
    CVC: new FormControl ('',[Validators.required,ValidacionTarjeta.validarCVCLongitud(),ValidacionTarjeta.soloNumeros()])      
  });

  constructor(){}

  get firstName () {return this.tarjetaForm.get('firstName')}
  get lastName () {return this.tarjetaForm.get('lastName')}
  get nTarjeta () {return this.tarjetaForm.get('nTarjeta')}
  get fechaVencimiento () {return this.tarjetaForm.get('fechaVencimiento')}
  get CVC () {return this.tarjetaForm.get('CVC')}

  onSubmit ()
  {
      let tarjeta = new Tarjeta()
  }
}
