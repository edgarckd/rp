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
		iconUrl: 'https://image.flaticon.com/icons/png/128/853/853997.png',
		clickable: true,
		iconSize: [30, 30],
		iconAnchor: [15, 15]
	}),
	rotateIcons: true,
	layerGroup: null
}).addTo(map);

var popupInicial = "<br>Punto incial<br>";
var popupFinal = "<br>Punto final<br>";

// taxi 1
var marker11 = L.marker([0,0],{icon: myIcon}).bindPopup(popupInicial,{autoClose: false});
var marker21 = L.marker([0,0],{icon: myIcon}).bindPopup(popupFinal,{autoClose: false});
var polyline = L.polyline([], {color: 'red', opacity: 0.8, weight: 2, lineJoin: 'round', smoothFactor: 0}).addTo(map);
polyline.arrowheads({yawn: 40, fill: true, size: "10px", frequency: '60px'});

//taxi 2
var marker12 = L.marker([0,0],{icon: myIcon}).bindPopup(popupInicial,{autoClose: false});
var marker22 = L.marker([0,0],{icon: myIcon}).bindPopup(popupFinal,{autoClose: false});
var polyline2 = L.polyline([], {color: 'blue', opacity: 0.8, weight: 2, lineJoin: 'round', smoothFactor: 0}).addTo(map);
polyline2.arrowheads({yawn: 40, fill: true, size: "10px", frequency: '60px'});

// Grupo de marcadores
var markersGroup = new L.FeatureGroup([marker11,marker21,marker12,marker22]);

/*
* Esta función convierte el formato de fecha y hora dado por la función Date() a uno tal que pueda ser
* interpretado por el formulario de los calendarios, es decir, tipo "date-time local" --> "YYYY-MM-DDThh-mm"
*/
function formatofecha(date){

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

	return datetime
}

// Fecha y hora local:
var date = new Date();
var local = formatofecha(date)
console.log(local)
// Establece que el máximo valor por defecto de los calendarios es el día que sea realiza la consulta
document.getElementById("calendario1").setAttribute("max", local)
document.getElementById("calendario2").setAttribute("max", local)

/*
* Esta función restringe los posibles datos que el usuario puede ingresar
*
* 1. Restringe la posibilidad de dar clic al botón de Buscar si el usuario no selecciona ambas fechas y horas
* 2. Bloquea las fechas anteriores a la seleccionada en la inicial  para el calendario final
* 3. Bloquea las fechas posteriores a la seleccionada en el final para el calendario inicial
*/
function verificar(){

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

markersGroup.removeLayer(marker11);
markersGroup.removeLayer(marker21);
markersGroup.removeLayer(marker12);
markersGroup.removeLayer(marker22);

/*
* Esta función recupera los datos de la base de datos de acuerdo a lo seleccionado en el formulario
* Carga la matriz de la polilínea y la añade al mapa. Se ejecuta al hacer clic al botón "Buscar"
* También muestra una alerta si no hay datos para la ventana de tiempo seleccionada.
* Se incluyen los metodos para borrar marcadores y polilíneas
*/
var x = document.getElementsByName("taxis");
x[2].checked = true;
var i=1;
async function obtenerdatos(){

	map.setView([10.982088,-74.783445],12);
	polyline.setLatLngs([]);
	polyline2.setLatLngs([]);
	var cal1 = document.getElementById("calendario1").value;
	var cal2 = document.getElementById("calendario2").value;

	markersGroup.removeLayer(marker11);
	markersGroup.removeLayer(marker21);
	markersGroup.removeLayer(marker12);
	markersGroup.removeLayer(marker22);

	if (x[0].checked == true) {
		mostrarRecorrido(`http://taxisweb.sytes.net:37778/ubicartaxi/1;${cal1};${cal2}`,1);
	} else if (x[1].checked == true) {
		mostrarRecorrido(`http://taxisweb.sytes.net:37778/ubicartaxi/2;${cal1};${cal2}`,2);
	} else {
		mostrarRecorrido(`http://taxisweb.sytes.net:37778/ubicartaxi/1;${cal1};${cal2}`,1);
		mostrarRecorrido(`http://taxisweb.sytes.net:37778/ubicartaxi/2;${cal1};${cal2}`,2);
	}
}

async function mostrarRecorrido(fetchParam,taxiNo){

	response = await fetch(fetchParam);

	if (taxiNo==1) {
		var poly = polyline;
		var popupTaxi = "Taxi 1: AMV569";

		data = await response.json();
		const rows = data;
		var latlon = Array(rows.length);

		for (i=0; i < rows.length; i++){
			latlon[i] = L.latLng([rows[i].latitud, rows[i].longitud])
		}

		if (latlon.length != 0){
			longitud1 = rows[0].longitud;
			latitud1 = rows[0].latitud;
			time1 = rows[0].time;
			longitud2 = rows[latlon.length-1].longitud;
			latitud2 = rows[latlon.length-1].latitud;
			time2 = rows[latlon.length-1].time;
			markersGroup.addTo(map);
			markersGroup.addLayer(marker11);
			markersGroup.addLayer(marker21);
			marker11.setLatLng(latlon[0]);
			marker11.setPopupContent(popupTaxi+popupInicial+"Longitud: "+longitud1+"<br>Latitud: "+latitud1+"<br>Tiempo: "+time1);
			marker21.setLatLng(latlon[latlon.length-1]);
			marker21.setPopupContent(popupTaxi+popupFinal+"Longitud: "+longitud2+"<br>Latitud: "+latitud2+"<br>Tiempo: "+time2);
			poly.setLatLngs([latlon]);
		} else {
			markersGroup.removeLayer(marker11);
			markersGroup.removeLayer(marker21);
			alert("No hay datos del taxi "+taxiNo+" para la ventana de tiempo seleccionada");
		}
	} else if (taxiNo==2) {
		var poly = polyline2;
		var popupTaxi = "Taxi 2: YLK650";

		data = await response.json();
		const rows = data;
		var latlon = Array(rows.length);

		for (i=0; i < rows.length; i++){
			latlon[i] = L.latLng([rows[i].latitud, rows[i].longitud])
		}

		if (latlon.length != 0){
			longitud1 = rows[0].longitud;
			latitud1 = rows[0].latitud;
			time1 = rows[0].time;
			longitud2 = rows[latlon.length-1].longitud;
			latitud2 = rows[latlon.length-1].latitud;
			time2 = rows[latlon.length-1].time;
			markersGroup.addTo(map);
			markersGroup.addLayer(marker12);
			markersGroup.addLayer(marker22);
			marker12.setLatLng(latlon[0]);
			marker12.setPopupContent(popupTaxi+popupInicial+"Longitud: "+longitud1+"<br>Latitud: "+latitud1+"<br>Tiempo: "+time1);
			marker22.setLatLng(latlon[latlon.length-1]);
			marker22.setPopupContent(popupTaxi+popupFinal+"Longitud: "+longitud2+"<br>Latitud: "+latitud2+"<br>Tiempo: "+time2);
			poly.setLatLngs([latlon]);
		} else {
			markersGroup.removeLayer(marker11);
			markersGroup.removeLayer(marker21);
			alert("No hay datos del taxi "+taxiNo+" para la ventana de tiempo seleccionada");
		}
	}

}
