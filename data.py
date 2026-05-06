import re

ROUTE = "stops/route_stops.txt"
STOPS = "stops/stops.txt"
NUMBER_OF_TRAMS = 26

stops = []
routes = {"L"+str(i):[] for i in range(1, NUMBER_OF_TRAMS+1)}


def get_route(number_of_route):
    return routes["L"+str(number_of_route)]

def print_route(number_of_route):
    print("L"+str(number_of_route), routes["L"+str(number_of_route)])

def find_stop(stop_id, stops):
    for i in range(len(stops)):
        if stops[i][0] == stop_id:
            return stops[i]
    return -1


with open(ROUTE, "r") as route_file, open(STOPS, "r") as stops_file:

    for line in stops_file:
        
        match =  re.match(r"^U([0-9]+)Z([0-9]+)P?", line.strip()) # U507Z1P
        
        if match:
            parts_of_line = line.split(",")
            stop_id = parts_of_line[0] 
            stop_name = parts_of_line[1]
            lan = parts_of_line[2]
            lon = parts_of_line[3]
            stops.append([stop_id, stop_name, lan, lon])


    for line in route_file:


        if not re.match("^L([1-9]|1[0-9]|2[0-6]),", line):
            continue

        parts_of_line = line.split(",")
        stop_id = parts_of_line[2]
        route_id = parts_of_line[0]

        stop_info = find_stop(stop_id, stops)


        if stop_info == -1:
            print("not found")
        else:
            routes[route_id].append(stop_info)



    route_file.close()
    stops_file.close()

