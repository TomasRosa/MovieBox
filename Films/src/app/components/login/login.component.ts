import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';
import { OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';
  users: Array<User> = [];

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      ValidacionUserPersonalizada.minDosNumeros(),
    ]),
  });
  ngOnInit() {
    this.userService.loadUsersFromJSON().then(() => {
      this.users = this.userService.getUsers();
    });
  }
  constructor(private userService: UserService, private router: Router, private carritoService: CarritoService) {}

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  async onSubmit() 
  {
    const emailValue: string | null = this.loginForm.get('email')?.value ?? null;
    const passwordValue: string | null = this.loginForm.get('password')?.value ?? null;
    let userActual: User | undefined;
  
    if (emailValue !== null && passwordValue !== null) {
      const isUserValid = await this.userService.verifyUser(
        emailValue as string,
        passwordValue as string
      );
  
      if (isUserValid) {
        userActual = this.userService.obtenerUserByEmail(emailValue as string);
        this.successMessage = 'Bienvenido a RosaGomezRuiz Peliculas';
        this.errorMessage = '';
        this.loginForm.get('email')?.setErrors(null);
        this.loginForm.get('password')?.setErrors(null);
        this.router.navigate(['/inicio']);
  
        if (userActual) {
          this.userService.setUsuarioActual(userActual);
        }
      } else {
        this.errorMessage = 'El email o contraseña son incorrectos';
        this.successMessage = '';
        this.loginForm.get('email')?.setErrors({ incorrecto: true });
        this.loginForm.get('password')?.setErrors({ incorrecto: true });
      }
    } else {
      this.errorMessage = 'El email o contraseña son nulos';
    }
  }  
  logout() {
    this.userService.logout();
    this.router.navigate(['/inicio']); // Redirige al usuario a la página de inicio después de cerrar sesión
  }
}
