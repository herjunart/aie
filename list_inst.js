// $(document).ready(function () {
//Kodenya di dalam sini

//variable id declaration
let sClass = $("#s_Class");
let sCourse = $("#s_Course");
let btnAdd = $("#btn-Add");
let btnAddSingle = $("#btn-addSingle");
let btnAddMulti = $("#btn-addMulti");
let btnInScore = $("#btn-In_score");
let sKeyword = $("#s_Keyword");
let inPrevPhoto = $("#in_Prev_photo");
let inPhoto = $("#in_Photo");
let inName = $("#in_Name");
let errInName = $("#err_in_Name");
let inGender1 = $("#in_Gender1");
let inGender2 = $("#in_Gender2");
let errInGender = $("#err_in_Gender");
let inID = $("#in_Id");
let errInID = $("#err_in_Id");
let sClassAdd = $("#s_Class_add");
let errSClassAdd = $("#err_s_Class_add");
let inEmail = $("#in_Email");
let errInEmail = $("#err_in_Email");
let btnSave = $("#btn-Save");
let imgPhoto = $("#img_Photo");
let pName = $("#p_Name");
let pGender = $("#p_Gender");
let pId = $("#p_Id");
let pClass = $("#p_Class");
let pEmail = $("#p_Email");
let pNilai = $("#p_Nilai");
let instList = $("#inst-list");
let mView = $("#modal_view");
let mAddEdit = $("#modal_add_edit");
let mChoice = $("#modal_choice");
let mAddMulti = $("#modal_add_multi");
let formEdit = document.getElementById("form-edit");
let hAdd = $("#h_add");
let hEdit = $("#h_edit");
let iPlus = $("#i_plus");
let multiIn = $("#multiIn");
let inMulti = $("#in_multi");
let rowIn = $("#rowIn");
let userChart = $("#userChart");
let styledModal = $(".styled");
let selInstance = $("#selInstansi");
let instance;
let selVid = $("#sel_vid");
let vidPn = $("#vid_penilaian");

setSelInstance();
// setTimeout(() => {
//   setSelClass();
//   setSelCourse();
// }, 1000);

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
      instance = selInstance.val();
      // setSelClass();
      // setSelCourse();
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
      for (let i = 0; i < response.length; i++) {
        const data = response[i];
        let option;

        option = "<option value='";
        option += data.id_kelas;
        option += "'>";
        option += data.kelas;
        option += "</option>";

        sClass.append(option);
        sClassAdd.append(option);
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
      for (let i = 0; i < response.length; i++) {
        const data = response[i];
        let option;

        option = "<option>";
        option += data.course_name;
        option += "</option>";

        sCourse.append(option);
      }
    },
  });
}

//Mengirimkan Token Keamanan
$.ajaxSetup({
  headers: {
    "CSRF-Token": $('meta[name="CSRF-Token"]').attr("content"),
  },
});

let resultChart;
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

setTimeout(() => {
  setDatatable();
  console.log("out time");
}, 2000);

function setDatatable() {
  let type = "view_data";
  let vClass = sClass.val();
  let vKeyword = sKeyword.val();
  let vCourse = sCourse.val();
  instance = selInstance.val();
  console.log(vClass);
  console.log(vCourse);
  console.log(instance);

  table = instList.DataTable({
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
      url: "list_inst_action.php", //URL
      data: {
        jenis: type,
        kelas: vClass,
        keyword: vKeyword,
        mapel: vCourse,
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
      `<'w3-row'<'w3-col s6 m6 l6 w3-padding-small'l><'w3-col s6 m6 l6 w3-right'<'w3-right'B>>>` +
      `<'w3-row'<'w3-col s12 m12 l12'tr>>` +
      `<'w3-row'<'w3-col s6 m6 l6'i><'w3-col s6 m6 l6'p>>`,
    buttons: [
      {
        extend: "excelHtml5",
        filename: "List Instansi",
        title: "Rekap Data Daftar Instansi",
        footer: true,
        exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7],
          orthogonal: "export",
        },
      },
      {
        extend: "pdfHtml5",
        filename: "List Instansi",
        title: "Rekap Data Daftar Instansi",
        footer: true,
        exportOptions: {
          columns: [0, 2, 3, 4, 5, 6, 7],
          orthogonal: "export",
          modifier: {
            orientation: "landscape",
          },
        },
      },
    ],
    columnDefs: [
      {
        targets: -1,
        className: "dt-body-right",
      },
    ],
    aoColumns: [
      {
        name: "No",
        title: "No",
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      { data: "instansi", name: "instansi", title: "Nama Instansi" },
      { data: "id_instansi", name: "id_instansi", title: "ID" },
      { data: "alamat", name: "alamat", title: "Alamat" },
      { data: "rombel", name: "rombel", title: "Rombel" },
      {
        data: null,
        name: "Aksi",
        title: "Aksi",
        width: "100px",
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

  $("#inst-list tbody").on("click", ".view_data", function () {
    let id = $(this).attr("id");
    let doType = "view_data_by_id";
    let chartData;
    let eS = [];
    let dtsLabel = [];
    instance = selInstance.val();

    // mending ambil dari tabel aja, mengurangi distrak dari server, kecuali 6 skor emotional state nya
    let data = table.row($(this).parents("tr")).data();
    let foto = data["foto"];
    let nama = data["nama"];
    let nis = data["nis"];
    let kelas = data["kelas"];
    let jenkel = data["jenis_kelamin"];
    let email = data["email"];
    let nilai = data["nilai_akhir"];
    let classroom = data["classroom_name"];

    pName.html(nama);
    pId.html(nis);
    pClass.html(kelas);
    pGender.html(jenkel);
    pEmail.html(email);
    pNilai.html(nilai);
    imgPhoto.attr("src", foto);

    let vid_pertemuan = [];

    $.ajax({
      type: "POST",
      url: "siswa_action.php",
      data: {
        jenis: doType,
        nis: nis,
        classroom: classroom,
        instansi: instance,
      },
      dataType: "json",
      success: function (response) {
        // console.log(response[0]);
        // console.log(response[1]);

        for (let r = 0; r < response.length; r++) {
          const data = response[r];

          vid_pertemuan[data.id_pertemuan] = data.video;

          option = "<option value='";
          option += data.id_pertemuan;
          option += "'>";
          option += data.id_pertemuan;
          option += "</option>";

          selVid.append(option);

          dtsLabel[r] = data.id_pertemuan;
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
            document.getElementById("userChart"),
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

    selVid.change(() => {
      let value = selVid.val();
      let vidDir = vid_pertemuan[value];
      // console.log(vidDir);
      vidPn.attr("src", vidDir);
    });

    // console.log(resultChart.data);
    // resultChart.destroy();
    // resultChart = new Chart(document.getElementById("userChart"), chart[id]);
    // styledModal.css("max-width", "1000px");
    mView.modal("show");
  });

  $("#inst-list tbody").on("click", ".edit_data", function () {
    hAdd.hide();
    hEdit.show();
    resetWajib();
    let id = $(this).attr("id");
    s_Id = id;

    let data = table.row($(this).parents("tr")).data();
    inPrevPhoto.val(data["foto"]);
    inName.val(data["nama"]);
    inID.val(data["nis"]);
    sClassAdd.val(data["kelas"]);
    inEmail.val(data["email"]);

    if (data["jenis_kelamin"] == "Laki-laki") {
      inGender1.prop("checked", true);
    } else {
      inGender2.prop("checked", true);
    }

    mAddEdit.modal({
      focus: false,
    });
  });

  $("#inst-list tbody").on("click", ".hapus_data", function () {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
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
          url: "siswa_action.php",
          data: { id: id, jenis: doType },
          success: function (response) {
            if (response.code == 200) {
              Swal.fire({
                icon: response.status,
                title: "Sukses",
                text: response.message,
                customClass: "animate__animated animate__bounce",
              }).then((result) => {
                instList.DataTable().ajax.reload(null, false);
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

  // buat urusan pernilaian di sini=== tampil dan editnya
  $("#inst-list tbody").on("change", ".edit_nilai", function () {
    Swal.fire({
      title: "Anda yakin akan mengganti nilai?",
      text: "Anda nanti masih bisa menggantinya lagi",
      icon: "warning",
      customClass: "animate__animated animate__tada",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ganti nilainya!",
    }).then((result) => {
      console.log("masuk then");
      if (result.value) {
        let id = $(this).attr("id");
        let nilai = $(this).val();
        let doType = "edit_nilai";

        console.log("id:" + id);
        console.log("nilai:" + nilai);

        $.ajax({
          type: "POST",
          url: "siswa_action.php",
          data: { id: id, jenis: doType, nilai: nilai },
          success: function (response) {
            if (response.code == 200) {
              Swal.fire({
                icon: response.status,
                title: "Sukses",
                text: response.message,
                customClass: "animate__animated animate__bounce",
              }).then((result) => {
                instList.DataTable().ajax.reload(null, false);
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
  let value = sClass.val();
  console.log(value);
  setDatatable();
});

sKeyword.keyup(function () {
  setDatatable();
});

btnAdd.click(function () {
  mChoice.modal("show");
});

btnAddSingle.click(() => {
  mChoice.modal("hide");
  hEdit.hide();
  hAdd.show();
  mAddEdit.modal("show");
  formEdit.reset();

  resetWajib();
});

// mAddMulti.modal("show");

btnAddMulti.click(() => {
  mChoice.modal("hide");
  mAddMulti.modal("show");
});

function simpanData() {
  const foto = inPhoto.prop("files")[0];
  let foto_lama = inPrevPhoto.val();
  let jenkel = $("input[name=in_gender]:checked").val();
  let nama = inName.val();
  let email = inEmail.val();
  let nis = inID.val();
  let kelas = sClassAdd.val();
  let jenis = "";
  if (s_Id == "") {
    jenis = "tambah_data";
  } else {
    jenis = "edit_data";
  }

  if (jenkel == undefined) {
    errInGender.html("Jenis Kelamin Harus Dipilih");
  } else {
    errInGender.html("");
  }
  if (nama == "") {
    errInName.html("Nama Siswa Harus Diisi");
  } else {
    errInName.html("");
  }
  if (nis == "") {
    errInID.html("nis Siswa Harus Diisi");
  } else {
    errInID.html("");
  }
  if (kelas == "") {
    errSClassAdd.html("kelas Siswa Harus Diisi");
  } else {
    errSClassAdd.html("");
  }
  if (email == "") {
    errInEmail.html("email Siswa Harus Diisi");
  } else {
    errInEmail.html("");
  }

  if (
    nama != "" &&
    email != "" &&
    nis != "" &&
    kelas != "" &&
    jenkel != undefined
  ) {
    let formData = new FormData();
    formData.append("id", s_Id);
    formData.append("nama", nama);
    formData.append("jenkel", jenkel);
    formData.append("nis", nis);
    formData.append("kelas", kelas);
    formData.append("email", email);
    formData.append("jenis", jenis);
    formData.append("foto", foto);
    formData.append("foto_lama", foto_lama);

    $.ajax({
      type: "POST",
      url: "siswa_action.php",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      // beforeSend: () => {
      //   Swal.fire({
      //     html: "Proses",
      //     onBeforeOpen: () => {
      //       Swal.showLoading();
      //     },
      //     allowOutsideClick: () => !Swal.isLoading(),
      //   });
      // },
      success: function (response) {
        if (response.code == 200) {
          Swal.fire({
            icon: response.status,
            title: "Sukses",
            text: response.message,
            customClass: "animate__animated animate__fadeInDown",
          }).then((result) => {
            instList.DataTable().ajax.reload(null, false);
            mAddEdit.modal("hide");
            formEdit.reset();
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
  simpanData();
});

// formEdit.keypress(function (e) {
//   if (e.which == 13) {
//     simpanData();
//   }
// });

$(".wajib").change(function () {
  let name = $(this).attr("id");
  $("#err_" + name).html("");
});

function resetWajib() {
  let x = document.getElementsByClassName("wajib");
  let i;
  for (i = 0; i < x.length; i++) {
    let name = x[i].name;
    $("#err_" + name).html("");
  }
}

let _validFileExtensions = [".jpg", ".jpeg", ".png", ".gif"];
function validate(file) {
  var min = 1024 * 30; // MINIMAL 30kb
  var maks = 1024 * 1024 * 2; // MAKSIMAL 2MB
  if (file.type == "file") {
    var sFileName = file.value;
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (
          sFileName
            .substr(
              sFileName.length - sCurExtension.length,
              sCurExtension.length
            )
            .toLowerCase() == sCurExtension.toLowerCase()
        ) {
          blnValid = true;
          break;
        }
      }

      if (!blnValid) {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text:
            "Hanya menerima file dengan ekstensi : " +
            _validFileExtensions.join(", "),
        });

        file.value = "";
        return false;
      }

      if (file.files[0].size < min) {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "File foto terlalu kecil.\nMinimal berukuran 30kb.",
        });

        file.value = "";
        return false;
      }

      if (file.files[0].size > maks) {
        Swal.fire({
          icon: "warning",
          title: "Warning!",
          text: "File / Attachment terlalu besar.\nMaksimal besar file adalah 2MB.",
        });

        file.value = "";
        return false;
      }
    }
  }
  return true;
}

inPhoto.change(function () {
  validate(this);
});

let readyTo;
btnInScore.click(function () {
  if (readyTo == "input") {
    readyTo = "finish";
    setDatatable();
    // location.reload();
    btnInScore.html("Input Nilai");
  } else {
    // let data = table.row($(this).parents("tr")).data();
    readyTo = "input";
    setDatatable();
    btnInScore.html("Selesai");
  }
});

function rand1(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

iPlus.click(() => {
  let input = multiIn.html();
  // console.log(input);
  rowIn.append(input);
  mAddMulti.css("margin-top", "0");
});

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

function test() {
  let type = "view_data";
  let vClass = sClass.val();
  let vKeyword = sKeyword.val();
  let vCourse = sCourse.val();
  instance = selInstance.val();

  $.ajax({
    type: "POST",
    url: "siswa_action.php",
    data: {
      jenis: "view_data",
      kelas: vClass,
      keyword: vKeyword,
      mapel: vCourse,
      instansi: instance,
    },
    dataType: "json",
    success: function (response) {
      console.log(response);
      return false;
      for (let i = 0; i < response.length; i++) {
        const data = response[i];
        let value, option;
        value = classDict[data.class_name];

        option = "<option value='";
        option += data.class_name;
        option += "'>";
        option += value;
        option += "</option>";

        sClass.append(option);
      }
    },
  });
}
// });
