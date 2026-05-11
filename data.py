import re
import json

ROUTE = "stops/route_stops.txt"
STOPS = "stops/stops.txt"
STOPS_NAME_LON_LAT = "stops_name_lon_lat.csv"
ROUTES_AND_ITS_STOP_IDS = "routes_and_its_stop_ids.csv"

NUMBER_OF_TRAMS = 26

stops = []
routes = {}
routes.update()
tram_stops = {}




def get_route(number_of_route):
    return routes["L"+str(number_of_route)]

def print_route(number_of_route):
    print("L"+str(number_of_route), routes["L"+str(number_of_route)])

def find_stop(stop_id, stops):
    for i in range(len(stops)):
        if stops[i][0] == stop_id:
            return stops[i]
    return -1



def iterate_stops_file(file):
    for line in file:
        
        match =  re.match(r"^U([0-9]+)Z([0-9]+)P?", line.strip()) # U507Z1P
        
        if match:
            parts_of_line = line.split(",")
            stop_id = parts_of_line[0] 
            stop_name = parts_of_line[1]
            lat = parts_of_line[2]
            lon = parts_of_line[3]
            stops.append([stop_id, stop_name, lat, lon])

def update_tram_stops(stop_id, stop_info):
    stop_name = stop_info[1]
    lat = stop_info[2]
    lon = stop_info[3]
    tram_stops.update({stop_id : {"stop_name" : stop_name, "lon":lon, "lat":lat}})

def iterate_routes_file(file):
    for line in file:

        if not re.match("^L([1-9]|1[0-9]|2[0-6]|34),", line):
            continue

        parts_of_line = line.split(",")
        stop_id = parts_of_line[2]
        direction = parts_of_line[1]
        route_id = parts_of_line[0]

        stop_info = find_stop(stop_id, stops)

        if stop_info == -1:
            print("not found")
        else:

            if route_id in routes:
                routes[route_id].append(stop_info + [direction])
            else:
                routes[route_id] = [stop_info + [direction]]
            update_tram_stops(stop_id, stop_info)

with open(ROUTE, "r") as route_file, open(STOPS, "r") as stops_file:

    iterate_stops_file(stops_file)

    iterate_routes_file(route_file)

    route_file.close()
    stops_file.close()

def csv_file_header(header_line, file):
    header_line_string = ""
    for word in header_line:
        header_line_string += (word+",")
    header_line_string = header_line_string[:-1]
    header_line_string += "\n"
    file.write(header_line_string)

def csv_file_data(data_lines, file):
    data_lines_string = ""
    for word in data_lines:
        data_lines_string += (word+",")
    data_lines_string = data_lines_string[:-1]
    data_lines_string += "\n"
    file.write(data_lines_string)

def delete_data_in_file(filename):
    with open(filename, "w") as file:
        pass

def csv_file_for_stops_name_lon_lat():
    delete_data_in_file(STOPS_NAME_LON_LAT)
        

    with open(STOPS_NAME_LON_LAT, "a") as file:

        csv_file_header(["stop_id", "stop_name", "lon", "lat"], file)

        for tram_stop in tram_stops:
            values = [tram_stop]
            for value in tram_stops[tram_stop]:
                values.append(tram_stops[tram_stop][value])
            csv_file_data(values, file)

def create_json_file(data, filename):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)



create_json_file(tram_stops, "stop_name_lon_lat.json")

lines = []

for route in routes:

    tram_route = routes[route]

    for i in range(len(tram_route)):
        tram_stop = tram_route[i]
        if i > 0:

            if tram_route[i-1][-1] == tram_stop[-1]:
                id_of_first_stop = tram_route[i-1][0]
                id_of_second_stop = tram_stop[0]
                lat_of_first_stop = tram_stops[id_of_first_stop]["lat"]
                lon_of_first_stop = tram_stops[id_of_first_stop]["lon"]
                lat_of_second_stop = tram_stops[id_of_second_stop]["lat"]
                lon_of_second_stop = tram_stops[id_of_second_stop]["lon"]
                lines.append([lon_of_first_stop, lat_of_first_stop, lon_of_second_stop, lat_of_second_stop])
print(tram_stops)