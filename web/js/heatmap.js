const corners = {
    "southWest": [49.9897, 14.2801],
    "northWest": [50.1500, 14.2801],
    "northEast": [50.1500, 14.5800],
    "southEast": [49.9897, 14.5800]
};

const map = L.map('map').fitBounds([
    corners.southWest,
    corners.northEast
]);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


let routeLayer = L.layerGroup().addTo(map);

function drawBorders() {
    L.polyline([
        corners["southEast"],
        corners["northEast"],
        corners["northWest"],
        corners["southWest"],
        corners["southEast"]
    ]).addTo(map);
}

function drawAllStops() {
    
    Object.entries(stops_information).forEach(([stop_id, stop]) => {


        const circle = L.circleMarker([stop.lat, stop.lon], {
        radius: 5,
        color: "red",
        fillColor: "red",
        fillOpacity: 1
        }).addTo(map);

        circle.bindPopup(`<b>${stop.stop_name}</b>`);

        circle.on("click", () => {
            showFromMap(stop_id);
            console.log(stop_id);          // U4Z1P
            console.log(stop.stop_name);  // Arbesovo náměstí
        });

    });
}

async function loadStopsInformation() {
    const response = await fetch("stops.json");
    return await response.json();
}

async function loadData() {
    stops_information = await loadStopsInformation();
    drawAllStops();
    drawRectangles();
}

function drawSquare(leftUpperCorner, size, color, opacity) {

    const border = opacity;
    
    if (border < 0.05) {
        opacity = 0;
        color = "green";
    } else if (border < 0.1) {
        color = "green";
        opacity = 0.3;  
    } else if (border< 0.2) {
        color = "green";
        opacity = 0.5;
    } else if (border< 0.4) {
        color = "yellow"
    } else if (border< 0.6){
        color = "orange";
    } else if (border< 0.8) {
        color = "red";
    } else {
        color = "red";
        opacity = 0.8
    }
        
    //console.log(opacity );
    L.rectangle([
        leftUpperCorner,
        [leftUpperCorner[0] + size, leftUpperCorner[1] + size]
    ], {
        color: color,
        weight: 0,
        fillOpacity: opacity,
        fill: true
    }).addTo(map);
}

function findClosestStop(midCoords) {
    const x = midCoords[1];
    const y = midCoords[0];

    let minDistance = 10000;

    for (const [id, stop] of Object.entries(stops_information)) {

        const distance = Math.sqrt( (y - stop.lat)**2 + (x - stop.lon)**2 );
        if (distance < minDistance) {
            minDistance = distance;
        }
    }

    return minDistance;
}

function calculateB(smernica, x, y) {
    return y - (smernica*x);
}

function linearFunction(smernica, b, x) {
    return smernica * x + b;
}

function functionDistanceToOpacity(minDistance, maxDistance) {

    // y = ax + b

    const smernica = 1 / (maxDistance - minDistance); // a
    const pointOnFunction = [minDistance, 0];
    const x = pointOnFunction[0];
    const y = pointOnFunction[1];
    const b = calculateB(smernica, x, y);


    return [smernica, b];
}

function drawRectangles() {

    const beginningNorth = corners.northWest[0];
    const leftUp = corners.northWest;
    const rightDown = corners.southEast;

    const leftUpX = leftUp[1];
    const leftUpY = leftUp[0];

    const rightDownX = rightDown[1];
    const rightDownY = rightDown[0];

    const height = Math.abs(leftUpY - rightDownY);
    const width = Math.abs(leftUpX - rightDownX);

    const sizeOfSquare = height / 100;

    const numberOfSquaresInRow = width / sizeOfSquare;
    const numberOfSquaresInCol = height / sizeOfSquare;

    let posOfSquareX = leftUpX;
    let posOfSquareY = leftUpY;

    let mids = [];
    let distances = [];
    let distance;


    for (let row = 0; row < numberOfSquaresInCol; row++) {
        for (let col = 0; col < numberOfSquaresInRow; col++) {

            //console.log(row, col);

            posOfSquareX = leftUpX + col * sizeOfSquare;
            posOfSquareY =  leftUpY - row * sizeOfSquare;
            midCoord = [posOfSquareY + (sizeOfSquare / 2), posOfSquareX + (sizeOfSquare / 2)];
            //drawSquare([posOfSquareY, posOfSquareX], sizeOfSquare, "red", 0.5);

            distance = findClosestStop(midCoord);
            distances.push(distance);

        }


    }

    const maxDistance = Math.max(...distances);
    const minDistance = Math.min(...distances);

    let smernica, b;


    [smernica, b] = functionDistanceToOpacity(minDistance, maxDistance);

    let index = 0

    for (let row = 0; row < numberOfSquaresInCol; row++) {
        for (let col = 0; col < numberOfSquaresInRow; col++) {

            posOfSquareX = leftUpX + col * sizeOfSquare;
            posOfSquareY =  leftUpY - row * sizeOfSquare;
            midCoord = [posOfSquareY + (sizeOfSquare / 2), posOfSquareX + (sizeOfSquare / 2)];
            //drawSquare([posOfSquareY, posOfSquareX], sizeOfSquare, "red", 0.5);

            const currDistance = distances[index];
            console.log(currDistance);
            const opacity = linearFunction(smernica, b, currDistance);


            drawSquare([posOfSquareY, posOfSquareX], sizeOfSquare, "red", opacity);

            index += 1;
        }
    }

}

function main() {
    //drawBorders();
    loadData();

    
    

}

main();
