import { Component } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';
import { ValidacionTarjeta } from 'src/app/validaciones/validacion-tarjeta';
import { Tarjeta } from 'src/app/models/tarjeta';
import { CarritoService } from 'src/app/services/carrito.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})

export class TarjetaComponent {
  /* Generales */
  usuarioActual: User | null = null;
  showFormAddCard: boolean|null = true;
  showFormNewCard: boolean = false;
  /* Tarjeta */
  showFormCVC: boolean = false;
  lastFourDigits: String | null = null;
  showBuyWithActualCard: boolean = true;
  showFormConfirmBuyWithActualCard: boolean = false;
  
  errorMessage: string = '';
  successMessage: string = '';
  result: string = ''
  mostrarFormularioSinUltimaTarjeta: boolean = false;

  tarjetaForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    lastName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    nTarjeta: new FormControl('', [Validators.required,ValidacionTarjeta.soloNumeros(),ValidacionTarjeta.validarTarjetaLongitud()]),
    fechaVencimiento: new FormControl ('',[Validators.required,ValidacionTarjeta.validarFechaNoExpirada(),ValidacionTarjeta.validarFormatoFechaVencimiento()]),
    CVC: new FormControl ('',[Validators.required,ValidacionTarjeta.validarCVCLongitud(),ValidacionTarjeta.soloNumeros()])      
  });

  constructor(
    private carritoService: CarritoService, 
    private userService: UserService, 
    private routerService: Router){}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      this.validarSiTieneTarjeta();
    });
    this.userService.showFormAddCard$.subscribe ((show: boolean | null) => {
      this.showFormAddCard = show;
    })
  }

  get firstName () {return this.tarjetaForm.get('firstName')}
  get lastName () {return this.tarjetaForm.get('lastName')}
  get nTarjeta () {return this.tarjetaForm.get('nTarjeta')}
  get fechaVencimiento () {return this.tarjetaForm.get('fechaVencimiento')}
  get CVC () {return this.tarjetaForm.get('CVC')}

  async buyWithActualCard (){
    let res;
      const carrito = this.carritoService.obtenerCarrito()
      if(this.carritoService.obtenerTotalCarrito() != null && this.usuarioActual){
        if (this.usuarioActual.tarjeta.saldo >= this.carritoService.obtenerTotalCarrito()){
          this.usuarioActual.tarjeta.saldo -= this.carritoService.obtenerTotalCarrito()
          res = await this.userService.cargarBiblioteca(this.usuarioActual as User, carrito)
          if (res){
            if (res.success) this.result = res.message; 
            else this.result = res.message;
          }
          this.carritoService.limpiarCarrito()
        }else{
          this.result = 'Saldo insufuciente! Intente mas tarde'
        }
      }
    setTimeout(()=>{
      this.showFormConfirmBuyWithActualCard = false;
      this.mostrarFormularioSinUltimaTarjeta = false;
      this.showBuyWithActualCard = false;
      this.navegarInicio ('inicio');
    }, 1500)
  }
  
  async onSubmit ()
  {
    if(this.tarjetaForm.valid){
      let tarjeta = new Tarjeta()
      
      if (this.firstName && this.lastName && this.nTarjeta && this.CVC && this.fechaVencimiento){
        if (this.CVC.value != null) tarjeta.CVC = this.CVC.value 
        if (this.firstName.value != null) tarjeta.firstName = this.firstName.value
        if (this.lastName.value != null) tarjeta.lastName = this.lastName.value
        if (this.nTarjeta.value != null) tarjeta.nTarjeta = this.nTarjeta.value
        if (this.fechaVencimiento.value != null) tarjeta.fechaVencimiento = this.fechaVencimiento.value
      }

      if (tarjeta && this.usuarioActual?.tarjeta)
      this.usuarioActual.tarjeta = tarjeta

      let res;
      const carrito = this.carritoService.obtenerCarrito()
      if(this.carritoService.obtenerTotalCarrito() != null && this.usuarioActual){
        if (this.usuarioActual.tarjeta.saldo >= this.carritoService.obtenerTotalCarrito()){
          this.usuarioActual.tarjeta.saldo -= this.carritoService.obtenerTotalCarrito()
          res = await this.userService.cargarBiblioteca(this.usuarioActual as User, carrito)
          if (res){
            if (res.success) this.result = res.message; 
            else this.result = res.message;
          }
          this.carritoService.limpiarCarrito()
        }else{
           this.result = 'Saldo insufuciente! Intente mas tarde'
        }
      }

    setTimeout(()=>{
      this.showFormConfirmBuyWithActualCard = false;
      this.mostrarFormularioSinUltimaTarjeta = false;
      this.navegarInicio ('inicio');
    }, 1500)
    }
  }

  validarSiTieneTarjeta (){
    if (this.usuarioActual?.tarjeta?.firstName && this.usuarioActual?.tarjeta?.lastName && this.usuarioActual?.tarjeta?.fechaVencimiento && this.usuarioActual?.tarjeta?.nTarjeta){
      this.showBuyWithActualCard = true
      this.getLastFourDigits ();
    } 
    else this.mostrarFormularioSinUltimaTarjeta=true ;
  }

  getLastFourDigits (){
    if (this.usuarioActual){
      this.lastFourDigits = this.usuarioActual.tarjeta.nTarjeta.substring(this.usuarioActual.tarjeta.nTarjeta.length - 4);
    }
  }

  showFormToAddNewCard (){
    this.userService.toggleShowFormAddCard(true);
    this.showFormNewCard = true;
  }

  hideFormToAddNewCard(){
    this.userService.toggleShowFormAddCard(false);
  }

  showFormSecurityCode(){
    this.showFormCVC = true;
  }

  showFormConfirmBuy(){
    this.showFormConfirmBuyWithActualCard = true;
  }

  navegarInicio(componente: string) {
    this.routerService.navigate([componente]);
  }

  actualizarTarjeta(nuevaTarjeta: Tarjeta) {
    if (this.usuarioActual) 
      this.getLastFourDigits();
    this.showFormNewCard = false; 
    this.showFormAddCard = false; 
  }
}
