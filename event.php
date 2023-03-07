<?php require_once 'Imports/preload.php'; ?>
<?php
require_once 'Classes/global.php';
require_once 'Classes/Database.php';

$Connection = Database::Connect($Host, $DatabaseName, $Username, $Password);
$Result = Database::read($Connection, "SELECT `$eventMasterTableName`.`event_id`, `$eventMasterTableName`.`user_id`, `$eventMasterTableName`.`event_type`, `$eventMasterTableName`.`event_name`, `$eventMasterTableName`.`event_password`, `$eventMasterTableName`.`event_form`, `$eventMasterTableName`.`event_list`, `$eventMasterTableName`.`event_email`, `$eventMasterTableName`.`start_time`, `$eventMasterTableName`.`end_time`, `$eventMasterTableName`.`event_status`, `$formMasterTableName`.`form_content` FROM `$eventMasterTableName` LEFT JOIN `$formMasterTableName` ON `$eventMasterTableName`.`event_form` = `$formMasterTableName`.`form_id` WHERE `event_id`={$_GET["eventId"]};");
if ($Result) {
    $startTime = $Result ? $Result[0]["start_time"] : null;
    $endTime = $Result ? $Result[0]["end_time"] : null;
    $currentTime = date("Y-m-d H:i:s");
    $eventPassword = $Result[0]["event_password"] ? "true" : "false";
    $eventType = $Result[0]["event_type"];
    $specialForm = $Result[0]["form_content"];
    ?>
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <?php include 'Imports/top.php'; ?>
            <link href="Assets/css/animation.css" rel="stylesheet" type="text/css"/>
            <link href="Assets/css/viewEvent.css" rel="stylesheet" type="text/css"/>
            <?php
            if ($startTime > $currentTime) {
                ?>
                <link href="Vendor/Plugins/FlipClock-master/flipclock.css" rel="stylesheet" type="text/css"/>
                <script src="Vendor/Plugins/FlipClock-master/flipclock.js" type="text/javascript"></script>
                <?php
            }
            if ($startTime < $currentTime && $eventPassword == "true" && isset($_SESSION["user"]) && $_SESSION["user"]["user_id"] == $Result[0]["user_id"]) {
                ?>
                <link href="Assets/css/viewEventPass.css" rel="stylesheet" type="text/css"/>
                <?php
            }
            if ($eventType == "registration") {
                ?>
                <link href="Assets/css/viewReg.css" rel="stylesheet" type="text/css"/>
                <script src="Assets/js/viewReg.js" type="text/javascript"></script>
                <?php
            } else {
                ?>
                <link href="Vendor/Plugins/DataTables-1.10.16/css/jquery.dataTables.css" rel="stylesheet" type="text/css"/>
                <script src="Vendor/Plugins/DataTables-1.10.16/js/jquery.dataTables.js" type="text/javascript"></script>
                <link href="Assets/css/attendanceTable.css" rel="stylesheet" type="text/css"/>
                <?php
            }
            ?>

        </head>

        <body data-event-id="<?php echo $_GET["eventId"]; ?>" data-event-name="<?php echo $Result[0]["event_name"]; ?>" data-event-type="<?php echo $Result[0]["event_type"]; ?>" data-special-form-content='<?php echo $specialForm; ?>' data-current-time="<?php echo $currentTime; ?>" data-start-time="<?php echo $startTime; ?>" data-end-time="<?php echo $endTime; ?>" data-event-status="<?php echo $Result[0]["event_status"]; ?>">
            <?php
            if ($startTime < $currentTime) {
                if ($Result[0]["event_status"] == "active" || (isset($_SESSION["user"]) && $_SESSION["user"]["user_id"] == $Result[0]["user_id"])) {
                    ?>
                    <h1 id="eventTitle" class="event-label registration"><?php echo $Result[0]["event_name"]; ?></h1>
                    <?php
                    if (isset($_SESSION["user"]) && $eventType == "attendance") {
                        ?>
                        <div class="actions-container">
                            <form class="action-children" method="POST" action="Classes/process.php">
                                <input type="text" name="eventId" value="<?php echo $_GET["eventId"]; ?>" hidden="true">
                                <input type="text" name="maxColumnCount" value="" hidden="true">
                                <button type="submit" data-original-title="Download report" class="attendance-action download-report"><i class="fa fa-download"></i></button>
                            </form>
                            <button type="button" data-original-title="End event" class="fa fa-hourglass-half action-children attendance-action end-event"></button>
                            <?php
                            if ($endTime < $currentTime) {
                                ?>
                                <button type="button" data-original-title="Mark event as <?php echo $Result[0]["event_status"] == "active" ? "in" : false; ?>active" data-event-status="<?php echo $Result[0]["event_status"] != "active" ? "in" : false; ?>active" class="action-children attendance-action event-status-toggle"><i class="fa fa-check-circle"></i></button>
                                <?php
                            }
                            ?>
                        </div>
                        <?php
                    }
                    ?>
                    <div id="eventMain" data-event-id="<?php echo $_GET["eventId"]; ?>" data-event-password="<?php echo $eventPassword; ?>">
                        <?php
                        if ($eventType == "registration") {
                            require_once 'Classes/Tools.php';
                            $form = json_decode($specialForm, true);
                            $regListData = Database::read($Connection, "SELECT `list_id` FROM `$listMasterTableName` WHERE `event_id`='{$Result[0]["event_id"]}';");
                            $listId;
                            if (!$regListData) {
                                $defaultName = $Result[0]["event_name"];
                                $defaultValue = "";
                                $allowedColumnSize = 26;
                                $allowedRowSize = 100;

                                //=====Insert list=====//
                                $Column = array("user_id", "event_id", "list_name");
                                $Data = array($_SESSION["user"]["user_id"], $Result[0]["event_id"], $defaultName);
                                Database::create($Connection, $listMasterTableName, $Column, $Data);
                                //=====Insert list=====//
                                //=====Create table=====//
                                $regListResult = Database::read($Connection, "SELECT LAST_INSERT_ID() FROM `$listMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}'");
                                $SQL = "CREATE TABLE `{$regListResult[0]["LAST_INSERT_ID()"]}` (row_id INT(11) PRIMARY KEY AUTO_INCREMENT, ";
                                for ($i = 0; $i < $allowedColumnSize; $i++) {
                                    $SQL = $SQL . "`$systemColumnPrefix" . ($i + 1) . "` VARCHAR(255) NULL, ";
                                }
                                $SQL = substr($SQL, 0, -2) . ");";
                                //=====Create table=====//
                                //=====Insert values to table=====//
                                $SQL = $SQL . "INSERT INTO `{$regListResult[0]["LAST_INSERT_ID()"]}` VALUES ('', ";
                                $fieldIndex = 0;
                                foreach ($form as $value) {
                                    $SQL = $SQL . "{$Connection->quote(Tools::utf8Encode($value["title"]))}, ";
                                    $fieldIndex++;
                                }
                                for ($i = 0; $i < $allowedColumnSize - $fieldIndex; $i++) {
                                    $SQL = $SQL . "NULL, ";
                                }
                                $SQL = substr($SQL, 0, -2) . ");";
                                Database::execute($Connection, $SQL);
                                //=====Insert values to table=====//
                                $listId = $regListResult[0]["LAST_INSERT_ID()"];
                            } else {
                                $listId = $regListData[0][array_keys($regListData[0])[0]];
                            }
                            ?>
                            <div id="preregistrationContainer" data-list-id="<?php echo $listId; ?>">
                                <?php
                                foreach ($form as $value) {
                                    ?>
                                    <div class="fieldContainer">
                                        <?php
                                        if ($value["type"] != "time") {
                                            ?>
                                            <span class="fieldLabel"><?php echo $value["title"]; ?></span>
                                            <?php
                                        }
                                        switch ($value["type"]) {
                                            case "text":
                                                ?>
                                                <input type="<?php echo $value["type"]; ?>" id="<?php echo $value["id"]; ?>" maxlength="<?php echo $value["maxLength"]; ?>">
                                                <?php
                                                break;
                                            case "number":
                                                ?>
                                                <input type="<?php echo $value["type"]; ?>" id="<?php echo $value["id"]; ?>" min="<?php echo $value["minVal"]; ?>" max="<?php echo $value["maxVal"]; ?>">
                                                <?php
                                                break;
                                            case "boolean":
                                                ?>
                                                <label class="switch boolean">
                                                    <input type="checkbox" id="<?php echo $value["id"]; ?>" class="booleanInput"<?php echo $value["default"] == "true" ? " checked" : false; ?>>
                                                    <span class="slider round"></span>
                                                </label>
                                                <?php
                                                break;
                                            case "dropdown":
                                                ?>
                                                <select id="<?php echo $value["id"]; ?>">
                                                    <?php
                                                    foreach ($value["values"]["options"] as $option) {
                                                        if ($value["default"] == $option) {
                                                            ?>
                                                            <option value="<?php echo $option; ?>" selected><?php echo $option; ?></option>
                                                            <?php
                                                        } else {
                                                            ?>
                                                            <option value="<?php echo $option; ?>"><?php echo $option; ?></option>
                                                            <?php
                                                        }
                                                    }
                                                    ?>
                                                </select>
                                                <?php
                                                break;
                                        }
                                        ?>
                                    </div>
                                    <hr>
                                    <?php
                                }
                                ?>
                                <br>
                                <button type="button" id="submitData" class="btn">SUBMIT</button>
                            </div>
                            <?php
                        } else {
                            $list = $Result[0]["event_list"];
                            $tableName = $listColumnPrefix . $list;
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
                            } else {
                                echo "Your list seems to be empty.";
                            }

                            //====================EVENT DATA TABLE====================//
                            $eventDataTable = Database::read($Connection, "SHOW TABLES LIKE 'data_{$_GET["eventId"]}';") ? true : false;
                            if ($startTime < $currentTime) {
                                if (!$eventDataTable) {
                                    echo $eventDataTable;
                                    if ($eventType == "attendance") {
                                        $columnCount = sizeof(json_decode($specialForm, true));
                                        $rowCount = $maxDataCount - 1;
                                        $fieldNames = array();
                                        foreach (json_decode($specialForm, true) as $value) {
                                            $fieldNames[] = $value["title"];
                                        }

                                        // Create event data table
                                        $tableName = $dataColumnPrefix . $_GET["eventId"];
                                        $SQL = "CREATE TABLE `$tableName` (row_id INT(11) PRIMARY KEY AUTO_INCREMENT, ";
                                        for ($i = 0; $i < $columnCount; $i++) {
                                            $SQL = $SQL . "`{$systemColumnPrefix}" . ($i + 1) . "` VARCHAR(255) NULL, ";
                                        }
                                        $SQL = substr($SQL, 0, -2) . ");";

                                        // Data insertion
                                        $SQL = $SQL . "INSERT INTO `$tableName` VALUES ";
                                        $rowTemplate = "(NULL, ";
                                        for ($i = 0; $i < $columnCount; $i++) {
                                            $rowTemplate = $rowTemplate . "NULL, ";
                                        }
                                        $rowTemplate = substr($rowTemplate, 0, -2) . "), ";
                                        //====================ALL FIELDS====================//
                                        $maxMultiplier = 10000;
                                        $multiplier = $rowCount % $maxMultiplier == 0 ? $maxMultiplier : null;
                                        for ($i = 0; $i < $maxMultiplier - 2; $i++) {
                                            $multiplier = ($multiplier < ($maxMultiplier - ($i))) && ($rowCount % ($maxMultiplier - ($i)) == 0) ? ($maxMultiplier - ($i)) : $multiplier;
                                            if ($multiplier != null) {
                                                break;
                                            }
                                        }
                                        $rowData = null;
                                        if ($rowCount != $multiplier) {
                                            for ($i = 0; $i < $multiplier; $i++) {
                                                $rowData .= $rowTemplate;
                                            }
                                        } else {
                                            $multiplier = 1;
                                            $rowData = $rowTemplate;
                                        }
                                        $rowData = substr($rowData, 0, -2) . ", ";
                                        for ($i = 0; $i < $rowCount / $multiplier; $i++) {
                                            $SQL = $SQL . $rowData;
                                        }
                                        //====================ALL FIELDS====================//
                                        $SQL = substr($SQL, 0, -2) . ";";
                                        Database::execute($Connection, $SQL);
                                    } else {
                                        echo "Table \"{$_GET["eventId"]}\" for registration event created.";
                                    }
                                }
                            }
                            //====================EVENT DATA TABLE====================//
                            //========================================MAIN TABLE========================================//
                            if ($listResult) {
                                ?>
                                <table id="attendanceTable" data-event-list="<?php echo $list; ?>" data-max-col="<?php echo $maxColumnCount; ?>" data-col-names="<?php echo htmlentities(serialize($ColumnNames)) ?>" data-list-result="<?php echo htmlentities(serialize($listResult)) ?>" data-special-form="<?php echo htmlentities($specialForm) ?>">
                                    <!--------------------Table Head-------------------->
                                    <thead>
                                        <tr>
                                            <?php
                                            for ($i = 0; $i < $maxColumnCount + 1; $i++) {
                                                if ($i != 0 && $listResult[0][$ColumnNames[$i]]) {
                                                    ?>
                                                    <th><?php echo $listResult[0][$ColumnNames[$i]]; ?></th>
                                                    <?php
                                                }
                                            }
                                            foreach (json_decode($specialForm, true) as $value) {
                                                ?>
                                                <th><?php echo $value["title"]; ?></th>
                                                <?php
                                            }
                                            ?>
                                            <th>Certificate</th>
                                        </tr>
                                    </thead>
                                    <!--------------------Table Head-------------------->

                                    <!--------------------Table Body-------------------->
                                    <tbody>
                                    </tbody>
                                    <!--------------------Table Body-------------------->
                                </table>
                                <div id="adContainer"></div>
                                <?php
                            } else {
                                ?>
                                <?php
                            }
                            //========================================MAIN TABLE========================================//
                        }
                        ?>
                    </div>
                    <?php
                    if ($eventPassword == "true") {
                        ?>
                        <div id="modal-backdrop">
                            <div id="modal-body">
                                <div id="form-body">
                                    <span class="event-title"><?php echo $Result[0]["event_name"]; ?></span>
                                    <br><br>
                                    <input id="password" class="field" type="password">
                                    <div id="login-result"></div>
                                    <input class="btn" id="verify-pass-button" type="button" value="ENTER">
                                </div>
                            </div>
                        </div>
                        <?php
                    }
                    ?>
                    <?php
                } else if ((!isset($_SESSION["user"]) || (isset($_SESSION["user"]) && $_SESSION["user"]["user_id"] != $Result[0]["user_id"])) && $Result[0]["event_status"] == "inactive") {
                    ?>
                    <div id="list-error">
                        <h1 class="list-error-title">The event has ended.</h1>
                        <p class="list-error-dscrptn">This event has already been marked as ended by its owner.</p>
                    </div>
                    <?php
                }
            } else {
                ?>
                <div id="countdown">
                    <h1 id="eventTitle" class="event-label countdown"><?php echo $Result[0]["event_name"]; ?></h1>
                    <div id="countdownContainer">
                        <div class="clock"></div>
                    </div>
                </div>
                <?php
            }
            ?>
            <div class="fieldSource">
                <!--Text-->
                <input type="text" class="textInput">
                <!--Text-->
                <input type="number" class="numberInput">
                <!--Boolean-->
                <label class="switch boolean">
                    <input type="checkbox" class="booleanInput">
                    <span class="slider round"></span>
                </label>
                <!--Dropdown-->
                <select class="options dropdown"></select>
                <!--Time-->
                <label class="switch time">
                    <input type="checkbox" class="time-input">
                    <span class="slider round time-switch"></span>
                </label>
            </div>
            <?php include 'Imports/bottom.php'; ?>
            <script src="Assets/js/viewEvent.js" type="text/javascript"></script>
        </body>

    </html>
    <?php
} else {
    $projectRoot = str_replace($_SERVER['DOCUMENT_ROOT'], "", str_replace(chr(92), "/", getcwd())) . "/";
    header("Location: {$projectRoot}home");
}
