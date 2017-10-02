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
            if (strpos($file, '.html') === false) {
                $result[] = $file;
            }
        }
    }

    return $result;
}

function getTemplate($filePath) {
    $html = file($filePath);

    $template = '';
    foreach ($html as $row) {
        $template .= trim($row);
    }

    return $template;
}

function buildFile(&$file) {
    $parts = explode('<compose ', $file);

    if (count($parts) == 1) {
        return;
    }

    for ($i = 1; $i < count($parts); $i++) {
        $params = substr($parts[$i], 0, strpos($parts[$i], '>'));
        $parts[$i] = substr($parts[$i], strpos($parts[$i], '>') + 1);

        $paramsParts = explode(' ', $params);

        if ($paramsParts[0] = 'type=template') {
            $filePath = explode('=', $paramsParts[1])[1];
            $parts[$i] = getTemplate($filePath) . $parts[$i];
        }
    }

    $file = implode('', $parts);
}

$files = getFileList(__DIR__ . '/js');

$resultFile = '';
foreach ($files as $file) {
    $content = file_get_contents($file);
    buildFile($content);

    $resultFile .= $content . "\r\n";
}

file_put_contents('app.js', $resultFile);