import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AdminService } from 'src/app/services/admin.service'; 
import { User } from 'src/app/models/user';
import { Admin } from 'src/app/models/admin';
import { SharedServicesService } from 'src/app/services/shared-services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';
  users: Array<User> = [];
  isLoggedIn: boolean | null;
  admins: Array<Admin> = [];
  isAdmin: boolean = false; // Indica si el usuario actual es un administrador

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  codeForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private router: Router,
    private sharedService: SharedServicesService
  ) {
    this.isLoggedIn = false
  }

  ngOnInit() {
    this.userService.loadUsersFromJSON().then(() => {
      this.users = this.userService.getUsers();
    });

    this.adminService.loadAdminsFromJSON().then(() => {
      this.admins = this.adminService.getAdmins();
    });

    this.sharedService.isLoggedIn$.subscribe((isLoggedIn: boolean | null) => {
      this.isLoggedIn = isLoggedIn || false;
    });
  }

  async onSubmit() {
    const emailValue: string | null = this.loginForm.controls['email']?.value ?? null;
    const passwordValue: string | null = this.loginForm.controls['password']?.value ?? null;

    if (emailValue !== null && passwordValue !== null) {
      const isUserValid = await this.userService.verifyUserOrAdmin(emailValue, passwordValue);
      
      if (isUserValid.isUser) {
        this.successMessage = 'Bienvenido a RosaGomezRuiz Peliculas';
        this.userService.setUsuarioActual(isUserValid.user!);
        this.isAdmin = false;
        this.isLoggedIn = true;
        this.sharedService.setLogged(true)
        this.userService.storedUser = isUserValid.user!;
        this.userService.storedAdmin = null;
        this.router.navigate(['/inicio']);
      } else if (isUserValid.isAdmin) {
        this.successMessage = 'Acceso de administrador, se requiere código';
        this.adminService.setAdminActual(isUserValid.admin!);
        this.isAdmin = true;
        this.isLoggedIn = true;
        this.sharedService.setLogged(true)
      } else {
        this.errorMessage = 'Credenciales incorrectas';
      }
    } else {
      this.errorMessage = 'El email o contraseña son nulos';
    }
  }

  verifyAdminCode() {
    const codeAdminValue: string | null = this.codeForm.controls['code']?.value ?? null;
    console.log("CODIGO ADMIN: ", codeAdminValue);
    
    if (this.adminService.obtenerCodigoAdmin(this.adminService.getAdminActual()?.email!) == codeAdminValue) {
      this.successMessage = 'Código verificado con éxito';
      this.sharedService.setAdminCodeVerified(true);
      this.userService.storedAdmin = this.adminService.getAdminActual();
      this.userService.storedUser = null;
      this.router.navigate(['/inicio']);
    } else {
      this.errorMessage = 'Código incorrecto';
    }
  }
  
}






