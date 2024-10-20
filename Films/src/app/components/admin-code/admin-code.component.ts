import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-code',
  templateUrl: './admin-code.component.html',
  styleUrls: ['./admin-code.component.css']
})
export class AdminCodeComponent {
  adminCode: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private userService: UserService) {}

  onSubmit() {
    const currentUser = this.userService.getUserActual();

    if (currentUser?.role === 'admin' && currentUser?.adminCode === this.adminCode) {
      // Código correcto, redirigir a la página principal
      this.router.navigate(['/inicio']);
    } else {
      // Mostrar mensaje de error
      this.errorMessage = 'Código de administrador incorrecto';
    }
  }
}
