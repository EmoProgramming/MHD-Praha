# MHD Prague

MHD Prague is a web application for exploring Prague's tram network. It allows users to visualize tram routes on an interactive map, find upcoming departures from tram stops, and test their knowledge of Prague's tram lines through an interactive quiz.

## Live Demo

[Open MHD Prague](https://www.ms.mff.cuni.cz/~granskye/mhdprague/index.php)

## Features

- **Interactive Map** – Display tram routes and explore individual stops using Leaflet.
- **Tram Departures** – Find upcoming tram departures based on a selected date, time, and stop or platform.
- **Tram Quiz** – Test your knowledge of Prague's tram routes by guessing tram line numbers.
- **Leaderboard** – Compare quiz scores with other players.

## Technologies Used

- **Python** – Processing and filtering public transport data.
- **JavaScript** – Client-side application logic and data retrieval.
- **Leaflet** – Interactive map rendering.
- **JSON** – Storing and providing processed transport data.
- **PID GTFS** – Source of public transport schedule and route data.

## Data Source

The application uses public transport data provided by Prague Integrated Transport (PID).

[PID Open Data](https://pid.cz/en/opendata/)

The original GTFS data is processed using Python scripts and converted into JSON files consumed by the web application.

## Documentation

For more detailed information, see the following documents:

- [User Documentation](docs/userDocumentation.md) – Instructions for using the application's features.
- [Technical Documentation](docs/technicalDocumentation.md) – Description of the data processing pipeline, JSON file structures, and JavaScript application logic.

## Live Application Pages

- [Home](https://www.ms.mff.cuni.cz/~granskye/mhdprague/index.php)
- [Departures](https://www.ms.mff.cuni.cz/~granskye/mhdprague/departures_arrivals.php)
- [Quiz](https://www.ms.mff.cuni.cz/~granskye/mhdprague/quiz.php)
- [Leaderboard](https://www.ms.mff.cuni.cz/~granskye/mhdprague/leaderboard.php)

## AI Assistance

ChatGPT was used to translate the project documentation into English and to create this README file.
