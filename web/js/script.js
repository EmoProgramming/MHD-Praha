const map = L.map('map').setView([50.0755, 14.4378], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

let routeLayer = L.layerGroup().addTo(map);

let routes = null;
let currentLine = null;

function addMarker(lat, lon, map, stop_name) {
    L.marker([lat, lon])
        .addTo(routeLayer)
        .bindPopup(stop_name);
}

function addCircleMarker(lat, lon, map, stop_name) {
    L.circleMarker([lat, lon], {
    radius: 5,
    color: "red",
    fillColor: "red",
    fillOpacity: 1
    })
    .addTo(routeLayer)
    .bindPopup(stop_name);
    }


async function loadData() {
    const res = await fetch("routes.json");
    routes = await res.json();

}

function drawPointsOfRoute(route) {
    let points = [];

    for (let i = 0; i < route.length; i++) {
        let lat = route[i][2];
        let lon = route[i][3];
        let stop_name = route[i][1];
        points.push([lat, lon]);
        addCircleMarker(lat, lon, map, stop_name);
    }
    return points;
}

function drawLine(points, colorOfLine) {
    currentLine = L.polyline(points, {
    color: colorOfLine
        }).addTo(routeLayer);
}

function drawRoute(route_id, routes) {

    routeLayer.clearLayers();

    let route = routes[route_id];
    let points = drawPointsOfRoute(route);

    drawLine(points, "red");
}

function update() {
    let route_number = document.getElementById("route_number").value;
    let route_id = "L" + route_number + "_1";
    drawRoute(route_id, routes);
}

loadData();


