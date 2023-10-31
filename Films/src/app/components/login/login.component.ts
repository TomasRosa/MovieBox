import { Component } from '@angular/core';
import { OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
errorMessage: string = '';
successMessage: string = '';
 
loginForm = new FormGroup (
  {
    email: new FormControl('',[Validators.required,Validators.email, ValidacionUserPersonalizada.emailExistente(this.userService)]),
    password: new FormControl('',[Validators.required,Validators.minLength (6), ValidacionUserPersonalizada.minDosNumeros()])
  }
)

constructor(private userService: UserService,private router: Router) { }

get email () {return this.loginForm.get('email'); }
get password () {return this.loginForm.get('password'); }

onSubmit() {
  let user = new User();
  let emailValue: string | null = this.loginForm.get('email')?.value ?? null;
  let passwordValue: string | null = this.loginForm.get('password')?.value ?? null;
  
  if (emailValue !== null && passwordValue !== null) {
    user.email = emailValue as string;
    user.password = passwordValue as string;
 
    if (user.email && user.password) 
    {
      this.userService
        .verificarUserEnJson(emailValue as string, passwordValue as string)
        .then((isUserValid) => {
          if (isUserValid) 
          {
            this.successMessage = 'Bienvenido a RosaGomezRuiz Peliculas';
            this.errorMessage = ''; // Restablece el mensaje de error
            this.loginForm.get('email')?.setErrors(null); // Restablece los errores de validación
            this.loginForm.get('password')?.setErrors(null);
            this.router.navigate(['/inicio']);
          }
           else 
           {
            this.errorMessage = 'El email o contraseña son incorrectos';
            this.successMessage = ''; // Restablece el mensaje de éxito
            this.loginForm.get('email')?.setErrors({ 'incorrecto': true }); // Agrega errores de validación
            this.loginForm.get('password')?.setErrors({ 'incorrecto': true });
          }
        })
        .catch((error) => {
          this.errorMessage = 'Ocurrió un error al verificar el usuario';
        });
    }
  } 
  else 
  {
    this.errorMessage = 'El email o contraseña son nulos';
  }
}
}