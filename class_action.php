<?php
session_start();
include 'koneksi.php';
include 'csrf.php';

$db1 = $dbMaster;

function anti($text)
{
    return $id = stripslashes(strip_tags(htmlspecialchars($text, ENT_QUOTES)));
}


function timeNow()
{
    date_default_timezone_set("Asia/Jakarta");
    $realtime = date("Y-m-d H:i:s");

    return $realtime;
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "view_data") {
    $kelas = '%' . anti($_POST['kelas']) . '%';
    $mapel = '%' . anti($_POST['mapel']) . '%';
    $keyword = '%' . anti($_POST['keyword']) . '%';
    $instance = anti($_POST['instansi']);

    $query = "SELECT * FROM classroom WHERE class_name LIKE ? AND course_name LIKE ? AND classroom_name LIKE ? AND instansi=? ORDER BY id DESC";
    $qSelect = $db1->prepare($query);
    $qSelect->bind_param('ssss', $kelas, $mapel, $keyword, $instance);
    $qSelect->execute();
    $resSel = $qSelect->get_result();
    while ($rowSel = $resSel->fetch_assoc()) {
        $data[] = $rowSel;
    }
    echo json_encode($data);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "view_data_by_id") {
    $id = anti($_POST['id']);

    $query = "SELECT classroom_name FROM classroom WHERE id=?";
    $qSelect = $db1->prepare($query);
    $qSelect->bind_param('i', $id);
    $qSelect->execute();
    $resSel = $qSelect->get_result();
    $rowSel = $resSel->fetch_assoc();
    $classroom_name = $rowSel['classroom_name'];

    //ambil dari pertemuan, where classroom_name
    $query = "SELECT * FROM pertemuan WHERE classroom_name=?";
    $qSelect1 = $db1->prepare($query);
    $qSelect1->bind_param('s', $classroom_name);
    $qSelect1->execute();
    $resSel1 = $qSelect1->get_result();
    while ($rowSel1 = $resSel1->fetch_assoc()) {
        $data[] = $rowSel1;
    }
    echo json_encode($data);
    // while ($row = $res1->fetch_assoc()) {
    //     $h['id'] = $row["id"];
    //     $h['classroom_name'] = $row["classroom_name"];
    //     $h['course_name'] = $row["course_name"];
    //     $h['class_name'] = $row["class_name"];
    //     $h['enroll_key'] = $row["enroll_key"];
    //     $h['num_join'] = $row["num_join"];
    //     $h['class_state'] = $row["class_state"];
    // }
    // echo json_encode($h);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "tambah_data") {
    $classroom_name = anti($_POST['classroom_name']);
    $course_name = anti($_POST['course_name']);
    $class_name = anti($_POST['class_name']);
    $enroll_key = anti($_POST['enroll_key']);
    $instance = anti($_POST['instansi']);

    $query = "INSERT into classroom (classroom_name, course_name, class_name, enroll_key, instansi) VALUES (?, ?, ?, ?, ?)";
    $qInsert = $db1->prepare($query);
    $qInsert->bind_param("sssss", $classroom_name, $course_name, $class_name, $enroll_key, $instance);
    $qInsert->execute();
    $qInsert_s = $qInsert->affected_rows;

    $user = $_SESSION['username'];
    $time_now = timeNow();

    if ($qInsert_s > 0) {
        $activity = "Ruang kelas " . $classroom_name . " berhasil ditambahkan";
        $category = "newClass";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 200, 'status' => 'success', 'message' => $activity]);
    } else {
        $activity = "Ruang kelas " . $classroom_name . " gagal ditambahkan";
        $category = "error";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 400, 'status' => 'error', 'message' => $activity]);
    }
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "edit_data") {
    $id = anti($_POST['id']);
    $classroom_name = anti($_POST['classroom_name']);
    $course_name = anti($_POST['course_name']);
    $class_name = anti($_POST['class_name']);
    $enroll_key = anti($_POST['enroll_key']);
    // $instance = anti($_POST['instansi']);
    // $num_join = anti($_POST['num_join']);
    // $class_state = anti($_POST['class_state']);

    if ($id == '1') {
        exit(json_encode(['code' => 400, 'status' => 'error', 'message' => 'Data Master Tidak bisa Diubah']));
    }

    $query = "UPDATE classroom SET classroom_name=?, course_name=?, class_name=?, enroll_key=? WHERE id=?";
    $qUpdate = $db1->prepare($query);
    $qUpdate->bind_param("ssssi", $classroom_name, $course_name, $class_name, $enroll_key, $id);
    $qUpdate->execute();
    $qUpdate_s = $qUpdate->affected_rows;

    $user = $_SESSION['username'];
    $time_now = timeNow();

    if ($qUpdate_s > 0) {
        $activity = "Ruang kelas " . $classroom_name . " berhasil diperbarui";
        $category = "editedClass";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 200, 'status' => 'success', 'message' => $activity]);
    } else {
        $activity = "Ruang kelas " . $classroom_name . " gagal diperbarui";
        $category = "error";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 400, 'status' => 'error', 'message' => $activity]);
    }
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "delete_data") {
    $id = anti($_POST['id']);

    if ($id == '1') {
        exit(json_encode(['code' => 400, 'status' => 'error', 'message' => 'Data Master Tidak bisa Dihapus']));
    }

    $query = "SELECT classroom_name FROM classroom WHERE id=?";
    $qSelect = $db1->prepare($query);
    $qSelect->execute();
    $qSelect->bind_param('i', $id);
    $resSel = $qSelect->get_result();
    $rowSel = $resSel->fetch_assoc();
    $classroom_name = $rowSel['classroom_name'];

    $query = "DELETE FROM classroom WHERE id=?";
    $qDelete = $db1->prepare($query);
    $qDelete->bind_param("i", $id);
    $qDelete->execute();
    $qDelete_s = $qDelete->affected_rows;

    $user = $_SESSION['username'];
    $time_now = timeNow();

    if ($qDelete_s > 0) {
        $activity = "Ruang kelas " . $classroom_name . " berhasil dihapus";
        $category = "deletedClass";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 200, 'status' => 'success', 'message' => $activity]);
    } else {
        $activity = "Ruang kelas " . $classroom_name . " gagal dihapus";
        $category = "error";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 400, 'status' => 'error', 'message' => $activity]);
    }
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

if (isset($_POST['jenis']) && $_POST['jenis'] == "setselectclass") {
    $instance = anti($_POST['instansi']);

    $query = "SELECT id_instansi FROM list_instansi WHERE instansi=?";
    $qS = $db1->prepare($query);
    $qS->bind_param('s', $instance);
    $qS->execute();
    $rS = $qS->get_result();
    $rowS = $rS->fetch_assoc();
    $id_instance = $rowS['id_instansi'];

    // echo json_encode($instance);
    // return false;

    $query = "SELECT * FROM list_kelas WHERE id_instansi=? ORDER BY kelas ASC";
    $qS1 = $db1->prepare($query);
    $qS1->bind_param('s', $id_instance);
    $qS1->execute();
    $rS1 = $qS1->get_result();
    while ($rowS1 = $rS1->fetch_assoc()) {
        $data[] = $rowS1;
    };

    echo json_encode($data);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "setselectcourse") {
    $instance = anti($_POST['instansi']);

    $query = "SELECT id_instansi FROM list_instansi WHERE instansi=?";
    $qS = $db1->prepare($query);
    $qS->bind_param('s', $instance);
    $qS->execute();
    $rS = $qS->get_result();
    $rowS = $rS->fetch_assoc();
    $id_instance = $rowS['id_instansi'];

    // echo json_encode($id_instance);
    // return false;

    $query = "SELECT * FROM list_course WHERE id_instansi=? ORDER BY course_name ASC";
    $qS1 = $db1->prepare($query);
    $qS1->bind_param('s', $id_instance);
    $qS1->execute();
    $rS1 = $qS1->get_result();
    while ($rowS1 = $rS1->fetch_assoc()) {
        $data[] = $rowS1;
    };

    echo json_encode($data);
}
