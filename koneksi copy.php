<?php

define('HOST', 'localhost');
define('USER', 'u6799722_aicovid');
define('PASS', 'klHwDgSh5pIVXCtv');

define('DB1', 'u6799722_aicovid');
$dbMaster = new mysqli(HOST, USER, PASS, DB1);

// define('HOST', 'sql208.epizy.com');
// define('USER', 'epiz_28728626');
// define('PASS', 'u16Vomre9YXu');

// define('DB1', 'epiz_28728626_thesis');
// $dbMaster = new mysqli(HOST, USER, PASS, DB1);

// define('DB2', 'epiz_28728626_SMAN11YK');
// $dbEleven = new mysqli(HOST, USER, PASS, DB2);

//connection into the database
$conn = mysqli_connect(HOST, USER, PASS, DB1);
if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    exit();
}
// function query($query)
// {
//     global $conn;
//     $result = mysqli_query($conn, $query);
//     $rows = [];
//     while ($row = mysqli_fetch_assoc($result)) {
//         $rows[] = $row;
//     }
//     return $rows;
// }
