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



include "../../../language.php";

?>

<!DOCTYPE html>

<html>



<head>

    <title><?= $lang_affective_intelligence; ?> | <?= $lang_app_name; ?></title>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="<?= $_SESSION['csrf_token']; ?>">

    <link rel="icon" href="../../../app_icon2.png" type="image/x-icon">

    <!-- <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> -->

    <link rel="stylesheet" href="../../../assets/w3/w3.css">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.10.24/css/jquery.dataTables.min.css"> -->

    <!-- <link rel="stylesheet" href="https://cdn.datatables.net/1.10.24/css/dataTables.bootstrap4.min.css">

    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.7.0/css/buttons.dataTables.min.css"> -->

    <link rel="stylesheet" href="../../../assets/sweetalert/dist/sweetalert2.min.css">

    <!-- Bootstrap -->

    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"> -->

    <link rel="stylesheet" href="../../../assets/bootstrap-4.1.3-dist/css/bootstrap.min.css">

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



        .btm {

            position: absolute;

            bottom: 20px;

            /* left: 10px; */

            width: auto;

            /* border: 3px solid #73AD21; */

            padding: 10px;

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

                            <i class="fa fa-ellipsis-v" style="margin: 5px;"></i>

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

    <nav class="w3-sidebar w3-collapse w3-light-grey w3-animate-left" style="z-index:3;width:200px;position:relative" id="mySidebar"><br>

        <div class="w3-container w3-row">

            <div class="w3-col s4 w3-center" style="margin-top:4px">

                <!-- take the pic from database -->

                <div class="w3-dropdown-hover w3-circle">

                    <img src="../../../img/man.png" class="w3-circle" style="width:46px">

                    <div class="w3-dropdown-content" style="width:46px">

                        <img src="../../../img/man.png" style="width:100%">

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

            <img src="../../../img/logo_brains_uny.jpg" style="width: 185px;">

        </div>

    </nav>



    <!-- Overlay effect when opening sidebar on small screens -->

    <div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>



    <!-- !PAGE CONTENT! -->

    <div class="w3-main" style="margin-left:200px;margin-top:40px;">



        <!-- Header -->

        <header class="w3-container">

            <div class="w3-col s3 m3 l3">

                <h5 class="animate__animated animate__bounce" style="padding:30px 0 0 10px"><b><i class="fa fa-bullseye fa-fw"></i> <?= $lang_affective_intelligence; ?></b></h5>

                <!-- <button id="btn-camera" class="w3-button w3-round w3-light-grey">Ganti kamera</button> -->

            </div>

            <div class="w3-col s7 m7 l7">

                <div class="w3-container" style="padding:25px 0 0 10px">

                    <button id="btn-collect" class="w3-button w3-round w3-teal"><?= $lang_collect; ?></button>

                    <button id="btn-train" class="w3-button w3-round w3-indigo"><?= $lang_train; ?></button>

                    <button id="btn-classify" class="w3-button w3-round w3-black"><?= $lang_classify; ?></button>

                    <button id="btn-test" class="w3-button w3-round w3-amber"><?= $lang_test_sys_model; ?></button>

                    <button id="btn-stop" class="w3-button w3-round w3-red" style="display: none;"><?= $lang_stop_process; ?></button>

                </div>

            </div>

        </header>



        <!-- tombol panel -->

        <!-- <div class="w3-panel">

            <div class="w3-row">



            </div>

        </div> -->



        <!-- preview panel -->

        <div class="w3-container" style="margin-left:-15px">

            <div class="w3-col s10 m10 l10 w3-panel">

                <div class="w3-bar w3-amber"><?= $lang_preview_panel; ?></div>

                <div class="w3-container w3-border">

                    <div id="container_editorTool" class="w3-container" style="display:none;">

                        <div class="w3-center">

                            <p id="stateP"></p>

                            <p id="conditionP"></p>

                        </div>

                        <div class="w3-col w3-half">

                            <input type="file" id="in_loadDataset" class="w3-input w3-right" style=" display:none;max-width:250px;">

                            <input type="file" id="in_loadModel" class="w3-input w3-right" style=" display:none;" multiple>

                        </div>

                        <div class="w3-col w3-half">
                            <input type="text" id="in_nclass" class="w3-input w3-left" style=" display:none;max-width:80px;" placeholder="n class">

                            <select class="w3-select w3-round w3-border w3-left" id="s_dataLabel" style="display:none;margin-right:30px;max-width:60px;">

                                <!-- <option value="A">A</option>

                                <option value="B">B</option>

                                <option value="C">C</option>

                                <option value="D">D</option> -->

                                <!-- <option value="E">E</option> -->

                            </select>

                            <input type="text" id="in_epochTrain" class="w3-input w3-left" style=" display:none;max-width:80px;" placeholder="epochs...">

                            <button id="btn-add" class="w3-button w3-round w3-gray w3-left" style="display:none;"><?= $lang_add_data; ?></button>

                            <button id="btn-do_train" class="w3-button w3-round w3-gray w3-left" style="display:none;"><?= $lang_train_model; ?></button>

                            <button id="btn-do_classify" class="w3-button w3-round w3-gray w3-left" style="display:none;"><?= $lang_classify_pose; ?></button>

                            <button id="btn-update" class="w3-button w3-round w3-light-gray w3-left" style="display:none;"><?= $lang_update; ?></button>

                        </div>

                    </div>

                    <div id="detector-holder" class="w3-center" style="margin: 10px 0 10px 0;"></div>

                    <div id="videorec-holder" class="w3-center" style="margin: 10px 0 10px 0; display:none">

                        <button id="btn-confirmVid" class="w3-button w3-round w3-khaki" name="save"><i class="fa fa-save"></i> <?= $lang_save; ?></button>

                        <button id="btn-downloadVid" class="w3-button w3-round w3-khaki"><i class="fa fa-download"></i> <?= $lang_download; ?></button>

                        <br>

                        <video id="videorec" name="videoRec" width="640" height="360" autoplay loop controls></video>

                    </div>

                </div>

            </div>

            <div class="w3-col s2 m2 l2 w3-panel">

                <div class="w3-bar w3-amber"><?= $lang_recording_panel; ?></div>

                <div class="w3-card w3-border w3-center">
                    <div>
                        <label><?= $lang_check_sel_model; ?></label>
                        <label><?= $lang_no; ?></label> <input id="check-sel_model" name="sel_model" type="checkbox" value="no">
                    </div>

                    <button id="btn-start_rec" class="w3-button w3-round w3-green" style="margin:5px;"><?= $lang_start; ?></button>

                    <button id="btn-stop_rec" class="w3-button w3-round w3-red" style="margin:5px;"><?= $lang_stop; ?></button>

                    <button id="btn-modal_rec" class="w3-button w3-round w3-brown" style="margin:5px; display:none"><?= $lang_recorded; ?></button>

                </div>

            </div>

        </div>

    </div>



    <!-- Footer -->

    <footer class="w3-container w3-padding-16 w3-light-grey" style="margin-top:20px;">

        <p><?= $lang_app_name; ?> <i class="fa fa-copyright"></i> <?= $lang_copyright; ?> <a href="https://www.w3schools.com/" target="_blank" class="w3-text-white">w3 school</a></p>

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

    <!-- JQuery -->

    <!-- <script src=" https://code.jquery.com/jquery-3.6.0.js "></script> -->

    <script type="text/javascript" src="../../../assets/jquery/jquery-3.6.0.min.js"></script>

    <!-- Bootstrap -->

    <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script> -->

    <script type="text/javascript" src="../../../assets/bootstrap-4.1.3-dist/js/bootstrap.min.js"></script>

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script> -->

    <script type="text/javascript" src="../../../assets/popper/popper.min.js"></script>

    <!-- DataTable -->

    <!-- <script src="https://cdn.datatables.net/1.10.24/js/jquery.dataTables.min.js"></script>

    <script src="https://cdn.datatables.net/1.10.24/js/dataTables.bootstrap4.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/dataTables.buttons.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.bootstrap4.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.html5.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.print.min.js"></script>

    <script src="https://cdn.datatables.net/buttons/1.7.0/js/buttons.colVis.min.js"></script> -->

    <!-- Sweet Alert -->

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.33.1/sweetalert2.min.js"></script> -->

    <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>



    <!-- w3 js -->

    <!-- <script src="https://www.w3schools.com/lib/w3.js"></script> -->

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/p5.js"></script> -->

    <script type="text/javascript" src="../../../assets/p5/p5.min.js"></script>

    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/addons/p5.sound.min.js"></script> -->

    <script type="text/javascript" src="../../../assets/p5/addons/p5.sound.min.js"></script>

    <!-- <script src="https://unpkg.com/ml5@0.5.0/dist/ml5.min.js"></script> -->

    <script type="text/javascript" src="../../../assets/ml5/ml5.min.js"></script>

    <!-- <script src="https://unpkg.com/ml5@latest/dist/ml5.min.js"></script> -->

    <!-- <script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>

    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script> -->

    <!-- <script src="https://unpkg.com/react-webcam@latest/dist/react-webcam.min.js" crossorigin></script> -->

    <!-- <script src="https://unpkg.com/browse/react-webcam@5.2.3/dist/react-webcam.min.js"></script> -->

    <!-- <script src="https://unpkg.com/prop-types@15.6.1/prop-types.js"></script>

    <script src="https://unpkg.com/babel-transform-in-browser@6.4.6/dist/btib.min.js"></script> -->

    <!-- <script src="react-webcam/dist/react-webcam.js"></script> -->


    <script src="../../../assets/fixwebmduration/fix-webm-duration.js"></script>
    <script src="js/ai3.js"></script>

</body>



</html>