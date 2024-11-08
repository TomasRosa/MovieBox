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
  isAdmin: boolean = false; 
  mostrarContrasena: boolean = false;


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
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
        this.adminService.setAdminActual(isUserValid.admin!);
        this.navegarAdminCode(isUserValid.isAdmin)
      } else {
        this.errorMessage = 'Credenciales incorrectas';
      }
    } else {
      this.errorMessage = 'El email o contraseña son nulos';
    }
  }
  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  navegarAdminCode (isAdmin: boolean)
  {
    if (isAdmin)
    {
      this.router.navigate(['admin-code']);
    }
  }
  
}