<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <link rel="stylesheet" href="main.css?v=2">
    <link rel="stylesheet" href="header.css">

    <link rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"/>

</head>
<body>

<?php require 'header.php'; ?>

    <main>
        <div id="map"></div>
        <form action="update.php" method="POST">
            <label for="route_number">Choose route:</label><br>

            <select name="route_number" id="route_number">
                <option value="All"></option>
                <?php
                for ($i = 1; $i < 27; $i++) {
                    if ($i == 14) {
                        continue;
                    }
                    echo "<option value='$i'>$i</option>";
                }
                ?>
            </select>

            <br><br>

            <button type="button" onclick="update()">Update</button>
        </form>
    </main>

    <script>

    </script>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="script.js?v=2"></script>

</body>
</html>