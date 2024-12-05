import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { OnInit, Input } from '@angular/core';
import { ReactiveFormsModule,FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  mensajeRegistro: string = '';
  mostrarContrasena: boolean = false;

  userForm = new FormGroup ({
    firstName: new FormControl ('', [Validators.required, ValidacionUserPersonalizada.soloLetras(),]),
    lastName: new FormControl ('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    email: new FormControl ('', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    address: new FormControl ('', [Validators.required]),
    password: new FormControl ('', [Validators.required, Validators.minLength (6), ValidacionUserPersonalizada.minDosNumeros()]),
    DNI: new FormControl ('', [Validators.required, Validators.minLength(8), Validators.maxLength(8),ValidacionUserPersonalizada.soloNumeros()])
  })

  constructor (private userService: UserService, private router: Router){}
  
  ngOnInit ()
  {
    /*
    this.userService.loadUsersFromJSON().subscribe ((users) => this.users=users)
    console.log(this.users); // Verifica los datos obtenidos
    */
  }

  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get dni() { return this.userForm.get('DNI'); }
  get email() { return this.userForm.get('email'); }
  get address() { return this.userForm.get('address'); }
  get password() { return this.userForm.get('password'); }

  async onSubmit() {
    let user = new User();
  
    if (this.firstName && this.lastName && this.email && this.password && this.address && this.dni) {
      if (this.firstName.value != null) user.firstName = this.firstName.value;
      if (this.lastName.value != null) user.lastName = this.lastName.value;
      if (this.email.value != null) user.email = this.email.value;
      if (this.dni.value != null) user.dni = this.dni.value;
      if (this.address.value != null) user.address = this.address.value;
      if (this.password.value != null) user.password = this.password.value;
  
      this.userService.checkEmailExists(user.email).subscribe((emailExists) => {
        if (emailExists) {
          this.mensajeRegistro = 'El email ya está registrado. Intente con otro.';
          console.log(this.mensajeRegistro);
          return; // No proceder si el email ya está registrado
        } else {
          // Si no existe, proceder a registrar el usuario
          this.userService.addUser(user)
            .then((newUser) => {
              console.log('Usuario agregado:', newUser);
              this.userService.setUsuarioActual (newUser!)
              this.mensajeRegistro = 'Registrado con éxito';
              this.router.navigate(['inicio']) 
            })
            .catch((error) => {
              this.mensajeRegistro = 'Oops! Ocurrió un error al registrarse';
              console.error('Error al agregar usuario:', error);
            });
            
            setTimeout(() => {
              this.mensajeRegistro = '';
            }, 2000);  
        }
      });
    }
  }
  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}