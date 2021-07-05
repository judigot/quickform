<?php

Class Database {

    public static function connect($host, $databaseName, $username, $password) {
        try {
            $connection = new PDO("mysql:host={$host};dbname={$databaseName};charset=utf8", $username, $password, [PDO::MYSQL_ATTR_LOCAL_INFILE => true]);
            return $connection;
        } catch (PDOException $exception) {
            return null;
        }
    }

    public static function disconnect($connection) {
        $connection = null;
    }

    public static function execute($connection, $sql) {
        $preparedStatement = $connection->prepare($sql);
        $preparedStatement->execute();
    }

    public static function create($connection, $tableName, $column, $data) {
        $sql = "INSERT INTO `" . $tableName . "` (";
        foreach ($column as $value) {
            $sql = $sql . "`" . $value . "`, ";
        }
        $sql = substr($sql, 0, -2) . ") VALUES (";
        foreach ($data as $value) {
            if ($value != null) {
                $sql = $sql . $connection->quote(utf8_encode($value)) . ", ";
            } else {
                $sql = substr($sql, 0, -1) . " NULL, ";
            }
        }
        $sql = substr($sql, 0, -2) . ");";
        $preparedStatement = $connection->prepare($sql);
        $preparedStatement->execute();
    }

    public static function read($connection, $sql) {
        $preparedStatement = $connection->prepare($sql);
        $preparedStatement->execute();
        $result = $preparedStatement->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public static function update($connection, $tableName, $targetColumn, $newValue, $referenceColumn, $referenceValue) {
        if ($newValue != null) {
            $newValue = $connection->quote($newValue);
        } else {
            $newValue = "NULL";
        }
        if ($referenceColumn == null) {
            $sql = "UPDATE `$tableName` SET `$targetColumn` = $newValue;";
        } else {
            $reference = is_array($referenceValue) ? implode("', '", $referenceValue) : $referenceValue;
            $sql = "UPDATE `$tableName` SET `$targetColumn` = $newValue WHERE `$tableName`.`$referenceColumn` IN ('$reference');";
        }
        $preparedStatement = $connection->prepare($sql);
        $preparedStatement->execute();
    }

    public static function delete($connection, $tableName, $referenceColumn, $referenceValue) {
        $reference = is_array($referenceValue) ? implode("', '", $referenceValue) : $referenceValue;
        $sql = "DELETE FROM `" . $tableName . "` WHERE `" . $referenceColumn . "` IN ('$reference');";
        $preparedStatement = $connection->prepare($sql);
        $preparedStatement->execute();
        return $preparedStatement->rowCount();
    }

    public static function duplicate($connection, $tableName, $referenceColumn, $referenceValue, $incrementColumn, $incrementString) {
        $sql = "CREATE TEMPORARY TABLE `temp` SELECT * FROM `{$tableName}` WHERE `{$referenceColumn}`='{$referenceValue}';
		SELECT @newPK := (SELECT `{$referenceColumn}` FROM `{$tableName}` ORDER BY `{$referenceColumn}` DESC LIMIT 1)+1, @oldValue := (SELECT `{$incrementColumn}` FROM `{$tableName}` WHERE `{$referenceColumn}`='{$referenceValue}');
                UPDATE `temp` SET `{$referenceColumn}`=@newPK, `{$incrementColumn}`=CONCAT('{$incrementString}', @oldValue) WHERE `{$referenceColumn}`='{$referenceValue}';
                INSERT INTO `{$tableName}` SELECT * FROM `temp` WHERE `{$referenceColumn}`=@newPK;";
        $preparedStatement = $connection->prepare($sql);
        $preparedStatement->execute();
    }

}
