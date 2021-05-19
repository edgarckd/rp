const express = require("express")
var app = express()
var data
var lat
var lon
var tim
var taxiN
var path = require('path')

// fs es para manipular archivos en general (en este caso un txt)
const fs = require("fs")

app.listen(37778);

app.use(express.static(__dirname));

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname + '/estatico/index.html'));
});

app.get('/ubicartaxi', (request, response) => {
	response.sendFile(path.join(__dirname + '/estatico/ubicar.html'));
});

// conexión con la base de datos
const {pool,Client}= require("pg")
const connectionString="postgressql://juanc:juancamilo22@taxiswebdb.cphvv1knh4lu.us-east-1.rds.amazonaws.com:5432/taxisdatabase"

const client = new Client({
	connectionString:connectionString
})

client.connect()

app.get("/ubicartaxi/:id", (req,res) => {

	var {id} = req.params;
	console.log("esto es id "+id)
	id = id.split(";");
	var taxi = id[0];
	const inicio = id[1].split("T");
	const final = id[2].split("T");

	if(taxi == "1"){
		client.query(`SELECT * FROM public.geodatos WHERE "time" >= \'${inicio}\' AND "time" <= \'${final}\'`,
			(err, rows, fields) => {
		if (!err) {
			res.json(rows.rows);
		} else {
			console.log("errorSelect",err);
		}
	});
	} else if (taxi == "2"){
		client.query(`SELECT * FROM public.geodatos2 WHERE "time" >= \'${inicio}\' AND "time" <= \'${final}\'`,
			(err, rows, fields) => {
		if (!err) {
			res.json(rows.rows);
		} else {
			console.log("errorSelect",err);
		}
		});
	}
});

// sniffer udp
const dgram = require('dgram');

// taxis data
const datos = dgram.createSocket('udp4');
console.log("heyhey")
datos.on('error', (err) => {
	console.log(`server error:\n${err.stack}`);
	datos.close();
});
datos.on('message', (msg, rinfo) =>  {
	var msg1 = msg.toString()
	fs.writeFile('/home/ubuntu/diseño/proyectoweb1_/estatico/result.txt', msg1, err => {
	if (err) throw err;
	})
	console.log(msg1)
	data = msg1.split("/")
	lat = ("\'"+data[0]+"\'")
	lon = ("\'"+data[1]+"\'")
	tim = ("\'"+data[2]+"\'")
	taxiN = data[3];
	lat1 = parseFloat(data[0]);
	lon1 = parseFloat(data[1]);

	if (taxiN == "1") {
		console.log("taxi1: "+lat1)

			client.query('INSERT INTO public.geodatos("latitud","longitud","time")VALUES ('+lat+','+lon+','+tim+');', (err,res)=>{
				console.log(err,res);
			});
	} else if (taxiN == "2") {
		console.log("taxi1: "+lat)
			client.query('INSERT INTO public.geodatos2("latitud","longitud","time")VALUES ('+lat+','+lon+','+tim+');', (err,res)=>{
				console.log(err,res);
			});
		}
	}
);
datos.bind(37777);
