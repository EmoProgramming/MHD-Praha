
let stops_information = [];
let stop_times = [];
let trips = [];

function getAllStopsAndIds() {
    let stop_names = [];

    Object.entries(stops_information).forEach(([stop_id, stop]) => {
        const stop_name = stop.stop_name
        stop_names.push([stop_name, stop_id])
    });
    return stop_names;
}

function removeDuplicates(stop_names) {
    for (let i = stop_names.length - 1; i > 0; i--) {
        if (stop_names[i][0] == stop_names[i-1][0]) {
            stop_names.splice(i, 1);
        }
    }
}

function removeDuplicatesSecondArg(stop_names) {
    for (let i = stop_names.length - 1; i > 0; i--) {
        if (stop_names[i][1] == stop_names[i-1][1]) {
            stop_names.splice(i, 1);
        }
    }
    return stop_names;
}

function addOptionToSelect(value, textContent, select) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = textContent;
    select.appendChild(option);
}

function createOptionsForStopnames(select, stop_names) {
    stop_names.forEach(([name, stop]) => {
        addOptionToSelect(stop, name, select);
    });
}

function displayStopnamesOptions() {
    const select = document.getElementById('stop_name');

    let stop_names = getAllStopsAndIds();

    stop_names.sort();
    removeDuplicates(stop_names);
    createOptionsForStopnames(select, stop_names);
}

function addOptionsFromTo(from, to, select) {
    for (let i = from; i <= to; i++) {
        const option = addOptionToSelect(i, i, select);
    }
}

function displayHours() {
    const select_hours = document.getElementById('hours');
    addOptionToSelect("hours", "hours", select_hours)
    addOptionsFromTo(0, 23, select_hours);

}

function displayMinutes() {
    const select_minutes = document.getElementById('minutes');
    addOptionToSelect("minutes", "minutes", select_minutes)
    addOptionsFromTo(0, 59, select_minutes);
}

function displayDay() {
    const select_day = document.getElementById('day');
    addOptionToSelect("day", "day", select_day)
    addOptionsFromTo(1, 7, select_day);
}

function displayMonth() {
    const select_month = document.getElementById('month');
    addOptionToSelect("month", "month", select_month)
    addOptionsFromTo(1, 12, select_month);
}

function displayYear() {
    const select_year = document.getElementById('year');
    addOptionToSelect("year", "year", select_year)
    addOptionsFromTo(2024, 2026, select_year);
}

function displayTimeOption() {
    displayHours();
    displayMinutes();
    displayDay();
}

function minutesFromBeginning(hours, minutes) {
    return hours * 60 + minutes;
}

function formatTime(time) { // "HH:MM:SS" into HH and MM
    return time.split(":").map(Number);
}

function isDepartingAfterCurrentTime(arr_time, currentTimeInMinutes) {
    const [arr_time_hours, arr_time_minutes, arr_time_seconds] = formatTime(arr_time);
    const arrTimeInMinutes = minutesFromBeginning(arr_time_hours, arr_time_minutes);

    if (arrTimeInMinutes > currentTimeInMinutes) {
        return true;
    } else {
        return false;
    }
}

function checkDayAndService(service_id, day) {
    return service_id[day - 1] === '1';
}   


function findDepartingTimes(stop_times_for_stop, currentTimeInMinutes, numberOfDepartures, day) {
    let departures = [];

    for (let i = 0; i < stop_times_for_stop.length; i++) {

        const arr_time = stop_times_for_stop[i][0];
        const trip_id = stop_times_for_stop[i][1];

        if (isDepartingAfterCurrentTime(arr_time, currentTimeInMinutes) && numberOfDepartures > 0) {
            const service_id = trips[trip_id]["service_id"];
            if (!checkDayAndService(service_id, day)) {
                continue;
            }
            departures.push([arr_time, trip_id]);
            numberOfDepartures -= 1;
        }
    }
    return departures;
}

function getDepartures(stop_id , currentTimeHours, currentTimeMinutes, day) {
    
    let numberOfDepartures = 10;
    const currentTimeInMinutes = minutesFromBeginning(currentTimeHours, currentTimeMinutes);
    let stop_times_for_stop = stop_times[stop_id];

    let departures = findDepartingTimes(stop_times_for_stop, currentTimeInMinutes, numberOfDepartures, day);

    return departures;
}

function findLastDigit(string) {
    for (let i = string.length; i >= 0; i--) {
        if (string[i] >= '0' && string[i] <= '9') {
            return i;
        }
    }
    return 0;
}

function isInArray(value, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][0] == value) {
            return true;
        } 
    }
    return false;
}



function show() {
    const departuresElement = document.getElementById("departureList");
    departuresElement.innerHTML = "";
    const stop_id = document.getElementById('stop_name').value;
    const currentTimeHours = Number(document.getElementById('hours').value);
    const currentTimeMinutes = Number(document.getElementById('minutes').value);
    const day = Number(document.getElementById('day').value);
    

    let departures = getDepartures(stop_id, currentTimeHours, currentTimeMinutes, day);

    let index = findLastDigit(stop_id);
    let znaky = stop_id.split("");

    for (let i = 1; i < 10; i++) {
        znaky[index] = i;
        let newStopId = znaky.join("");
        if (stop_id == newStopId || !(newStopId in stop_times)) {
            continue;
        }
        departures = [...departures, ...getDepartures(newStopId, currentTimeHours, currentTimeMinutes, day)];
    } 

    departures.sort();
    console.log(departures);

        departuresElement.innerHTML += `
        <thead>
            <tr>
                <th>Tram Number</th>
                <th>Departure Time</th>
                <th>Destination</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    departures = removeDuplicatesSecondArg(departures);
    
    for (let i = 0; i < departures.length; i++) {

        if (i >= 10) {
            break;
        }

        const trip_id = departures[i][1];
        const stopNumber = trip_id.split("_")[0];
        const trip = trips[trip_id];
        const keys = Object.keys(trip);
        const lastKey = keys[keys.length - 1];

        const lastStop = stops_information[lastKey].stop_name;


                const tbody = document.querySelector("#departureList tbody");

        tbody.innerHTML += `
            <tr>
                <td>${stopNumber}</td>
                <td>${departures[i][0]}</td>
                <td>${lastStop}</td>
            </tr>
        `;


    }

}

function showFromMap(stop_id) {
    const departuresElement = document.getElementById("departureList");
    departuresElement.innerHTML = "";
    const currentTimeHours = Number(document.getElementById('hours').value);
    const currentTimeMinutes = Number(document.getElementById('minutes').value);
    const day = Number(document.getElementById('day').value);
    

    let departures = getDepartures(stop_id, currentTimeHours, currentTimeMinutes, day);

    departures.sort();
    console.log(departures);

    departuresElement.innerHTML += `
        <thead>
            <tr>
                <th>Tram Number</th>
                <th>Departure Time</th>
                <th>Destination</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    departures = removeDuplicatesSecondArg(departures);
    
    for (let i = 0; i < departures.length; i++) {

        if (i >= 10) {
            break;
        }

        const trip_id = departures[i][1];
        const stopNumber = trip_id.split("_")[0];
        const trip = trips[trip_id];
        const keys = Object.keys(trip);
        const lastKey = keys[keys.length - 1];

        const lastStop = stops_information[lastKey].stop_name;

        const tbody = document.querySelector("#departureList tbody");

        tbody.innerHTML += `
            <tr>
                <td>${stopNumber}</td>
                <td>${departures[i][0]}</td>
                <td>${lastStop}</td>
            </tr>
        `;



    }
}


async function loadStopsInformation() {
    const response = await fetch("stops.json");
    return await response.json();
}

async function loadStopTimes() {
    const response = await fetch("stop_times.json");
    return await response.json();
}

async function loadTrips() {
    const response = await fetch("trips.json");
    return await response.json();
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

async function loadData() {
    [stops_information, stop_times, trips] = await Promise.all([
        loadStopsInformation(),
        loadStopTimes(),
        loadTrips()
    ]);

    displayStopnamesOptions();
    displayTimeOption();
    drawAllStops();
}



loadData();

