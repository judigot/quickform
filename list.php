<?php require_once 'Imports/preload.php'; ?>
<?php

require_once 'Classes/global.php';
require_once 'Classes/Database.php';

$isCreateList = null;
$Connection = Database::Connect($Host, $DatabaseName, $Username, $Password);
if (isset($_POST["createList"])) {
    $isCreateList = "true";
    $defaultName = "Untitled list";
    $defaultValue = "NULL";
    $allowedColumnSize = 26;
    $allowedRowSize = 100;
    //=====Insert list=====//
    $Column = array("user_id", "list_name");
    $Data = array($_SESSION["user"]["user_id"], $defaultName);
    Database::create($Connection, $listMasterTableName, $Column, $Data);
    //=====Insert list=====//
    //=====Create table=====//
    $Result = Database::read($Connection, "SELECT LAST_INSERT_ID() FROM `$listMasterTableName` WHERE `user_id`='{$_SESSION['user']["user_id"]}'");
    $tableName = $listColumnPrefix . $Result[0]["LAST_INSERT_ID()"];
    $SQL = "CREATE TABLE `$tableName` (row_id INT(11) PRIMARY KEY AUTO_INCREMENT, ";
    for ($i = 0; $i < $allowedColumnSize; $i++) {
        $SQL = $SQL . "`$systemColumnPrefix" . ($i + 1) . "` VARCHAR(255) NULL, ";
    }
    $SQL = substr($SQL, 0, -2) . ");";
    Database::execute($Connection, $SQL);
    //=====Create table=====//
    //=====Insert values to table=====//
    $SQL = "INSERT INTO `$tableName` VALUES ";
    for ($i = 0; $i < $allowedRowSize; $i++) {
        $SQL = $SQL . "('', ";
        for ($j = 0; $j < $allowedColumnSize; $j++) {
            $SQL = $SQL . "$defaultValue, ";
        }
        $SQL = substr($SQL, 0, -2) . "), ";
    }
    $SQL = substr($SQL, 0, -2) . ";";
    Database::execute($Connection, $SQL);
    //=====Insert values to table=====//
    $listId = $Result[0]["LAST_INSERT_ID()"];
}
if (isset($_GET["listId"])) {
    $isCreateList = "false";
    $listId = $_GET["listId"];
}
if (isset($listId) && $Connection != null) {
    $listName = Database::read($Connection, "SELECT `list_name` FROM `$listMasterTableName` WHERE `list_id`=$listId;");
    ?>
    <!DOCTYPE html>
    <html lang="en">

        <head>
            <?php include 'Imports/top.php'; ?>
            <link href="Assets/css/listSyle.css" rel="stylesheet" type="text/css"/>
            <script src="Assets/js/listSyle.js" type="text/javascript"></script>
            <script src="Assets/js/viewList.js" type="text/javascript"></script>
        </head>

        <body>
            <!--View selected list-->
            <div class="content" data-create-list="<?php echo $isCreateList; ?>" data-list-id="<?php echo $listId; ?>">
                <p class="list-info"><i class="fa fa-list-ul" aria-hidden="true"></i>&nbsp<span class="list-name"><?php echo isset($listName[0]["list_name"]) ? $listName[0]["list_name"] : false; ?></span>&nbsp&nbsp<span class="update-progress"></span></p>
                <?php
                $tableName = $listColumnPrefix . $listId;
                $Result = Database::read($Connection, "SELECT * FROM `$tableName`;");
                if ($Result) {
                    $ColumnNames = array_keys($Result[0]);
                    array_shift($ColumnNames);
                    $columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
                    ?>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr><?php for ($i = 0; $i < sizeOf($ColumnNames); $i++) { ?><th id="<?php echo str_replace("q_col_", "", $ColumnNames[$i]); ?>"><?php echo $columns[$i]; ?></th><?php } ?> </tr>
                            </thead>    
                            <tbody class="list-data">
                                <?php
                                $ColumnNames = array_keys($Result[0]);
                                foreach ($Result as $Value) {
                                    ?>
                                    <tr>
                                        <?php
                                        for ($i = 1; $i < 27; $i++) {
                                            ?>
                                            <td><input type="text"<?php echo isset($ColumnNames[$i]) ? ' value="' . $Value[$ColumnNames[$i]] . '"' : ""; ?>></td>
                                            <?php
                                        }
                                        ?>
                                    </tr>
                                    <?php
                                }
                                ?>
                            </tbody>
                        </table>
                    </div>
                    <?php
                } else {
                    ?>
                    <div id="list-error">
                        <h1 class="list-error-title">List error title.</h1>
                        <p class="list-error-dscrptn">List error description.</p>
                    </div>
                    <?php
                }
                Database::disconnect($Connection);
                ?>
            </div>
            <div id="instruction" class="modal" role="dialog">
                <div class="modal-dialog">
                    <div class="title-bar">
                        <div>
                            <span class="window-title">Quickinfo</span>
                            <span class="title-bar-controls">
                                <span data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i></span>
                            </span>
                        </div>
                    </div>
                    <div class="modal-content">
                        <div class="modal-body">
                            <h1 class="quickinfo">Quickinfo</h1>
                            <div class="guide-content">
                                <h4 class="format-label">List format guidelines:</h4>
                                <ul>
                                    <li>The first row is called the <strong data-toggle="tooltip" data-placement="bottom" data-original-title="The table header in the attendance table">list header</strong> and should only consist of column names<br>
                                        <img src="Assets/images/info/1.png" alt=""/>
                                    </li>
                                    <hr>
                                    <li><strong data-toggle="tooltip" data-placement="bottom" data-original-title="The actual data that will be shown in the attendance table">Row content</strong> should not exceed the list header. If so, the extra cells will be disregarded during the attendance<br>
                                        <img src="Assets/images/info/2.png" alt=""/>
                                    </li>
                                    <hr>
                                    <li>Columns can be rearranged according to your liking<br>
                                        <img src="Assets/images/info/3.gif" alt=""/>
                                    </li>
                                </ul>
                                <br>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;That's pretty much all you need to know. Quick isn't it?</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn green" data-dismiss="modal">Got it!</button>
                        </div>
                    </div>
                </div>
            </div>
            <?php include 'Imports/bottom.php'; ?>
        </body>

    </html>
    <?php
} else {
    $projectRoot = str_replace($_SERVER['DOCUMENT_ROOT'], "", str_replace(chr(92), "/", getcwd())) . "/";
//    header("Location: {$projectRoot}home");
}