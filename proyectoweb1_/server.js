const express = require("express")
var app = express()
//var server = require('http').createServer(app)
var data
var lat
var lon
var tim
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
const connectionString="postgressql://juanc:juancamilo22@database3.cphvv1knh4lu.us-east-1.rds.amazonaws.com:5431/serverdb"

const client = new Client({
  connectionString:connectionString
})

client.connect()


app.get("/ubicartaxi/:id", (req,res) => {
/*
  var {id} = req.params;
  res.send(id);
*/

  var {id} = req.params;
  id = id.split(";");
  const inicio = id[0].split("T");
  const final = id[1].split("T");

  client.query(`SELECT "latitud","longitud","time" FROM public.geodatos WHERE "time" >= \'${inicio}\' AND "time" <= \'${final}\'`,
  (err, rows, fields) => {
  if (!err) {
  res.json(rows);
  } else {
  console.log("errorSelect",err);
  }
  });

});

// sniffer udp
const dgram = require('dgram');

//ejecuto el metodo create socket para que me devuelva un objeto en la variable datos
const datos = dgram.createSocket('udp4');

//cacho error del socket
datos.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  datos.close();
});

//obtengo de datos el mensaje que envio desde la app
//SINFFER
datos.on('message', (msg, rinfo) =>  {
  msg = msg.toString()
  fs.writeFile('/home/ubuntu/diseño/TAXIS-web-server-2/proyectoweb1_/estatico/result.txt', msg, err => {
    if (err) throw err;
  })
  console.log(msg)
  data = msg.split("/")
  lat = ("\'"+data[0]+"\'")
  lon = ("\'"+data[1]+"\'")
  tim = ("\'"+data[2]+"\'")
  console.log(lat)
});

setInterval(function() {
  client.query('INSERT INTO public.geodatos("latitud","longitud","time")VALUES ('+lat+','+lon+','+tim+');', (err,res)=>{
      console.log(err,res);
  })
},5000)

// Fijación del puerto UDP
datos.bind(37777);
