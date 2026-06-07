

function createSelect() {
    const select = document.getElementById('stop_name');

    let names = [];

    Object.entries(stops_information).forEach(([stop_id, stop]) => {

        const name = stop.stop_name.replaceAll('"', '');

        names.push([name, stop_id])
    });


    names.sort();
    

    for (let i = names.length - 1; i > 0; i--) {
        if (names[i][0] == names[i-1][0]) {
            names.splice(i, 1);
        }
    }

    names.forEach(([name, stop]) => {
        const option = document.createElement('option');

        option.value = stop;
        option.textContent = name;

        select.appendChild(option);
    });
}


function timer() {
    const select_hours = document.getElementById('hours');
    for (let i = 0; i < 24; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select_hours.appendChild(option);
    }

    const select_minutes = document.getElementById('minutes');
    for (let i = 0; i < 60; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select_minutes.appendChild(option);
    }


}


let times = [];

let stops_information = null;


async function loadData() {

    const response1 = await fetch("stops_information.json");
    stops_information = await response1.json();


    createSelect();

    const response = await fetch('stop_times.json?v=' + Date.now());
    times = await response.json();

}

function minutesFromBeginning(hours, minutes) {
    return hours * 60 + minutes;
}

function formatTime(time) { // "HH:MM:SS" into HH and MM
    return time.split(":").map(Number);
}


function getDepartures(stop_id , currentTimeHours, currentTimeMinutes) {
    let departures = [];
    let number = 20;


    const currentTime = minutesFromBeginning(currentTimeHours, currentTimeMinutes);

    for (let i = 0; i < times[stop_id].length; i++) {
        const time = times[stop_id][i][0];
        const route = times[stop_id][i][1];
        const terminus = times[stop_id][i][2];


        const [hours, minutes, seconds] = formatTime(time);
        const departureMinutes = minutesFromBeginning(hours, minutes);

        if (departureMinutes > currentTime && number > 0) {
            departures.push([time, route, terminus]);
            number -= 1;
        }
    }

    return departures;
}

function show() {
    const stop_id = document.getElementById('stop_name').value;
    const currentTimeHours = Number(document.getElementById('hours').value);
    const currentTimeMinutes = Number(document.getElementById('minutes').value);

    departures = getDepartures(stop_id, currentTimeHours, currentTimeMinutes);
    for (let i = 0; i < departures.length; i++) {
        console.log(departures[i][2]);
        let name = stops_information[departures[i][2]].stop_name.replaceAll('"', '');
        console.log(name);
        const departuresElement = document.getElementById("departureList");
        const departure = document.createElement("div");
        departure.textContent = departures[i][0] + ", " + departures[i][1] + ", " + name;
        departuresElement.appendChild(departure);
    }

}

timer();
loadData();

