<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <link rel="stylesheet" href="main.css">
    <link rel="stylesheet" href="header.css">

    <link rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"/>

</head>
<body>

<?php require 'header.php'; ?>

    <main>
        <div id="map"></div>
        <form action="update.php" method="POST">
        <select id="hours">
        </select>
        <select id="minutes">
        </select>

            <label for="stop_name">Choose route:</label><br>

            <select name="stop_name" id="stop_name">
            
            </select>

            <br><br>

            <button type="button" onclick="show()">Show</button>
        </form>
    </main>


    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="script.js"></script>
    <script src="dep_arr.js?=v1"></script>

</body>
</html>