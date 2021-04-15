var map = L.map("map").setView([10.982088164553303,-74.78344818015789],11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom:18, minZoom:9,
}).addTo(map);

polyline = L.polyline([], {color: 'red', opacity: 0.8, weight: 5, smoothFactor: 0}).addTo(map);

function formatofecha(date){

	/*
	* Esta función convierte el formato de fecha y hora dado por la función Date() a uno tal que pueda ser
	* interpretado por el formulario de los calendarios, es decir, tipo "date-time local" --> "YYYY-MM-DDThh-mm"
	*/

	var mes = date.getMonth()+1; //obteniendo mes
	var dia = date.getDate(); //obteniendo dia
	var hora = date.getHours(); // obteniendo hora
	var year = date.getFullYear(); //obteniendo año
	var minuto = date.getMinutes(); // obteniendo minutos
	if(dia<10){
		dia='0'+dia; //agrega cero si el año menor de 10
		//console.log(dia)
	}
	if(mes<10){
		mes='0'+mes //agrega cero si el mes menor de 10
	}
	if(hora<10){
		hora='0'+hora; // agrega cero si la hora es menor a 10
	}
	if(minuto<10){
		minuto='0'+minuto //agrega cero si el menor de 10
	}

	// Fecha y hora local con formato Date-time local - calendarios
	var datetime = +year+"-"+mes+"-"+dia+"T"+hora+":"+minuto;
	//console.log(datenow)
	return datetime
}

// Fecha y hora local:
var date = new Date();
var local = formatofecha(date)
console.log(local)
// Establece que el máximo valor por defecto de los calendarios es el día que sea realiza la consulta
document.getElementById("calendario1").setAttribute("max", local)
document.getElementById("calendario2").setAttribute("max", local)

function verificar(){
	/*
	* Esta función restringe los posibles datos que el usuario puede ingresar
	*
	* 1. Restringe la posibilidad de dar clic al botón de Buscar si el usuario no selecciona ambas fechas y horas
	* 2. Bloquea las fechas anteriores a la seleccionada en la inicial  para el calendario final
	* 3. Bloquea las fechas posteriores a la seleccionada en el final para el calendario inicial
	*/

	var cal1 = document.getElementById("calendario1").value;
	var cal2 = document.getElementById("calendario2").value;

	// 1.
	if (cal1 == [] || cal2 == []) {
		document.getElementById("btn1").setAttribute("disabled", "on")
	} else {
		document.getElementById("btn1").removeAttribute("disabled")
	}

	// 2.
	if (cal1 != []){
		document.getElementById("calendario2").setAttribute("min", cal1)
	}

	// 3.
	if (cal2 != []){
		document.getElementById("calendario1").setAttribute("max", cal2)
	}

}

async function obtenerdatos(){

	/*
	* Esta función recupera los datos de la base de datos de acuerdo a lo seleccionado en el formulario, además
	*	carga la matriz de la polilínea y la añade al mapa. Se ejecuta al hacer clic al botón "Buscar".
	*	También muestra una alerta si no hay datos para la ventana de tiempo seleccionada.
	*/

	polyline.setLatLngs([])
	map.setView([10.982088164553303,-74.78344818015789],11)

	var cal1 = document.getElementById("calendario1").value;
	var cal2 = document.getElementById("calendario2").value;

	try{
		//var latlon = [];
		const response = await fetch(`http://taxisweb.sytes.net:37778/ubicartaxi/${cal1};${cal2}`)
		const data = await response.json();
		const {rows} = data;
		var latlon = Array(rows.length)
		var popup1;
		var popup2;

		// escribir una matriz con los datos de latitud y longitud obtenidos de la base de datos
		for (i = 0; i < rows.length; i++){
			latlon[i] = L.latLng([rows[i].latitud, rows[i].longitud])
		}

		// map.setView(latlon[0])
		console.log(latlon.length)

		polyline.setLatLngs([latlon])

		if (latlon.length == 0){
			alert("NO DATA1")
		}

	}
	catch(err){
		alert("NO DATA")
	}

}
