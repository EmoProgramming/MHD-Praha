<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <link rel="stylesheet" href="trip.css?v=4">
    <link rel="stylesheet" href="header.css?v=1">

    <link rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"/>

    <?php  require 'font.php'; ?>
</head>
<body>

<?php require 'header.php'; ?>

    <main>
        <h1 id="tram_number"></h1>
        <table class="trip" id="trip">

        </table>
    </main>
    
    <script src="trip.js?v=2"></script>

</body>
</html>