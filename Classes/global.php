<?php

$dbInfoFileName = "dbinfo.json";
$jsonPath = (file_exists($dbInfoFileName)) ? $dbInfoFileName : "Classes/$dbInfoFileName";
$dbinfo = json_decode(file_get_contents($jsonPath), true);

$DatabaseName = $dbinfo["database"][0];
$Host = $dbinfo["host"];
$Username = $dbinfo["username"];
$Password = $dbinfo["password"];

$certificateMasterTableName = $dbinfo["table"][0];
$eventMasterTableName = $dbinfo["table"][1];
$formMasterTableName = $dbinfo["table"][2];
$listMasterTableName = $dbinfo["table"][3];
$userMasterTableName = $dbinfo["table"][4];

$dataColumnPrefix = "data_";
$listColumnPrefix = "list_";
$systemColumnPrefix = "q_col_";
