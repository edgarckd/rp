var cont=0;
var marker1;
let arraypoly=[];

var map = L.map("map").setView([10.982088164553303,-74.78344818015789],16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom:18, minZoom:9,
}).addTo(map);

var marker1 = L.marker([0,0]).addTo(map)

function readFile(){

    jQuery.get('/estatico/result.txt', function(data){

        var split = data.split("/")

        data1 =split[0]
        data2 =split[1]
        data3 =split[2]

//        console.log(data)

        $('#output1').text(data1)
        $('#output2').text(data2)
        $('#output3').text(data3)

        var latlng1 = L.latLng(data1,data2);
        arraypoly.push(latlng1);
        var latlng = [arraypoly]

        polyline = L.polyline(latlng, {color: 'red', smoothFactor: 0}).addTo(map);
//      polyline.options.smoothFactor = 0
//      polyline.redraw();

        marker1.setLatLng(latlng1).bindPopup('Taxi No:1 <br> Placa: AVM569.').openPopup()
        map.setView([data1,data2])

    })

}setInterval(readFile,2500);