import re

ROUTE = "stops/route_stops.txt"
STOPS = "stops/stops.txt"
STOPS_NAME_LON_LAT = "stops_name_lon_lat.csv"

NUMBER_OF_TRAMS = 26

stops = []
routes = {"L"+str(i):[] for i in range(1, NUMBER_OF_TRAMS+1)}
routes.update({"L34":[]})
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
        route_id = parts_of_line[0]

        stop_info = find_stop(stop_id, stops)

        if stop_info == -1:
            print("not found")
        else:
            routes[route_id].append(stop_info)
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
    header_line_string.strip(",")
    header_line_string += "\n"
    file.write(header_line_string)

def csv_file_data(data_lines, file):
    data_lines_string = ""
    for word in data_lines:
        data_lines_string += (word+",")
    data_lines_string.strip(",")
    data_lines_string += "\n"
    file.write(data_lines_string)

with open(STOPS_NAME_LON_LAT, "w") as file:
    pass

with open(STOPS_NAME_LON_LAT, "a") as file:

    csv_file_header(["stop_id", "stop_name", "lon", "lat"], file)

    for tram_stop in tram_stops:
        values = tram_stops[tram_stop].values()
        csv_file_data(values, file)