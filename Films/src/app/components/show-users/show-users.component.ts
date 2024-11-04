import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent 
{
  users: User[] = []

  constructor (private userService: UserService)
  {
    this.users = userService.getUsers();
    console.log ("USERS: ", this.users)
  }
}
