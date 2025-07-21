<?php
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

include 'auth.php';
include "../../../language.php";

?>
<!DOCTYPE html>
<html>

<head>
    <title><?= $lang_list_inst; ?> | <?= $lang_app_name; ?></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="CSRF-Token" content=" <?= $_SESSION['csrf_token']; ?>">
    <link rel="icon" href="../../../app_icon2.png" type="image/x-icon">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.10.24/css/jquery.dataTables.min.css"> -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.24/css/dataTables.bootstrap4.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.7.0/css/buttons.dataTables.min.css">
    <link rel="stylesheet" href="../../../assets/sweetalert/dist/sweetalert2.min.css">
    <!-- Bootstrap -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
    <!-- Animasi -->
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

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

        p {
            font-family: "Noto Sans";
        }

        .tbutton {
            /* margin-top: 20px; */
            float: right;
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
        <div class="w3-bar w3-blue w3-large" style="z-index:4">
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
                    <div class="w3-dropdown-hover w3-right">
                        <button class="w3-button w3-khaki w3-xlarge">
                            <i class="fa fa-ellipsis-v" style="margin: 5px;"></i>
                        </button>
                        <div class="w3-dropdown-content w3-bar-block w3-border" style="right: 0;">
                            <a href="../../../setting.php" class="w3-bar-item w3-button w3-small"><?= $lang_setting; ?> <i class="fa fa-cog"></i></a>
                            <a href="../../../help.php" class="w3-bar-item w3-button w3-small"><?= $lang_help; ?> <i class="fa fa-question-circle"></i></a>
                            <a href="../../../logout.php" class="w3-bar-item w3-button w3-small"><?= $lang_logout; ?> <i class="fa fa-sign-out"></i></a>
                        </div>
                    </div>
                    <a href="?lang=english" class="w3-button w3-round-medium w3-tiny w3-black w3-right" style="margin:9px">EN</a>
                    <a href="?lang=bahasa_indonesia" class="w3-button w3-round-medium w3-tiny w3-white w3-right" style="margin:9px">ID</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Sidebar/menu -->
    <nav class="w3-sidebar w3-collapse w3-blue w3-animate-left" style="z-index:3;width:200px;position:relative" id="mySidebar"><br>
        <div class="w3-container w3-row">
            <div class="w3-col s4 w3-center">
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
            <img src="/img/uny-ptei.png" style="width: 185px;">
        </div>
    </nav>

    <!-- Overlay effect when opening sidebar on small screens -->
    <div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>

    <!-- !PAGE CONTENT! -->
    <div class="w3-main" style="margin-left:200px;margin-top:40px;">

        <!-- Header -->
        <header class="w3-container">
            <h5 class="animate__animated animate__bounce" style="padding:30px 0 0 10px"><b><i class="fa fa-database"></i> <?= $lang_list_inst; ?></b></h5>
        </header>

        <label style="margin-left: 20px;">Instansi:</label>
        <select id="selInstansi" class="w3-select w3-round w3-border" style="width:max-content;">
            <option label="semua"></option>
        </select>

        <!-- <button class="w3-button"><a href="hps.php">Hapus session</a></button> -->
        <div class="w3-panel">
            <div class="w3-row-padding" style="margin:0 -14px;">
                <div class="w3-col s3 m3 l3">
                    <label for="s_course"><?= $lang_course; ?>:</label>
                    <select class="w3-select w3-round w3-border" name="s_course" id="s_Course" style="max-width:100px;">
                        <option label="semua"></option>
                    </select>
                </div>
                <div class="w3-col s3 m3 l2">
                    <label for="s_class"><?= $lang_class; ?>:</label>
                    <select class="w3-select w3-round w3-border" name="s_class" id="s_Class" style="max-width:100px;">
                        <option label="semua"></option>
                    </select>
                </div>
                <!-- button tambah -->
                <div class="w3-col s4 m4 l4">
                    <button id="btn-Add" class="w3-button w3-round w3-indigo">
                        <i class="fa fa-plus"></i> <?= $lang_add_student; ?>
                    </button>
                    <button id="btn-In_score" class="w3-button w3-green w3-round"><?= $lang_input_score; ?></button>
                </div>
                <div class="w3-col s2 m2 l3">
                    <input class="w3-input w3-border w3-round" type="text" name="s_keyword" id="s_Keyword" placeholder="masukkan keyword..." autocomplete="off" style="float:right; max-width:400px;" autofocus>
                    </input>
                </div>
            </div>
        </div>

        <!-- modal choice -->
        <div id="modal_choice" class="modal fade">
            <div class="modal-dialog modal-sm" style="margin-top: 200px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Pilih salah satu</h4>
                        <button type="button" class="close" data-dismiss="modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="w3-container w3-row">
                            <div class="w3-half">
                                <button id="btn-addSingle" class="w3-button w3-round w3-light-grey">Satu siswa</button>
                            </div>
                            <div class="w3-half">
                                <button id="btn-addMulti" class="w3-button w3-round w3-grey">Banyak siswa</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL TAMBAH & EDIT -->
        <div id="modal_add_edit" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" width="100%">
            <div class="modal-dialog modal-xl" style="margin-top:100px">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 id="h_add" class="modal-title"><?= $lang_add_student; ?></h4>
                        <h4 id="h_edit" class="modal-title" style="display: none;"><?= $lang_edit_student; ?></h4>
                        <button type="button" class="close" data-dismiss="modal">×</button>
                    </div>
                    <div class="modal-body">
                        <form method="post" class="form-data" id="form-edit">
                            <div class="w3-row">
                                <div class="w3-half">
                                    <div class="form-group">
                                        <label><?= $lang_student_name; ?></label>
                                        <input type="text" name="in_name" id="in_Name" class="form-control wajib" required="true">
                                        <p class="text-danger" id="err_in_Name"></p>
                                    </div>
                                </div>
                                <div class="w3-half">
                                    <div class="form-group">
                                        <label><?= $lang_student_id; ?></label>
                                        <input type="text" name="in_id" id="in_Id" class="form-control wajib" required="true"></input>
                                        <p class="text-danger" id="err_in_Id"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="w3-row">
                                <div class="w3-half">
                                    <div class="form-group">
                                        <label><?= $lang_gender; ?></label><br>
                                        <input type="radio" name="in_gender" id="in_Gender1" value="Laki-laki" class="wajib"> Laki-laki
                                        <input type="radio" name="in_gender" id="in_Gender2" value="Perempuan" class="wajib"> Perempuan
                                        <p class="text-danger" id="err_in_Gender"></p>
                                    </div>
                                </div>
                                <div class="w3-half">
                                    <div class="form-group">
                                        <label><?= $lang_class; ?></label>
                                        <select name="s_class_add" id="s_Class_add" class="form-control wajib" required="true">
                                        </select>
                                        <p class="text-danger" id="err_s_Class_add"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="w3-row">
                                <div class="w3-half">
                                    <div class="form-group">
                                        <label><?= $lang_photo; ?></label>
                                        <input type="hidden" name="in_prev_photo" id="in_Prev_photo">
                                        <input type="file" name="in_photo" id="in_Photo" class="form-control">
                                    </div>
                                </div>
                                <div class="w3-half">
                                    <div class="form-group">
                                        <label><?= $lang_email; ?></label>
                                        <input type="text" name="in_email" id="in_Email" class="form-control wajib" required="true">
                                        <p class="text-danger" id="err_in_Email"></p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" name="btn-save" id="btn-Save" class="btn btn-primary">
                            <i class="fa fa-save"></i> <?= $lang_save; ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- END MODAL TAMBAH & EDIT -->

        <!-- modal add multi student -->
        <div id="modal_add_multi" class="modal fade">
            <div class="modal-dialog modal-sm" style="margin-top: 200px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Tambah beberapa siswa</h4>
                        <button type="button" class="close" data-dismiss="modal">×</button>
                    </div>
                    <div class="modal-body">
                        <div id="rowIn" class="w3-row">
                            <div id="multiIn" class="w3-twothird">
                                <div class="w3-container" style="margin: 2px 0 2px 0">
                                    <input id="in_multi" type="text" class="in_multi" style="width:200px;">
                                </div>
                            </div>
                            <div class="w3-third">
                                <i id="i_plus" class="fa fa-plus-square-o w3-right w3-padding"></i>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" name="btn-saveM" id="btn-SaveM" class="btn btn-primary">
                            <i class="fa fa-save"></i> <?= $lang_save; ?>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL VIEW -->
        <div id="modal_view" class="modal fade">
            <div class="modal-dialog modal-xl styled" style="max-width: 1000px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 id="p_Name" class="modal-title"></h4>
                        <button type="button" class="close" data-dismiss="modal">×</button>
                    </div>
                    <div class="modal-body w3-center">
                        <div class="w3-row">
                            <!-- half info -->
                            <div class="w3-third">
                                <!-- row foto + nilai -->
                                <div class="w3-row">
                                    <div class="w3-half">
                                        <div class="w3-panel w3-card">
                                            <img src="" id="img_Photo" height="100px" style="margin-left:-20px;">
                                        </div>
                                        <!-- <label><strong><?= $lang_class; ?>: </strong></label>
                                        <p id="p_Class"></p>
                                        <label><strong><?= $lang_gender; ?>: </strong></label>
                                        <p id="p_Gender"></p> -->
                                    </div>
                                    <div class="w3-half">
                                        <div class="w3-panel w3-card">
                                            <h2 id="p_Nilai" class="w3-jumbo w3-padding"></h2>
                                        </div>
                                        <!-- <label><strong><?= $lang_student_id; ?>: </strong></label>
                                        <p id="p_Id"></p>
                                        <label><strong><?= $lang_email; ?>: </strong></label>
                                        <p id="p_Email"></p> -->
                                    </div>
                                </div>
                                <div class="w3-row w3-panel w3-card">
                                    <select class="w3-select" id="sel_vid">
                                        <option label="pilih..."></option>
                                    </select>
                                    <video id="vid_penilaian" src="" height="260px" width="300px" style="margin-left:-5px;" controls></video>
                                </div>
                            </div>
                            <!-- half chart -->
                            <div class="w3-twothird">
                                <div class="w3-panel w3-card">
                                    <canvas id="userChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- END MODAL VIEW -->

        <!-- students list -->
        <div class="w3-container">
            <table id="inst-list" class="table table-striped table-bordered" width="100%"></table>
        </div>

        <!-- Footer -->
        <footer class="w3-blue">
            <p><?= $lang_app_name; ?> <i class="fa fa-copyright"></i> 2021 | Powered by <a href="https://www.w3schools.com/" target="_blank" class="w3-text-white">w3 school</a></p>
        </footer>

        <!-- End page content -->
    </div>

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
    <!-- <script src="assets/sweetalert/dist/sweetalert2.all.min.js"></script>
    <script src="assets/jquery/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.7.0/js/dataTables.buttons.min.js"></script> -->
    <!-- Bootstrap -->
    <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.24/js/dataTables.bootstrap4.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.bootstrap4.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.print.min.js"></script> -->

    <!-- JQuery -->
    <script src=" https://code.jquery.com/jquery-3.6.0.js "></script>
    <!-- Bootstrap -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
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
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- w3 js -->
    <script src="https://www.w3schools.com/lib/w3.js"></script>
    <script src="js/list_inst.js"></script>
</body>

</html>