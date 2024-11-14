import { Component } from '@angular/core';
import emailjs from 'emailjs-com';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {
  email: string = '';
  codigo: string = '';
  codigoGenerado: string = '';
  codigoEnviado: boolean = false;
  codigoVerificado: boolean = false;
  mensaje: string = '';
  mostrarContrasena: boolean = false;

  // Formulario de restablecimiento de contraseña
  restablecerForm = new FormGroup({
    nuevaContrasena: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      ValidacionUserPersonalizada.minDosNumeros()
    ])
  });

  constructor(private router: Router, private userService: UserService) 
  {
    console.log("Componente Recuperar Contrase")
  }

  // Acceso rápido al FormControl de la nueva contraseña
  get nuevaContrasena() {
    return this.restablecerForm.get('nuevaContrasena');
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
  }

  async enviarCodigo() {
    const usuario = await this.userService.getUserByEmail(this.email);

    if (!usuario) {
      this.mensaje = 'Oh, no hemos podido encontrar ese email en nuestra base de datos.';
      this.codigoEnviado = false;
      return;
    }

    this.codigoGenerado = this.generarCodigo();
    this.codigoEnviado = true;

    const templateParams = {
      user_email: this.email,
      codigo: this.codigoGenerado
    };

    emailjs.send('service_okxw4ds', 'template_f5wvr6i', templateParams, 'PbnptYh6mif-wo9iV')
      .then(() => {
        this.mensaje = 'Código enviado a su correo.';
      }, (error) => {
        console.error('Error al enviar el código:', error);
        this.mensaje = 'Error al enviar el código. Intente nuevamente.';
      });
  }

  verificarCodigo() {
    if (this.codigo === this.codigoGenerado) {
      this.codigoVerificado = true;
      this.mensaje = 'Código verificado. Ahora puede cambiar su contraseña.';
    } else {
      this.mensaje = 'El código ingresado es incorrecto.';
    }
  }

  async cambiarContrasena() {
    // Verificar que el formulario de restablecimiento sea válido
    if (this.restablecerForm.invalid) {
      this.mensaje = 'La contraseña no cumple con los requisitos';
      return;
    }

    // Obtener el usuario correspondiente al email
    const usuario = await this.userService.getUserByEmail(this.email);
    if (!usuario) {
      this.mensaje = 'Usuario no encontrado. Verifique el email ingresado.';
      return;
    }

    // Cambiar la contraseña utilizando el método changePassword
    const nuevaPasswordValue = this.nuevaContrasena?.value ?? ''; // Asegura que siempre haya un string
    const result = await this.userService.changePassword(usuario, nuevaPasswordValue);
    
    if (result.success) {
      this.mensaje = 'Contraseña cambiada con éxito. Redirigiendo al inicio de sesión...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.mensaje = result.message; // Mostrar mensaje de error
    }
  }
}
