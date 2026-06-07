const map = L.map('map').setView([50.0755, 14.4378], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let routeLayer = L.layerGroup().addTo(map);

function addMarker(lat, lon, map, stop_name) {
    L.marker([lat, lon])
        .addTo(routeLayer)
        .bindPopup(stop_name);
}


/*
function addLine(lat1, lon1, lat2, lon2, colorOfRoute) {
    L.polyline(
        [
            [lat1, lon1],
            [lat2, lon2]
        ],
        {
            color: colorOfRoute,
            weight: 5,
            opacity: 0.8
        }
    ).addTo(map);

}

fetch("stops_information.json")
  .then(r => r.json())
  .then(data => {

    Object.keys(data).forEach(stop_id => {
      const stop = data[stop_id];
      let lon = parseFloat(stop.lon);
      let lat = parseFloat(stop.lat);
      let stop_name = stop.stop_name;

    
    addMarker(lat, lon, map, stop_name)

    });

});

*/

let data = null;

async function loadData() {
    const res = await fetch("routes.json");
    data = await res.json();

}

let currentLine = null;

function drawRoute(route_id, data) {

    routeLayer.clearLayers();

    route = data[route_id];

    let points = [];

    for (let i = 0; i < route.length; i++) {
        let lat = route[i][2];
        let lon = route[i][3];
        let stop_name = route[i][1];
        points.push([lat, lon]);
        addMarker(lat, lon, map, stop_name);
    }

    currentLine = L.polyline(points, {
        color: 'blue'
    }).addTo(routeLayer);
  
}

function update() {
    let route_number = document.getElementById("route_number").value;
    let route_id = "L" + route_number + "_1";
    drawRoute(route_id, data);
}

loadData();


