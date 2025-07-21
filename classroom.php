<?php

// include 'auth.php';

// <?= $_SESSION['csrf_token'] 



// memulai sesi

session_start();

include 'koneksi.php';



//checking cookie

if (isset($_COOKIE['id']) && isset($_COOKIE['key'])) {

    $id = $_COOKIE['id'];

    $key = $_COOKIE['key'];



    //take user id based on id

    $result = mysqli_query($conn, "SELECT * FROM users WHERE id = $id");

    $row = mysqli_fetch_assoc($result);



    //checking cookie and username

    if ($key === hash('sha256', $row['username'])) {

        $_SESSION['login'] = true;

        $_SESSION['fullname'] = $row['fullname'];

        $_SESSION['role'] = $row['role'];

        $_SESSION['username'] = $row['username'];

        $_SESSION['etc'] = $row['etc'];

        $_SESSION['picture'] = $row['picture'];

        $_SESSION['instansi'] = $row['instansi'];
    }
}



if (!isset($_SESSION['login'])) {

    header("Location: /");

    exit;
}



// if (isset($_POST['create_class'])) {

//     $classroom_name = $_POST['class_name'];

//     $enroll_key = $_POST['enroll_key'];



//     mysqli_query($conn, "INSERT INTO classroom VALUES ");

// }



include 'auth.php';

include "../../../language.php";

?>

<!DOCTYPE html>

<html>



<head>

    <title><?= $lang_classroom; ?> | <?= $lang_app_name; ?></title>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="CSRF-Token" content=" <?= $_SESSION['csrf_token']; ?>">

    <link rel="icon" href="../../../app_icon2.png" type="image/x-icon">

    <!-- <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> -->

    <link rel="stylesheet" href="../../../assets/w3/w3.css">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.10.24/css/jquery.dataTables.min.css"> -->

    <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.10.24/css/dataTables.bootstrap4.min.css">

    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.7.0/css/buttons.dataTables.min.css">-->

    <link rel="stylesheet" href="../../../assets/sweetalert/dist/sweetalert2.min.css">

    <!-- Bootstrap -->

    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"> -->

    <link rel="stylesheet" href="../../../assets/bootstrap-4.1.3-dist/css/bootstrap.min.css">

    <!-- Animasi -->

    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">



    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.24/css/dataTables.bootstrap4.min.css">

    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.7.0/css/buttons.dataTables.min.css">



    <style>
        body,

        h1,

        h2,

        h3,

        h4,

        h5 {

            font-family: "Lato", sans-serif
        }



        .w3-bar,

        h1,

        button {

            font-family: "Montserrat", sans-serif
        }



        a.w3-button {

            text-decoration: none;

        }



        .btm {

            position: absolute;

            bottom: 20px;

            /* left: 10px; */

            width: auto;

            /* border: 3px solid #73AD21; */

            padding: 10px;

        }



        body {

            min-height: 94vh;

            margin: 0;

            position: relative;

        }



        body::after {

            content: '';

            display: block;

            height: 50px;

            /* Set same as footer's height */

        }



        footer {

            position: absolute;

            bottom: 0;

            width: 100%;

            padding: 10px;

            height: 50px;

        }
    </style>

</head>



<body>

    <!-- Top bar -->

    <div class="w3-top">

        <div class="w3-bar w3-light-grey w3-large" style="z-index:4">

            <div class="w3-row">

                <div class="w3-col s4 m3 l2">

                    <button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey w3-padding-large" onclick="w3_open();">

                        <i class="fa fa-bars"></i> Menu</button>

                    <p class="w3-small"></p>

                </div>

                <div class="w3-col s4 m6 l8">

                    <marquee style="margin-top:12px"><?= $lang_welcoming_main; ?></marquee>

                </div>

                <div class="w3-col s4 m3 l2">

                    <a href="?lang=bahasa_indonesia" class="w3-button w3-round-medium w3-tiny w3-white" style="margin: 9px 0 0 25px;">ID</a>

                    <a href="?lang=english" class="w3-button w3-round-medium w3-tiny w3-black" style="margin: 9px 0 0 0;">EN</a>



                    <div class="w3-dropdown-hover w3-right">

                        <button class="w3-button w3-khaki w3-xlarge">

                            <i class="fa fa-ellipsis-v w3-large" style="padding: 2px;"></i>

                        </button>

                        <div class="w3-dropdown-content w3-bar-block w3-border" style="right: 0;">

                            <a href="../../../setting.php" class="w3-bar-item w3-button w3-small"><?= $lang_setting; ?> <i class="fa fa-cog"></i></a>

                            <a href="../../../help.php" class="w3-bar-item w3-button w3-small"><?= $lang_help; ?> <i class="fa fa-question-circle"></i></a>

                            <a href="../../../logout.php" class="w3-bar-item w3-button w3-small"><?= $lang_logout; ?> <i class="fa fa-sign-out"></i></a>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>



    <!-- Sidebar/menu -->

    <nav class="w3-sidebar w3-collapse w3-light-grey w3-animate-left" style="z-index:3;width:200px;position:relative;" id="mySidebar"><br>

        <div class="w3-container w3-row">

            <div class="w3-col s4 w3-center" style="margin-top:4px">

                <!-- take the pic from database -->

                <div class="w3-dropdown-hover w3-circle">

                    <img src="/img/man.png" class="w3-circle" style="width:46px">

                    <div class="w3-dropdown-content" style="width:46px">

                        <img src="/img/man.png" style="width:100%">

                    </div>

                </div>

            </div>

            <div class="w3-col s8 w3-center">

                <span><?= $lang_welcoming; ?>,</span><br>

                <strong><?= $_SESSION['fullname']; ?></strong><br>

                <!-- take the user name from database -->

                <!-- <a href="profile.php" class="w3-bar-item w3-button" title="profile"><i class="fa fa-user"></i></a> -->



            </div>

        </div>

        <div class="w3-container w3-light-gray w3-margin-top">

            <h6>Menu</h6>

        </div>

        <div class="w3-bar-block">

            <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-large w3-dark-grey w3-hover-black" onclick="w3_close()" title="close menu"><i class="fa fa-remove fa-fw"></i> Close Menu</a>

            <a href="dashboard.php" class="w3-bar-item w3-button w3-padding w3-hover-light-grey"><i class="fa fa-dashboard fa-fw"></i> <?= $lang_dashboard; ?></a>

            <a href="students.php" class="w3-bar-item w3-button w3-padding w3-hover-light-grey"><i class="fa fa-database fa-fw"></i> <?= $lang_students_data; ?></a>

            <a href="detector.php" class="w3-bar-item w3-button w3-padding w3-hover-light-grey"><i class="fa fa-bullseye fa-fw"></i> <?= $lang_affective_intelligence; ?></a>

            <a href="classroom.php" class="w3-bar-item w3-button w3-padding w3-hover-light-grey"><i class="fa fa-address-book fa-fw"></i> <?= $lang_classroom; ?></a>



            <a href="list_inst.php" class="w3-bar-item w3-button w3-padding w3-hover-light-grey"><i class="fa fa-database fa-fw"></i> <?= $lang_list_inst; ?></a>

            <a href="list_class.php" class="w3-bar-item w3-button w3-padding w3-hover-light-grey"><i class="fa fa-database fa-fw"></i> <?= $lang_list_class; ?></a>

            <a href="list_course.php" class="w3-bar-item w3-button w3-padding w3-hover-light-grey"><i class="fa fa-database fa-fw"></i> <?= $lang_list_course; ?></a>

        </div>

        <div class="btm">

            <img src="/img/logo_brains_uny.jpg" style="width: 185px;">

        </div>

    </nav>



    <!-- Overlay effect when opening sidebar on small screens -->

    <div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>



    <!-- !PAGE CONTENT! -->

    <div class="w3-main" style="margin-left:200px;margin-top:40px;">



        <!-- Header -->

        <header class="w3-container">

            <h5 class="animate__animated animate__bounce" style="padding:30px 0 0 10px"><b><i class="fa fa-address-book fa-fw"></i> <?= $lang_classroom; ?></b></h5>

        </header>



        <label style="margin-left: 20px;">Instansi:</label>

        <select id="selInstansi" class="w3-select w3-round w3-border" style="width:max-content;"></select>



        <!-- modal view & editclass by id -->

        <div id="m_ViEd" class="modal fade" role="dialog">

            <div class="modal-dialog modal-xl styled" style="margin-top:100px;max-width:450px">

                <div class="modal-content">

                    <div class="modal-header">

                        <h4 id="p_classroomName" class="modal-title viewer"></h4>

                        <input type="text" class="form-control editor" name="class_name" id="ed_className" placeholder="isikan nama kelas" style="max-width:170px;">

                        <input id="in_namePrev" type="hidden">

                        <button type="button" class="close" data-dismiss="modal">×</button>

                    </div>

                    <div class="modal-body w3-center">

                        <div class="viewer">

                            <div class="w3-row">

                                <!-- info -->

                                <div class="w3-third">

                                    <div class="w3-row">

                                        <div class="w3-panel w3-card w3-purple">

                                            <label for="p_classState"><?= $lang_state; ?></label>

                                            <p id="p_classState"></p>

                                        </div>

                                        <div class="w3-panel w3-card w3-yellow">

                                            <label for="p_courseName"><?= $lang_course; ?></label>

                                            <p id="p_courseName" class="viewer"></p>

                                        </div>

                                        <div class="w3-panel w3-card w3-cyan">

                                            <label for="p_className"><?= $lang_class; ?></label>

                                            <p id="p_className" class="viewer"></p>

                                        </div>

                                        <div class="w3-panel w3-card w3-pale-red">

                                            <label for="p_numJoin"><?= $lang_num_join; ?></label>

                                            <p id="p_numJoin"></p>

                                        </div>

                                        <div class="w3-panel w3-card w3-red">

                                            <label for="p_enrollKey"><?= $lang_enroll_key; ?></label>

                                            <p id="p_enrollKey" class="viewer"></p>

                                        </div>



                                    </div>

                                </div>

                                <!-- chart -->

                                <div class="w3-twothird">

                                    <div class="w3-card" id="chartContainer">

                                        <canvas id="classChart"></canvas>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div class="editor">

                            <div class="w3-row">

                                <div class="w3-third">

                                    <div class="w3-panel w3-card w3-yellow">

                                        <label for="ed_courseName"><?= $lang_course; ?></label>

                                        <input id="s_coursePrev" type="hidden">

                                        <select class="w3-select w3-round w3-border" name="ed_course" id="ed_Course" style="max-width:170px;">

                                            <option label="pilih..." style="display: none;"></option>

                                            <!-- <optgroup label="UMUM">

                                                <option>Agama</option>

                                                <option>Bahasa Indonesia</option>

                                                <option>Bahasa Inggris</option>

                                                <option>PKn</option>

                                                <option>TIK</option>

                                            </optgroup>

                                            <optgroup label="IPA">

                                                <option>Biologi</option>

                                                <option>Fisika</option>

                                                <option>Kimia</option>

                                                <option>Matematika</option>

                                            </optgroup>

                                            <optgroup label="IPS">

                                                <option>Sejarah</option>

                                                <option>Geologi</option>

                                                <option>Sosiologi</option>

                                                <option>Ekonomi</option>

                                            </optgroup> -->

                                        </select>

                                    </div>

                                </div>

                                <div class="w3-third">

                                    <div class="w3-panel w3-card w3-cyan">

                                        <label for="ed_className"><?= $lang_class; ?></label>

                                        <input id="s_classPrev" type="hidden">

                                        <select class="w3-select w3-round w3-border" name="ed_class" id="ed_Class" style="max-width:100px;">

                                            <option label="pilih..." style="display: none;"></option>

                                            <!-- <optgroup label="Kelas X">

                                                <option value="XA1">X IPA 1</option>

                                                <option value="XA2">X IPA 2</option>

                                                <option value="XA3">X IPA 3</option>

                                                <option value="XA4">X IPA 4</option>

                                                <option value="XA5">X IPA 5</option>

                                                <option value="XA6">X IPA 6</option>

                                                <option value="XA7">X IPA 7</option>

                                                <option value="XS1">X IPS 1</option>

                                                <option value="XS2">X IPS 2</option>

                                            </optgroup>

                                            <optgroup label="Kelas XI">

                                                <option value="XIA1">XI IPA 1</option>

                                                <option value="XIA2">XI IPA 2</option>

                                                <option value="XIA3">XI IPA 3</option>

                                                <option value="XIA4">XI IPA 4</option>

                                                <option value="XIA5">XI IPA 5</option>

                                                <option value="XIA6">XI IPA 6</option>

                                                <option value="XIA7">XI IPA 7</option>

                                                <option value="XIS1">XI IPS 1</option>

                                                <option value="XIS2">XI IPS 2</option>

                                            </optgroup>

                                            <optgroup label="Kelas XII">

                                                <option value="XIIA1">XII IPA 1</option>

                                                <option value="XIIA2">XII IPA 2</option>

                                                <option value="XIIA3">XII IPA 3</option>

                                                <option value="XIIA4">XII IPA 4</option>

                                                <option value="XIIA5">XII IPA 5</option>

                                                <option value="XIIA6">XII IPA 6</option>

                                                <option value="XIIA7">XII IPA 7</option>

                                                <option value="XIIS1">XII IPS 1</option>

                                                <option value="XIIS2">XII IPS 2</option>

                                            </optgroup> -->

                                        </select>

                                    </div>

                                </div>

                                <div class="w3-third">

                                    <div class="w3-panel w3-card w3-pale-red">

                                        <label for="ed_numJoin"><?= $lang_num_join; ?></label>

                                        <p id="ed_numJoin"></p>

                                    </div>

                                </div>

                            </div>

                            <div class="w3-row">

                                <div class="w3-half">

                                    <div class="w3-panel w3-card w3-purple">

                                        <label for="ed_classState"><?= $lang_state; ?></label>

                                        <p id="ed_classState"></p>

                                    </div>

                                </div>

                                <div class="w3-half">

                                    <div class="w3-panel w3-card w3-red">

                                        <label for="ed_enrollKey"><?= $lang_enroll_key; ?></label>

                                        <input type="text" class="form-control" name="enroll_key" id="ed_enrollKey" placeholder="isikan enroll key" style="max-width:170px;">

                                        <input id="in_enrollPrev" type="hidden">

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div class="modal-footer">

                        <button name="btn-open" id="btn-open" class="w3-button w3-green"><?= $lang_open; ?></button>

                        <button name="btn-close" id="btn-close" class="w3-button w3-red"><?= $lang_close; ?></button>

                        <button name="btn-save" id="btn-save" class="w3-button w3-green editor"><?= $lang_save; ?></button>

                    </div>

                </div>

            </div>

        </div>



        <!-- tombol panel -->

        <div class="w3-panel">

            <button id="btn-create-new" class="w3-button w3-round w3-teal"><?= $lang_create_new; ?></button>



            <!-- create new class modal -->

            <div id="m_createNew" class="modal fade mr-tp-100" role="dialog">

                <div class="modal-dialog modal-sm" style="margin-top: 100px;">

                    <div class="modal-content">

                        <div class="modal-header">

                            <h4 class="modal-title"><?= $lang_new_classroom; ?></h4>

                            <button type="button" class="close" data-dismiss="modal">×</button>

                        </div>

                        <div class="modal-body">

                            <form method="POST" name="form_newClass" id="formNewClass">

                                <div class="form-group">

                                    <label for="class_name"><?= $lang_classroom_name; ?>:</label>

                                    <input type="text" class="form-control" name="class_name" id="in_className" placeholder="isikan nama kelas">

                                </div>

                                <div class="form-group">

                                    <label for="in_course"><?= $lang_course; ?>:</label>

                                    <select class="w3-select w3-round w3-border" name="in_course" id="in_Course" style="max-width:100px;">

                                        <option label="pilih..." style="display: none;"></option>

                                        <!-- <optgroup label="UMUM">

                                            <option>Agama</option>

                                            <option>Bahasa Indonesia</option>

                                            <option>Bahasa Inggris</option>

                                            <option>PKn</option>

                                            <option>TIK</option>

                                        </optgroup>

                                        <optgroup label="IPA">

                                            <option>Biologi</option>

                                            <option>Fisika</option>

                                            <option>Kimia</option>

                                            <option>Matematika</option>

                                        </optgroup>

                                        <optgroup label="IPS">

                                            <option>Sejarah</option>

                                            <option>Geologi</option>

                                            <option>Sosiologi</option>

                                            <option>Ekonomi</option>

                                        </optgroup> -->

                                    </select>

                                </div>

                                <div class="form-group">

                                    <label for="in_class"><?= $lang_class; ?>:</label>

                                    <select class="w3-select w3-round w3-border" name="in_class" id="in_Class" style="max-width:100px;">

                                        <option label="pilih..." style="display: none;"></option>

                                        <!-- <optgroup label="Kelas X">

                                            <option value="XA1">X IPA 1</option>

                                            <option value="XA2">X IPA 2</option>

                                            <option value="XA3">X IPA 3</option>

                                            <option value="XA4">X IPA 4</option>

                                            <option value="XA5">X IPA 5</option>

                                            <option value="XA6">X IPA 6</option>

                                            <option value="XA7">X IPA 7</option>

                                            <option value="XS1">X IPS 1</option>

                                            <option value="XS2">X IPS 2</option>

                                        </optgroup>

                                        <optgroup label="Kelas XI">

                                            <option value="XIA1">XI IPA 1</option>

                                            <option value="XIA2">XI IPA 2</option>

                                            <option value="XIA3">XI IPA 3</option>

                                            <option value="XIA4">XI IPA 4</option>

                                            <option value="XIA5">XI IPA 5</option>

                                            <option value="XIA6">XI IPA 6</option>

                                            <option value="XIA7">XI IPA 7</option>

                                            <option value="XIS1">XI IPS 1</option>

                                            <option value="XIS2">XI IPS 2</option>

                                        </optgroup>

                                        <optgroup label="Kelas XII">

                                            <option value="XIIA1">XII IPA 1</option>

                                            <option value="XIIA2">XII IPA 2</option>

                                            <option value="XIIA3">XII IPA 3</option>

                                            <option value="XIIA4">XII IPA 4</option>

                                            <option value="XIIA5">XII IPA 5</option>

                                            <option value="XIIA6">XII IPA 6</option>

                                            <option value="XIIA7">XII IPA 7</option>

                                            <option value="XIIS1">XII IPS 1</option>

                                            <option value="XIIS2">XII IPS 2</option>

                                        </optgroup> -->

                                    </select>

                                </div>

                                <div class="form-group">

                                    <label for="enroll_key"><?= $lang_enroll_key; ?>:</label>

                                    <input type="text" class="form-control" name="enroll_key" id="in_enrollKey" placeholder="isikan enroll key">

                                </div>

                            </form>

                        </div>

                        <div class="modal-footer">

                            <button name="create_class" id="btn-create" class="w3-button w3-green"><?= $lang_create; ?></button>

                        </div>

                    </div>

                </div>

            </div>

        </div>



        <div class="w3-panel">

            <div class="w3-col s3 m3 l3">

                <label for="s_course"><?= $lang_course; ?>:</label>

                <select class="w3-select w3-round w3-border" name="s_course" id="s_Course" style="max-width:100px;">

                    <option label="semua"></option>

                    <!-- <optgroup label="UMUM">

                        <option>Agama</option>

                        <option>Bahasa Indonesia</option>

                        <option>Bahasa Inggris</option>

                        <option>PKn</option>

                        <option>TIK</option>

                    </optgroup>

                    <optgroup label="IPA">

                        <option>Biologi</option>

                        <option>Fisika</option>

                        <option>Kimia</option>

                        <option>Matematika</option>

                    </optgroup>

                    <optgroup label="IPS">

                        <option>Sejarah</option>

                        <option>Geologi</option>

                        <option>Sosiologi</option>

                        <option>Ekonomi</option>

                    </optgroup> -->

                </select>

            </div>

            <div class="w3-col s3 m3 l3">

                <label for="s_class"><?= $lang_class; ?>:</label>

                <select class="w3-select w3-round w3-border" name="s_class" id="s_Class" style="max-width:100px;">

                    <option label="semua"></option>

                    <!-- <optgroup label="Kelas X">

                        <option value="XA1">X IPA 1</option>

                        <option value="XA2">X IPA 2</option>

                        <option value="XA3">X IPA 3</option>

                        <option value="XA4">X IPA 4</option>

                        <option value="XA5">X IPA 5</option>

                        <option value="XA6">X IPA 6</option>

                        <option value="XA7">X IPA 7</option>

                        <option value="XS1">X IPS 1</option>

                        <option value="XS2">X IPS 2</option>

                    </optgroup>

                    <optgroup label="Kelas XI">

                        <option value="XIA1">XI IPA 1</option>

                        <option value="XIA2">XI IPA 2</option>

                        <option value="XIA3">XI IPA 3</option>

                        <option value="XIA4">XI IPA 4</option>

                        <option value="XIA5">XI IPA 5</option>

                        <option value="XIA6">XI IPA 6</option>

                        <option value="XIA7">XI IPA 7</option>

                        <option value="XIS1">XI IPS 1</option>

                        <option value="XIS2">XI IPS 2</option>

                    </optgroup>

                    <optgroup label="Kelas XII">

                        <option value="XIIA1">XII IPA 1</option>

                        <option value="XIIA2">XII IPA 2</option>

                        <option value="XIIA3">XII IPA 3</option>

                        <option value="XIIA4">XII IPA 4</option>

                        <option value="XIIA5">XII IPA 5</option>

                        <option value="XIIA6">XII IPA 6</option>

                        <option value="XIIA7">XII IPA 7</option>

                        <option value="XIIS1">XII IPS 1</option>

                        <option value="XIIS2">XII IPS 2</option>

                    </optgroup> -->

                </select>

            </div>

            <div class="w3-col s3 m3 l3">

                <input class="w3-input w3-border w3-round" type="text" name="s_keyword" id="s_Keyword" placeholder="masukkan keyword..." autocomplete="off" style="float:right; max-width:400px;" autofocus>

                </input>

            </div>

        </div>

        <div class="w3-container">

            <table id="classes-list" class="table table-striped table-bordered" width="100%"></table>

        </div>



        <!-- Footer -->

        <footer class="w3-light-grey">

            <p><?= $lang_app_name; ?> <i class="fa fa-copyright"></i> <?= $lang_copyright; ?> <a href="https://www.w3schools.com/" target="_blank" class="w3-text-white">w3 school</a></p>

        </footer>

    </div>

    <!-- End page content -->





    <script>
        // Get the Sidebar

        var mySidebar = document.getElementById("mySidebar");

        // Get the DIV with overlay effect

        var overlayBg = document.getElementById("myOverlay");

        // Toggle between showing and hiding the sidebar, and add overlay effect

        function w3_open() {

            if (mySidebar.style.display === 'block') {

                mySidebar.style.display = 'none';

                overlayBg.style.display = "none";

            } else {

                mySidebar.style.display = 'block';

                overlayBg.style.display = "block";

            }

        }



        // Close the sidebar with the close button

        function w3_close() {

            mySidebar.style.display = "none";

            overlayBg.style.display = "none";

        }
    </script>

    <!-- JQuery -->

    <!-- <script src=" https://code.jquery.com/jquery-3.6.0.js "></script> -->

    <script type="text/javascript" src="../../../assets/jquery/jquery-3.6.0.min.js"></script>

    <!-- Bootstrap -->

    <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script> -->

    <script type="text/javascript" src="../../../assets/bootstrap-4.1.3-dist/js/bootstrap.min.js"></script>

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script> -->

    <script type="text/javascript" src="../../../assets/popper/popper.min.js"></script>

    <!-- DataTable -->

    <script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>

    <script src="https://cdn.datatables.net/1.10.24/js/dataTables.bootstrap4.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/dataTables.buttons.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.bootstrap4.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.html5.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.print.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.colVis.min.js"></script>

    <!-- Sweet Alert -->

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.33.1/sweetalert2.min.js"></script> -->

    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- w3 js -->

    <!-- <script src="https://www.w3schools.com/lib/w3.js"></script> -->

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/p5.js"></script> -->

    <!-- <script type="text/javascript" src="../../../assets/p5/p5.min.js"></script> -->

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/addons/p5.sound.min.js"></script> -->

    <!-- <script type="text/javascript" src="../../../assets/p5/addons/p5.sound.min.js"></script> -->

    <!-- <script src="https://unpkg.com/ml5@0.5.0/dist/ml5.min.js"></script> -->

    <!-- <script type="text/javascript" src="../../../assets/ml5/ml5.min.js"></script> -->



    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- <script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>

    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script> -->

    <!-- <script src="https://unpkg.com/react-webcam@latest/dist/react-webcam.min.js" crossorigin></script> -->

    <!-- <script src="https://unpkg.com/browse/react-webcam@5.2.3/dist/react-webcam.min.js"></script> -->

    <!-- <script src="https://unpkg.com/prop-types@15.6.1/prop-types.js"></script>

    <script src="https://unpkg.com/babel-transform-in-browser@6.4.6/dist/btib.min.js"></script> -->

    <!-- <script src="react-webcam/dist/react-webcam.js"></script> -->



    <script src="js/classroom.js"></script>

</body>



</html>