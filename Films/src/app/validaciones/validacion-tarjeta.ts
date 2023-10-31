export class validacionTarjeta{
    static validarTarjetaLongitud(numeroTarjeta: string): boolean 
    {
        const resultado = numeroTarjeta.length === 16;
        console.log("validarTarjetaLongitud" + resultado);
        return resultado;
    }
    
    static soloNumeros(cadena: string): boolean 
    {
        const resultado = /^\d+$/.test(cadena)
        console.log('soloNumeros:', resultado);
        return resultado;
    }
    static validarCVCLongitud(cvc: string): boolean 
    {
        const resultado = /^[0-9]{3,4}$/.test(cvc)
        console.log('validarCVCLongitud', resultado);
        return resultado;
    }
    static validarFormatoFechaVencimiento(fecha: string): boolean 
    { 
        const resultado = /^\d{1,2}\/\d{2}(\d{2})?$/.test(fecha);
        console.log('validarFormatoFechaVencimiento', resultado);
        return resultado;
    }
    static validarFechaNoExpirada(fecha: string): boolean 
    {
        if (!validacionTarjeta.validarFormatoFechaVencimiento(fecha)) 
        {
          return false; // El formato no es válido
        }
      
        const partes = fecha.split('/');
        const mes = parseInt(partes[0], 10);
        const anio = parseInt(partes[1], 10);
      
        if (mes < 1 || mes > 12) 
        {
          return false; // El mes no es válido
        }
      
        const fechaActual = new Date();
        const anioActual = fechaActual.getFullYear() % 100; // Solo los últimos 2 dígitos
        const mesActual = fechaActual.getMonth() + 1; // Se suma 1 porque en JavaScript los meses van de 0 a 11
      
        if (anio < anioActual || (anio === anioActual && mes < mesActual)) 
        {
          return false; // La fecha ha expirado
        }
      
        return true; // La fecha no ha expirado
      }
}