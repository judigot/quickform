<?php

if ($_POST || $_FILES) {
    session_status() == PHP_SESSION_NONE ? session_start() : false;

    require_once 'global.php';
    require_once '../Imports/phpDefaults.php';
    require_once 'Database.php';
    require_once 'Tools.php';

    $Connection = Database::Connect($Host, $DatabaseName, $Username, $Password);

    if ($Connection) {
        if (isset($_POST["eventID"])) {
            $tableName = $dataColumnPrefix . $_POST["eventID"];
            $eventID = isset($_POST["eventID"]) ? $_POST["eventID"] : false;
            $Result = Database::read($Connection, "SHOW TABLES LIKE '$tableName';");
            $Result = $Result ? $Result[0][array_keys($Result[0])[0]] : null;
            if($Result) {
                $chronological = false;
                // $eventListResult = Database::read($Connection, "SELECT `event_list`, `event_name` FROM `$eventMasterTableName` WHERE `event_id`='$eventID';");
                $eventListResult = Database::read($Connection, "SELECT `event_list`, `event_name`, `F`.`form_content` FROM `$eventMasterTableName` AS `E` JOIN `$formMasterTableName` as `F` ON `E`.`event_form` = `F`.`form_id` WHERE `event_id`='$eventID';");
                $eventList = $eventListResult[0][array_keys($eventListResult[0])[0]];
                $eventName = $eventListResult[0][array_keys($eventListResult[0])[1]];
                if ($chronological) {
                    $Result = Database::read($Connection, "SELECT * FROM `$tableName` WHERE `q_col_1` IS NOT NULL ORDER BY `q_col_1` ASC;");
                } else {
                    $Result = Database::read($Connection, "SELECT * FROM `$tableName` WHERE `q_col_1` IS NOT NULL;");
                }

                $tableName = $listColumnPrefix . $eventList;
                $listResult = Database::read($Connection, "SELECT * FROM `$tableName` WHERE `row_id`='1';");

                if ($listResult) {
                    $ColumnNames = array_keys($listResult[0]);
                    $maxColumnCount = 0;
                    for ($j = 1; $j < sizeof($listResult[0]); $j++) {
                        if ($listResult[0][$ColumnNames[$j]] != "") {
                            $maxColumnCount++;
                        }
                    }
                    $maxDataCount = (int) Database::read($Connection, "SELECT COUNT(*) AS `maxRowCount` FROM `$tableName`;")[0]["maxRowCount"];

                    $attended = array();
                    foreach ($Result as $Value) {
                        array_push($attended, $Value[array_keys($Result[0])[0]] + 1);
                    }
                    $activeRows = "'" . implode("', '", $attended) . "'";
                    $columns = null;
                    for ($i = 0; $i < $maxColumnCount; $i++) {
                        $columns .= "`$systemColumnPrefix" . ($i + 1) . "`, ";
                    }
                    $columns = substr($columns, 0, -2);
                    $tableName = $listColumnPrefix . $eventList;
                    $formFields = json_decode($eventListResult[0]["form_content"]);
                    if ($chronological) {
                        $listResult = Database::read($Connection, "SELECT `row_id`, $columns FROM `$tableName` WHERE `row_id` IN (1, $activeRows) ORDER BY FIELD (`row_id`, $activeRows) ASC;");
                    } else {
                        $listResult = Database::read($Connection, "SELECT `row_id`, $columns FROM `$tableName` WHERE `row_id` IN (1, $activeRows);");
                    }
                    if ($listResult) {
                        for ($i = 0; $i < sizeof($listResult); $i++) {
                            array_shift($listResult[$i]);
                            if ($i == 0) {
                                array_push($listResult[$i], "In", "Out");
                            } else {
                                $time = json_decode($Result[$i - 1]["q_col_1"], true);
                                $in = isset($time[0]["in"]) ? $time[0]["in"] : null;
                                $out = isset($time[1]["out"]) ? $time[1]["out"] : null;
                                array_push($listResult[$i], $in, $out);
                            }
                        }
                        $columnNames = [];
                        foreach ($listResult as $Value) {
                            //MySQL Data to CSV
                            array_push($columnNames, array_values($Value));
                        }
                        die(json_encode(
                            [
                                "eventName" => $eventName,
                                "data" => $columnNames
                            ]
                        ));
                    }
                }
            }
        }
        if (isset($_POST["eventId"])) {
            $tableName = $dataColumnPrefix . $_POST["eventId"];
            $eventData = isset($_POST["eventId"]) ? $_POST["eventId"] : false;
            $Result = Database::read($Connection, "SHOW TABLES LIKE '$tableName';");
            $Result = $Result ? $Result[0][array_keys($Result[0])[0]] : null;
            if ($Result) {
                $chronological = false;
                $eventListResult = Database::read($Connection, "SELECT `event_list`, `event_name` FROM `$eventMasterTableName` WHERE `event_id`='$eventData'");
                $eventList = $eventListResult[0][array_keys($eventListResult[0])[0]];
                $eventName = $eventListResult[0][array_keys($eventListResult[0])[1]];
                if ($chronological) {
                    $Result = Database::read($Connection, "SELECT * FROM `$tableName` WHERE `q_col_1` IS NOT NULL ORDER BY `q_col_1` ASC;");
                } else {
                    $Result = Database::read($Connection, "SELECT * FROM `$tableName` WHERE `q_col_1` IS NOT NULL;");
                }
                //==========TIME FIELD==========//
                $attended = array();
                foreach ($Result as $Value) {
                    array_push($attended, $Value[array_keys($Result[0])[0]] + 1);
                }
                $activeRows = "'" . implode("', '", $attended) . "'";
                $columns = null;
                for ($i = 0; $i < ((int) $_POST["maxColumnCount"]); $i++) {
                    $columns .= "`$systemColumnPrefix" . ($i + 1) . "`, ";
                }
                $columns = substr($columns, 0, -2);
                $tableName = $listColumnPrefix . $eventList;
                if ($chronological) {
                    $listResult = Database::read($Connection, "SELECT `row_id`, $columns FROM `$tableName` WHERE `row_id` IN (1, $activeRows) ORDER BY FIELD (`row_id`, $activeRows) ASC;");
                } else {
                    $listResult = Database::read($Connection, "SELECT `row_id`, $columns FROM `$tableName` WHERE `row_id` IN (1, $activeRows);");
                }

                if ($listResult) {
                    for ($i = 0; $i < sizeof($listResult); $i++) {
                        array_shift($listResult[$i]);
                        if ($i == 0) {
                            array_push($listResult[$i], "In", "Out");
                        } else {
                            $time = json_decode($Result[$i - 1]["q_col_1"], true);
                            $in = isset($time[0]["in"]) ? $time[0]["in"] : null;
                            $out = isset($time[1]["out"]) ? $time[1]["out"] : null;
                            array_push($listResult[$i], $in, $out);
                        }
                    }
                    $total = sizeof($listResult) - 1;
                    $copyright = "Copyright © " . date("Y") . " Quickform Inc. All rights reserved.";
                    $borderWidth = (strlen($eventName) < strlen($copyright) ? strlen($copyright) : strlen($eventName) + 8) + 1;
                    $border = null;
                    for ($i = 0; $i < $borderWidth; $i++) {
                        $border .= "-";
                    }
                    $margin = null;
                    if (strlen($copyright) < strlen($eventName)) {
                        for ($i = 0; $i < (strlen($eventName) - strlen($copyright)) * 0.55; $i++) {
                            $margin .= " ";
                        }
                    }
                    echo "$border\n";
                    echo " {$margin}Q    U    I    C    K    R    E    P    O    R    T\n";
                    echo "$border\n";
                    echo " Event: $eventName\n";
                    echo " Total: " . $total . "\n";
                    echo "$border\n";
                    echo " $margin$copyright\n";
                    echo "$border\n\n";

                    Tools::downloadCSV("Quickreport - " . $eventName, $listResult, false, false);
                }
                //==========TIME FIELD==========//
            }
        }

        if (isset($_FILES['listContent'])) {
            $allowedColumnSize = 26;
            $listName = substr($_FILES["listContent"]["name"], 0, strlen($_FILES["listContent"]["name"]) - 4);
            $allowed = array("csv");
            $fileExt = explode('.', $_FILES['listContent']['name']);
            $fileActualExt = strtolower(end($fileExt));
            if (in_array($fileActualExt, $allowed)) {
                //=====Insert list=====//
                $Column = array("user_id", "list_name");
                $Data = array($_SESSION["user"]["user_id"], $listName);
                Database::create($Connection, $listMasterTableName, $Column, $Data);
                //=====Insert list=====//
                //=====Create table=====//
                $Result = Database::read($Connection, "SELECT LAST_INSERT_ID() FROM `$listMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}'");
                $tableName = $listColumnPrefix . $Result[0]["LAST_INSERT_ID()"];
                $SQL = "CREATE TABLE `$tableName` (row_id INT(11) PRIMARY KEY AUTO_INCREMENT, ";
                for ($i = 0; $i < $allowedColumnSize; $i++) {
                    $SQL = $SQL . "`{$systemColumnPrefix}" . ($i + 1) . "` VARCHAR(255) NULL, ";
                }
                $SQL = substr($SQL, 0, -2) . ");";
                //=====Create table=====//
                //=====Insert values to table=====//
                $SQL = $SQL . "LOAD DATA LOCAL INFILE '" . str_replace("\\", "/", $_FILES["listContent"]["tmp_name"]) . "' INTO TABLE `$tableName` FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY  '\"' LINES TERMINATED BY '\r\n' STARTING BY '' (";
                for ($i = 0; $i < $allowedColumnSize; $i++) {
                    $SQL = $SQL . "$systemColumnPrefix" . ($i + 1) . ", ";
                }
                $SQL = substr($SQL, 0, -2) . ");";
                Database::execute($Connection, $SQL);
                //=====Insert values to table=====//
            } else {
                echo "invalid";
            }
        }

        if (isset($_POST['create'])) {
            if ($_POST['create'] == "insertUser") {
                $Data = array();
                $Result = Database::read($Connection, "SELECT COUNT(*) FROM `$userMasterTableName` WHERE `email`='{$_POST['data']["email"]}'");
                if ($Result[0]["COUNT(*)"] == "0") {
                    $lastName = $_POST["data"]["lastName"];
                    $columns = array("first_name", "last_name", "email", "password", "birthdate", "gender", "address", "user_type");
                    $data = array(ucwords($_POST["data"]["firstName"]), ucwords($_POST["data"]["lastName"]), $_POST["data"]["email"], Tools::hashPassword($_POST["data"]["password"]), null, null, null, "standard");
                    Database::create($Connection, $userMasterTableName, $columns, $data);
                    $_SESSION["userEmail"] = $_POST["data"]["email"];
                    array_push($Data, 0);
                } else if ($Result[0]["COUNT(*)"] == "1") {
                    array_push($Data, 1);
                }
                echo json_encode($Data);
            }
            if ($_POST['create'] == "insertRegistrationValues") {
                $Data = json_decode($_POST["data"]["values"]);
                $Column = array();
                for ($i = 0; $i < sizeof($Data); $i++) {
                    array_push($Column, $systemColumnPrefix . ($i + 1));
                }
                print_r($Column);
                Database::create($Connection, $_POST["data"]["table"], $Column, $Data);
            }
            if ($_POST['create'] == "insertEvent") {
                $eventPassHash = $_POST["data"]["password"] ? Tools::hashPassword($_POST["data"]["password"]) : null;
                $Column = array("user_id", "event_type", "event_name", "event_password", "event_form", "event_list", "event_email", "start_time", "end_time");
                if ($_POST["data"]["type"] == "registration") {
                    $Data = array($_SESSION["user"]["user_id"], $_POST["data"]["type"], $_POST["data"]["eventName"], $eventPassHash, $_POST["data"]["form"], null, null, $_POST["data"]["startTime"], $_POST["data"]["endTime"]);
                } else {
                    $Data = array($_SESSION["user"]["user_id"], $_POST["data"]["type"], $_POST["data"]["eventName"], $eventPassHash, $_POST["data"]["specialForm"], $_POST["data"]["list"], $_POST["data"]["email"], $_POST["data"]["startTime"], $_POST["data"]["endTime"]);
                }
                Database::create($Connection, $eventMasterTableName, $Column, $Data);
            }
            if ($_POST['create'] == "insertForm") {
                $Column = array("user_id", "form_name", "form_content");
                $formName = $_POST["data"]["formName"] ? $_POST["data"]["formName"] : "Untitled form";
                $Data = array($_SESSION["user"]["user_id"], $formName, $_POST["data"]["jsonForm"]);
                Database::create($Connection, $formMasterTableName, $Column, $Data);
            }
        }

        if (isset($_POST['read'])) {
            if ($_POST['read'] == "checkActiveEventUpdates") {
                $tableName = $dataColumnPrefix . $_POST["data"]["eventId"];
                $Data = array();
                if ($_POST["data"]["eventStart"] < date("Y-m-d H:i:s")) {
                    $activeRows = "'" . str_replace(",", "', '", $_POST["data"]["activeRows"]) . "'";
                    $Result = Database::read($Connection, "SELECT * FROM `$tableName` WHERE `row_id` IN ($activeRows)");
                    array_push($Data, date("Y-m-d G:i:s"), md5(serialize($Result)), $Result);
                } else {
                    array_push($Data, date("Y-m-d G:i:s"));
                }
                $Result = Database::read($Connection, "SELECT `start_time`, `end_time`, `event_status` FROM `$eventMasterTableName` WHERE `event_id`='{$_POST["data"]["eventId"]}';");
                array_push($Data, $Result);
                echo json_encode($Data);
            }
            if ($_POST['read'] == "checkOngoingEventUpdates") {
                $Result = Database::read($Connection, "SELECT `event_id`, `event_name`, `event_type` FROM `$eventMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}' AND ((`event_type`='attendance' AND `event_status`='active') OR (`event_type`='registration'))");
                $Data = array();
                array_push($Data, md5(serialize($Result)), $Result);
                echo json_encode($Data);
            }
            if ($_POST['read'] == "checkFinishedEventUpdates") {
                $Result = Database::read($Connection, "SELECT `event_id`, `event_name`, `event_type` FROM `$eventMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}' AND (`event_type`='attendance' AND `event_status`='inactive')");
                $Data = array();
                array_push($Data, md5(serialize($Result)), $Result);
                echo json_encode($Data);
            }
            if ($_POST['read'] == "checkFormUpdates") {
                $Result = Database::read($Connection, "SELECT `form_id`, `form_name`, `form_content` FROM `$formMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}'");
                $Data = array();
                array_push($Data, md5(serialize($Result)), $Result);
                echo json_encode($Data);
            }
            if ($_POST['read'] == "checkListUpdates") {
                $Result = Database::read($Connection, "SELECT `list_id`, `list_name` FROM `$listMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}'");
                $Data = array();
                array_push($Data, md5(serialize($Result)), $Result);
                echo json_encode($Data);
            }
            if ($_POST['read'] == "checkListDataUpdates") {
                $tableName = $listColumnPrefix . $_POST["data"]["listId"];
                $Result = Database::read($Connection, "SELECT * FROM `$tableName`;");
                $Data = array();
                array_push($Data, md5(serialize($Result)), $Result);
                echo json_encode($Data);
            }
            if ($_POST['read'] == "formAndListDropdown") {
                $formResult = Database::read($Connection, "SELECT * FROM `$formMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}';");
                $listResult = Database::read($Connection, "SELECT * FROM `$listMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}';");
                $Data = array();
                array_push($Data, $formResult, $listResult);
                echo json_encode($Data);
            }
        }
        if (isset($_POST['update'])) {
            if ($_POST['update'] == "forceEndEvent") {
                Database::update($Connection, $eventMasterTableName, "end_time", date("Y-m-d H:i:s", time()), "event_id", $_POST["data"]["eventId"]);
            }
            if ($_POST['update'] == "toggleEventStatus") {
                Database::execute($Connection, "UPDATE `$eventMasterTableName` SET `event_status`=CASE WHEN `event_status`='active' THEN 'inactive' ELSE 'active' END WHERE `event_id`='{$_POST["data"]["eventId"]}'");
            }
            if ($_POST['update'] == "updateEventData") {
                $tableName = $dataColumnPrefix . $_POST["data"]["tableName"];
                $time = strtoupper(date("h:i:s a"));
                if ($time[0] == "0") {
                    $time = substr($time, 1);
                }
                if ($_POST["data"]["timeType"] == "in") {
                    $timeJSON = '[{"in":"' . $time . '"}]';
                    Database::update($Connection, $tableName, "$systemColumnPrefix{$_POST["data"]["columnIndex"]}", $timeJSON, "row_id", $_POST["data"]["rowIndex"]);
                } else {
                    $timeJSON = ',{\"out\":\"' . $time . '\"}]';
                    $SQL = "UPDATE `$tableName` SET `$systemColumnPrefix{$_POST["data"]["columnIndex"]}`=CONCAT(SUBSTRING(`$systemColumnPrefix{$_POST["data"]["columnIndex"]}`, 1, CHAR_LENGTH(`$systemColumnPrefix{$_POST["data"]["columnIndex"]}`) - 1), '$timeJSON') WHERE `row_id`='{$_POST["data"]["rowIndex"]}';";
                    Database::execute($Connection, $SQL);
                }
            }
            if ($_POST['update'] === "renameItem") {
                $itemType = $_POST["data"]["type"];
                Database::update($Connection, getTableName($itemType, $eventMasterTableName, $formMasterTableName, $listMasterTableName), $_POST["data"]["type"] . "_name", $_POST["data"]["newName"], $_POST["data"]["type"] . "_id", $_POST["data"]["id"]);
            }
            if ($_POST['update'] === "updateListData") {
                $tableName = $listColumnPrefix . $_POST["data"]["tableName"];
                Database::update($Connection, $tableName, $systemColumnPrefix . $_POST["data"]["column"], $_POST["data"]["newValue"], "row_id", $_POST["data"]["row"]);
            }
            if ($_POST['update'] === "rearrangeColumns") {
                $tableName = $listColumnPrefix . $_POST["data"]["tableName"];
                $SQL;
                $columns = json_decode($_POST["data"]["columns"]);
                for ($i = 0; $i < sizeof($columns); $i++) {
                    if ($i == 0) {
                        $SQL = "ALTER TABLE `$tableName` MODIFY COLUMN `$systemColumnPrefix{$columns[$i]}` VARCHAR(255) AFTER `row_id`;";
                    } else {
                        $SQL .= "ALTER TABLE `$tableName` MODIFY COLUMN `$systemColumnPrefix{$columns[$i]}` VARCHAR(255) AFTER `$systemColumnPrefix{$columns[$i - 1]}`;";
                    }
                }
                Database::execute($Connection, $SQL);
            }
        }
        if (isset($_POST['delete'])) {
            if ($_POST['delete'] === "deleteWithConstraint") {
                Database::delete($Connection, "constraintTable", "columnName", $_SESSION['foreignPrimaryKey']);
                Database::delete($Connection, "foreignTable", "columnName", $_SESSION['foreignPrimaryKey']);
            }
            if ($_POST['delete'] === "deleteItems") {
                if ($_POST["itemType"] == "event") {
                    Database::update($Connection, $listMasterTableName, "event_id", null, "event_id", json_decode($_POST["data"]));
                }
                $itemType = $_POST["itemType"];
                $rowCount = Database::delete($Connection, getTableName($itemType, $eventMasterTableName, $formMasterTableName, $listMasterTableName), $_POST["itemType"] . "_id", json_decode($_POST["data"]));
                if ($_POST["itemType"] == "event") {
                    $SQL = "DROP TABLE `$dataColumnPrefix" . implode("`, `$dataColumnPrefix", json_decode($_POST["data"])) . "`;";
                    Database::execute($Connection, $SQL);
                }
                if ($_POST["itemType"] == "list" && $rowCount != 0) {
                    $SQL = "DROP TABLE `$listColumnPrefix" . implode("`, `$listColumnPrefix", json_decode($_POST["data"])) . "`;";
                    Database::execute($Connection, $SQL);
                }
                echo $rowCount;
            }
        }

        if (isset($_POST['duplicate'])) {
            if ($_POST['duplicate'] === "duplicateItem") {
                $itemType = $_POST["data"]["itemType"];
                Database::duplicate($Connection, getTableName($itemType, $eventMasterTableName, $formMasterTableName, $listMasterTableName), $_POST["data"]["itemType"] . "_id", $_POST["data"]["id"], $_POST["data"]["itemType"] . "_name", "Copy of ");
                if ($_POST["data"]["itemType"] == "list") {
                    $Result = Database::read($Connection, "SELECT `list_id` FROM `$listMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}' ORDER BY `list_id` DESC LIMIT 1;");
                    echo json_encode($Result);
                    $SQL = "CREATE TABLE `{$Result[0]["list_id"]}` LIKE `{$_POST["data"]["id"]}`; INSERT `{$Result[0]["list_id"]}` SELECT * FROM `{$_POST["data"]["id"]}`";
                    Database::execute($Connection, $SQL);
                }
            }
        }

        if (isset($_POST['loginFilter'])) {
            $Result = Database::read($Connection, "SELECT * FROM $userMasterTableName WHERE `email`='{$_POST["data"]["email"]}'");
            if (!empty($Result)) {
                $Data = array();
                if (Tools::verifyPassword($_POST["data"]["password"], $Result[0]["password"])) {
                    $_SESSION["user"] = array("user_id" => $Result[0]["user_id"], "first_name" => $Result[0]["first_name"], "last_name" => $Result[0]["last_name"], "email" => $Result[0]["email"], "password" => $Result[0]["password"], "birthdate" => $Result[0]["birthdate"], "gender" => $Result[0]["gender"], "address" => $Result[0]["address"], "user_type" => $Result[0]["user_type"]);
                    $_SESSION["userEmail"] = $_SESSION["user"]["email"];
                    $Data[] = 0;
                } else {
                    $Data[] = 1;
                }
                $Data[] = $Result[0]["first_name"];
            } else {
                $Data[] = "nodata";
            }
            echo json_encode($Data);
        }

        if (isset($_POST['logoutUser'])) {
            unset($_SESSION["user"]);
            echo (!isset($_SESSION["user"])) ? 1 : 0;
        }

        if (isset($_POST['eventFilter'])) {
            $Result = Database::read($Connection, "SELECT * FROM `$eventMasterTableName` WHERE `event_id`='{$_POST["data"]["eventId"]}'");
            if (!empty($Result)) {
                if (Tools::verifyPassword($_POST["data"]["password"], $Result[0]["event_password"])) {
                    echo "0";
                }
            } else {
                echo "1";
            }
        }
        Database::disconnect($Connection);
    } else {
        echo '<h1>Connection failed!</h1>';
    }
} else {
    header("Location: ..");
}

function getTableName($itemType, $eventMasterTableName, $formMasterTableName, $listMasterTableName) {
    $tableName = null;
    if ($itemType == "event") {
        $tableName = $eventMasterTableName;
    } else if ($itemType == "form") {
        $tableName = $formMasterTableName;
    } else if ($itemType == "list") {
        $tableName = $listMasterTableName;
    }
    return $tableName;
}
