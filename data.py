import re
import json

ROUTE = "stops/route_stops.txt"
STOPS = "stops/stops.txt"
STOPS_NAME_LON_LAT = "stops_name_lon_lat.csv"
ROUTES_AND_ITS_STOP_IDS = "routes_and_its_stop_ids.csv"

NUMBER_OF_TRAMS = 26

stops = []
routes = {} # route_id : [ all stops of route in format - stop_id, stop_name, lat, lon, direction]
tram_stops = {} # stop_id : stop_name, lat, lon




def get_route(number_of_route, direction):
    return routes["L"+str(number_of_route)+"_"+str(direction)]

def print_route(number_of_route, direction):
    print("L"+str(number_of_route)+"_"+str(direction), routes["L"+str(number_of_route)+"_"+str(direction)])

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

            if route_id+"_"+direction in routes:
                routes[route_id+"_"+direction].append(stop_info + [direction])
            else:
                routes[route_id+"_"+direction] = [stop_info + [direction]]
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



create_json_file(tram_stops, "out/stops_information.json")

create_json_file(routes, "out/routes.json")
print(routes)
#print(routes)