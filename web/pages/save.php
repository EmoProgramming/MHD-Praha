<?php

$file = "results.json";

$data = json_decode(file_get_contents("php://input"), true);


if (file_exists($file)) {
    $old = json_decode(file_get_contents($file), true);
} else {
    $old = [];
}

$old[] = [
    "nickname" => $data["nickname"],
    "score" => $data["score"],
    "time" => $data["time"],
    "date" => date("Y-m-d H:i:s")
];

file_put_contents($file, json_encode($old, JSON_PRETTY_PRINT));

echo json_encode(["status" => "ok"]);