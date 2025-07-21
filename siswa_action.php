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

// if (isset($_POST['jenis']) && $_POST['jenis'] == "view_data") {
//     $kelas = '%' . anti($_POST['kelas']) . '%';
//     $keyword = '%' . anti($_POST['keyword']) . '%';

//     $query = "SELECT * FROM siswa WHERE kelas LIKE ? AND nama LIKE ? ORDER BY nama ASC";
//     $qSelect = $db1->prepare($query);
//     $dewan1->bind_param('ss', $kelas, $keyword);
//     $qSelect->execute();
//     $resSel = $qSelect->get_result();
//     while ($rowSel = $resSel->fetch_assoc()) {
//         $data[] = $rowSel;
//     }
//     echo json_encode($data);
// }

// with join
if (isset($_POST['jenis']) && $_POST['jenis'] == "view_data") {
    $mapel = '%' . anti($_POST['mapel']) . '%';
    $kelas = '%' . anti($_POST['kelas']) . '%';
    $keyword = '%' . anti($_POST['keyword']) . '%';
    $instance = anti($_POST['instansi']);

    // echo json_encode($instance);
    // return false;

    $query = "SELECT s.*, n.*, c.course_name 
      FROM ((siswa AS s
      INNER JOIN nilai_siswa AS n ON s.nis = n.id_siswa)
      INNER JOIN classroom AS c ON n.classroom_name = c.classroom_name)
      WHERE s.kelas LIKE ? AND s.nama LIKE ? AND c.course_name LIKE ? AND c.instansi=?
      ORDER BY s.nama ASC";

    $qSelect = $db1->prepare($query);
    $qSelect->bind_param('ssss', $kelas, $keyword, $mapel, $instance);
    $qSelect->execute();
    $resSel = $qSelect->get_result();
    while ($rowSel = $resSel->fetch_assoc()) {
        $data[] = $rowSel;
    }
    echo json_encode($data);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "view_data_by_id") {
    $nis = anti($_POST['nis']);
    $instance = anti($_POST['instansi']);
    $classroom_name = anti($_POST['classroom']);
    $id_p = '%' . $classroom_name . '%';

    //ambil dari penilaian, where id_siswa
    $query = "SELECT * FROM penilaian WHERE id_siswa=? AND instansi=? AND id_pertemuan LIKE ?";
    $qS1 = $db1->prepare($query);
    $qS1->bind_param('iss', $nis, $instance, $id_p);
    $qS1->execute();
    $rS1 = $qS1->get_result();
    while ($rowS1 = $rS1->fetch_assoc()) {
        $data[] = $rowS1;
    }
    echo json_encode($data);
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "tambah_data") {
    $nama = anti($_POST['nama']);
    $jenkel = anti($_POST['jenkel']);
    $nis = anti($_POST['nis']);
    $kelas = anti($_POST['kelas']);
    $email = anti($_POST['email']);

    $temp = "/foto/";
    if (isset($_FILES['foto']['tmp_name'])) {
        $fileupload     = $_FILES['foto']['tmp_name'];
        $ImageName      = $_FILES['foto']['name'];
        $acak           = rand(11111111, 99999999);
        $ImageExt       = substr($ImageName, strrpos($ImageName, '.'));
        $ImageExt       = str_replace('.', '', $ImageExt);
        $ImageName      = preg_replace("/\.[^.\s]{3,4}$/", "", $ImageName);
        $NewImageName   = str_replace(' ', '', $acak . '.' . $ImageExt);
        $foto           = $temp . $NewImageName;
        move_uploaded_file($fileupload, $temp . $NewImageName);
    } else {
        $foto = "/foto/no-pic.jpg";
    }
    //JIKA INGIN VALIDASI DI BACKEND/PHP 

    $query = "INSERT into siswa (nama, jenis_kelamin, nis, kelas, email, foto) VALUES (?, ?, ?, ?, ?, ?)";
    $qInsert = $db1->prepare($query);
    $qInsert->bind_param("ssssss", $nama, $jenkel, $nis, $kelas, $email, $foto);
    $qInsert->execute();
    $qInsert_s = $qInsert->affected_rows;

    $user = $_SESSION['username'];
    $time_now = timeNow();

    if ($qInsert_s > 0) {
        $activity = $nama . " berhasil ditambahkan di " . $kelas;
        $category = "newStudent";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 200, 'status' => 'success', 'message' => $activity]);
    } else {
        $activity = $nama . " gagal ditambahkan di " . $kelas;
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
    $nama = anti($_POST['nama']);
    $jenkel = anti($_POST['jenkel']);
    $nis = anti($_POST['nis']);
    $kelas = anti($_POST['kelas']);
    $email = anti($_POST['email']);

    if ($id == '1') {
        exit(json_encode(['code' => 400, 'status' => 'error', 'message' => 'Data Master Tidak bisa Diubah']));
    }

    $temp = "/foto/";
    if (isset($_FILES['foto']['tmp_name'])) {
        $fileupload     = $_FILES['foto']['tmp_name'];
        $ImageName      = $_FILES['foto']['name'];
        $acak           = rand(11111111, 99999999);
        $ImageExt       = substr($ImageName, strrpos($ImageName, '.'));
        $ImageExt       = str_replace('.', '', $ImageExt);
        $ImageName      = preg_replace("/\.[^.\s]{3,4}$/", "", $ImageName);
        $NewImageName   = str_replace(' ', '', $acak . '.' . $ImageExt);
        $foto           = $temp . $NewImageName;
        move_uploaded_file($fileupload, $temp . $NewImageName);

        if (anti($_POST['foto_lama']) != "" && $_POST['foto_lama'] != "/foto/no-pic.jpg") {
            unlink($_POST['foto_lama']);
        }
    } else {
        $foto = anti($_POST['foto_lama']);
    }

    $query = "UPDATE siswa SET nama=?, jenis_kelamin=?, nis=?, kelas=?, email=?, foto=? WHERE id=?";
    $qUpdate = $db1->prepare($query);
    $qUpdate->bind_param("ssssssi", $nama, $jenkel, $nis, $kelas, $email, $foto, $id);
    $qUpdate->execute();
    $qUpdate_s = $qUpdate->affected_rows;

    $user = $_SESSION['username'];
    $time_now = timeNow();

    if ($qInsert_s > 0) {
        $activity = "Data " . $nama . " berhasil diperbarui";
        $category = "editedStudent";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 200, 'status' => 'success', 'message' => $activity]);
    } else {
        $activity = "Data " . $nama . " gagal diperbarui";
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

    $query = "SELECT * FROM siswa WHERE id=? LIMIT 1";
    $qSelect = $db1->prepare($query);
    $qSelect->bind_param('i', $id);
    $qSelect->execute();
    $resSel = $qSelect->get_result();
    while ($rowSel = $resSel->fetch_assoc()) {
        $foto = $rowSel['foto'];
        if ($foto != "/foto/no-pic.jpg") {
            unlink($foto);
        }
        $nama = $rowSel['nama'];
        $kelas = $rowSel['kelas'];
    }

    $query = "DELETE FROM siswa WHERE id=?";
    $qDelete = $db1->prepare($query);
    $qDelete->bind_param("i", $id);
    $qDelete->execute();
    $qDelete_s = $qDelete->affected_rows;

    $user = $_SESSION['username'];
    $time_now = timeNow();

    if ($qDelete_s > 0) {
        $activity = $nama . " berhasil dihapus dari " . $kelas;
        $category = "deletedStudent";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 200, 'status' => 'success', 'message' => $activity]);
    } else {
        $activity = $nama . " gagal dihapus dari " . $kelas;
        $category = "error";

        $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
        $qLog = $db1->prepare($query);
        $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
        $qLog->execute();

        echo json_encode(['code' => 400, 'status' => 'error', 'message' => $activity]);
    }
}

if (isset($_POST['jenis']) && $_POST['jenis'] == "edit_nilai") {
    $id = anti($_POST['id']);
    $nilai = anti($_POST['nilai']);

    if (empty($nilai)) {
        echo json_encode(['code' => 400, 'status' => 'error', 'message' => 'Nilai tidak ada isinya']);
    } else {
        $query = "UPDATE siswa SET nilai=? WHERE id=?";
        $qUpdate = $db1->prepare($query);
        $qUpdate->bind_param('si', $nilai, $id);
        $qUpdate->execute();
        $qUpdate_s = $qUpdate->affected_rows;

        if ($qUpdate_s > 0) {
            $query = "SELECT nama FROM siswa WHERE id=?";
            $qSelect = $db1->prepare($query);
            $qSelect->bind_param('i', $id);
            $qSelect->execute();
            $resSel = $qSelect->get_result();
            $rowSel = $resSel->fetch_assoc();
            $nama = $rowSel['nama'];

            $user = $_SESSION['username'];
            $time_now = timeNow();

            if ($nama) {
                $activity = "Nilai " . $nama . " berhasil diperbarui";
                $category = "editedScore";

                $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
                $qLog = $db1->prepare($query);
                $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
                $qLog->execute();

                echo json_encode(['code' => 200, 'status' => 'success', 'message' => $activity]);
            } else {
                $activity = $nama . " tidak ada di database";
                $category = "error";

                $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
                $qLog = $db1->prepare($query);
                $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
                $qLog->execute();

                echo json_encode(['code' => 400, 'status' => 'error', 'message' => $activity]);
            }
        } else {
            $activity = "Nilai " . $nama . " gagal diperbarui";
            $category = "error";

            $query = "INSERT into activity_log (activity, category, waktu, user) VALUES (?, ?, ?, ?)";
            $qLog = $db1->prepare($query);
            $qLog->bind_param("ssss", $activity, $category, $time_now, $user);
            $qLog->execute();

            echo json_encode(['code' => 400, 'status' => 'error', 'message' => $activity]);
        }
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
