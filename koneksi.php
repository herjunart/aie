<?php



define('HOST', 'localhost');

define('USER', 'beaisuny_aie');

define('PASS', 'aiebrainsuny');



define('DB0', 'beaisuny_aie');

$dbMaster = new mysqli(HOST, USER, PASS, DB0);



if ($dbMaster->connect_errno) {

    echo "Failed to connect to MySQL: " . $dbMaster->connect_error;

    exit();

}

