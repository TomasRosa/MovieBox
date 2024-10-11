import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  usuarioActual: User | null = null;
  
  formGroupEmail=new FormGroup({
    email: new FormControl ('', [Validators.email, Validators.required])
  });
  formGroupFirstName = new FormGroup ({
    firstname:new FormControl ('', [Validators.required, ValidacionUserPersonalizada.soloLetras()])
  });
  formGroupLastName = new FormGroup ({
    lastname: new FormControl ('', [Validators.required, ValidacionUserPersonalizada.soloLetras()])
  });
  formGroupDNI = new FormGroup ({
    dni: new FormControl ('', [Validators.required, ValidacionUserPersonalizada.soloNumeros])
  });
  formGroupAddress = new FormGroup ({
    address: new FormControl ('', [Validators.required])
  });

  get email_fc() { return this.formGroupEmail.get('email'); }
  get firstname_fc () { return this.formGroupFirstName.get('firstname') }
  get lastname_fc () { return this.formGroupLastName.get('lastname') }
  get dni_fc () { return this.formGroupDNI.get ('dni') }
  get address_fc () { return this.formGroupAddress.get ('address') }

  // Variables para los datos originales
  firstName: string | null | undefined = null;
  lastName:string | null | undefined = null;
  dni: string | null | undefined = null;
  email: string | null | undefined = null;
  address: string | null | undefined = null;

  isEditingFirstName = false;
  isEditingLastName = false;
  isEditingDni = false;
  isEditingEmail = false;
  isEditingAddress = false;

  showErrors = false;
  result: string = ''

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Suscribirse al servicio para obtener los datos del usuario actual
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      if (this.usuarioActual) {
        // Asignar los valores cuando el usuario sea cargado
        this.firstName = this.usuarioActual.firstName;
        this.lastName = this.usuarioActual.lastName;
        this.dni = this.usuarioActual.dni;
        this.email = this.usuarioActual.email;
        this.address = this.usuarioActual.address;

        this.formGroupEmail.get('email')?.setValue(this.email); // Llenamos el FormControl con el email del usuario
        this.firstname_fc?.setValue (this.firstName)
        this.lastname_fc?.setValue (this.lastName)
      }
    });
  }

  // Funciones para activar el modo de edición
  toggleEditFirstame() {
    this.isEditingFirstName = !this.isEditingFirstName;
    this.firstname_fc?.setValue (this.firstName as string); // Resetear valor al original
  }

  toggleEditLastName (){
    this.isEditingLastName = !this.isEditingLastName;
    this.lastname_fc?.setValue (this.lastName as string); // Resetear valor al original
  }

  toggleEditDni() {
    this.isEditingDni = !this.isEditingDni;
    this.dni_fc?.setValue (this.dni as string); // Resetear valor al original
  }

  toggleEditEmail() {
    this.isEditingEmail = !this.isEditingEmail;
    this.formGroupEmail.get('email')?.setValue(this.email as string); // Resetear valor al original si se vuelve a editar
  }

  toggleEditAddress() {
    this.isEditingAddress = !this.isEditingAddress;
    this.address_fc?.setValue (this.address as string); // Resetear valor al original
  }

  // Función para cancelar la edición
  cancelEdit() {
    this.isEditingFirstName = false;
    this.isEditingLastName = false;
    this.isEditingDni = false;
    this.isEditingAddress = false;
    this.isEditingEmail = false;

    this.formGroupFirstName.reset ({firstname: this.firstName});
    this.formGroupFirstName.markAsUntouched();
    this.formGroupLastName.reset ({lastname: this.lastName});
    this.formGroupLastName.markAsUntouched();
    this.formGroupDNI.reset ({dni: this.dni});
    this.formGroupDNI.markAsUntouched();
    this.formGroupAddress.reset ({address: this.address});
    this.formGroupAddress.markAsUntouched();
    this.formGroupEmail.reset({ email: this.email });
    this.formGroupEmail.markAsUntouched();
  }

  private async processEmailChangeRequest (){
    if (this.formGroupEmail.valid) {
      const newEmail = this.formGroupEmail.value.email;
      if (newEmail !== this.email) {
        try {
          const resultado = await this.userService.changeEmail(this.usuarioActual as User, newEmail as string);
          if (resultado.success) {
            this.email = newEmail; // Actualizamos el email
            this.result = 'Email cambiado con éxito';
          } else {
            this.result = 'Error al cambiar el email';
          }
        } catch (error) {
          this.result = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingEmail = false; // Salimos del modo de edición
    } else {
      this.result = 'Por favor, ingresa un email válido.';
    }
  }

  async processFirstNameChangeRequest (){
    if (this.formGroupFirstName.valid) {
      const newFirstName = this.formGroupFirstName.value.firstname;
      if (newFirstName !== this.firstName) {
        try {
          const resultado = await this.userService.changeFirstName(this.usuarioActual as User, newFirstName as string);
          if (resultado.success) {
            this.firstName = newFirstName; // Actualizamos el email
            this.result = 'Nombre cambiado con éxito';
          } else {
            this.result = 'Error al cambiar el nombre';
          }
        } catch (error) {
          this.result = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingFirstName = false; // Salimos del modo de edición
    } else {
      this.result = 'Por favor, ingresa un nombre válido.';
    }
  }

  async processLastNameChangeRequest (){
    if (this.formGroupFirstName.valid) {
      const newLastName = this.formGroupLastName.value.lastname;
      if (newLastName !== this.lastName) {
        try {
          const resultado = await this.userService.changeLastName(this.usuarioActual as User, newLastName as string);
          if (resultado.success) {
            this.lastName = newLastName; // Actualizamos el email
            this.result = 'Apellido cambiado con éxito';
          } else {
            this.result = 'Error al cambiar el apellido';
          }
        } catch (error) {
          this.result = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingLastName = false; // Salimos del modo de edición
    } else {
      this.result = 'Por favor, ingresa un apellido válido.';
    }
  }

  async processDNIChangeRequest (){
    if (this.formGroupDNI.valid) {
      const newDNI = this.formGroupDNI.value.dni;
      if (newDNI !== this.dni) {
        try {
          const resultado = await this.userService.changeDNI(this.usuarioActual as User, newDNI as string);
          if (resultado.success) {
            this.dni = newDNI; // Actualizamos el email
            this.result = 'DNI cambiado con éxito';
          } else {
            this.result = 'Error al cambiar el DNI';
          }
        } catch (error) {
          this.result = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingLastName = false; // Salimos del modo de edición
    } else {
      this.result = 'Por favor, ingresa un DNI válido.';
    }
  }

  async processAddressChangeRequest (){
    if (this.formGroupAddress.valid) {
      const newAddress = this.formGroupAddress.value.address;
      if (newAddress !== this.address) {
        try {
          const resultado = await this.userService.changeAddress(this.usuarioActual as User, newAddress as string);
          if (resultado.success) {
            this.address = newAddress; // Actualizamos el email
            this.result = 'Direccion cambiada con éxito';
          } else {
            this.result = 'Error al cambiar la direccion';
          }
        } catch (error) {
          this.result = 'Error en la solicitud: ' + error;
        }
      }
      this.isEditingLastName = false; // Salimos del modo de edición
    } else {
      this.result = 'Por favor, ingresa un DNI válido.';
    }
  }

  async confirmChangeFirstName (){
    await this.processFirstNameChangeRequest ()
  }

  async confirmChangeDNI (){
    await this.processDNIChangeRequest ()
  }

  async confirmChangeAddress (){
    await this.processAddressChangeRequest ()
  }

  async confirmChangeLastName (){
    await this.processLastNameChangeRequest ()
  }

  async confirmChangeEmail (){
    await this.processEmailChangeRequest()
  }
}
