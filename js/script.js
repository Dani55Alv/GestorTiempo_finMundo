'use strict';

dayjs.extend(dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_duration);
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);
dayjs.locale('es');

// ==================================================
// PUNTO 1: EDAD EN COSAS RARAS
// ==================================================

//Calcular nacimiento
let inputNacimiento = document.querySelector('#nacimiento');
let botonCalcular = document.querySelector('[type="submit"]');
let zonaResultadoEdad = document.querySelector('#resultado-edad');
let zonaErrorEdad = document.querySelector('#error-edad');

//Cuenta atras
let fechaFinAnio = document.querySelector('#fecha-evento');




const fechaActual = dayjs();




function contarViernes13(fechaNacimiento, fechaActual) {
  
  let contadorBucle= fechaActual.diff(fechaNacimiento, 'day');
  
  let fechaActualCopia = dayjs(fechaActual); 
  
let Viernes13Detectado = 0;
  
for (let index = 0; index <= contadorBucle; index++) {

  let stringday=dayjs(fechaActualCopia)
  .format("DD"); //Es 13?

  let stringDiaSemana=dayjs(fechaActualCopia)
  .format("dddd"); //Es viernes?

    if (stringday === "13" && stringDiaSemana === "viernes") {

      Viernes13Detectado++;
    }
    fechaActualCopia = fechaActualCopia.subtract(1, "day");


}
  return Viernes13Detectado; 

}

function calcularEdad(evento) {

  evento.preventDefault()

  procesarFormularioEdad()

let nuevaFechaTxt=inputNacimiento.value;

console.log("Debug input nacimiento: " + nuevaFechaTxt);


  const fechaNacimiento = dayjs(nuevaFechaTxt);

if(nuevaFechaTxt==="" ){

  let excepcion= "Elige una fecha de nacimiento, porfavor.";
  mostrarEdad("", excepcion)
  return;
}



//Controlamos las fechas invalidas
if(fechaNacimiento.isAfter(fechaActual,'day') ){

  let excepcion= "La fecha de nacimiento " + nuevaFechaTxt + " es invalida porque está despues que la actual."
  mostrarEdad("",excepcion)
  return;
}

if(fechaNacimiento.isSame(fechaActual,'day') ){

  let excepcion= "La fecha de nacimiento " + nuevaFechaTxt + " es invalida porque son iguales."
  mostrarEdad("",excepcion)
  return;
}


//Diferencias totales por dias, segundos y horas:

let difDias= fechaActual.diff(fechaNacimiento, 'day');
let difSegundos= fechaActual.diff(fechaNacimiento, 'seconds');
let difHoras= fechaActual.diff(fechaNacimiento, 'hours');

let diaSemanaNac= fechaNacimiento.format("dddd");

let numViernes13=contarViernes13(fechaNacimiento, fechaActual);


let mensaje="La difrencia en dias: "+ difDias + "  horas: " + difHoras + " segundos: " + difSegundos + " Dia de la semana nacimiento " + diaSemanaNac + " Numero de viernes 13: " + numViernes13;

mostrarEdad(mensaje,"")
return;



}

function mostrarEdad(mensaje,excepcion) {

if(excepcion===""){
  zonaResultadoEdad.textContent=mensaje;
}else{

  zonaErrorEdad.textContent=excepcion;
}
}

function procesarFormularioEdad() {
  zonaResultadoEdad.textContent="";
  zonaErrorEdad.textContent="";

zonaResultadoEdad.hidden=false;

}

function iniciarEdad() {

  botonCalcular.addEventListener("click",  calcularEdad )

}

// ==================================================
// PUNTO 2: CUENTA ATRÁS
// ==================================================

function descomponerDuracion(fechaActual, fechaFin) {

  let diferencia = fechaFin.diff(fechaActual);

  let tiempoRestante = dayjs.duration(diferencia);

  let difDias = Math.floor(tiempoRestante.asDays()); //Math floor es para quitar decimales a los dias. (2,5) x 
  let difhoras = tiempoRestante.hours();  
  let difMinutos = tiempoRestante.minutes();
  let difsegundos = tiempoRestante.seconds(); 


return difDias + " dias : " + difhoras + " horas : " + difMinutos + " minutos : " + difsegundos + " segundos" ; 

}


function actualizarCuentaAtras(finAnioString, finAnioFecha) {
  let fechaActualDinamica = dayjs(); // Dentro de esta funcion es dinamica gracias a setInterval(actualizarRelojes, 1000);


  //Fecha falsa para verificar
  
  //const fechaFalsa = dayjs("2027-01-01");
  //fechaActualDinamica = fechaFalsa;



  if (finAnioFecha.diff(fechaActualDinamica) <= 0) {
          let duracionSinDiferencia= descomponerDuracion(finAnioFecha, finAnioFecha);

    fechaFinAnio.textContent =   "Fecha evento: "+ finAnioString + " Tiempo restante: " + duracionSinDiferencia +" ¡El evento ha llegado!";
    return; 
  }

  let duracion = descomponerDuracion(fechaActualDinamica, finAnioFecha);


  fechaFinAnio.textContent = "Fecha evento: "+ finAnioString + " Tiempo restante: " + duracion;

}



//Variables de alcace global. El objeto dayJs y sus fromato string
let finAnioString ; 
let finAnioFecha;

function iniciarCuentaAtras() {


let anioMas1= fechaActual.add(1,"year");
let anioMas1String= anioMas1.format("YYYY");

 finAnioString = dayjs(anioMas1String +'-01-01').format("YYYY/MM/DD");
 finAnioFecha= dayjs(anioMas1String +'-01-01');


}

// ==================================================
// PUNTO 3: ZONAS HORARIAS
// ==================================================



let mihoraLocal = document.querySelector('#hora-local');
let tokyo = document.querySelector('#hora-tokio');
let nuevaYork = document.querySelector('#hora-nueva-york');
let sidney = document.querySelector('#hora-sidney');


function actualizarZonasHorarias() {

let fechaActualDinamica = dayjs(); 
  
  let mensajeFecha = 'DD/MM/YYYY HH:mm:ss';

  mihoraLocal.textContent = fechaActualDinamica.format(mensajeFecha); 
  
  //Con tz(), la biblioteca se encarga automáticamente de los cambios de hora.

  tokyo.textContent = fechaActualDinamica.tz('Asia/Tokyo').format(mensajeFecha);
  nuevaYork.textContent = fechaActualDinamica.tz('America/New_York').format(mensajeFecha);
  sidney.textContent = fechaActualDinamica.tz('Australia/Sydney').format(mensajeFecha);

}

// ==================================================
// INICIO Y ACTUALIZACIÓN COMÚN
// ==================================================

function actualizarRelojes() {
  actualizarCuentaAtras(finAnioString, finAnioFecha);
  actualizarZonasHorarias();
}

iniciarEdad();





iniciarCuentaAtras();

// Ejecutamos la función nada más empezar y creamos un intervalo
actualizarRelojes();
// Un intervalo permite ejecutar una función cada x segundos (1000ms == 1seg)
setInterval(actualizarRelojes, 1000);

