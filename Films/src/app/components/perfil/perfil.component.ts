import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  usuarioActual: User | null = null;

  // Variables para los datos originales
  firstNameLastName: string | null = null;
  dni: string | null = null;
  email: string | null = null;
  address: string | null = null;

  // Variables para almacenar el valor temporal durante la edición
  tempName: string | null = null;
  tempDni: string | null = null;
  tempEmail: string | null = null;
  tempAddress: string | null = null;

  // Flags de edición
  isEditingName = false;
  isEditingDni = false;
  isEditingEmail = false;
  isEditingAddress = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Suscribirse al servicio para obtener los datos del usuario actual
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      if (this.usuarioActual) {
        // Asignar los valores cuando el usuario sea cargado
        this.firstNameLastName = `${this.usuarioActual.firstName} ${this.usuarioActual.lastName}`;
        this.dni = this.usuarioActual.dni;
        this.email = this.usuarioActual.email;
        this.address = this.usuarioActual.address;

        // Actualizar también los valores temporales
        this.tempName = this.firstNameLastName;
        this.tempDni = this.dni;
        this.tempEmail = this.email;
        this.tempAddress = this.address;
      }
    });
  }

  // Funciones para activar el modo de edición
  toggleEditName() {
    this.isEditingName = !this.isEditingName;
    this.tempName = this.firstNameLastName;
  }

  toggleEditDni() {
    this.isEditingDni = !this.isEditingDni;
    this.tempDni = this.dni;
  }

  toggleEditEmail() {
    this.isEditingEmail = !this.isEditingEmail;
    this.tempEmail = this.email;
  }

  toggleEditAddress() {
    this.isEditingAddress = !this.isEditingAddress;
    this.tempAddress = this.address;
  }

  // Funciones para confirmar la edición
  confirmEditName() {
    this.firstNameLastName = this.tempName;
    this.isEditingName = false;
  }

  confirmEditDni() {
    this.dni = this.tempDni;
    this.isEditingDni = false;
  }

  confirmEditEmail() {
    this.email = this.tempEmail;
    this.isEditingEmail = false;
  }

  confirmEditAddress() {
    this.address = this.tempAddress;
    this.isEditingAddress = false;
  }

  // Función para cancelar la edición
  cancelEdit() {
    this.isEditingName = false;
    this.isEditingDni = false;
    this.isEditingEmail = false;
    this.isEditingAddress = false;
  }
}
