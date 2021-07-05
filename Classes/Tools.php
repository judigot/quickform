<?php

Class Tools {

    private static $helloWorld = "Hello, world!";

    public static function helloWorld() {
        echo self::$helloWorld;
    }
    
    public static function log($content, $outputLocation) {
        if ($outputLocation != null && file_exists($outputLocation)) {
            $outputLocation = str_replace(chr(92), "/", $outputLocation);
            if (substr($outputLocation, -1) != "/") {
                $outputLocation .= "/";
            }
        } else if ($outputLocation == "current") {
            $outputLocation = "";
        } else {
            $outputLocation = "C:/Users/" . getenv("USERNAME") . "/Desktop/";
        }
        $fp = fopen($outputLocation . "Log.txt", "wb");
        fwrite($fp, $content);
    }

    public static function utf8Encode($string) {
        return preg_match('!!u', $string) ? $string : utf8_encode($string);
    }

    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }

    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    public static function resetRowCount($Data, $Index) {
        for ($i = 0; $i < sizeof($Data); $i++) {
            $Data[$i][array_keys($Data[0])[$Index]] = $i + 1;
        }
        return $Data;
    }

    public static function downloadCSV($fileName, $Data, $rowCount, $includeColumnNames) {
        if ($rowCount) {
            $Data = self::resetRowCount($Data, 0);
        }
        if ($includeColumnNames) {
            // Insert Column Names into the Array ($Data)
            array_unshift($Data, array_keys($Data[0]));
        }
        self::createFile(true, $Data, null, $fileName ? $fileName : "Untitled", "csv");
    }

    public static function exportCSV($fileName, $Data, $rowCount, $includeColumnNames) {
        if ($rowCount) {
            $Data = self::resetRowCount($Data, 0);
        }
        if ($includeColumnNames) {
            // Insert Column Names into the Array ($Data)
            array_unshift($Data, array_keys($Data[0]));
        }
        $Path = getenv("HOMEDRIVE") . getenv("HOMEPATH") . "/Desktop/";
        self::createFile(false, $Data, $Path, $fileName ? $fileName : "Untitled", "csv");
    }

    public static function createFile($isDownloadable, $Content, $Location, $FileName, $FileType) {
        $FileType = strtolower($FileType);
        if ($isDownloadable == true) {
            header("Content-type: application/$FileType");
            header("Content-disposition: attachment; filename=$FileName.$FileType");
            $File = fopen('php://output', 'w');
        } else {
            $File = fopen("$Location\\$FileName.$FileType", 'w');
        }

        switch ($FileType) {
            case "csv":
                foreach ($Content as $Value) {
                    //MySQL Data to CSV
                    fputcsv($File, $Value);
                    //Array Data to CSV
                    //fputcsv($File,explode(',',$Value));
                }
                break;
        }
        fclose($File);
    }

}
