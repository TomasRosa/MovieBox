export class Tarjeta {
    firstName:string ='';
    lastName:string ='';
    nTarjeta: string ='';
    fechaVencimiento: string='';
    CVC: string= '';
    saldo: number = 99999;

    constructor(init?: Partial<Tarjeta>) {
        Object.assign(this, init);
      }
}
