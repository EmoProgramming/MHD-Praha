<!DOCTYPE html>
<html>
<head>


    <meta charset="utf-8">
    <link rel="stylesheet" href="header.css?v=2">
    <link rel="stylesheet" href="quiz.css?v=3">

    <link rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"/>

    <?php require 'font.php'; ?>
</head>
<body>

<?php require 'header.php'; ?>

    <main>
        <div class="left">
            <div id="map"></div>
        </div>

        <div class="right">
            <div id="quiz"></div>
            <div id="timer"></div>
            <div id="rules"></div>
        </div>
            

        
    </main>


    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="script.js?v=1"></script>
    <script src="quiz.js?v=3"></script>

</body>
</html>