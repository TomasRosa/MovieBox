import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ValidacionUserPersonalizada {
    static soloLetras (): ValidatorFn {
        let regExp: RegExp = /^[a-zA-Z\s]*$/;

        return (control: AbstractControl): {[key: string]: any} | null => {                     
            const soloLetras = regExp.test(control.value);

            return !soloLetras ? { 'soloLetras': {value: control.value} } : null;
        };
    }

    static soloNumeros(): ValidatorFn {
        const regExp: RegExp = /^[0-9]*$/; // Expresión regular que valida solo números
    
        return (control: AbstractControl): { [key: string]: any } | null => {
          const soloNumeros = regExp.test(control.value);
    
          return !soloNumeros ? { 'soloNumeros': { value: control.value } } : null;
        };
    }

    static minDosNumeros(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
          const regex = /\d/g; // Expresión regular para encontrar dígitos
          const numerosEncontrados = (control.value.match(regex) || []).length; // Cuenta los números encontrados en la cadena
    
          // Comprueba si hay al menos dos números en la cadena
          return numerosEncontrados >= 2 ? null : { 'minDosNumeros': true };
        };
    } 
}
