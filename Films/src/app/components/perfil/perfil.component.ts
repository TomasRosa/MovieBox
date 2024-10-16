import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  isLogoutModalVisible: boolean = false;

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

  isEditingFirstName = false;
  isEditingLastName = false;
  isEditingDni = false;
  isEditingEmail = false;
  isEditingAddress = false;

  showErrors = false;
  result: string = ''

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      if (this.usuarioActual) {
        this.formGroupEmail.get('email')?.setValue(this.usuarioActual.email); // Llenamos el FormControl con el email del usuario
        this.formGroupFirstName.get('firstname')?.setValue (this.usuarioActual.firstName);
        this.formGroupLastName.get('lastname')?.setValue (this.usuarioActual.lastName);
        this.formGroupAddress.get('address')?.setValue (this.usuarioActual.address);
        this.formGroupDNI.get('dni')?.setValue (this.usuarioActual.dni);
      }
    });
  }

  openLogoutModal() {
    this.isLogoutModalVisible = true;
  }

  closeLogoutModal() {
    this.isLogoutModalVisible = false;
  }

  // Funciones para activar el modo de edición
  toggleEditFirstame() {
    this.isEditingFirstName = !this.isEditingFirstName;
    if (this.usuarioActual)
      this.formGroupFirstName.get('firstname')?.setValue (this.usuarioActual.firstName);
  }

  toggleEditLastName (){
    this.isEditingLastName = !this.isEditingLastName;
    if (this.usuarioActual)
      this.formGroupLastName.get('lastname')?.setValue (this.usuarioActual.lastName);
  }

  toggleEditDni() {
    this.isEditingDni = !this.isEditingDni;
    if (this.usuarioActual)
      this.formGroupDNI.get('dni')?.setValue (this.usuarioActual.dni);
  }

  toggleEditEmail() {
    this.isEditingEmail = !this.isEditingEmail;
    if (this.usuarioActual)
      this.formGroupEmail.get('email')?.setValue(this.usuarioActual.email); // Resetear valor al original si se vuelve a editar
  }

  toggleEditAddress() {
    this.isEditingAddress = !this.isEditingAddress;
    if (this.usuarioActual)
      this.formGroupAddress.get('address')?.setValue (this.usuarioActual.address);
  }

  // Función para cancelar la edición
  cancelEdit() {
    this.isEditingFirstName = false;
    this.isEditingLastName = false;
    this.isEditingDni = false;
    this.isEditingAddress = false;
    this.isEditingEmail = false;
    if (this.usuarioActual){
      this.formGroupFirstName.reset ({firstname: this.usuarioActual.firstName});
      this.formGroupFirstName.markAsUntouched();
      this.formGroupLastName.reset ({lastname: this.usuarioActual.lastName});
      this.formGroupLastName.markAsUntouched();
      this.formGroupDNI.reset ({dni: this.usuarioActual.dni});
      this.formGroupDNI.markAsUntouched();
      this.formGroupAddress.reset ({address: this.usuarioActual.address});
      this.formGroupAddress.markAsUntouched();
      this.formGroupEmail.reset({ email: this.usuarioActual.email });
      this.formGroupEmail.markAsUntouched();
    }
  }

  private async processEmailChangeRequest (){
    if (this.formGroupEmail.valid) {
      const newEmail = this.formGroupEmail.value.email;
      if (this.usuarioActual && newEmail !== this.usuarioActual.email) {
        try {
          const resultado = await this.userService.changeEmail(this.usuarioActual as User, newEmail as string);
          if (resultado.success) {
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
      if (this.usuarioActual && newFirstName !== this.usuarioActual.firstName) {
        try {
          const resultado = await this.userService.changeFirstName(this.usuarioActual as User, newFirstName as string);
          if (resultado.success) {
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
      if (this.usuarioActual && newLastName !== this.usuarioActual.lastName) {
        try {
          const resultado = await this.userService.changeLastName(this.usuarioActual as User, newLastName as string);
          if (resultado.success) {
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
      if (this.usuarioActual && newDNI !== this.usuarioActual.dni) {
        try {
          const resultado = await this.userService.changeDNI(this.usuarioActual as User, newDNI as string);
          if (resultado.success) {
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
      if (this.usuarioActual && newAddress !== this.usuarioActual.address) {
        try {
          const resultado = await this.userService.changeAddress(this.usuarioActual as User, newAddress as string);
          if (resultado.success) {
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

  logout()
  {
    this.userService.logout();
    this.router.navigate(['/inicio']);
  }
}
