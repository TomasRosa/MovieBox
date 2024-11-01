import { Component } from '@angular/core';
import emailjs from 'emailjs-com';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {
  email: string = '';
  codigo: string = '';
  nuevaContrasena: string = '';
  codigoGenerado: string = '';
  codigoEnviado: boolean = false;
  codigoVerificado: boolean = false;
  mensaje: string = '';

  constructor(private router: Router, private userService: UserService) 
  {
    console.log(this.email);
  }

  generarCodigo(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
  }

  enviarCodigo() {
    const usuario = this.userService.obtenerUserByEmail(this.email);

    if (!usuario) {
      this.mensaje = 'Oh, no hemos podido encontrar ese email en nuestra base de datos.';
      this.codigoEnviado = false; // Asegura que no cambie el estado si el usuario no existe
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
    // Obtener el usuario correspondiente al email
    const usuario = await this.userService.obtenerUserByEmail(this.email);
    console.log(usuario);
    if (!usuario) {
      this.mensaje = 'Usuario no encontrado. Verifique el email ingresado.';
      return;
    }
  
    // Cambiar la contraseña utilizando el método changePassword
    const result = await this.userService.changePassword(usuario, this.nuevaContrasena);
    
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
