import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { DeudaService } from 'src/app/services/deuda.service';
import { UserService } from 'src/app/services/user.service';
import { ValidacionTarjeta } from 'src/app/validaciones/validacion-tarjeta';

@Component({
  selector: 'app-pago-deuda',
  templateUrl: './pago-deuda.component.html',
  styleUrls: ['./pago-deuda.component.css']
})
export class PagoDeudaComponent {
  deuda: number = 0;
  user: User | null = null;
  payDeuda: Boolean = false;
  saldarDeuda = false;
  hadCard = false;
  deudaSubscription: Subscription = new Subscription;
  successMessage = '';

  //Tarjeta
  imgTypeCardClass: string = '';
  typeCard: String = '';
  lastFourDigits: String | null = null;
  showFormNewCard: boolean | null = false;
  pressButtonCard: boolean | null = false;
  showFormCVC: boolean = false;
  isLoading: boolean = false;
  result: string = "";

  cvcFormGroup = new FormGroup({
    cvc: new FormControl("", [
      Validators.required,
      ValidacionTarjeta.validarCVCLongitud(),
      ValidacionTarjeta.soloNumeros(),
    ]),
  });
  get cvc() {
    return this.cvcFormGroup.get("cvc");
  }

  constructor(private route: ActivatedRoute, private userService: UserService, private deudaService: DeudaService, private router: Router) {
    this.deudaSubscription = this.deudaService.deuda$.subscribe(nuevaDeuda => {
      this.deuda = nuevaDeuda;
    });
  }

  async ngOnInit() {
    const userId = +this.route.snapshot.paramMap.get('id')!;

    if (userId) {
      this.user = await this.userService.getUserById(userId)
      if (this.user) 
      {
        this.userService.tarjetaUsuarioSubject.next (this.user.tarjeta)
        this.deuda = this.user.deuda;
        this.payDeuda = this.user.payDeuda;
      }
    }
    this.userService.showFormAddCard$.subscribe(c => {
      this.showFormNewCard = c;
    })
  }

  toggleSaldarDeuda() {
    this.saldarDeuda = !this.saldarDeuda;
  }

  pagoEfectivo() {
    if (this.user) {
      this.user.deuda = 0;
      this.user.payDeuda = false;
      this.payDeuda = false;
      this.userService.updateUserToJSON(this.user);
      this.deudaService.deudaSubject.next(0)
      clearInterval(this.deudaService.intervalId)
      this.successMessage = "Pago realizado!"
    }
  }

  async pagoTarjeta() {
    if (this.user) 
    {
      this.userService.tarjetaUsuario$.subscribe(t => {
        this.user!.tarjeta = t!
        this.getLastFourDigits()
      })

      if (this.user.tarjeta.nTarjeta != "") {
        this.identificarTarjeta()
        this.getLastFourDigits()
        this.hadCard = true;
      }
      else {
        this.hadCard = false;
      }
      this.pressButtonCard = true;
    }

  }

  identificarTarjeta() {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardRegex = /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[0-1][0-9]{12}|720[0-9]{12}))$/;

    if (visaRegex.test(this.user?.tarjeta.nTarjeta as string)) {
      this.typeCard = '/assets/visa.png';
      this.imgTypeCardClass = 'visa-logo';
    } else if (mastercardRegex.test(this.user?.tarjeta.nTarjeta as string)) {
      this.typeCard = '/assets/mastercard-logo.png';
      this.imgTypeCardClass = 'mastercard-logo';
    } else {
      this.typeCard = '/assets/visa.png';
      this.imgTypeCardClass = 'visa-logo';
    }
  }

  getLastFourDigits() {
    if (this.user) {
      this.lastFourDigits = this.user.tarjeta.nTarjeta.substring(
        this.user.tarjeta.nTarjeta.length - 4
      );
    }
  }

  navegar(id: number) 
  {
    if (id)
    {
      this.router.navigate(['pago-deuda', id])
      this.toggleSaldarDeuda()
      this.pressButtonCard = false;
    }
  }

  showFormToAddNewCard() {
    this.userService.toggleShowFormAddCard(true);
    this.showFormNewCard = true;
  }

  hideFormToAddNewCard() {
    this.userService.toggleShowFormAddCard(false);
    this.showFormNewCard = false;
  }

  showFormSecurityCode() {
    this.showFormCVC = true;
  }

  async buyWithActualCard() {
    if (this.user && this.user.tarjeta)
    {
      this.user.tarjeta.saldo -= this.deuda;
      this.user.deuda = 0;
      this.isLoading = true;
      this.user.payDeuda = false;
      this.payDeuda = false;
      this.userService.updateUserToJSON(this.user);
      this.deudaService.deudaSubject.next(0)
      clearInterval(this.deudaService.intervalId)
    }
    setTimeout(() => {
      this.isLoading = false;
      this.showFormCVC = false;
      this.successMessage = "Pago realizado!"
    }, 2000);
  }
}
