<!DOCTYPE html>
<html>
<head>


    <meta charset="utf-8">
    <link rel="stylesheet" href="main.css?v=2">
    <link rel="stylesheet" href="header.css">
    <link rel="stylesheet" href="quiz.css">

    <link rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"/>

</head>
<body>

<?php require 'header.php'; ?>

    <main>
        <div id="map"></div>

        <div class="right">
            <div id="quiz"></div>
            <h2>TIMER</h2>
            <div id="timer">0</div>
        </div>
            

        
    </main>


    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="script.js?v=2"></script>
    <script src="quiz.js"></script>

</body>
</html>