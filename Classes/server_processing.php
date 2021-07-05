<?php

/*
 * DataTables example server-side processing script.
 *
 * Please note that this script is intentionally extremely simply to show how
 * server-side processing can be implemented, and probably shouldn't be used as
 * the basis for a large complex system. It is suitable for simple use cases as
 * for learning.
 *
 * See http://datatables.net/usage/server-side for full details on the server-
 * side processing requirements of DataTables.
 *
 * @license MIT - http://datatables.net/license_mit
 */

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Easy set variables
 */

// DB table to use
require_once 'global.php';
require_once 'Database.php';

$eventId = $dataColumnPrefix . $_POST["eventId"];
$table = $listColumnPrefix . $_POST["eventList"];
$eventName = $_POST["eventName"];
$listResult = unserialize($_POST["listResult"]);
$ColumnNames = unserialize($_POST["columnNames"]);
$maxColumnCount = $_POST["maxColumnCount"] + 1;
$specialForm = json_decode($_POST["specialForm"], true);

// Table's primary key
$primaryKey = $ColumnNames[0];

// Array of database columns which should be read and sent back to DataTables.
// The `db` parameter represents the column name in the database, while the `dt`
// parameter represents the DataTables column identifier. In this case simple
// indexes

$Connection = Database::Connect($Host, $DatabaseName, $Username, $Password);
$Result = Database::read($Connection, "SELECT * FROM `$eventId` WHERE `q_col_1` IS NOT NULL ORDER BY `q_col_1` DESC;");

$where = null;
$condition = null;
$attended = array();
$activeRows = null;
if ($Result) {
    $attended = array();
    foreach ($Result as $Value) {
        array_push($attended, $Value[array_keys($Result[0])[0]] + 1);
    }
    $activeRows = "'" . implode("', '", $attended) . "'";
    $condition = "ORDER BY FIELD (`row_id`, $activeRows) DESC";
} else {
    for ($i = 0; $i < $_POST["maxColumnCount"]; $i++) {
        $condition .= "`$systemColumnPrefix" . ($i + 1) . "` > '' OR ";
    }
    $condition = "AND (" . substr($condition, 0, -4) . ")";
}

$where = "`row_id`!='1' $condition";
$columns = array();
$columnIndex;
for ($columnIndex = 0; $columnIndex < $maxColumnCount + 1; $columnIndex++) {
    if ($columnIndex != 0 && $listResult[0][$ColumnNames[$columnIndex]]) {
        array_push($columns, array('db' => $ColumnNames[$columnIndex], 'dt' => $columnIndex - 1));
    }
}
$columnIndex -= 2;
$specialFormCount = 1;
foreach ($specialForm as $value) {

    switch ($value["type"]) {

        case "text":
            $field = array('db' => $ColumnNames[0], 'dt' => $columnIndex, 'formatter' => function($d, $row) use ($specialFormCount) {
                    return "<input type='text' class='textInput' data-row-index='$d' data-column-index='$specialFormCount'>";
                });
            break;

        case "number":
            $field = array('db' => $ColumnNames[0], 'dt' => $columnIndex, 'formatter' => function($d, $row) use ($specialFormCount) {
                    return "<input type='number' class='numberInput' data-row-index='$d' data-column-index='$specialFormCount'>";
                });
            break;

        case "boolean":
            $field = array('db' => $ColumnNames[0], 'dt' => $columnIndex, 'formatter' => function($d, $row) use ($specialFormCount) {
                    return "<label class='switch boolean' data-row-index='$d' data-column-index='$specialFormCount'>
                                <input type='checkbox' class='booleanInput'>
                                <span class='slider round'></span>
                            </label>";
                });
            break;

        case "dropdown":
            $options = null;
            foreach ($value["values"]["options"] as $option) {
                if ($value["default"] == $option) {
                    $options .= "<option value='$option' selected>$option</option>";
                } else {
                    $options .= "<option value='$option'>$option</option>";
                }
            }
            $field = array('db' => $ColumnNames[0], 'dt' => $columnIndex, 'formatter' => function($d, $row) use ($specialFormCount, $options) {
                    return "<select class='options dropdown' data-row-index='$d' data-column-index='$specialFormCount'>$options</select>";
                });
            break;

        case "time":
            $field = array('db' => $ColumnNames[0], 'dt' => $columnIndex, 'formatter' => function($d, $row) use ($specialFormCount) {
                    return "<label class='special-field switch time' data-row-index='$d' data-column-index='$specialFormCount'>
                                <input type='checkbox' class='time-input'>
                                <span class='slider round time-switch'></span>
                            </label>";
                });
            break;

        default:
            break;
    }

    array_push($columns, $field);
    $columnIndex++;
    $specialFormCount++;
}

// Certificate link
array_push($columns, array('db' => $ColumnNames[0], 'dt' => $columnIndex, 'formatter' => function($d, $row) use ($table, $eventName) {
        $form = "<a target='_blank' href='certificate'><button type='button' class='fa fa-certificate certificate-link'></button></a>";
        return $form;
    }));

// SQL server connection information
$sql_details = array(
    'user' => $Username,
    'pass' => $Password,
    'db' => $DatabaseName,
    'host' => $Host
);


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * If you just want to use the basic configuration for DataTables with PHP
 * server-side, there is no need to edit below this line.
 */

require( 'Quickclass.php' );

echo json_encode(
        Quickclass::quickform($_POST, $sql_details, $table, $primaryKey, $columns, $where)
);
