import { Component } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ValidacionUserPersonalizada } from 'src/app/validaciones/validacion-user-personalizada';
import { ValidacionTarjeta } from 'src/app/validaciones/validacion-tarjeta';
import { Tarjeta } from 'src/app/models/tarjeta';
import { CarritoService } from 'src/app/services/carrito.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})

export class TarjetaComponent {
  errorMessage: string = '';
  successMessage: string = '';
  usuarioActual: User | null = null;
  result: string = ''
  mostrarFormularioConUltimaTarjeta: boolean = false;
  mostrarFormularioSinUltimaTarjeta: boolean = false;
  mostrarDeseaComprarConUltimaTarjeta: boolean = true;

  tarjetaForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    lastName: new FormControl('', [Validators.required, ValidacionUserPersonalizada.soloLetras()]),
    nTarjeta: new FormControl('', [Validators.required,ValidacionTarjeta.soloNumeros(),ValidacionTarjeta.validarTarjetaLongitud()]),
    fechaVencimiento: new FormControl ('',[Validators.required,ValidacionTarjeta.validarFechaNoExpirada(),ValidacionTarjeta.validarFormatoFechaVencimiento()]),
    CVC: new FormControl ('',[Validators.required,ValidacionTarjeta.validarCVCLongitud(),ValidacionTarjeta.soloNumeros()])      
  });

  constructor(private carritoService: CarritoService, private userService: UserService){}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
    });
  }

  get firstName () {return this.tarjetaForm.get('firstName')}
  get lastName () {return this.tarjetaForm.get('lastName')}
  get nTarjeta () {return this.tarjetaForm.get('nTarjeta')}
  get fechaVencimiento () {return this.tarjetaForm.get('fechaVencimiento')}
  get CVC () {return this.tarjetaForm.get('CVC')}

  async comprarConUltimaTarjeta (){
    const carrito = this.carritoService.obtenerCarrito()
    const res = await this.userService.cargarBiblioteca(this.usuarioActual as User, carrito)
    if (res.success) this.result = res.message; 
    else this.result = res.message;

    setTimeout(()=>{
      this.mostrarFormularioConUltimaTarjeta = false;
      this.mostrarFormularioSinUltimaTarjeta = false;
      this.mostrarDeseaComprarConUltimaTarjeta = false;
    }, 2000)
  }
  
  async onSubmit ()
  {
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

    if(this.tarjetaForm.valid){
      const carrito = this.carritoService.obtenerCarrito()
      const res = await this.userService.cargarBiblioteca(this.usuarioActual as User, carrito)
      if (res.success) this.result = res.message; 
      else this.result = res.message;
    }

    setTimeout(()=>{
      this.mostrarFormularioConUltimaTarjeta = false;
      this.mostrarFormularioSinUltimaTarjeta = false;
      /* ENVIAR A INICIO */
    }, 2000)
  }
}
