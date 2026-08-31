function getTripId() {
    const params = new URLSearchParams(window.location.search);
    const tripId = params.get("trip_id");
    return tripId;
}

function addTable(toElement) {
    toElement.innerHTML += `
        <thead>    
            <tr>
                <th>Stop</th>
                <th>Departure Time</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
}

function addRowToTable(toElement, firstCol, secondCol) {
        toElement.innerHTML += `
            <tr>
                <td>${firstCol}</td>
                <td>${secondCol}</td>
            </tr>
        `;
}

function getStopnameFromStopId(stop_id) {
    return stops_information[stop_id]["stop_name"];
}

function showTramNumber(tram_number) {
    const tramNumberElement = document.getElementById("tram_number");

    tramNumberElement.innerHTML += tram_number;
}

function showTrip(trip_id) {

    const tripElement = document.getElementById("trip");

    addTable(tripElement);

    console.log(trips[trip_id]);
    const trip = trips[trip_id];
    const tram_number = trip_id.split("_")[0];

    showTramNumber(tram_number);
    
    for (const key in trip) {

        if (key == "service_id") {
            continue;
        }

        const stop_id = key;
        const arr_time = trip[key]["arr_time"]

        const stopname = getStopnameFromStopId(stop_id);

        addRowToTable(tripElement, stopname, arr_time);

    }


}




async function loadTrips() {
    const response = await fetch("trips.json");
    return await response.json();
}

async function loadStopsInformation() {
    const response = await fetch("stops.json");
    return await response.json();
}


async function loadData() {
    [stops_information, trips] = await Promise.all([
        loadStopsInformation(),
        loadTrips()
    ]);

    const trip_id = getTripId();
    showTrip(trip_id);
}

loadData();
