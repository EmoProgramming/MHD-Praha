<?php
$file = "results.json";

$data = file_exists($file)
    ? json_decode(file_get_contents($file), true)
    : [];

// zoradenie (najvyššie score hore)
usort($data, function($a, $b) {
    return $b["score"] - $a["score"];
});
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="main.css">
    <title>Leaderboard</title>
    <style>
        body {
            font-family: Arial;
            background: #FFFFFF;
            color: #000000;
            text-align: center;
        }

        table {
            margin: auto;
            border-collapse: collapse;
            width: 60%;
        }

        th, td {
            border: 1px solid #444;
            padding: 10px;
        }


    </style>
</head>
<body>
<?php require 'header.php'; ?>
<h1>🏆 Leaderboard</h1>

<table>
    <tr>
        <th>Nickname</th>
        <th>Score</th>
        <th>Time (s)</th>
        <th>Date</th>
    </tr>

    <?php foreach ($data as $row): ?>
        <tr>
            <td><?= $row["nickname"] ?></td>
            <td><?= $row["score"] ?></td>
            <td><?= $row["time"] ?></td>
            <td><?= $row["date"] ?></td>
        </tr>
    <?php endforeach; ?>

</table>

</body>
</html>