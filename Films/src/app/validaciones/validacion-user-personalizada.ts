import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { UserService } from "../services/user.service";
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable, tap  } from 'rxjs';  
import { catchError } from 'rxjs/operators';
import { from } from 'rxjs';

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
    
    static emailExistente(userService: UserService): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } | null => {
        const email = control.value as string;
  
        // Llama a la función buscarUserPorEmail que retorna una promesa
        return userService.buscarUserPorEmail(email).then(existe => {
          // Comprueba si el correo electrónico existe
          return existe ? { 'emailExistente': true } : null;
        });
      };
    }
    
}
