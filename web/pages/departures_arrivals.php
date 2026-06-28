<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <link rel="stylesheet" href="departures.css">
    <link rel="stylesheet" href="header.css">

    <link rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"/>

</head>
<body>

<?php require 'header.php'; ?>

    <main>
        <div class="left">
            <h1>DEPARTURES</h1>
            <div class="selects">
                <select id="hours">
                </select>
                <select id="minutes">
                </select>
                <select id="day">
                </select>
            </div>

            <div class="stop_select">
                    <select name="stop_name" id="stop_name">
                    </select>
            </div>

            <div class="button">
                <button id="show" type="button" onclick="show()">Show</button>
            </div>
            <table id="departureList">

            </table>
        </div>
        <div class="right">
            <div id="map"></div>
        </div>
    </main>


    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="script.js?v=2"></script>
    <script src="dep_arr.js?v=8"></script>

</body>
</html>