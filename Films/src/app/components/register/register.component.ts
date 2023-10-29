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
    firstName: new FormControl ('', [Validators.required]),
    lastName: new FormControl ('', [Validators.required]),
    email: new FormControl ('', [Validators.required]),
    address: new FormControl ('', [Validators.required]),
    password: new FormControl ('', [Validators.required]),
    DNI: new FormControl ('', [Validators.minLength(8), Validators.maxLength(8),Validators.required])
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
  /*
  onSubmit (){
    let user = new User();

    if (this.firstName &&  this.lastName && this.email && this.password && this.address && this.dni){
      if(this.firstName.value != null) user.nombre=this.firstName.value;
      if (this.lastName.value != null) user.apellido=this.lastName.value;
      if (this.email.value != null) user.email=this.email.value;
      if (this.dni.value != null) user.dni= this.dni.value;
      if (this.address.value != null) user.address = this.address.value;
      if (this.password.value != null) user.password = this.password.value
    }
    
    this.userService.addUser (user) /* LLAMAMOS AL METODO ASYNC QUE POSTEA EL USER EN EL JSON SERVER */
  }
} 
