import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  users = new Array<User>()
  
  userForm = new FormGroup ({
    firstName: new FormControl (''),
    lastName: new FormControl (''),
    email: new FormControl (''),
    address: new FormControl (''),
    password: new FormControl (''),
    DNI: new FormControl ('', [Validators.minLength(8), Validators.maxLength(8)])
  })

  constructor (private userService: UserService){}
  
  ngOnInit (){
    this.userService.getUsers ().subscribe ((users) => this.users=users)
  }

  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get dni() { return this.userForm.get('DNI'); }
  get email() { return this.userForm.get('email'); }
  get address() { return this.userForm.get('address'); }
  private get password() { return this.userForm.get('password'); }
  
  onSubmit (){
    let user = new User ()
    user.nombre = this.firstName.value;
    user.apellido = this.lastName.value;
    user.email = this.email.value;
    user.dni = this.dni.value;
    user.password = this.password.value;
  }

} 
