import { Component } from '@angular/core';
import { OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
errorMessage: string = '';

loginForm = new FormGroup (
  {
    email: new FormControl('',[Validators.required],/*Aca irian las custom validators*/),
    password: new FormControl('',[Validators.required],/*Aca irian las custom validators*/)
  }
)

constructor(private userService: UserService) { }

// Dentro del método ngOnInit()
ngOnInit() 
{
  
}


get email () {return this.loginForm.get('email'); }
get password () {return this.loginForm.get('password'); }

onSubmit() {
  let user = new User();
  let emailValue: string | null = this.loginForm.get('email')?.value ?? null;
  let passwordValue: string | null = this.loginForm.get('password')?.value ?? null;

  if (emailValue !== null && passwordValue !== null) {
    user.email = emailValue as string;
    user.password = passwordValue as string;

    console.log(emailValue);
    console.log(passwordValue);

    if (user.email && user.password) {
      this.userService
        .verificarUserEnJson(emailValue as string, passwordValue as string)
        .then((isUserValid) => {
          if (isUserValid) {
            // Usuario válido, entrar a la página
          } else {
            this.errorMessage = 'El email o contraseña son incorrectos.';
          }
        })
        .catch((error) => {
          this.errorMessage = 'Ocurrió un error al verificar el usuario.';
        });
    }
  } else {
    this.errorMessage = 'El email o contraseña son nulos';
  }
}
}
