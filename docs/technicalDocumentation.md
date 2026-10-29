# Technical Documentation

## 1. Application Overview

I developed a web application that retrieves data about Prague's public transport connections from PID GTFS ([PID Open Data](https://pid.cz/en/opendata/)). Specifically, the application filters the data to include only tram services. I also use the [Leaflet JavaScript library](https://leafletjs.com/), which allows me to render a map and interact with it.

The application consists of the following pages and features:

### Home

The Home page allows users to select any tram route and displays the selected route on a Leaflet map.

https://www.ms.mff.cuni.cz/~granskye/mhdprague/index.php

### Departures

The Departures page allows users to select a specific date, time, and tram stop. Based on the selected criteria, the application displays several upcoming tram departures.

https://www.ms.mff.cuni.cz/~granskye/mhdprague/departures_arrivals.php

### Quiz

The Quiz page implements a game in which users have to guess tram line numbers. The page contains a **Start** button. Once clicked, a randomly selected tram route is displayed on the map, and the user must guess the corresponding tram line number.

The process is repeated for several additional routes. At the end of the quiz, users who have scored at least one point can submit their score and nickname to the leaderboard, which stores all submitted results.

https://www.ms.mff.cuni.cz/~granskye/mhdprague/quiz.php

### Leaderboard

The Leaderboard page displays a table containing the results of all players who have participated in the quiz. The results are sorted in descending order by score. If two players have the same score, their ranking is determined by the time spent completing the quiz, with shorter times ranked higher.

https://www.ms.mff.cuni.cz/~granskye/mhdprague/leaderboard.php

## 2. Source Data Files

A significant part of the application involves processing transport data. The data is obtained from four files provided by PID GTFS:

- `stops.txt`
- `route_stops.txt`
- `stop_times.txt`
- `trips.txt`

### 2.1. `stops.txt`

This file contains all tram stops in Prague and information about them. Each stop is identified by a unique `stop_id`.

The following fields are essential for the application:

- `stop_id` – the identifier of the stop
- `stop_name` – the name of the stop
- `stop_lat` – the latitude of the stop
- `stop_lon` – the longitude of the stop

### 2.2. `route_stops.txt`

This file contains all regular tram routes, including the stops served by each route and its direction of travel.

Each tram line generally has two regular routes running in opposite directions.

For example, tram line 10 has the following regular routes:

- `Sídliště Řepy – Sídliště Ďáblice`
- `Sídliště Ďáblice – Sídliště Řepy`

The first route might have direction `0`, while the second has direction `1`.

In addition to these regular routes, tram line 10 may also have non-standard routes, for example when a tram travels to or from a depot.

### 2.3. `stop_times.txt`

This file contains information about the stops and scheduled times for all tram trips. The application uses the `trip_id` field to identify individual trips.

For each `trip_id`, the file lists all stops served by the trip, together with the scheduled departure time from each stop.

This file can therefore be used to retrieve all trips operated by a particular tram line, such as line 10, throughout the day.

### 2.4. `trips.txt`

This file contains information about all trips operated by public transport services. Each trip is identified by a `trip_id` and associated with a `service_id`, which determines the days on which the service operates.

The `service_id` is used to determine whether a particular trip operates on the selected day.

## 3. Data Processing and Formatting

All the source files described above are provided in CSV format. A Python script filters the required data and converts it into JSON files.

These JSON files are then uploaded to the server, where they are retrieved using JavaScript's `fetch()` function and used by the application.

The Python script generates the following four JSON files:

### 3.1. `stops.json`

The `stop_id` is used as the key, while the corresponding value contains `stop_name`, `stop_lat`, and `stop_lon`.

This structure makes it easy to retrieve a stop's name and geographical location using only its `stop_id`. This is particularly useful when rendering stops on the map.

### 3.2. `routes.json`

The key consists of the tram line number and its direction. The corresponding value contains a list of all stops served by the route in that direction, including the associated stop information.

This file is used to render tram routes on the map, for example in the quiz.

### 3.3. `stop_times.json`

The `stop_id` is used as the key. The corresponding value contains all departures of any tram line from that stop, sorted in ascending order by departure time.

Each departure is associated with a `trip_id`. This identifier makes it possible to determine which tram trip the departure belongs to and, together with the information stored in `trips.json`, to identify the destination stop.

This file makes it possible to find the upcoming departures from a specific stop at a given time.

### 3.4. `trips.json`

The `trip_id` is used as the key. The corresponding value contains all stops served by the trip, together with the scheduled times at which the tram reaches or departs from each stop, as represented in the source data.

When searching for departures from a stop, this file is used together with `stop_times.json` to identify the destination stop and reconstruct the complete route of a trip.

### 3.5. Data Filtering and Generation

The data is processed using straightforward iterations over the source files.

The original files contain information not only about trams, but also about metro services, buses, and trolleybuses. During processing, only tram-related records are retained. This filtering is performed using regular expressions (regex), since the tram line numbers are known.

As the source files are processed, the script progressively builds the four JSON files according to the data structures described above.

## 4. Server-Side Logic

The server-side application uses three JavaScript files to handle map rendering, quiz functionality, and tram departure searches:

- `script.js`
- `quiz.js`
- `departures.js`

### 4.1. `script.js`

This file handles map initialization, rendering, and the display of selected tram routes.

Since `routes.json` contains the information needed to display each route, rendering a route involves selecting the appropriate tram line and direction. The corresponding list of stops and their associated information is then retrieved.

This information is used to render the stops as circles on the map and draw lines connecting them to represent the tram route.

### 4.2. `quiz.js`

This file implements the quiz logic, including game states, score tracking, the timer, random tram route selection, and the submission of the final result.

When the user starts the quiz, a random tram route is selected and displayed on the map. The user must identify the corresponding tram line. The script manages the progression through the quiz and tracks the user's performance.

At the end of the quiz, users who have scored at least one point can submit their nickname and score to the leaderboard.

### 4.3. `departures.js`

This file handles tram departure searches.

Users can select a specific tram stop, an exact time, and a day of the week. Based on these criteria, the application finds the upcoming departures from the selected stop and displays the next 10 services.

This is implemented by iterating through the data associated with the selected stop in `stop_times.json`. The corresponding value is a list of tram departures sorted by departure time.

The application iterates through this list until it finds departures after the requested time. For each candidate departure, it checks the associated `service_id` to determine whether the service operates on the selected day. If the service is running, the departure is added to the results.

This process continues until the next 10 valid departures have been found.

Users can select a stop in two ways:

**1. Selecting a stop from the list**

Users can choose a stop from a menu containing all tram stops. Since a stop can consist of multiple platforms, selecting a stop from this menu displays the next 10 departures across all platforms belonging to that stop.

**2. Selecting a platform on the map**

Users can click on a stop directly on the map and select a specific platform. In this case, the application displays only the next 10 departures from that particular platform.

The departure search becomes available only after the user has selected the travel date and time.

ChatGPT was used to translate the project documentation into English.
