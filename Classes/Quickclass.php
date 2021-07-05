<?php

require_once 'ssp.class.php';

class Quickclass extends SSP {

    static function quickform($request, $conn, $table, $primaryKey, $columns, $whereResult = null, $whereAll = null) {
        $bindings = array();
        $db = self::db($conn);
        $localWhereResult = array();
        $localWhereAll = array();
        $whereAllSql = '';

        // Build the SQL query string from the request
        $limit = self::limit($request, $columns);
        $order = self::order($request, $columns);
        $where = self::filter($request, $columns, $bindings);

        $whereResult = self::_flatten($whereResult);
        $whereAll = self::_flatten($whereAll);

        if ($whereResult) {
            $where = $where ?
                    $where . ' AND ' . $whereResult :
                    'WHERE ' . $whereResult;
        }

        if ($whereAll) {
            $where = $where ?
                    $where . ' AND ' . $whereAll :
                    'WHERE ' . $whereAll;

            $whereAllSql = 'WHERE ' . $whereAll;
        }

        // Main query to actually get the data
        $data = self::sql_exec($db, $bindings, "SELECT `" . implode("`, `", self::pluck($columns, 'db')) . "`
			 FROM `$table`
			 $where
			 $limit"
        );

        // Data set length after filtering
        $resFilterLength = self::sql_exec($db, $bindings, "SELECT COUNT(`{$primaryKey}`)
			 FROM   `$table`
			 $where"
        );
        $recordsFiltered = $resFilterLength[0][0];

        // Total data set length
        $resTotalLength = self::sql_exec($db, $bindings, "SELECT COUNT(`{$primaryKey}`)
			 FROM   `$table` " .
                        $whereAllSql
        );
        $recordsTotal = $resTotalLength[0][0];

        /*
         * Output
         */
        return array(
            "draw" => isset($request['draw']) ?
            intval($request['draw']) :
            0,
            "recordsTotal" => intval($recordsTotal),
            "recordsFiltered" => intval($recordsFiltered),
            "data" => self::data_output($columns, $data)
        );
    }

}
