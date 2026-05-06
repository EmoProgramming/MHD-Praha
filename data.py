import re

ROUTE = "stops/route_stops.txt"
STOPS = "stops/stops.txt"

INDEX_OF_STOP_ID = 2

stops = []

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

    pocitadlo = 0

    for line in route_file:


        if not re.match("^L([1-9]|1[0-9]|2[0-6]),", line):
            continue

        pocitadlo += 1

        parts_of_line = line.split(",")
        stop_id = parts_of_line[INDEX_OF_STOP_ID]

        stop_info = find_stop(stop_id, stops)

        if stop_info == -1:
            print("not found")



    print(pocitadlo)



    route_file.close()
    stops_file.close()

