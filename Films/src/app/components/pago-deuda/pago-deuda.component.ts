import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tarjeta } from 'src/app/models/tarjeta';
import { User } from 'src/app/models/user';
import { DeudaService } from 'src/app/services/deuda.service';
import { UserService } from 'src/app/services/user.service';
import { ValidacionTarjeta } from 'src/app/validaciones/validacion-tarjeta';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';

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
  permitirEditarTarjeta:boolean | null = false;
  showFormularioPassword: boolean | null = false;
  showPassword: boolean | null = false;
  passwordToEdit: String = '';
  resultInputPassword: string = '';
  showOptionButtonsToCard: boolean = false;
  activeOptionsEditCard: boolean | null = false;
  resultEditCard: String = '';

  cardFormGroup = new FormGroup ({
    firstName:  new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    lastName: new FormControl('',[Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    nTarjeta:  new FormControl ('',[Validators.required, ValidacionTarjeta.validarTarjetaLongitud(), ValidacionTarjeta.soloNumeros()]),
    fechaVencimiento: new FormControl('', [Validators.required,ValidacionTarjeta.validarFechaNoExpirada(),ValidacionTarjeta.validarFormatoFechaVencimiento()])
  })

  get firstnameCard (){return this.cardFormGroup.get ('firstName')}
  get lastnameCard (){return this.cardFormGroup.get ('lastName')}
  get numberCard (){return this.cardFormGroup.get ('nTarjeta')}
  get fechaVencimientoCard (){return this.cardFormGroup.get ('fechaVencimiento')}

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

  toggleFormPassword(){
    this.showFormularioPassword = !this.showFormularioPassword;
    this.showPassword = false;
  }

  closeFormPassword() {
    this.showFormularioPassword = false;
  }

  openEditByAdmin(){
      this.allowEditCard ();
      this.openOptionsEditCard ();
      this.setFormControlDefaultCardValues ();
  }

  allowEditCard (){
    this.permitirEditarTarjeta = true;
    this.showOptionButtonsToCard = false;
  }

  dontAllowEditCard (){
    this.permitirEditarTarjeta = false;
    this.showOptionButtonsToCard = true;
  }

  openOptionsEditCard (){
    this.activeOptionsEditCard = true;
  }

  closeOptionsEditCard (){
    this.activeOptionsEditCard = false;
  }

  setFormControlDefaultCardValues (){
    this.firstnameCard?.setValue (this.user?.tarjeta.firstName as string)
    this.lastnameCard?.setValue (this.user?.tarjeta.lastName as string)
    this.numberCard?.setValue (this.user?.tarjeta.nTarjeta as string)
    this.fechaVencimientoCard?.setValue (this.user?.tarjeta.fechaVencimiento as string)
  }

  resetCardValues (){
    this.setFormControlDefaultCardValues ()
    this.cardFormGroup.markAsUntouched();
  }

  cancelEditCard(){
    this.dontAllowEditCard ();
    this.closeOptionsEditCard ();
    this.resetCardValues ();
    this.showOptionButtonsToCard = true;
    this.resultEditCard = '';
  }

  async confirmEditCard(){
    if (this.cardFormGroup.valid){
      const newCard = new Tarjeta ({
        firstName: this.firstnameCard?.value ?? '', 
        lastName:this.lastnameCard?.value ?? '', 
        nTarjeta:this.numberCard?.value ?? '', 
        fechaVencimiento:this.fechaVencimientoCard?.value ?? ''
      })
      try{
        const resultado = await this.userService.changeDataCard (this.user, newCard);
        if (resultado.success)
          this.resultEditCard = 'Tarjeta cambiada correctamente'
        else
          this.resultEditCard = 'Error al procesar el cambio de los datos de la tarjeta'
        this.dontAllowEditCard ();
        this.closeOptionsEditCard ();
        this.getLastFourDigits ();
        setTimeout(() => {
          this.resultEditCard = '';
        }, 2000);
      }catch (err){
        console.error (err)
      }
    }else
      this.resultEditCard = 'Por favor, revise los campos de la tarjeta'
  }
  
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
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
      setTimeout(() => {
        this.router.navigate (['/showUsers'])
      }, 2000);
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
        this.showOptionButtonsToCard = true;
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
      this.showFormCVC = false;
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
      this.successMessage = "Pago realizado!"
    }
    setTimeout(() => {
      this.isLoading = false;
      this.showFormCVC = false;
      this.router.navigate (['/showUsers'])
    }, 2000);
  }
}
