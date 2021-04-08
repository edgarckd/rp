var map = L.map("map").setView([10.982088164553303,-74.78344818015789],13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom:18, minZoom:9,
}).addTo(map);
var fecha1
var fecha2
var hora1
var hora2
var f1
var f2

polyline = L.polyline([], {color: 'red', smoothFactor: 0}).addTo(map);

async function obtenerdatos(){

	var cal1 = document.getElementById("calendario1").value;
	var cal2 = document.getElementById("calendario2").value;

	var split = cal1.split("T")
	var split2 = cal2.split("T")

	fecha1 = split[0]
	fecha2 = split2[0]
	hora1 = split[1]
	hora2 = split2[1]

	// # de miliseg desde el 1 de enero de 1970
	f1 = Date.parse(fecha1+","+hora1)
	f2 = Date.parse(fecha2+","+hora2)
	console.log("f1",fecha1)

	// verificar:
	// 1. ¿el usuario realmente digitó todos los datos necesarios?

	if (cal1 == [] || cal2 == []) {
		alert("Ups! verifica tus datos")
	}

	// 2. ¿la fecha/hora final realmente ocurre después que la fecha/hora inicial?
	if (f1>f2) {
		alert("Ups! la fecha/hora inicial debe ocurrir antes que la final")
		// alertify.warning('La fecha/hora inicial debe ocurrir antes que la final');
	}


	/* 3. ¿la fecha/hora consultada realmente está en la base de datos?

							|||
							|||
						   \|||/
							\ /
							 X

	* HISTORICOS
	* acceder a los datos de los calendarios y buscar la respuesta (fetch) de la conexión
	* a la base de datos
	*/
	try {
	const response = await fetch(`http://3.232.187.14:37778/ubicartaxi/${cal1};${cal2}`)
	const data = await response.json();
	const {rows} = data;
	var latlon = Array(rows.length)

	// escribir una matriz con los datos de latitud y longitud obtenidos de la base de datos
	for (i = 0; i < rows.length; i++){
					latlon[i] = ([rows[i].latitud, rows[i].longitud])
	}

	polyline.setLatLngs([latlon])
	map.setView(latlon[0])
	}
	catch(err){
	alert("Ups! los datos seleccionados no se encuentran en la base de datos")
	}

}
							
							
