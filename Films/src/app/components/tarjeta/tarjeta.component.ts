import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ValidacionUserPersonalizada } from "src/app/validaciones/validacion-user-personalizada";
import { ValidacionTarjeta } from "src/app/validaciones/validacion-tarjeta";
import { Tarjeta } from "src/app/models/tarjeta";
import { CarritoService } from "src/app/services/carrito.service";
import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/user";
import { Router } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";
import { DeudaService } from "src/app/services/deuda.service";

@Component({
  selector: "app-tarjeta",
  templateUrl: "./tarjeta.component.html",
  styleUrls: ["./tarjeta.component.css"],
})
export class TarjetaComponent {
  /* Generales */
  usuarioActual: User | null = null;
  showFormAddCard: boolean | null = true;
  showFormNewCard: boolean = false;
  /* Tarjeta */
  imgTypeCardClass: string = '';
  typeCard: String = '';
  showFormCVC: boolean = false;
  lastFourDigits: String | null = null;
  showBuyWithActualCard: boolean = true;
  showFormConfirmBuyWithActualCard: boolean = false;
  /* Proceso de compra */
  isLoading: boolean = false;
  errorMessage: string = "";
  successMessage: string = "";
  result: string = "";
  cardIsEmpty: boolean = false;

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

  constructor(
    private carritoService: CarritoService,
    private userService: UserService,
    private routerService: Router,
    private deudaService: DeudaService
  ) {}

  ngOnInit(): void {
    this.userService.usuarioActual$.subscribe((usuario: User | null) => {
      this.usuarioActual = usuario;
      this.validarSiTieneTarjeta();
      this.identificarTarjeta ();
    });
    this.userService.showFormAddCard$.subscribe((show: boolean | null) => {
      this.showFormAddCard = show;
    });
  }

  identificarTarjeta() {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const mastercardRegex = /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[0-1][0-9]{12}|720[0-9]{12}))$/;

    if (visaRegex.test(this.usuarioActual?.tarjeta.nTarjeta as string)) {
        this.typeCard = '/assets/visa.png';
        this.imgTypeCardClass = 'visa-logo';
    } else if (mastercardRegex.test(this.usuarioActual?.tarjeta.nTarjeta as string)) {
        this.typeCard = '/assets/mastercard-logo.png';
        this.imgTypeCardClass = 'mastercard-logo';
    } else{
      this.typeCard = '/assets/visa.png';
      this.imgTypeCardClass = 'visa-logo';
    } 
  }

  async buyWithActualCard() {
    if (!this.cvcFormGroup.valid) {
      this.result = "Hay errores en el codigo de seguridad";
      return;
    }
    const carrito = this.carritoService.obtenerCarrito();
    if (!carrito) {
      this.result = "Su carrito se encuentra vacio";
      return;
    }
    let res;
    const total = this.carritoService.obtenerTotalCarrito();
    if (total != null && this.usuarioActual) {
      if (this.usuarioActual.tarjeta.saldo >= total) {
        this.usuarioActual.tarjeta.saldo -= total;
        res = await this.userService.cargarBiblioteca(
          this.usuarioActual as User,
          carrito
        );
        if (res) {
          if (res.success) {
            this.result = res.message;
            this.isLoading = true;
          } else this.result = res.message;
        }
        this.carritoService.limpiarCarrito();
        // this.deudaService.iniciarDeuda();
      } else {
        this.result = "Saldo insufuciente! Intente mas tarde";
      }
    }
    setTimeout(() => {
      this.isLoading = false;
      this.showBuyWithActualCard = false;
      this.navegarInicio("inicio");
    }, 2000);
  }

  validarSiTieneTarjeta() {
    if (
      this.usuarioActual?.tarjeta?.firstName &&
      this.usuarioActual?.tarjeta?.lastName &&
      this.usuarioActual?.tarjeta?.fechaVencimiento &&
      this.usuarioActual?.tarjeta?.nTarjeta
    ) {
      this.showBuyWithActualCard = true;
      this.getLastFourDigits();
    } else this.showBuyWithActualCard = false;
  }

  getLastFourDigits() {
    if (this.usuarioActual) {
      this.lastFourDigits = this.usuarioActual.tarjeta.nTarjeta.substring(
        this.usuarioActual.tarjeta.nTarjeta.length - 4
      );
    }
  }

  showFormToAddNewCard() {
    this.userService.toggleShowFormAddCard(true);
    this.showFormNewCard = true;
  }

  hideFormToAddNewCard() {
    this.userService.toggleShowFormAddCard(false);
  }

  showFormSecurityCode() {
    this.showFormCVC = true;
  }

  navegarInicio(componente: string) {
    this.routerService.navigate([componente]);
  }

  actualizarTarjeta(nuevaTarjeta: Tarjeta) {
    if (this.usuarioActual) this.getLastFourDigits();
    this.showFormNewCard = false;
    this.showFormAddCard = false;
  }
  pagarEnEfectivo(): void {
    const peliculasCarrito = this.carritoService.obtenerCarrito();
    if (this.usuarioActual && peliculasCarrito.length > 0) {
      this.userService
        .agregarEntregaPendiente(this.usuarioActual, peliculasCarrito)
        .then((response) => {
          if (response.success) {
            this.result = "Pago en efectivo exitoso: " + response.message; // Mensaje de éxito
            this.carritoService.limpiarCarrito();
          } else {
            this.result = "Error al pagar en efectivo: " + response.message; // Mensaje de error
          }
          this.manejarMensaje();
        })
        .catch((error) => {
          this.result = "Ocurrió un error al procesar el pago en efectivo: " + error.message; // Mensaje de error
          this.manejarMensaje();
        });
    } else {
      this.result = "El carrito está vacío o no hay usuario activo."; // Mensaje si el carrito está vacío
      this.manejarMensaje();
    }
  }
  manejarMensaje() {
    setTimeout(() => {
      this.result = ""; // Ocultar el mensaje
      this.navegarInicio('inicio'); // Redirigir al inicio
    }, 2000);
  }
  
}
