import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent {
  users: User[] = [];
  openDeleteUserAccount: boolean = false;
  fullnameUserToDelete: String = '';
  idUserToDelete: number = -1;

  constructor (private userService: UserService, private router: Router){
    this.users = userService.getUsers();
  }

  verBiblioteca(id: number) {
    this.router.navigate(['/biblioteca', id]);
  }

  verPagosPendientes(id: number){
    this.router.navigate(['/entregas-pendientes',id]);
  }

  async deleteUserAccount (userId: number){
    await this.userService.deleteUserByAdmin (userId);
    this.closeDeleteUserAccountModal ();
    this.users = this.userService.getUsers();
  }

  openDeleteUserAccountModal(firstname: String, lastname: String, id: number){
    this.openDeleteUserAccount = true;
    this.fullnameUserToDelete = firstname + ' ' + lastname;
    this.idUserToDelete = id;
  }

  closeDeleteUserAccountModal(){
    this.openDeleteUserAccount = false;
    this.fullnameUserToDelete = '';
    this.idUserToDelete = -1;
  }
}
