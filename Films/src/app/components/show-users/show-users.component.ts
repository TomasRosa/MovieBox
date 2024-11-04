import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor (private userService: UserService, private router: Router)
  {
    this.users = userService.getUsers();
    console.log ("USERS: ", this.users)
  }

  verBiblioteca(id: number) {
    this.router.navigate(['/biblioteca', id]);
  }
}
