var map = L.map("map").setView([10.982088,-74.783445],12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom:18, minZoom:9,
}).addTo(map);


var myIcon = L.icon({
    iconUrl: 'https://image.flaticon.com/icons/png/128/2282/2282362.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0,-15],
});

var edgeMarkerLayer = L.edgeMarker({
      icon: L.icon({ // style markers
          iconUrl: 'https://image.flaticon.com/icons/png/128/892/892646.png',
          clickable: true,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
      }),
        rotateIcons: true,
        layerGroup: null
}).addTo(map);

var popup11 = "<br>Punto incial<br>";
var popup21 = "<br>Punto final<br>";
// taxi 1
var marker11 = L.marker([0,0],{icon: myIcon}).bindPopup(popup11,{autoClose: false}).addTo(map);
var marker21 = L.marker([0,0],{icon: myIcon}).bindPopup(popup21,{autoClose: false}).addTo(map);
var polyline = L.polyline([], {color: 'red', opacity: 0.8, weight: 2, lineJoin: 'round', smoothFactor: 0, dashArray: "10 10", dashSpeed: 30}).addTo(map);
//polyline.arrowheads({yawn: 40, fill: true, size: "10px", frequency: '60px'});

//taxi 2
var marker12 = L.marker([0,0],{icon: myIcon}).bindPopup(popup11,{autoClose: false}).addTo(map);
var marker22 = L.marker([0,0],{icon: myIcon}).bindPopup(popup21,{autoClose: false}).addTo(map);
var polyline2 = L.polyline([], {color: 'blue', opacity: 0.8, weight: 2, lineJoin: 'round', smoothFactor: 0, /*dashArray: "15 15", dashSpeed: 30*/}).addTo(map);
polyline2.arrowheads({yawn: 40, fill: true, size: "10px", frequency: '60px'});

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

//	puntoA.remove();

}

async function obtenerdatos(){

	/*
	* Esta función recupera los datos de la base de datos de acuerdo a lo seleccionado en el formulario, además
	* carga la matriz de la polilínea y la añade al mapa. Se ejecuta al hacer clic al botón "Buscar".
	* También muestra una alerta si no hay datos para la ventana de tiempo seleccionada.
	* Se incluyen los metodos de establecimiento y borrado de marcadores y polilíneas
	*/

	polyline.setLatLngs([])
	marker11.removeFrom(map)
	marker11 = L.marker([0,0],{icon: myIcon}).bindPopup(popup11,{autoClose: false}).addTo(map);
	marker21.removeFrom(map)
	marker21 = L.marker([0,0],{icon: myIcon}).bindPopup(popup21,{autoClose: false}).addTo(map);
	map.setView([10.982088,-74.783445],12)
	polyline2.setLatLngs([])
	marker12.removeFrom(map)
	marker12 = L.marker([0,0],{icon: myIcon}).bindPopup(popup11,{autoClose: false}).addTo(map);
	marker22.removeFrom(map)
	marker22 = L.marker([0,0],{icon: myIcon}).bindPopup(popup21,{autoClose: false}).addTo(map);

	var cal1 = document.getElementById("calendario1").value;
	var cal2 = document.getElementById("calendario2").value;

	var longitud1
	var latitud1
	var time1
	var longitud2
	var latitud2
	var time2

	// taxi 1

/*	try{
		var response = await fetch(`http://taxisweb.sytes.net:37778/ubicartaxi/1;${cal1};${cal2}`)
		var data = await response.json();
		const rows = data;

		// escribir una matriz con los datos de latitud y longitud obtenidos de la base de datos
		for (i = 0; i < rows.length; i++){
			latlon[i] = L.latLng([rows[i].latitud, rows[i].longitud])
		}

		var latlon = Array(rows.length)
		longitud11 = rows[0].longitud;
		latitud11 = rows[0].latitud;
		time11 = rows[0].time;
		longitud21 = rows[rows.length-1].longitud;
		latitud21 = rows[rows.length-1].latitud;
		time21 = rows[rows.length-1].time;


		if (latlon.length != 0){
			marker11.setLatLng(latlon[0]);
			marker11.setPopupContent("Taxi 1: AVM569"+popup11+"Longitud: "+longitud11+"<br>Latitud: "+latitud11+"<br>Tiempo: "+time11);
			marker21.setLatLng(latlon[latlon.length-1]);
			marker21.setPopupContent("Taxi 1: AMV569"+popup21+"Longitud: "+longitud21+"<br>Latitud: "+latitud21+"<br>Tiempo: "+time21);
			polyline.setLatLngs([latlon.reverse()]);
		} else { alert("No hay datos del taxi 1 para la ventana de tiempo seleccionada"); }

//	} catch(err){alert("No hay datos del taxi 1 para la ventana de tiempo seleccionada kd"); }
*/
	// taxi 2
//	try{
		response = await fetch(`http://taxisweb.sytes.net:37778/ubicartaxi/2;${cal1};${cal2}`)
		data = await response.json();
		const rows2 = data;
		var latlon2 = Array(rows2.length)

		for (i=0; i < rows2.length; i++){
			latlon2[i] = L.latLng([rows2[i].latitud, rows2[i].longitud])
		}

		longitud12 = rows2[0].longitud;
		latitud12 = rows2[0].latitud;
		time12 = rows2[0].time;
		longitud22 = rows2[rows2.length-1].longitud;
		latitud22 = rows2[rows2.length-1].latitud;
		time22 = rows2[rows2.length-1].time;

		if (latlon2.length != 0){
			marker12.setLatLng(latlon2[0]);
			marker12.setPopupContent("Taxi 2: YLK650"+popup11+"Longitud: "+longitud12+"<br>Latitud: "+latitud12+"<br>Tiempo: "+time12);
			marker22.setLatLng(latlon2[latlon2.length-1]);
			marker22.setPopupContent("Taxi 2: YLK650"+popup21+"Longitud: "+longitud22+"<br>Latitud: "+latitud22+"<br>Tiempo: "+time22);
			polyline2.setLatLngs([latlon2]);
		} else { alert("No hay datos del taxi 2 para la ventana de tiempo seleccionada"); }

//	}catch(err){ alert("No hay datos del taxi 2 para la ventana de tiempo seleccionada kd"); }

}
