# User Documentation

**MHD PRAGUE** is a web application designed to display tram routes on a map and search for tram departures from the platforms of any tram stop at any given time. It also allows users to test their knowledge of Prague's tram routes through a quiz.

The application is available in a web browser at the following URL:

https://www.ms.mff.cuni.cz/~granskye/mhdprague/index.php

The application consists of three main sections:

## 1. Home

On the Home page, users can select any tram line. After clicking the **Update** button, the route of the selected line is displayed on the map. Users can view the names of individual stops by clicking on any stop displayed on the map.

## 2. Quiz

On the Quiz page, users can play a quiz about Prague's tram routes. The rules are provided at the bottom of the page.

The quiz starts when the user clicks the **Start** button. A random tram line is selected, and its route is displayed on the map. The user's task is to guess the number of the tram line corresponding to the displayed route.

This process continues until all of Prague's tram lines have been shown. At the end of the quiz, users who have scored at least one point can submit their results to the leaderboard, which is displayed on the **Leaderboard** page.

The goal is to achieve the highest possible score by correctly identifying as many tram routes as possible in the shortest amount of time.

## 3. Departures

On the Departures page, users can select a specific travel date and time for any day of the week, from Monday to Sunday.

Users can select a tram stop in two ways:

- **Using the stop selection menu:** Users can select a stop from the list of all tram stops. After clicking the **Show** button, the next 10 tram departures from the selected stop at the specified time are displayed.
- **Using the map:** Users can click on a specific platform at a tram stop directly on the map to view departures from that platform.

The difference between these two methods is that selecting a stop from the menu displays departures from all platforms at that stop, whereas clicking on a specific platform on the map displays only departures from that particular platform.

The map-based selection is available only after the user has selected a specific date and time.

When opening the Departures page for the first time, users must wait for the data to load from the server.

ChatGPT was used to translate the project documentation into English.
