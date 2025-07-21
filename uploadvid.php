<?php
include "koneksi.php";
include "csrf.php";

$file = $_FILES['file']['tmp_name'];
$title = $_POST['title'];

chdir("../../../video");
// $target_dir = "admin/";

if (!is_dir('admin')) {
    mkdir('admin');
}

chdir("admin");

$move = move_uploaded_file($file, $title . '.mp4');

// $d = dir(getcwd());
// while (($cont = $d->read()) !== false) {
//     $data['test'][] = $cont;
// }

$data['file'] = $file;
$data['title'] = $title;
$data['move'] = $move;
$data['dir'] = getcwd();

echo json_encode($data);
chdir(dirname(__FILE__));
