<!DOCTYPE html>
<html>
<head>

    <meta charset="utf-8">
    <link rel="stylesheet" href="index.css?v=4">
    <link rel="stylesheet" href="header.css?v=1">

    <link rel="stylesheet"
          href="https://unpkg.com/leaflet/dist/leaflet.css"/>

    <?php  require 'font.php'; ?>
</head>
<body>

<?php require 'header.php'; ?>

    <main>
        <div class="left">
            <form action="update.php" method="POST">
                <label for="route_number">CHOOSE ROUTE:</label><br>

                <select name="route_number" id="route_number">
                    <option value="All"></option>
                    <?php
                    for ($i = 1; $i < 27; $i++) {
                        if ($i == 14) {
                            continue;
                        }
                        echo "<option value='$i'>$i</option>";
                    }
                    echo "<option value='34'>34</option>";
                    ?>
                </select>

                <br><br>

                <button type="button" onclick="update()">Update</button>
            </form>
        </div>
        <div class="right">
            <div id="map"></div>
        </div>
    </main>

    <script>

    </script>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="script.js?v=2"></script>

</body>
</html>