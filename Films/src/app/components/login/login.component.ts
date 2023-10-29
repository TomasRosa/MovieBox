import { Component } from '@angular/core';
import { OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
message: string = '';

loginForm = new FormGroup (
  {
    email: new FormControl('',[Validators.required],/*Aca irian las custom validators*/),
    password: new FormControl('',[Validators.required],/*Aca irian las custom validators*/)
  }
)

constructor(private userService: UserService) { }

ngOnInit()
{

}

get email () {return this.loginForm.get('email'); }
get password () {return this.loginForm.get('password'); }


onSubmit()
{
  let user = new User();

  user.email = this.email.value;
  user.password = this.password.value;

  if(this.userService.verificarUserEnJson(getEmail(),getPassword()))
  {

  }
  else
  {
    
  }
}





}
