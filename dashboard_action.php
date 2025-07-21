<?php
session_start();
include 'koneksi.php';
include 'csrf.php';

$db1 = $dbMaster;

function anti($text)
{
    return $id = stripslashes(strip_tags(htmlspecialchars($text, ENT_QUOTES)));
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "update_state") {
    // $id = anti($_POST['id']);
    $classroom_name = anti($_POST['classroom_name']);
    $class_state = anti($_POST['class_state']);

    // if ($classroom_name != "") {
    $query = "UPDATE classroom SET class_state=? WHERE classroom_name=?";
    $dewan1 = $db1->prepare($query);
    $dewan1->bind_param("ss", $class_state, $classroom_name);
    $dewan1->execute();
    $success_state = $dewan1->affected_rows;
    // $error_state = $dewan1->error;

    if ($class_state == "Aktif") {
        $activity = "Ruang kelas " . $classroom_name . " dibuka";
        $category = "openClass";
    }
    if ($class_state == "Tidak Aktif") {
        $activity = "Selesai merekam kelas " . $classroom_name;
        $category = "recordedClass";
    }

    $user = $_SESSION['username'];

    $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, CURRENT_TIMESTAMP()+110000, ?)";
    $dewan2 = $db1->prepare($query);
    $dewan2->bind_param("sss", $activity, $category, $user);
    $dewan2->execute();

    // // $success_state = $dewan2->affected_rows;
    $error_state = $dewan2->error;

    // if ($id != "") {
    //     $query = "UPDATE classroom SET class_state=? WHERE id=?";
    //     $dewan1 = $db1->prepare($query);
    //     $dewan1->bind_param("si", $class_state, $id);
    //     $dewan1->execute();
    // }
    if ($success_state > 0) {
        if ($class_state == "Aktif") {
            echo json_encode(['code' => 200, 'status' => 'success', 'message' => 'Ruang Kelas Sudah Dibuka']);
        }

        if ($class_state == "Tidak Aktif") {
            echo json_encode(['code' => 200, 'status' => 'success', 'message' => 'Ruang Kelas Ditutup']);
        }
    }

    // echo json_encode($user);
    if ($error_state) {
        echo json_encode(['code' => 400, 'status' => 'error', 'message' => $error_state]);
    }
}


if (isset($_POST['jenis']) && $_POST['jenis'] == "classroom_card") {
    $instance = anti($_POST['instansi']);

    $query = "SELECT * FROM classroom WHERE instansi=? ORDER BY id DESC";
    $qS = $db1->prepare($query);
    $qS->bind_param('s', $instance);
    $qS->execute();
    $rS = $qS->get_result();
    while ($rowS = $rS->fetch_assoc()) {
        $data[] = $rowS;
    }

    echo json_encode($data);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "class_chart") {
    $instance = anti($_POST['instansi']);
    $query = "SELECT * FROM classroom WHERE instansi=? ORDER BY class_name ASC";
    $qS = $db1->prepare($query);
    $qS->bind_param('s', $instance);
    $qS->execute();
    $rS = $qS->get_result();
    while ($rowS = $rS->fetch_assoc()) {
        $data[] = $rowS;
    }

    echo json_encode($data);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "recapitulation") {
    $instance = anti($_POST['instansi']);

    $query = "SELECT classroom_name FROM classroom WHERE instansi=? ORDER BY id DESC";
    $qS = $db1->prepare($query);
    $qS->bind_param('s', $instance);
    $qS->execute();
    $rS = $qS->get_result();
    while ($rowS1 = $rS->fetch_assoc()) {
        $data['classroom_name'][] = $rowS1['classroom_name'];
    }
    // echo json_encode($data);
    // return false;

    if ($data == null) {
        echo json_encode($data);
        return false;
    }

    // overview pertemuan
    for ($i = 0; $i < count($data['classroom_name']); $i++) {
        $query = "SELECT count(pertemuan_ke) FROM pertemuan WHERE classroom_name=? AND instansi=? ORDER BY id DESC";
        $qS1 = $db1->prepare($query);
        $qS1->bind_param('ss', $data['classroom_name'][$i], $instance);
        $qS1->execute();
        $rS1 = $qS1->get_result();
        while ($rowS2 = $rS1->fetch_assoc()) {
            $data['count_meet'][] = $rowS2['count(pertemuan_ke)'];
        }
    }

    for ($j = 0; $j < count($data['classroom_name']); $j++) {
        $query = "SELECT nilai_akhir FROM nilai_siswa WHERE classroom_name=? AND instansi=? ORDER BY id DESC";
        $qS2 = $db1->prepare($query);
        $qS2->bind_param('ss', $data['classroom_name'][$j], $instance);
        $qS2->execute();
        $rS2 = $qS2->get_result();
        while ($rowS3 = $rS2->fetch_assoc()) {
            $data['nilai'][] = $rowS3['nilai_akhir'];
        }
    }

    // $time_now = timeNow();
    // $data['time_now'] = $time_now;

    echo json_encode($data);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "feeds") {
    $query = "SELECT * FROM activity_log ORDER BY id DESC";
    $qS = $db1->prepare($query);
    $qS->execute();
    $rS = $qS->get_result();
    while ($rowS = $rS->fetch_assoc()) {
        $data[] = $rowS;
    }
    echo json_encode($data);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "setselectins") {
    $query = "SELECT instansi FROM list_instansi ORDER BY instansi ASC";
    $qS = $db1->prepare($query);
    $qS->execute();
    $rS = $qS->get_result();
    while ($rowS = $rS->fetch_assoc()) {
        $data[] = $rowS;
    }
    echo json_encode($data);
}
