import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-show-users',
  templateUrl: './show-users.component.html',
  styleUrls: ['./show-users.component.css']
})
export class ShowUsersComponent implements OnInit{
  users: User[] = [];
  openDeleteUserAccount: boolean = false;
  fullnameUserToDelete: String = '';
  idUserToDelete: number = -1;

  constructor (private userService: UserService, private router: Router){}

  async ngOnInit (){
    const usersFromJSON = await this.userService.getUsersFromJSON();
    if (usersFromJSON){
      this.users = usersFromJSON;
    }
  }

  verBiblioteca(id: number) {
    this.router.navigate(['/biblioteca', id]);
  }

  verPagosPendientes(id: number){
    this.router.navigate(['/entregas-pendientes',id]);
  }

  verDeuda(id: number){
    this.router.navigate(['/pago-deuda',id]);
  }

  async deleteUserAccount (userId: number){
    await this.userService.deleteUserByAdmin (userId);
    this.closeDeleteUserAccountModal ();
    const usersFromJSON = await this.userService.getUsersFromJSON();
    if (usersFromJSON){
      this.users = usersFromJSON;
    }
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
