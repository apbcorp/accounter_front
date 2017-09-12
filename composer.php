<?php

function getFileList($path) {
    $result = [];
    $files = scandir($path);

    foreach ($files as $file) {
        if ($file == '..' || $file == '.') {
            continue;
        }

        $file = $path . DIRECTORY_SEPARATOR . $file;

        if (is_dir($file)) {
            $result = array_merge($result, getFileList($file));
        } else {
            $result[] = $file;
        }
    }

    return $result;
}

$files = getFileList(__DIR__ . '/js');

$resultFile = '';
foreach ($files as $file) {
    $resultFile .= file_get_contents($file) . "\r\n";
}

file_put_contents('app.js', $resultFile);