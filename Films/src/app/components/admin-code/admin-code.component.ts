import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { SharedServicesService } from 'src/app/services/shared-services.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-code',
  templateUrl: './admin-code.component.html',
  styleUrls: ['./admin-code.component.css']
})
export class AdminCodeComponent {
  adminCode: string = '';
  errorMessage: string = '';

  codeForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private adminService: AdminService, private userService: UserService, private sharedService: SharedServicesService) {}

  onSubmit() {
    this.verifyAdminCode()
  }

  verifyAdminCode() {
    const codeAdminValue: string | null = this.codeForm.controls['code']?.value ?? null;
    console.log("CODIGO ADMIN: ", codeAdminValue);
    
    if (this.adminService.obtenerCodigoAdmin(this.adminService.getAdminActual()?.id!) == codeAdminValue) {
      this.sharedService.setAdminCodeVerified(true);
      this.sharedService.setLogged(true);
      this.userService.isLoggedInSubject.next(true)
      this.userService.storedAdmin = this.adminService.getAdminActual();
      this.userService.storedUser = null;
      this.adminService.isLoggedInSubject.next (true)
      this.router.navigate(['/inicio']);
    } else 
    {
      this.errorMessage = 'Código incorrecto';
    }
  }
}
