import { AbstractControl, ValidatorFn } from "@angular/forms";

export class ValidacionTarjeta {
  static validarTarjetaLongitud(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const numeroTarjeta = control.value;
      if (!numeroTarjeta || numeroTarjeta.length !== 16) {
        return { 'validarTarjetaLongitud': { value: control.value } };
      }
      return null;
    };
  }

  static soloNumeros(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const numeroTarjeta = control.value;
      if (!numeroTarjeta || !/^\d+$/.test(numeroTarjeta)) {
        return { 'soloNumeros': { value: control.value } };
      }
      return null;
    };
  }

  static validarCVCLongitud(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const cvc = control.value;
      if (!cvc || !/^[0-9]{3}$/.test(cvc)) {
        return { 'validarCVCLongitud': { value: control.value } };
      }
      return null;
    };
  }

  static validarFormatoFechaVencimiento(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fecha = control.value;
      if (!fecha || !/^\d{2}\/\d{2}$/.test(fecha)) {
        return { 'validarFormatoFechaVencimiento': { value: control.value } };
      }
      return null;
    };
  }
  
  static validarFechaNoExpirada(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fecha = control.value;
      const partes = fecha.split('/');
      const mes = parseInt(partes[0], 10);
      const anio = parseInt(partes[1], 10);
  
      if (!fecha || !/^\d{2}\/\d{2}$/.test(fecha)) {
        return { 'validarFormatoFechaVencimiento': { value: control.value } };
      }
  
      const fechaActual = new Date();
      const anioActual = fechaActual.getFullYear() % 100;
      const mesActual = fechaActual.getMonth() + 1;
  
      if (anio < anioActual || (anio === anioActual && mes < mesActual)) {
        return { 'validarFechaNoExpirada': { value: control.value } };
      }
  
      return null;
    };
  }
  
}
