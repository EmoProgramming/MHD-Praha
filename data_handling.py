import re
import json

STOP_TIMES = "stops/stop_times.txt"
STOPS = "stops/stops.txt"
ROUTES = "stops/route_stops.txt"
TRIPS = "stops/trips.txt"

stops = {}
trips = {}
stop_times = {}
routes = {}
services = {}
trips_services = {}

def create_json_file(data, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)

# STOPS AND TRIPS

def is_tram_route(line):
    if re.match("^L([1-9]|1[0-9]|2[0-6]|34),", line):
        return True
    return False


def trips_with_services():
    with open(TRIPS, "r") as file:
        for line in file:
            if not is_tram_route(line):
                continue

            parts_of_line = line.split(",")
            service_id = parts_of_line[1]
            trip_id = parts_of_line[2]

            trips_services[trip_id] = service_id


def get_service(trip_id):
    if trip_id in trips_services:
        return trips_services[trip_id]
    else:
        return "0000000_TR2"

def is_tram_number(line):
    if re.match("^([1-9]|1[0-9]|2[0-6]|34)_", line):
        return True
    return False

def add_stop(stop_id):
    stops[stop_id] = {}

def add_trip(trip_id, stop_id, arr_time):
    if trip_id not in trips:
        trips[trip_id] = {"service_id" : get_service(trip_id), stop_id : {"arr_time" : arr_time}}
    else:
        trips[trip_id][stop_id] = {"arr_time": arr_time}

def sort_stops(stops):
    stops = dict(
        sorted(
            stops.items(),
            key=lambda item: (
                int(item[0].split("Z")[0][1:]),      # číslo za U
                int(item[0].split("Z")[1][:-1])      # číslo za Z pred P
            )
        )
    )
    return stops
    

def create_stops_and_trips():
    global stops
    with open(STOP_TIMES, "r") as file:
        for line in file:

            if not is_tram_number(line):
                continue
            
            parts_of_line = line.split(",")
            trip_id = parts_of_line[0]
            arr_time = parts_of_line[1]
            dep_time = parts_of_line[2]
            stop_id = parts_of_line[3]

            add_stop(stop_id)

            add_trip(trip_id, stop_id, arr_time)
    
    stops = sort_stops(stops)
    add_stops_information()

    create_json_file(stops, "out/stops.json")
    create_json_file(trips, "out/trips.json")


# STOP TIMES

def add_time(stop_id, arr_time, trip_id):
    parts = arr_time.split(":")
    arr_time = parts[0] + ":" + parts[1]
    if stop_id not in stop_times:
        stop_times[stop_id] = [[arr_time, trip_id]]
    else:
        stop_times[stop_id].append([arr_time, trip_id])

def sort_times():
    for stop_id in stop_times:
        stop_times[stop_id].sort()

def create_stop_times():
    for trip_id in trips:
        for stop_id in trips[trip_id]:

            if stop_id not in stops:
                continue

            arr_time = trips[trip_id][stop_id]["arr_time"]
            add_time(stop_id,arr_time , trip_id)

    sort_times()

    create_json_file(stop_times, "out/stop_times.json")


# STOP TIMES

# ADD STOPS INFORMATION  - ZLIEVANIE

def scrape_number_of_stop(stop_id):
    return stop_id.split("Z")[0][1::]

def add_stop_information(parts_of_line, stop_id):
    stop_name = parts_of_line[1].replace('\"', "")
    lat = parts_of_line[2]
    lon = parts_of_line[3]
    stops[stop_id].update({"stop_name": stop_name, "lat": lat, "lon":lon})

def add_stops_information():
    with open(STOPS, "r") as file:
        array_index = 0
        for line in file:

            parts_of_line = line.split(",")

            file_stop_id = parts_of_line[0]
            array_stop_id = list(stops.keys())[array_index]

            file_stop_number = scrape_number_of_stop(file_stop_id)
            array_stop_number = scrape_number_of_stop(array_stop_id)

            if (file_stop_number == array_stop_number):
                add_stop_information(parts_of_line, array_stop_id)
                array_index += 1
                if (array_index == len(stops)):
                    break
                continue
            elif (file_stop_number < array_stop_number):
                continue
        

# ADD STOPS INFORMATION

# ROUTES FILE

def get_stop_info(stop_id):
    if stop_id in stops:
        return [stop_id] + [stops[stop_id]["stop_name"], stops[stop_id]["lat"], stops[stop_id]["lon"]]
    return -1


def create_routes():
    with open(ROUTES, "r") as file:
        for line in file:

            if not is_tram_route(line):
                continue

            parts_of_line = line.split(",")
            stop_id = parts_of_line[2]
            direction = parts_of_line[1]
            route_id = parts_of_line[0]

            stop_info = get_stop_info(stop_id)

            if stop_info == -1:
                print("stop_id not found in stops")
                continue

            route_id_and_direction = route_id + "_" + direction

            if route_id_and_direction in routes:
                routes[route_id_and_direction].append(stop_info + [direction])
            else:
                routes[route_id_and_direction] = [stop_info + [direction]]

    create_json_file(routes, "out/routes.json")


def main():
    trips_with_services()
    create_stops_and_trips()
    add_stops_information()

    create_stop_times()

    

    create_routes()

main()