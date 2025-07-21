// id element declaration
let btnCreateNew = $("#btn-create-new");
let btnCreateClass = $("#btn-create");
let btnSave = $("#btn-save");
let btnOpen = $("#btn-open");
let btnClose = $("#btn-close");
let modalNewClass = $("#m_createNew");
let inClass = $("#in_Class");
let inCourse = $("#in_Course");
let inEnrollKey = $("#in_enrollKey");
let inClassName = $("#in_className");
let classesList = $("#classes-list");
let edClass = $("#ed_Class");
let edCourse = $("#ed_Course");
let edEnrollKey = $("#ed_enrollKey");
let edClassName = $("#ed_className");
let edNumJoin = $("#ed_numJoin");
let edClassState = $("#ed_classState");
let sClass = $("#s_Class");
let sCourse = $("#s_Course");
let sKeyword = $("#s_Keyword");
let mViEd = $("#m_ViEd");
let pClassroomName = $("#p_classroomName");
let pCourseName = $("#p_courseName");
let pClassName = $("#p_className");
let pNumJoin = $("#p_numJoin");
let pClassState = $("#p_classState");
let pEnrollKey = $("#p_enrollKey");
let editor = $(".editor");
let viewer = $(".viewer");
let idRow;
let chartContainer = $("#chartContainer");
let styledModal = $(".styled");
let selInstance = $("#selInstansi");
let instance;

let inNamePrev = $("#in_namePrev");
let sClassPrev = $("#s_classPrev");
let sCoursePrev = $("#s_coursePrev");
let inEnrollPrev = $("#in_enrollPrev");

setSelInstance();

setTimeout(() => {
  setSelClass();
  setSelCourse();
}, 1000);

function setSelInstance() {
  $.ajax({
    url: "dashboard_action.php",
    type: "POST",
    data: { jenis: "setselectins" },
    success: function (response) {
      console.log(response);
      for (let i = 0; i < response.length; i++) {
        const d = response[i];
        let option;

        option = "<option>";
        option += d.instansi;
        option += "</option>";

        selInstance.append(option);
      }
    },
  });
}

function setSelClass() {
  instance = selInstance.val();
  console.log(instance);
  $.ajax({
    type: "POST",
    url: "siswa_action.php",
    data: { instansi: instance, jenis: "setselectclass" },
    dataType: "json",
    success: function (response) {
      console.log(response);
      sClass.empty();
      sClass.append("<option label='semua'></option>");
      edClass.append(
        "<option label='pilih...' style='display: none;'></option>"
      );
      inClass.append(
        "<option label='pilih...' style='display: none;'></option>"
      );
      for (let i = 0; i < response.length; i++) {
        const data = response[i];
        let option;

        option = "<option value='";
        option += data.id_kelas;
        option += "'>";
        option += data.kelas;
        option += "</option>";

        sClass.append(option);
        edClass.append(option);
        inClass.append(option);
      }
    },
  });
}

function setSelCourse() {
  instance = selInstance.val();
  console.log(instance);
  $.ajax({
    type: "POST",
    url: "siswa_action.php",
    data: { instansi: instance, jenis: "setselectcourse" },
    dataType: "json",
    success: function (response) {
      console.log(response);
      sCourse.empty();
      sCourse.append("<option label='semua'></option>");
      edCourse.append(
        "<option label='pilih...' style='display: none;'></option>"
      );
      inCourse.append(
        "<option label='pilih...' style='display: none;'></option>"
      );
      for (let i = 0; i < response.length; i++) {
        const data = response[i];
        let option;

        option = "<option>";
        option += data.course_name;
        option += "</option>";

        sCourse.append(option);
        edCourse.append(option);
        inCourse.append(option);
      }
    },
  });
}

btnCreateNew.click(() => {
  modalNewClass.modal("show");
});

btnCreateClass.click(() => {
  editor.hide();

  let doType = "tambah_data";
  let vClassName = inClassName.val();
  let vEnrollKey = inEnrollKey.val();
  let vCourse = inCourse.val();
  let vClass = inClass.val();
  instance = selInstance.val();

  $.ajax({
    type: "POST",
    url: "class_action.php",
    data: {
      jenis: doType,
      classroom_name: vClassName,
      enroll_key: vEnrollKey,
      course_name: vCourse,
      class_name: vClass,
      instansi: instance,
    },
    dataType: "json",
    success: function (response) {
      if (response.code == 200) {
        Swal.fire({
          icon: response.status,
          title: "Sukses",
          text: response.message,
          // animation: false,
          customClass: "animate__animated animate__bounce",
        }).then((result) => {
          classesList.DataTable().ajax.reload(null, false);
          document.getElementById("formNewClass").reset();
          modalNewClass.modal("hide");
        });
      } else {
        Swal.fire({
          icon: response.status,
          title: response.message,
          text: "",
        });
      }
    },
  });
});

//Mengirimkan Token Keamanan
$.ajaxSetup({
  headers: {
    "Csrf-Token": $('meta[name="csrf-token"]').attr("content"),
  },
});

let s_Id = "";
let table = "";

selInstance.change(() => {
  instance = selInstance.val();
  console.log(instance);
  setSelClass();
  setSelCourse();
  setTimeout(() => {
    setDatatable();
  }, 1000);
});

// setDatatable();
function setDatatable() {
  let doType = "view_data";
  let vClass = sClass.val();
  let vCourse = sCourse.val();
  let vKeyword = sKeyword.val();
  instance = selInstance.val();

  // console.log("vclass:" + vClass);
  // console.log("vcourse:" + vCourse);
  // console.log("vkeyword:" + vKeyword);

  table = classesList.DataTable({
    language: {
      zeroRecords: "Data tidak tersedia",
    },
    lengthMenu: [
      [5, 10, 25, 50, -1],
      [5, 10, 25, 50, "All"],
    ],
    destroy: true,
    paging: true,
    sorting: true,
    responsive: true,
    ajax: {
      type: "POST",
      url: "class_action.php", //URL
      data: {
        jenis: doType,
        kelas: vClass,
        mapel: vCourse,
        keyword: vKeyword,
        instansi: instance,
      }, // PARAM
      timeout: 120000,
      dataSrc: function (json) {
        if (json != null) {
          return json;
        } else {
          return "";
        }
      },
    },
    sAjaxDataProp: "",
    width: "100%",
    order: [[0, "asc"]],
    dom:
      `<'w3-row'<'w3-col s6 m6 l6 w3-padding-small'l>>` +
      `<'w3-row'<'w3-col s12 m12 l12'tr>>` +
      `<'w3-row'<'w3-col s6 m6 l6'i><'w3-col s6 m6 l6'p>>`,
    aoColumns: [
      {
        name: "No",
        title: "No",
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      {
        data: "classroom_name",
        name: "Nama Ruang Kelas",
        title: "Nama Ruang Kelas",
      },
      { data: "course_name", name: "Mata Pelajaran", title: "Mata Pelajaran" },
      {
        data: "class_name",
        name: "Kelas",
        title: "Kelas",
      },
      { data: "num_join", name: "Jumlah Siswa", title: "Jumlah Siswa" },
      { data: "class_state", name: "Status", title: "Status" },
      {
        data: null,
        name: "Aksi",
        title: "Aksi",
        width: "90px",
        render: function (data, row, type, meta) {
          return (
            `<button id="` +
            data.id +
            `" class="btn btn-primary btn-sm view_data" title="Lihat Data"> <i class="fa fa-search"></i></button>
                <button id="` +
            data.id +
            `" class="btn btn-success btn-sm edit_data" title="Edit Data"> <i class="fa fa-edit"></i></button>
                <button id="` +
            data.id +
            `" class="btn btn-danger btn-sm hapus_data" title="Hapus Data"> <i class="fa fa-trash"></i></button>
                `
          );
        },
      },
    ],
  });

  // table.buttons().container().appendTo("#dataTable_wrapper .col-md-6:eq(0)");
  // $("#innilai").detach().prependTo(".placebutton");
  // table.buttons().container().appendTo("#placebutton");

  $("#classes-list tbody").on("click", ".view_data", function () {
    styledModal.css("max-width", "800px");
    // chartContainer.show();
    viewer.show();
    editor.hide();

    let data = table.row($(this).parents("tr")).data();
    let id = $(this).attr("id");
    idRow = id;
    // console.log("id tbody: " + id);

    let classroom_name = data["classroom_name"];
    let course_name = data["course_name"];
    let class_name = data["class_name"];
    let enroll_key = data["enroll_key"];
    let num_join = data["num_join"];
    let class_state = data["class_state"];

    pClassroomName.html(classroom_name);
    pCourseName.html(course_name);
    pClassName.html(class_name);
    pEnrollKey.html(enroll_key);
    pNumJoin.html(num_join);
    pClassState.html(class_state);

    if (class_state == "Aktif") {
      btnOpen.hide();
      btnClose.show();
    } else {
      btnOpen.show();
      btnClose.hide();
    }

    let doType = "view_data_by_id";
    let chartData;
    let eS = [];
    let dtsLabel = [];

    $.ajax({
      type: "POST",
      url: "class_action.php",
      data: { id: id, jenis: doType },
      dataType: "json",
      success: function (response) {
        if (response == null) {
          location.reload();
        }
        // console.log(response[0]);
        // console.log(response[1]);
        for (let r = 0; r < response.length; r++) {
          const data = response[r];
          dtsLabel[r] = data.pertemuan_ke;
          eS.push([
            r,
            data.senang,
            data.netral,
            data.tidak_ada,
            data.bosan,
            data.kecewa,
          ]);
        }
        // console.log(dtsLabel);
        // console.table(eS);
        // console.log(eS[0][1]);
        // console.log(eS.length);

        if (typeof resultChart === "undefined") {
          chartData = createChart(
            1,
            eS[0][1],
            eS[0][2],
            eS[0][3],
            eS[0][4],
            eS[0][5]
          );
          resultChart = new Chart(
            document.getElementById("classChart"),
            chartData
          );
          if (dtsLabel.length > 1) {
            for (let d = 1; d <= dtsLabel.length; d++) {
              const data = eS[d];
              if (data !== undefined) {
                const newDataset = {
                  label: d + 1,
                  data: [data[1], data[2], data[3], data[4], data[5]],
                  fill: true,
                  backgroundColor: dsColor(d, true),
                  borderColor: dsColor(d, false),
                  pointBackgroundColor: dsColor(d, false),
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: dsColor(d, false),
                  order: dtsLabel.length - d,
                };
                resultChart.data.datasets.push(newDataset);
              }
            }
            resultChart.data.datasets[0].order = dtsLabel.length;
            resultChart.update();
          }
        } else {
          let deleted = resultChart.data.datasets;
          // console.log(deleted);
          deleted.splice(0, deleted.length);
          // console.log(deleted);
          for (let i = 0; i < dtsLabel.length; i++) {
            const data = eS[i];
            const newDataset = {
              label: i + 1,
              data: [data[1], data[2], data[3], data[4], data[5]],
              fill: true,
              backgroundColor: dsColor(i, true),
              borderColor: dsColor(i, false),
              pointBackgroundColor: dsColor(i, false),
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: dsColor(i, false),
              order: dtsLabel.length - i,
            };
            resultChart.data.datasets.push(newDataset);
          }
          resultChart.update();
        }
      },
    });
    styledModal.css("margin-top", "20px");
    mViEd.modal("show");
  });

  $("#classes-list tbody").on("click", ".edit_data", function () {
    styledModal.css("max-width", "450px");
    styledModal.css("margin-top", "100px");
    // chartContainer.hide();
    btnClose.hide();
    btnOpen.hide();
    editor.show();
    viewer.hide();

    let id = $(this).attr("id");
    // console.log("id: " + id);
    s_Id = id;

    let data = table.row($(this).parents("tr")).data();

    let classroom_name = data["classroom_name"];
    let course_name = data["course_name"];
    let class_name = data["class_name"];
    let enroll_key = data["enroll_key"];
    let num_join = data["num_join"];
    let class_state = data["class_state"];

    edClassName.val(classroom_name);
    edEnrollKey.val(enroll_key);
    edCourse.val(course_name);
    edClass.val(class_name);
    edNumJoin.html(num_join);
    edClassState.html(class_state);

    inNamePrev.val(classroom_name);
    inEnrollPrev.val(enroll_key);
    sCoursePrev.val(course_name);
    sClassPrev.val(class_name);

    mViEd.modal("show");
  });

  $("#classes-list tbody").on("click", ".hapus_data", function () {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      // animation: false,
      customClass: "animate__animated animate__tada",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        let id = $(this).attr("id");
        let doType = "delete_data";

        $.ajax({
          type: "POST",
          url: "class_action.php",
          data: { id: id, jenis: doType },
          success: function (response) {
            if (response.code == 200) {
              Swal.fire({
                icon: response.status,
                title: "Sukses",
                text: response.message,
                // animation: false,
                customClass: "animate__animated animate__bounce",
              }).then((result) => {
                classesList.DataTable().ajax.reload(null, false);
              });
            } else {
              Swal.fire({
                icon: response.status,
                title: response.message,
                text: "",
              });
            }
          },
          error: function (response) {
            console.log(response.responseText);
          },
        });
      }
    });
  });
}

sClass.change(function () {
  setDatatable();
});

sCourse.change(function () {
  setDatatable();
});

sKeyword.keyup(function () {
  setDatatable();
});

function editData() {
  let classroom_name = edClassName.val();
  let enroll_key = edEnrollKey.val();
  let class_name = edClass.val();
  let course_name = edCourse.val();
  // instance = selInstance.val();

  let jenis = "";
  if (s_Id != "") {
    jenis = "edit_data";
  }

  if (
    classroom_name != "" &&
    enroll_key != "" &&
    class_name != "" &&
    course_name != ""
  ) {
    let formData = new FormData();
    formData.append("jenis", jenis);
    formData.append("id", s_Id);
    formData.append("classroom_name", classroom_name);
    formData.append("enroll_key", enroll_key);
    formData.append("class_name", class_name);
    formData.append("course_name", course_name);
    // formData.append("instansi", instance);

    $.ajax({
      type: "POST",
      url: "class_action.php",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      // beforeSend: () => {
      //   Swal.fire({
      //     html: "Proses",
      //     timerProgressBar: true,
      //     // onBeforeOpen: () => {
      //     //   Swal.showLoading();
      //     // },
      //     // allowOutsideClick: () => !Swal.isLoading(),
      //   });
      // },
      success: function (response) {
        if (response.code == 200) {
          Swal.fire({
            icon: response.status,
            title: response.message,
            // animation: false,
            customClass: "animate__animated animate__fadeInDown",
          }).then((result) => {
            classesList.DataTable().ajax.reload(null, false);
            mViEd.modal("hide");
          });
        } else {
          Swal.fire({
            icon: response.status,
            title: response.message,
            text: "",
          });
        }
      },
      error: function (response) {
        Swal.close();
        console.log(response.responseText);
      },
    });
  }
}

btnSave.click(function () {
  editData();
});

btnOpen.click(function () {
  // make class_state aktif
  let id = idRow;
  let classState = "Aktif";
  // console.log("id:" + id + " state:" + classState);
  updateState(id, classState);
});

btnClose.click(() => {
  let id = idRow;
  let classState = "Tidak Aktif";
  // console.log("id:" + id + " state:" + classState);

  updateState(id, classState);
});

function updateState(id, classState) {
  let doType = "update_state";
  $.ajax({
    type: "POST",
    url: "class_action.php",
    data: { id: id, jenis: doType, class_state: classState },
    dataType: "json",
    success: function (response) {
      if (response.code == 200) {
        Swal.fire({
          icon: response.status,
          title: "Sukses",
          text: response.message,
          // animation: false,
          customClass: "animate__animated animate__fadeInDown",
        }).then((result) => {
          classesList.DataTable().ajax.reload(null, false);
          mViEd.modal("hide");
        });
      } else {
        Swal.fire({
          icon: response.status,
          title: response.message,
          text: "",
        });
      }
    },
  });
}

function dsColor(number, t) {
  const color = {
    red: "rgb(255, 99, 132)",
    green: "rgb(75, 192, 192)",
    orange: "rgb(255, 159, 64)",
    blue: "rgb(54, 162, 235)",
    yellow: "rgb(255, 205, 86)",
    purple: "rgb(153, 102, 255)",
    grey: "rgb(201, 203, 207)",
  };
  const color_name = [
    color.red,
    color.green,
    color.orange,
    color.blue,
    color.yellow,
    color.purple,
    color.grey,
  ];
  const transparent = {
    red: "rgb(255, 99, 132, 0.7)",
    green: "rgb(75, 192, 192, 0.7)",
    orange: "rgb(255, 159, 64, 0.7)",
    blue: "rgb(54, 162, 235, 0.7)",
    yellow: "rgb(255, 205, 86, 0.7)",
    purple: "rgb(153, 102, 255, 0.7)",
    grey: "rgb(201, 203, 207, 0.7)",
  };
  const transparent_name = [
    transparent.red,
    transparent.green,
    transparent.orange,
    transparent.blue,
    transparent.yellow,
    transparent.purple,
    transparent.grey,
  ];

  if (number > color_name.length) {
    number = number % color_name.length;
  }

  if (t == true) {
    return transparent_name[number];
  } else {
    return color_name[number];
  }
}

function createChart(dtsLabel, senang, netral, tidak_ada, bosan, kecewa) {
  // buat parameter untuk input masing2 emotional state
  const userData = {
    labels: ["Senang", "Netral", "Tidak Ada", "Bosan", "Kecewa"],
    datasets: [
      {
        label: dtsLabel,
        data: [senang, netral, tidak_ada, bosan, kecewa],
        fill: true,
        backgroundColor: dsColor(0, true),
        borderColor: dsColor(0, false),
        pointBackgroundColor: dsColor(0, false),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: dsColor(0, false),
      },
    ],
  };

  const userConfig = {
    type: "radar",
    data: userData,
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };

  return userConfig;
}
