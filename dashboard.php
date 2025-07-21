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

    // $_SESSION['loginvia'] = "checked cookie";

    // need to renew the cookie?

  }
}



if (!isset($_SESSION['login'])) {

  header("Location: /");

  exit;
}



// require 'functions.php';

// $siswa = query("SELECT * FROM siswa");



// session_start();

include "../../../language.php";

?>

<!DOCTYPE html>

<html>

<title><?= $lang_dashboard; ?> | <?= $lang_app_name; ?></title>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1">

<link rel="icon" href="../../../app_icon6.png" type="image/x-icon">

<!-- <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> -->

<link rel="stylesheet" href="../../../assets/w3/w3.css">

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">

<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

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



  .switch {

    position: relative;

    display: inline-block;

    width: 60px;

    height: 34px;

  }



  .switch input {

    opacity: 0;

    width: 0;

    height: 0;

  }



  .slider {

    position: absolute;

    cursor: pointer;

    top: 0;

    left: 0;

    right: 0;

    bottom: 0;

    background-color: #ccc;

    -webkit-transition: .4s;

    transition: .4s;

  }



  .slider:before {

    position: absolute;

    content: "";

    height: 26px;

    width: 26px;

    left: 4px;

    bottom: 4px;

    background-color: white;

    -webkit-transition: .4s;

    transition: .4s;

  }



  input:checked+.slider {

    background-color: #33cc33;

  }



  input:focus+.slider {

    box-shadow: 0 0 1px #33cc33;

  }



  input:checked+.slider:before {

    -webkit-transform: translateX(26px);

    -ms-transform: translateX(26px);

    transform: translateX(26px);

  }



  /* Rounded sliders */

  .slider.round {

    border-radius: 34px;

  }



  .slider.round:before {

    border-radius: 50%;

  }



  .mySlides {

    display: none
  }



  .w3-left,

  .w3-right,

  .w3-badge {

    cursor: pointer
  }



  .w3-badge {

    height: 13px;

    width: 13px;

    padding: 0;

    margin-top: 7px;

  }



  .crdstyle {

    position: relative;

    height: 200px;

    width: 170px;

  }



  .btmrght {

    position: absolute;

    bottom: 10px;

    right: 0px;

    width: auto;

    /* border: 3px solid #73AD21; */

    padding: 10px;

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

        <!-- take the full name from database -->

        <!-- <a href="profile.php" class="w3-bar-item w3-button" title="profile"><i class="fa fa-user"></i></a> -->

      </div>

    </div>

    <div class="w3-container w3-light-grey w3-margin-top">

      <h6 style="padding-top:3px">Menu</h6>

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

      <p id="session"><?= $_SESSION['loginvia']; ?></p>

      <img src="/img/logo_brains_uny.jpg" style="width: 185px;">

    </div>

  </nav>





  <!-- Overlay effect when opening sidebar on small screens -->

  <div class="w3-overlay w3-hide-large w3-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>



  <!-- !PAGE CONTENT! -->

  <div class="w3-main" style="margin-left:200px;margin-top:40px;">



    <!-- Header -->

    <div class="w3-half">

      <header class="w3-container">

        <h5 class="animate__animated animate__bounce" style="padding:30px 0 0 10px"><b><i class="fa fa-dashboard"></i> <?= $lang_dashboard; ?></b></h5>

      </header>

    </div>

    <div class="w3-half" style="padding:30px 0 0 10px">

      <!-- recorder switch -->

      <div class="w3-right" style="margin: -5px 50px 0 0;">

        <label style="position:absolute;margin: 5px 0 0 -70px;">Recorder</label>

        <label class="switch">

          <input id="sw_rec1" type="checkbox">

          <span class="slider round"></span>

        </label>

      </div>

    </div>



    <label style="margin-left: 20px;">Instansi:</label>

    <select id="selInstansi" class="w3-select w3-round w3-border" style="width:max-content;"></select>



    <!-- recorder modal -->

    <div id="m_videoRec" class="modal fade mr-tp-100" role="dialog">

      <div class="modal-dialog modal-xl w3-center">

        <div class="modal-content" style="width: 700px;">

          <div class="modal-header">

            <h4 class="modal-title">Recorder</h4>

            <button type="button" class="close" data-dismiss="modal">×</button>

          </div>

          <div class="modal-body">

            <form id="uploadVid">

              <div id="videorec-holder" class="w3-center">

                <h5 id="h-titlevideorec">video title</h5>

                <div class="w3-center">

                  <video id="videorec" name="videoRec" width="640" height="360" autoplay loop controls></video>

                  <div id="canvasRec-holder"></div>

                </div>

              </div>

            </form>

          </div>

          <div class="modal-footer">

            <div id="sw-holder">

              <label>OFF</label>

              <label class="switch">

                <input id="sw_rec2" type="checkbox">

                <span class="slider round"></span>

              </label>

              <label>ON</label>

            </div>

            <div id="videorec-panel" class="w3-panel">

              <button id="btn-confirmVid" class="w3-button w3-round w3-khaki" name="save"><i class="fa fa-save"></i> <?= $lang_save; ?></button>

              <button id="btn-downloadVid" class="w3-button w3-round w3-khaki"><i class="fa fa-download"></i> <?= $lang_download; ?></button>

            </div>

          </div>

        </div>

      </div>

    </div>



    <!-- dashboard overview -->

    <div class="w3-row-padding w3-margin-bottom" style="padding: 20px;">

      <div class="w3-quarter">

        <div class="w3-container w3-red w3-padding-16">

          <div class="w3-left"><i class="fa fa-university w3-xxxlarge"></i></div>

          <div class="w3-right">

            <h3 id="ov_kelas"></h3>

          </div>

          <div class="w3-clear"></div>

          <h4><?= $lang_classroom; ?></h4>

        </div>

      </div>

      <div class="w3-quarter">

        <div class="w3-container w3-light-grey w3-padding-16">

          <div class="w3-left"><i class="fa fa-share-alt w3-xxxlarge"></i></div>

          <div class="w3-right">

            <h3 id="ov_meeting"></h3>

          </div>

          <div class="w3-clear"></div>

          <h4><?= $lang_meeting; ?></h4>

        </div>

      </div>

      <div class="w3-quarter">

        <div class="w3-container w3-teal w3-padding-16">

          <div class="w3-left"><i class="fa fa-users w3-xxxlarge"></i></div>

          <div class="w3-right">

            <h3 id="ov_siswa"></h3>

          </div>

          <div class="w3-clear"></div>

          <h4><?= $lang_students_data; ?></h4>

        </div>

      </div>

      <div class="w3-quarter">

        <div class="w3-container w3-orange w3-text-white w3-padding-16">

          <div class="w3-left"><i class="fa fa-check w3-xxxlarge"></i></div>

          <div class="w3-right">

            <h3 id="ov_scored"></h3>

          </div>

          <div class="w3-clear"></div>

          <h4><?= $lang_scored; ?></h4>

        </div>

      </div>

    </div>



    <!-- classroom panel -->

    <div class="w3-panel">

      <h5><?= $lang_classroom_list; ?> (<span id="card_total"></span>)</h5>

      <div id="card_panel" class="w3-panel">

      </div>

    </div>



    <!-- information panel -->

    <div class="w3-panel">

      <div class="w3-row-padding" style="margin:0 -16px">

        <!-- diagram -->

        <div class="w3-half">

          <h5><?= $lang_chart; ?> <span id="chartExp"></span></h5>

          <div class="w3-card">

            <canvas id="xChart" class="mySlides"></canvas>

            <!-- <canvas id="xiChart" class="mySlides"></canvas>

            <canvas id="xiiChart" class="mySlides"></canvas> -->

          </div>

          <!-- <div class="w3-content w3-display-container" style="margin-top: 25px;">

            <div class="w3-center w3-display-bottommiddle" style="width:100%">

              <div class="w3-left w3-large" onclick="plusDivs(-1)"><i class="fa fa-chevron-left"></i></div>

              <div class="w3-right w3-large" onclick="plusDivs(1)"><i class="fa fa-chevron-right"></i></div>

              <span class="w3-badge demo w3-border w3-white" onclick="currentDiv(1)"></span>

              <span class="w3-badge demo w3-border w3-white" onclick="currentDiv(2)"></span>

              <span class="w3-badge demo w3-border w3-white" onclick="currentDiv(3)"></span>

            </div>

          </div> -->

        </div>

        <!-- feeds -->

        <div class="w3-half">

          <h5><?= $lang_feeds; ?></h5>

          <table id="feeds_table" class="w3-table w3-striped w3-white w3-card">

            <tr></tr>

            <!-- <tr>

              <td><i class="fa fa-user w3-text-light-grey w3-large"></i></td>

              <td>New record, over 90 views.</td>

              <td><i>10 min ago</i></td>

            </tr> -->

            <!-- <tr>

              <td><i class="fa fa-bell w3-text-red w3-large"></i></td>

              <td>Database error.</td>

              <td><i>7 hours ago</i></td>

            </tr>

            <tr>

              <td><i class="fa fa-users w3-text-yellow w3-large"></i></td>

              <td>New record, over 40 users.</td>

              <td><i>13/06/2021</i></td>

            </tr>

            <tr>

              <td><i class="fa fa-comment w3-text-red w3-large"></i></td>

              <td>New comments.</td>

              <td><i>5/06/2021</i></td>

            </tr>

            <tr>

              <td><i class="fa fa-bookmark w3-text-light-grey w3-large"></i></td>

              <td>Check transactions.</td>

              <td><i>1/06/2021</i></td>

            </tr>

            <tr>

              <td><i class="fa fa-laptop w3-text-red w3-large"></i></td>

              <td>CPU overload.</td>

              <td><i>30/05/2021</i></td>

            </tr>

            <tr>

              <td><i class="fa fa-share-alt w3-text-green w3-large"></i></td>

              <td>New shares.</td>

              <td><i>24/05/2021</i></td>

            </tr> -->

          </table>

        </div>

      </div>

    </div>

    <hr>



    <!-- general stats -->

    <div class="w3-container">

      <h5><?= $lang_general_stats; ?></h5>

      <p><?= $lang_netral; ?></p>

      <div class="w3-grey" style="margin: -10px 0 10px 0">

        <div id="gsNetral" class="w3-container w3-center w3-padding w3-aqua"></div>

      </div>



      <p><?= $lang_happy; ?></p>

      <div class="w3-grey" style="margin: -10px 0 10px 0">

        <div id="gsHappy" class="w3-container w3-center w3-padding w3-yellow"></div>

      </div>



      <p><?= $lang_interest; ?></p>

      <div class="w3-grey" style="margin: -10px 0 10px 0">

        <div id="gsInterest" class="w3-container w3-center w3-padding w3-green"></div>

      </div>



      <p><?= $lang_boredom; ?></p>

      <div class="w3-grey" style="margin: -10px 0 10px 0">

        <div id="gsBoredom" class="w3-container w3-center w3-padding w3-indigo"></div>

      </div>



      <p><?= $lang_frustation; ?></p>

      <div class="w3-grey" style="margin: -10px 0 10px 0">

        <div id="gsFrustation" class="w3-container w3-center w3-padding w3-red"></div>

      </div>



      <p><?= $lang_aphatetic; ?></p>

      <div class="w3-grey" style="margin: -10px 0 10px 0">

        <div id="gsAphatetic" class="w3-container w3-center w3-padding w3-brown"></div>

      </div>

    </div>

    <hr>



    <div class="w3-container">

      <h5><?= $lang_best; ?></h5>

      <!-- <div class="container">

        <table id="best-list" class="table table-striped table-bordered" width="100%"></table>

      </div> -->

      <table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">

        <tr>

          <th>No.</th>

          <th><?= $lang_student_name; ?></th>

          <th><?= $lang_class; ?></th>

          <th><?= $lang_good_emotion; ?></th>

          <th><?= $lang_bad_emotion; ?></th>

        </tr>

        <tr>

          <td>1</td>

          <td>Alwi</td>

          <td>XA</td>

          <td>65%</td>

          <td>65%</td>

        </tr>

        <tr>

          <td>2</td>

          <td>Suprana</td>

          <td>XD</td>

          <td>65%</td>

          <td>15.7%</td>

        </tr>

        <tr>

          <td>3</td>

          <td>Diana</td>

          <td>XD</td>

          <td>65%</td>

          <td>5.6%</td>

        </tr>

        <tr>

          <td>4</td>

          <td>Layla</td>

          <td>XB</td>

          <td>65%</td>

          <td>2.1%</td>

        </tr>

        <tr>

          <td>5</td>

          <td>Bagus</td>

          <td>XC</td>

          <td>65%</td>

          <td>1.9%</td>

        </tr>

        <tr>

          <td>6</td>

          <td>Andriana</td>

          <td>XA</td>

          <td>65%</td>

          <td>1.5%</td>

        </tr>

      </table><br>

      <a href="../../../students.php" class="w3-button w3-dark-grey"><?= $lang_more; ?> <i class="fa fa-arrow-right"></i></a>

    </div>

    <hr>

    <div class="w3-container">

      <h5><?= $lang_recent_views; ?></h5>

      <ul class="w3-ul w3-card-4 w3-white">

        <li class="w3-padding-16">

          <img src="../../../app_icon.png" class="w3-left w3-circle w3-margin-right" style="width:35px">

          <span class="w3-xlarge">Bayu</span><br>

        </li>

        <li class="w3-padding-16">

          <img src="../../../app_icon2.png" class="w3-left w3-circle w3-margin-right" style="width:35px">

          <span class="w3-xlarge">Riana</span><br>

        </li>

        <li class="w3-padding-16">

          <img src="../../../app_icon3.png" class="w3-left w3-circle w3-margin-right" style="width:35px">

          <span class="w3-xlarge">Felix</span><br>

        </li>

      </ul>

    </div>

    <hr>



    <div class="w3-container">

      <h5><?= $lang_recent_comments; ?></h5>

      <div class="w3-row">

        <div class="w3-col m2 text-center">

          <img class="w3-circle" src="../../../app_icon4.png" style="width:96px;height:96px">

        </div>

        <div class="w3-col m10 w3-container">

          <h4>Budi <span class="w3-opacity w3-medium">Sep 29, 2014, 9:12 PM</span></h4>

          <p>Keep up the GREAT work! I am cheering for you!! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><br>

        </div>

      </div>



      <div class="w3-row">

        <div class="w3-col m2 text-center">

          <img class="w3-circle" src="../../../app_icon5.png" style="width:96px;height:96px">

        </div>

        <div class="w3-col m10 w3-container">

          <h4>Bonita <span class="w3-opacity w3-medium">Sep 28, 2014, 10:15 PM</span></h4>

          <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><br>

        </div>

      </div>

    </div>

    <br>

    <!-- <div class="w3-container w3-dark-grey w3-padding-32">

      <div class="w3-row">

        <div class="w3-container w3-third">

          <h5 class="w3-bottombar w3-border-green">Demographic</h5>

          <p>Language</p>

          <p>Country</p>

          <p>City</p>

        </div>

        <div class="w3-container w3-third">

          <h5 class="w3-bottombar w3-border-red">System</h5>

          <p>Browser</p>

          <p>OS</p>

          <p>More</p>

        </div>

        <div class="w3-container w3-third">

          <h5 class="w3-bottombar w3-border-orange">Target</h5>

          <p>Users</p>

          <p>Active</p>

          <p>Geo</p>

          <p>Interests</p>

        </div>

      </div>

    </div> -->



    <!-- Footer -->

    <footer class="w3-light-grey">

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



    // var slideIndex = 1;

    // showDivs(slideIndex);



    // function plusDivs(n) {

    //   showDivs(slideIndex += n);

    // }



    // function currentDiv(n) {

    //   showDivs(slideIndex = n);

    // }



    // function showDivs(n) {

    //   var i;

    //   var x = document.getElementsByClassName("mySlides");

    //   var dots = document.getElementsByClassName("demo");

    //   if (n > x.length) {

    //     slideIndex = 1

    //   }

    //   if (n < 1) {

    //     slideIndex = x.length

    //   }

    //   for (i = 0; i < x.length; i++) {

    //     x[i].style.display = "none";

    //   }

    //   for (i = 0; i < dots.length; i++) {

    //     dots[i].className = dots[i].className.replace(" w3-black", " w3-white");

    //   }

    //   x[slideIndex - 1].style.display = "block";

    //   dots[slideIndex - 1].className += " w3-black";

    // }
  </script>



  <script type="text/javascript" src="../../../assets/jquery/jquery-3.6.0.min.js"></script>

  <!-- Bootstrap -->

  <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script> -->

  <script type="text/javascript" src="../../../assets/bootstrap-4.1.3-dist/js/bootstrap.min.js"></script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>

  <!-- <script type="text/javascript" src="../../../assets/popper/popper.min.js"></script> -->

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/p5.js"></script> -->

  <script type="text/javascript" src="../../../assets/p5/p5.min.js"></script>

  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/addons/p5.sound.min.js"></script> -->

  <script type="text/javascript" src="../../../assets/p5/addons/p5.sound.min.js"></script>

  <!-- <script src="https://unpkg.com/ml5@0.5.0/dist/ml5.min.js"></script> -->

  <script type="text/javascript" src="../../../assets/ml5/ml5.min.js"></script>

  <!-- Sweet Alert -->

  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.33.1/sweetalert2.min.js"></script> -->

  <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>



  <script src="js/dashboard.js"></script>



</body>



</html>