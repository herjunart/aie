<?php
// Count total files
$countfiles = count($_FILES['files']['name']);

if (isset($_POST['type']) && $_POST['type'] != "") {
    // Base upload directory
    if ($_POST['type'] == "upload") {
        $base_location = "upload/";
    } else if ($_POST['type'] == "update") {
        $base_location = "baseml/";
    }
}

// To store uploaded files path
$files_arr = array();

// Loop all files
for ($index = 0; $index < $countfiles; $index++) {

    if (isset($_FILES['files']['name'][$index]) && $_FILES['files']['name'][$index] != '') {
        // File name
        $filename = $_FILES['files']['name'][$index];

        // Get extension
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        // Valid image extension
        $valid_ext = array("json", "bin");

        // Check extension
        if (in_array($ext, $valid_ext)) {

            //check subfolder
            if (strchr($filename, "dataset")) {
                $upload_location = $base_location . "dataset/";
            } else if (strchr($filename, "model")) {
                $upload_location = $base_location . "model/";
            }

            // File path
            $path = $upload_location . $filename;

            // Upload file
            if (move_uploaded_file($_FILES['files']['tmp_name'][$index], $path)) {
                $files_arr[] = $path;
            }
        }
    }
}

echo json_encode($files_arr);
die;
