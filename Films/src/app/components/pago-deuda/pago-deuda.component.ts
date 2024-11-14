import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-pago-deuda',
  templateUrl: './pago-deuda.component.html',
  styleUrls: ['./pago-deuda.component.css']
})
export class PagoDeudaComponent 
{
  deuda: number = 0;
  user: User | null = null;
  constructor(private route: ActivatedRoute, private userService: UserService)
  {
  }

  async ngOnInit ()
  {
    const userId = +this.route.snapshot.paramMap.get('id')!;

    if (userId)
    {
      this.user = await this.userService.getUserById(userId)
      if (this.user)
      {
        this.deuda = this.user.deuda;
      }
    }
  }
}
