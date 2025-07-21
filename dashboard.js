function rand() {
  return Math.floor(Math.random() * 100 + 1);
}

function rand1(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let selInstance = $("#selInstansi");
let instance;
setSelectIns();

function setSelectIns() {
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

let ov_classroom = $("#ov_kelas");
let ov_students = $("#ov_siswa");
let ov_meeting = $("#ov_meeting");
let ov_scored = $("#ov_scored");

selInstance.change(() => {
  instance = selInstance.val();
  console.log(instance);
  recapDashboard();
  setChart();
  setCard();
});

// recapDashboard();

function recapDashboard() {
  instance = selInstance.val();
  console.log(instance);
  $.ajax({
    url: "dashboard_action.php",
    type: "POST",
    data: { instansi: instance, jenis: "recapitulation" },
    success: function (response) {
      console.log(response);
      if (response == null) {
        ov_classroom.html("0");
        ov_students.html("0");
        ov_meeting.html("0");
        ov_scored.html("0");
        return false;
      }
      let countMeet = response.count_meet;
      let countScored = response.nilai;

      console.log(response.time_now);
      // console.log(countScored);

      // date = new Date(response.time_now);
      // day = date.getDate();
      // month = date.getMonth() + 1; //to get the correct month you must add 1
      // year = date.getFullYear();
      // hour = date.getHours();
      // min = date.getMinutes();
      // console.log(year + "-" + month + "-" + day + " " + hour + ":" + min);

      if (countMeet == undefined || countScored == undefined) {
        ov_meeting.html("0");
        ov_scored.html("0");
      } else {
        let n_meeting = 0;
        n_scored = 0;
        for (let i = 0; i < countMeet.length; i++) {
          n_meeting += countMeet[i];
        }
        for (let j = 0; j < countScored.length; j++) {
          if (countScored[j] != "K") {
            n_scored += 1;
          }
        }

        ov_meeting.html(n_meeting);
        ov_scored.html(n_scored);
      }
    },
  });
}

// let chartData;
// let doType = "";
// let class_name = "X";
// let num_class = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// let dTidak_ada = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   dSenang = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   dBosan = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   dKecewa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   dNetral = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// let avgTidak_ada = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   avgSenang = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   avgBosan = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   avgKecewa = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   avgNetral = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let chartExp = $("#chartExp");
let resultChart;

function setChart() {
  let classConf, xConf, xiConf, xiiConf;
  let eS = [];
  let kLabel = [];

  instance = selInstance.val();
  console.log(instance);
  $.ajax({
    type: "POST",
    url: "dashboard_action.php",
    data: { instansi: instance, jenis: "class_chart" },
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response == null) {
        // alert("Belum ada diagram");
        chartExp.html(" (Data belum tersedia)");
        return false;
      }

      for (let i = 0; i < response.length; i++) {
        const data = response[i];

        kLabel[i] = data.classroom_name;
        eS.push([
          kLabel[i],
          data.senang,
          data.netral,
          data.tidak_ada,
          data.bosan,
          data.kecewa,
        ]);

        //   let strX = /X/g;
        //   let strXI = /XI/g;
        //   let strXII = /XII/g;
        //   let checkX = strX.test(kelas);
        //   let checkXI = strXI.test(kelas);
        //   let checkXII = strXII.test(kelas);

        //   if (checkX && !checkXI && !checkXII) {
        //     let x;
        //     switch (kelas) {
        //       case "XA1":
        //         x = 0;
        //         break;
        //       case "XA2":
        //         x = 1;
        //         break;
        //       case "XA3":
        //         x = 2;
        //         break;
        //       case "XA4":
        //         x = 3;
        //         break;
        //       case "XA5":
        //         x = 4;
        //         break;
        //       case "XA6":
        //         x = 5;
        //         break;
        //       case "XA7":
        //         x = 6;
        //         break;
        //       case "XS1":
        //         x = 7;
        //         break;
        //       case "XS2":
        //         x = 8;
        //         break;
        //       default:
        //         break;
        //     }

        //     num_class[x]++;
        //     dTidak_ada[x] += data.tidak_ada;
        //     dSenang[x] += data.senang;
        //     dBosan[x] += data.bosan;
        //     dKecewa[x] += data.kecewa;
        //     dNetral[x] += data.netral;
        //   } else if (checkX && checkXI && !checkXII) {
        //     let xi;
        //     switch (kelas) {
        //       case "XIA1":
        //         xi = 9;
        //         break;
        //       case "XIA2":
        //         xi = 10;
        //         break;
        //       case "XIA3":
        //         xi = 11;
        //         break;
        //       case "XIA4":
        //         xi = 12;
        //         break;
        //       case "XIA5":
        //         xi = 13;
        //         break;
        //       case "XIA6":
        //         xi = 14;
        //         break;
        //       case "XIA7":
        //         xi = 15;
        //         break;
        //       case "XIS1":
        //         xi = 16;
        //         break;
        //       case "XIS2":
        //         xi = 17;
        //         break;
        //       default:
        //         break;
        //     }

        //     num_class[xi]++;
        //     dTidak_ada[xi] += data.tidak_ada;
        //     dSenang[xi] += data.senang;
        //     dBosan[xi] += data.bosan;
        //     dKecewa[xi] += data.kecewa;
        //     dNetral[xi] += data.netral;
        //   } else if (checkX && checkXI && checkXII) {
        //     let xii;
        //     switch (kelas) {
        //       case "XIIA1":
        //         xii = 18;
        //         break;
        //       case "XIIA2":
        //         xii = 19;
        //         break;
        //       case "XIIA3":
        //         xii = 20;
        //         break;
        //       case "XIIA4":
        //         xii = 21;
        //         break;
        //       case "XIIA5":
        //         xii = 22;
        //         break;
        //       case "XIIA6":
        //         xii = 23;
        //         break;
        //       case "XIIA7":
        //         xii = 24;
        //         break;
        //       case "XIIS1":
        //         xii = 25;
        //         break;
        //       case "XIIS2":
        //         xii = 26;
        //         break;
        //       default:
        //         break;
        //     }

        //     num_class[xii]++;
        //     dTidak_ada[xii] += data.tidak_ada;
        //     dSenang[xii] += data.senang;
        //     dBosan[xii] += data.bosan;
        //     dKecewa[xii] += data.kecewa;
        //     dNetral[xii] += data.netral;
        //   }
      }
      // console.log(eS);

      // for (let j = 0; j < 26; j++) {
      //   avgTidak_ada[j] = dTidak_ada[j] / num_class[j];
      //   avgSenang[j] = dSenang[j] / num_class[j];
      //   avgBosan[j] = dBosan[j] / num_class[j];
      //   avgKecewa[j] = dKecewa[j] / num_class[j];
      //   avgNetral[j] = dNetral[j] / num_class[j];
      // }
      // console.log("num_class: " + num_class);

      // console.log("dTidak_ada: " + dTidak_ada);
      // console.log("dSenang: " + dSenang);
      // console.log("dBosan: " + dBosan);
      // console.log("dKecewa: " + dKecewa);
      // console.log("dNetral: " + dNetral);

      // console.log("avgTidak_ada: " + avgTidak_ada);
      // console.log("avgSenang: " + avgSenang);
      // console.log("avgBosan: " + avgBosan);
      // console.log("avgKecewa: " + avgKecewa);
      // console.log("avgNetral: " + avgNetral);

      if (typeof resultChart === "undefined") {
        console.log("undefined chart");
        xConf = createCX(
          eS[0][0],
          eS[0][1],
          eS[0][2],
          eS[0][3],
          eS[0][4],
          eS[0][5]
        );
        resultChart = new Chart(document.getElementById("xChart"), xConf);

        if (kLabel.length > 1) {
          for (let d = 1; d <= kLabel.length; d++) {
            const data = eS[d];
            if (data !== undefined) {
              const newDataset = {
                label: kLabel[d],
                data: [data[1], data[2], data[3], data[4], data[5]],
                fill: true,
                backgroundColor: dsColor(d, true),
                borderColor: dsColor(d, false),
                pointBackgroundColor: dsColor(d, false),
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: dsColor(d, false),
                order: kLabel.length - d,
              };
              resultChart.data.datasets.push(newDataset);
            }
          }
          resultChart.data.datasets[0].order = kLabel.length;
          resultChart.update();
        }
      } else {
        console.log("defined chart");
        let deleted = resultChart.data.datasets;
        // console.log(deleted);
        deleted.splice(0, deleted.length);
        // console.log(deleted);
        for (let i = 0; i < kLabel.length; i++) {
          const data = eS[i];
          const newDataset = {
            label: kLabel[i],
            data: [data[1], data[2], data[3], data[4], data[5]],
            fill: true,
            backgroundColor: dsColor(i, true),
            borderColor: dsColor(i, false),
            pointBackgroundColor: dsColor(i, false),
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: dsColor(i, false),
            order: kLabel.length - i,
          };
          resultChart.data.datasets.push(newDataset);
        }
        resultChart.update();
      }

      // if (typeof xiChart == undefined) {
      //   xiConf = createCXI(
      //     kelas,
      //     avgSenang[j],
      //     avgNetral[j],
      //     avgTidak_ada[j],
      //     avgBosan[j],
      //     avgKecewa[j]
      //   );
      //   var xiChart = new Chart(document.getElementById("xiChart"), xiConf);
      // }

      // if (typeof xiiChart == undefined) {
      //   xiiConf = createCXII(
      //     kelas,
      //     avgSenang[k],
      //     avgNetral[k],
      //     avgTidak_ada[k],
      //     avgBosan[k],
      //     avgKecewa[k]
      //   );
      //   var xiiChart = new Chart(document.getElementById("xiiChart"), xiiConf);
      // }
    },
  });
}

function createCX(lKelas, A, B, C, D, E) {
  const xData = {
    labels: ["Senang", "Netral", "Tidak Ada", "Bosan", "Kecewa"],
    datasets: [
      {
        label: lKelas,
        data: [A, B, C, D, E],
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

  const xConfig = {
    type: "radar",
    data: xData,
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };

  return xConfig;
}

function createCXI(lKelas, A, B, C, D, E) {
  const xiData = {
    labels: ["Senang", "Netral", "Tidak Ada", "Bosan", "Kecewa"],
    datasets: [
      {
        label: lKelas,
        data: [A, B, C, D, E],
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

  const xiConfig = {
    type: "radar",
    data: xiData,
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };

  return xiConfig;
}

function createCXII(lKelas, A, B, C, D, E) {
  const xiiData = {
    labels: ["Senang", "Netral", "Tidak Ada", "Bosan", "Kecewa"],
    datasets: [
      {
        label: lKelas,
        data: [A, B, C, D, E],
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

  const xiiConfig = {
    type: "radar",
    data: xiiData,
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };

  return xiiConfig;
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
    red: "rgb(255, 99, 132, 0.5)",
    green: "rgb(75, 192, 192, 0.5)",
    orange: "rgb(255, 159, 64, 0.5)",
    blue: "rgb(54, 162, 235, 0.5)",
    yellow: "rgb(255, 205, 86, 0.5)",
    purple: "rgb(153, 102, 255, 0.5)",
    grey: "rgb(201, 203, 207, 0.5)",
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

function setChartLama() {
  instance = selInstance.val();
  $.ajax({
    type: "POST",
    url: "dashboard_action.php",
    data: { instansi: instance, jenis: "class_chart" },
    dataType: "json",
    success: function (response) {
      // console.log(response);
      for (let i = 0; i < response.length; i++) {
        const data = response[i];
        let kelas = data.class_name;
        let strX = /X/g;
        let strXI = /XI/g;
        let strXII = /XII/g;
        let checkX = strX.test(kelas);
        let checkXI = strXI.test(kelas);
        let checkXII = strXII.test(kelas);

        if (checkX && !checkXI && !checkXII) {
          if (kelas == "XA") {
            num_class[0]++;
            dTidak_ada[0] += data.tidak_ada;
            dSenang[0] += data.senang;
            dBosan[0] += data.bosan;
            dKecewa[0] += data.kecewa;
            dNetral[0] += data.netral;
          } else if (kelas == "XB") {
            num_class[1]++;
            dTidak_ada[1] += data.tidak_ada;
            dSenang[1] += data.senang;
            dBosan[1] += data.bosan;
            dKecewa[1] += data.kecewa;
            dNetral[1] += data.netral;
          } else if (kelas == "XC") {
            num_class[2]++;
            dTidak_ada[2] += data.tidak_ada;
            dSenang[2] += data.senang;
            dBosan[2] += data.bosan;
            dKecewa[2] += data.kecewa;
            dNetral[2] += data.netral;
          } else if (kelas == "XD") {
            num_class[3]++;
            dTidak_ada[3] += data.tidak_ada;
            dSenang[3] += data.senang;
            dBosan[3] += data.bosan;
            dKecewa[3] += data.kecewa;
            dNetral[3] += data.netral;
          }
        } else if (checkX && checkXI && !checkXII) {
          if (kelas == "XIA1") {
            num_class[4]++;
            dTidak_ada[4] += data.tidak_ada;
            dSenang[4] += data.senang;
            dBosan[4] += data.bosan;
            dKecewa[4] += data.kecewa;
            dNetral[4] += data.netral;
          } else if (kelas == "XIA2") {
            num_class[5]++;
            dTidak_ada[5] += data.tidak_ada;
            dSenang[5] += data.senang;
            dBosan[5] += data.bosan;
            dKecewa[5] += data.kecewa;
            dNetral[5] += data.netral;
          } else if (kelas == "XIS1") {
            num_class[6]++;
            dTidak_ada[6] += data.tidak_ada;
            dSenang[6] += data.senang;
            dBosan[6] += data.bosan;
            dKecewa[6] += data.kecewa;
            dNetral[6] += data.netral;
          } else if (kelas == "XIS2") {
            num_class[7]++;
            dTidak_ada[7] += data.tidak_ada;
            dSenang[7] += data.senang;
            dBosan[7] += data.bosan;
            dKecewa[7] += data.kecewa;
            dNetral[7] += data.netral;
          }
        } else if (checkX && checkXI && checkXII) {
          if (kelas == "XIIA1") {
            num_class[8]++;
            dTidak_ada[8] += data.tidak_ada;
            dSenang[8] += data.senang;
            dBosan[8] += data.bosan;
            dKecewa[8] += data.kecewa;
            dNetral[8] += data.netral;
          } else if (kelas == "XIIA2") {
            num_class[9]++;
            dTidak_ada[9] += data.tidak_ada;
            dSenang[9] += data.senang;
            dBosan[9] += data.bosan;
            dKecewa[9] += data.kecewa;
            dNetral[9] += data.netral;
          } else if (kelas == "XIIS1") {
            num_class[10]++;
            dTidak_ada[10] += data.tidak_ada;
            dSenang[10] += data.senang;
            dBosan[10] += data.bosan;
            dKecewa[10] += data.kecewa;
            dNetral[10] += data.netral;
          } else if (kelas == "XIIS2") {
            num_class[11]++;
            dTidak_ada[11] += data.tidak_ada;
            dSenang[11] += data.senang;
            dBosan[11] += data.bosan;
            dKecewa[11] += data.kecewa;
            dNetral[11] += data.netral;
          }
        }
      }

      for (let j = 0; j < 12; j++) {
        avgTidak_ada[j] = dTidak_ada[j] / num_class[j];
        avgSenang[j] = dSenang[j] / num_class[j];
        avgBosan[j] = dBosan[j] / num_class[j];
        avgKecewa[j] = dKecewa[j] / num_class[j];
        avgNetral[j] = dNetral[j] / num_class[j];
      }

      // console.log("num_class: " + num_class);

      // console.log("dTidak_ada: " + dTidak_ada);
      // console.log("dSenang: " + dSenang);
      // console.log("dBosan: " + dBosan);
      // console.log("dKecewa: " + dKecewa);
      // console.log("dNetral: " + dNetral);

      // console.log("avgTidak_ada: " + avgTidak_ada);
      // console.log("avgSenang: " + avgSenang);
      // console.log("avgBosan: " + avgBosan);
      // console.log("avgKecewa: " + avgKecewa);
      // console.log("avgNetral: " + avgNetral);
      createChart();

      // let xConfig = createChart(
      //   "XA",
      //   avgTidak_ada,
      //   avgSenang,
      //   avgBosan,
      //   avgKecewa,
      //   avgNetral
      // );
      // var xChart = new Chart(document.getElementById("xChart"), xConfig);

      // FOR DEPLOYING CHART akan looping sejumlah classlist
      // for (let i = 0; i < 4; i++) {
      //   for (let j = 0; j < 5; j++) {}
      // }

      // console.log("trycount: " + trycount[0]);
      // console.log("dF XA: " + dKecewa);
      // console.log("avgF XA: " + avgKecewa);
    },
  });
}

function createChart() {
  const xData = {
    labels: ["Senang", "Netral", "Tidak Ada", "Bosan", "Kecewa"],
    datasets: [
      {
        label: "XA",
        data: [
          avgSenang[0],
          avgNetral[0],
          avgTidak_ada[0],
          avgBosan[0],
          avgKecewa[0],
        ],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "XB",
        data: [
          avgSenang[1],
          avgNetral[1],
          avgTidak_ada[1],
          avgBosan[1],
          avgKecewa[1],
        ],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
      },
      {
        label: "XC",
        data: [
          avgSenang[2],
          avgNetral[2],
          avgTidak_ada[2],
          avgBosan[2],
          avgKecewa[2],
        ],
        fill: true,
        backgroundColor: "rgba(255, 153, 0, 0.2)",
        borderColor: "rgb(255, 153, 0)",
        pointBackgroundColor: "rgb(255, 153, 0)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 153, 0)",
      },
      {
        label: "XD",
        data: [
          avgSenang[3],
          avgNetral[3],
          avgTidak_ada[3],
          avgBosan[3],
          avgKecewa[3],
        ],
        fill: true,
        backgroundColor: "rgba(26, 255, 102, 0.2)",
        borderColor: "rgb(26, 255, 102)",
        pointBackgroundColor: "rgb(26, 255, 102)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(26, 255, 102)",
      },
    ],
  };

  const xConfig = {
    type: "radar",
    data: xData,
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };

  var xChart = new Chart(document.getElementById("xChart"), xConfig);

  const xiData = {
    labels: ["Senang", "Netral", "Tidak Ada", "Bosan", "Kecewa"],
    datasets: [
      {
        label: "XIA1",
        data: [
          avgSenang[4],
          avgNetral[4],
          avgTidak_ada[4],
          avgBosan[4],
          avgKecewa[4],
        ],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "XIA2",
        data: [
          avgSenang[5],
          avgNetral[5],
          avgTidak_ada[5],
          avgBosan[5],
          avgKecewa[5],
        ],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
      },
      {
        label: "XIS1",
        data: [
          avgSenang[6],
          avgNetral[6],
          avgTidak_ada[6],
          avgBosan[6],
          avgKecewa[6],
        ],
        fill: true,
        backgroundColor: "rgba(255, 153, 0, 0.2)",
        borderColor: "rgb(255, 153, 0)",
        pointBackgroundColor: "rgb(255, 153, 0)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 153, 0)",
      },
      {
        label: "XIS2",
        data: [
          avgSenang[7],
          avgNetral[7],
          avgTidak_ada[7],
          avgBosan[7],
          avgKecewa[7],
        ],
        fill: true,
        backgroundColor: "rgba(26, 255, 102, 0.2)",
        borderColor: "rgb(26, 255, 102)",
        pointBackgroundColor: "rgb(26, 255, 102)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(26, 255, 102)",
      },
    ],
  };

  const xiConfig = {
    type: "radar",
    data: xiData,
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };

  var xiChart = new Chart(document.getElementById("xiChart"), xiConfig);

  const xiiData = {
    labels: ["Senang", "Netral", "Tidak Ada", "Bosan", "Kecewa"],
    datasets: [
      {
        label: "XIIA1",
        data: [
          avgSenang[8],
          avgNetral[8],
          avgTidak_ada[8],
          avgBosan[8],
          avgKecewa[8],
        ],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
      {
        label: "XIIA2",
        data: [
          avgSenang[9],
          avgNetral[9],
          avgTidak_ada[9],
          avgBosan[9],
          avgKecewa[9],
        ],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
      },
      {
        label: "XIIS1",
        data: [
          avgSenang[10],
          avgNetral[10],
          avgTidak_ada[10],
          avgBosan[10],
          avgKecewa[10],
        ],
        fill: true,
        backgroundColor: "rgba(255, 153, 0, 0.2)",
        borderColor: "rgb(255, 153, 0)",
        pointBackgroundColor: "rgb(255, 153, 0)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 153, 0)",
      },
      {
        label: "XIIS2",
        data: [
          avgSenang[11],
          avgNetral[11],
          avgTidak_ada[11],
          avgBosan[11],
          avgKecewa[11],
        ],
        fill: true,
        backgroundColor: "rgba(26, 255, 102, 0.2)",
        borderColor: "rgb(26, 255, 102)",
        pointBackgroundColor: "rgb(26, 255, 102)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(26, 255, 102)",
      },
    ],
  };

  const xiiConfig = {
    type: "radar",
    data: xiiData,
    options: {
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  };

  var xiiChart = new Chart(document.getElementById("xiiChart"), xiiConfig);
}

let gsNetral = $("#gsNetral");
let gsHappy = $("#gsHappy");
let gsInterest = $("#gsInterest");
let gsBoredom = $("#gsBoredom");
let gsFrustation = $("#gsFrustation");
let gsAphatetic = $("#gsAphatetic");

let valNetral = rand() + "%";
let valHappy = rand() + "%";
let valInterest = rand() + "%";
let valBoredom = rand() + "%";
let valFrustation = rand() + "%";
let valAphatetic = rand() + "%";

gsNetral.html(valNetral);
gsNetral.css("width", valNetral);
gsHappy.html(valHappy);
gsHappy.css("width", valHappy);
gsInterest.html(valInterest);
gsInterest.css("width", valInterest);
gsBoredom.html(valBoredom);
gsBoredom.css("width", valBoredom);
gsFrustation.html(valFrustation);
gsFrustation.css("width", valFrustation);
gsAphatetic.html(valAphatetic);
gsAphatetic.css("width", valAphatetic);

// Video and PoseNet
let video;
let poseNet;
let poses = [];
let poseNetOption;
let collectOption = {
  // maxPoseDetections: 2,s
  // detectionType: "single",
  // inputResolution: 801,
  // outputStride: 8,
};

// state
let dS, rS, fS, uS;
let drawState = ["collecting", "classifying"];
let readyState = ["collected", "trained"];
let fileState = ["dataset", "model"];
let uploadState = ["upload", "update"];
let checkedState = [];

// id declaration
let modalVideoRec = $("#m_videoRec");
let panelVideoRec = $("#videorec-panel");
let titleVideoRec = $("#h-titlevideorec");
let videoRec = $("#videorec");
let swHolder = $("#sw-holder");
let sw1VideoRec = $("#sw_rec1");
let sw2VideoRec = $("#sw_rec2");
let canvasRec = $("#canvasRec-holder");
let btnConfirmVid = $("#btn-confirmVid");
let btnDownloadVid = $("#btn-downloadVid");

// recorder
let recorder;
let chunks = [];
const fR = 30;

function setup() {
  // modalVideoRec.modal("show");
  // panelVideoRec.hide();
  checkedState[0] = sw1VideoRec.prop("checked");
  checkedState[1] = sw2VideoRec.prop("checked");
  console.log("state sw1: " + checkedState[0]);
  console.log("state sw2: " + checkedState[1]);
  sw1VideoRec.change(function () {
    checkedState[0] = sw1VideoRec.prop("checked");
    if (checkedState[0]) {
      sw2VideoRec.prop("checked", checkedState[0]);
      videoRec.hide();
      // do this
      let canvas = createCanvas(640, 360);
      canvas.parent("canvasRec-holder");
      frameRate(fR);
      video = createCapture(VIDEO);
      // video.size(width, height);
      // Hide the video element, and just show the canvas
      video.hide();
      modalVideoRec.modal({ backdrop: "static" });
      // modalVideoRec.modal("show");
      panelVideoRec.hide();
      poseNetOption = collectOption;
      loadPosenet();
      // loadAsyncPosenet();
      dS = drawState[0]; //collecting
      titleVideoRec.html("recording...");
      setTimeout(() => {
        startRecording();
      }, 2000);
    } else {
      // do that
      sw2VideoRec.prop("checked", checkedState[0]);
      titleVideoRec.html("stop recording...");
      stopRecording();
      setTimeout(() => {
        exportVideo("preview");
      }, 2000);
      swHolder.hide();
      canvasRec.hide();
      // modalVideoRec.modal("hide");
      dS = ""; //do nothing

      panelVideoRec.show();
      videoRec.show();
      modalVideoRec.modal({ backdrop: "static" });
      // modalVideoRec.modal("show");
    }
  });

  sw2VideoRec.change(function () {
    checkedState[1] = sw2VideoRec.prop("checked");
    if (checkedState[1]) {
      sw1VideoRec.prop("checked", checkedState[1]);
      videoRec.hide();
      // do this
      let canvas = createCanvas(640, 360);
      canvas.parent("canvasRec-holder");
      frameRate(fR);
      video = createCapture(VIDEO);
      // video.size(width, height);
      // Hide the video element, and just show the canvas
      video.hide();

      modalVideoRec.modal({ backdrop: "static" });
      // modalVideoRec.modal("show");
      panelVideoRec.hide();
      poseNetOption = collectOption;
      loadPosenet();
      // loadAsyncPosenet();
      dS = drawState[0]; //collecting
      titleVideoRec.html("recording...");
      setTimeout(() => {
        startRecording();
      }, 2000);
    } else {
      // do that
      sw1VideoRec.prop("checked", checkedState[1]);
      titleVideoRec.html("stop recording...");
      stopRecording();
      setTimeout(() => {
        exportVideo("preview");
      }, 2000);
      swHolder.hide();
      canvasRec.hide();
      // modalVideoRec.modal("hide");
      dS = ""; //do nothing

      panelVideoRec.show();
      videoRec.show();
    }
  });

  modalVideoRec.on("hidden.bs.modal", () => {
    // alert("recorder ditutup");
    Swal.fire({
      title: "Anda yakin menutup recorder?",
      text: "Simpan atau download dahulu sebelum menutup jendela recorder",
      icon: "warning",
      animation: false,
      customClass: "animate__animated animate__tada",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, tidak apa",
      cancelButtonText: "Jangan!",
    }).then((result) => {
      if (result.dismiss) {
        modalVideoRec.modal({ backdrop: "static" });
      }
      if (result.isConfirmed) {
        location.reload();
      }
    });
  });

  btnConfirmVid.on("click", () => {
    //save to system -- database
    exportVideo("save");
  });

  btnDownloadVid.on("click", () => {
    exportVideo("download");
  });
}

// Load the posenet method
function loadPosenet() {
  // let option = {
  //   maxPoseDetections: 40,
  // };
  // pState.html("loading poseNet...");
  console.log("loading poseNet...");
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, poseNetOption, () => {
    // pState.html("poseNet loaded");
    console.log("poseNet loaded");
  });
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", (results) => {
    poses = results;
  });
}

function getInput() {
  let keypoints = poses[0].pose.keypoints;
  let inputs = [];
  for (let i = 0; i < keypoints.length; i++) {
    inputs.push(keypoints[i].position.x);
    inputs.push(keypoints[i].position.y);
  }
  return inputs;
}

// Draw to canvas
function drawPose() {
  // need to be checked later
  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    let pose = poses[0].pose;
    let pkp = pose.keypoints;
    let skeleton = poses[0].skeleton;
    if (pose) {
      for (let i = 0; i < pkp.length; i++) {
        fill(213, 0, 143);
        strokeWeight(2);
        stroke("white");
        ellipse(pkp[i].position.x, pkp[i].position.y, 10);
      }
      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0].position;
        let b = skeleton[i][1].position;
        strokeWeight(2);
        stroke("white");
        line(a.x, a.y, b.x, b.y);
      }
    }
  }
}

function drawId() {
  let count;
  if (poses.length > 0) {
    count = poses.length;
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      let score = poses[i].pose.score;
      if (score > 0.6) {
        // console.log(score);
        let noseX = pose.nose.x;
        let noseY = pose.nose.y;
        let id = i + 1;
        fill("red");
        stroke("white");
        textSize(50);
        text(id, noseX, noseY + 50);
      }
    }
    fill("red");
    stroke("white");
    textSize(20);
    text("N: " + count, 20, 20);
  }
}

function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}
function draw() {
  push();

  if (dS == "collecting") {
    image(video, 0, 0, width, height);
    drawPose();
  } else if (dS == "classifying") {
    image(video, 0, 0, width, height);
    drawId();
  } else {
  }
  pop();
}

function startRecording() {
  chunks.length = 0;

  let stream = document.querySelector("canvas").captureStream(fR);
  let options = { mimeType: "video/webm;codecs=vp8,opus" };
  // console.log(stream, options);
  recorder = new MediaRecorder(stream);

  console.log("Created MediaRecorder: ", recorder, "with options: ", options);

  recorder.onstop = (event) => {
    console.log("Recorder stopped: ", event);
    console.log("Recorded Blobs: ", chunks);
  };

  recorder.ondataavailable = (e) => {
    console.log("data available: ", e);
    if (e.data.size) {
      chunks.push(e.data);
      console.log("chunks:", chunks);
    }
  };

  recorder.start();
  console.log("Recorder started", recorder);
}

function stopRecording() {
  recorder.stop();
  console.log("Recorder stopped", recorder);
}

function exportVideo(vS) {
  if (vS == "preview") {
    // Draw video to screen
    const superBuffer = new Blob(chunks, { type: "video/webm" });
    videoRec.attr("src", null);
    videoRec.attr("srcObject", null);
    let url = window.URL.createObjectURL(superBuffer);
    videoRec.attr("title", vidTitle());
    titleVideoRec.html(vidTitle());
    console.log(url);
    videoRec.attr("src", url);
    // videoRecHolder.show();
    // btnDownloadVid.show();
    // btnConfirmVid.show();
    // videoRecModal.modal("show");
  } else if (vS == "download") {
    // Download the video
    const blob = new Blob(chunks, { type: "video/mp4" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = vidTitle() + ".mp4";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } else if ("save") {
    $.ajax({
      url: "uploadvid.php",
      type: "POST",
      data: data,
      success: function () {
        alert("Video berhasil disimpan");
      },
    });
  }
}

function vidTitle() {
  let title, date, day, month, year, hour, min;

  date = new Date();
  day = date.getDate();
  month = date.getMonth() + 1; //to get the correct month you must add 1
  year = date.getFullYear();
  hour = date.getHours();
  min = date.getMinutes();

  title =
    "Affective_Assesment_Video(" +
    day +
    "_" +
    month +
    "_" +
    year +
    "_" +
    hour +
    "_" +
    min +
    ")";

  return title;
}

let cardPanel = $("#card_panel");
let cardTotal = $("#card_total");
let cardColor = [
  "w3-pale-blue",
  "w3-pale-green",
  "w3-pale-yellow",
  "w3-pale-red",
  "w3-dark-grey",
  "w3-grey",
  "w3-light-grey",
  "w3-brown",
  "w3-blue-grey",
  "w3-deep-orange",
  "w3-orange",
  "w3-amber",
  "w3-yellow",
  "w3-khaki",
  "w3-sand",
  "w3-lime",
  "w3-light-green",
  "w3-green",
  "w3-teal",
  "w3-aqua",
  "w3-cyan",
  "w3-light-blue",
  "w3-blue",
  "w3-indigo",
  "w3-deep-purple",
  "w3-purple",
  "w3-pink",
  "w3-red",
  "w3-black",
  "w3-white",
];

// let doType = "classroom_card";
// let userClass = "";
// let userCourse = "";

function setCard() {
  cardPanel.empty();
  instance = selInstance.val();
  console.log(instance);
  $.ajax({
    type: "POST",
    url: "dashboard_action.php",
    data: { instansi: instance, jenis: "classroom_card" },
    dataType: "json",
    success: function (response) {
      if (response == null) {
        cardTotal.html("Data belum tersedia");
        return false;
      }

      // console.log(response);
      // console.log(response.length);

      let n_classroom,
        n_students = 0;
      for (let i = 0; i < response.length; i++) {
        const data = response[i];
        n_classroom = response.length;
        n_students += data.num_join;
      }

      ov_classroom.html(n_classroom);
      ov_students.html(n_students);

      let colorNum = [];
      let coloring = [];

      let togBtn = [];
      let togClass = [];
      let togState = [];
      let stateCard = [];
      let nameCard = [];

      let classroomName;
      let classState;

      cardTotal.html(response.length);

      for (let cI = 0; cI < response.length; cI++) {
        const rsp = response[cI];

        // get 2 value from database: classroom name, class state,
        classroomName = rsp.classroom_name;
        classState = rsp.class_state;
        // console.log(rsp.classroom_name);
        // console.log(rsp.class_state);

        let classroomCard;

        classroomCard =
          "<div class='w3-content w3-col s6 m3 l3 w3-padding' style='max-width: 205px;'>";
        classroomCard +=
          "<div class='w3-card-4 w3-round-xlarge crdstyle colClass'>";
        classroomCard += "<div class='w3-row-padding'>";
        classroomCard += "<h3 class='toggClass'>" + classroomName + "</h3>";
        classroomCard += "</div>";
        classroomCard += "<div class='w3-row-padding btmrght'>";
        classroomCard += "<p class='toggState'>" + classState + "</p>";
        classroomCard +=
          "<button class='w3-button w3-round-large w3-card-4 toggBtn'></button>";
        classroomCard += "</div>";
        classroomCard += "</div>";
        classroomCard += "</div>";

        cardPanel.append(classroomCard);

        let toggBtn = document.getElementsByClassName("toggBtn");
        let toggState = document.getElementsByClassName("toggState");
        let toggClass = document.getElementsByClassName("toggClass");
        let colClass = document.getElementsByClassName("colClass");

        // set card color
        coloring[cI] = colClass[cI];
        colorNum[cI] = rand1(0, 27);

        coloring[cI].classList.add(cardColor[colorNum[cI]]);
        coloring[cI].classList.remove(cardColor[colorNum[cI - 1]]);

        togBtn[cI] = toggBtn[cI];
        togState[cI] = toggState[cI];
        togClass[cI] = toggClass[cI];

        // set button color
        stateCard[cI] = togState[cI].innerHTML;
        if (stateCard[cI] == "Aktif") {
          togBtn[cI].classList.add(cardColor[29]); //white
          togBtn[cI].innerHTML = "Tutup kelas";
        } else if (stateCard[cI] == "Tidak Aktif") {
          togBtn[cI].classList.add(cardColor[28]); //black
          togBtn[cI].innerHTML = "Buka kelas";
        }
        // console.log("val button" + i + ":" + valBtn[cI]);
        // console.log("i:" + i);
        // console.log(togBtn[cI]);
        togBtn[cI].addEventListener("click", () => {
          stateCard[cI] = togState[cI].innerHTML;
          nameCard[cI] = togClass[cI].innerHTML;
          if (stateCard[cI] == "Tidak Aktif") {
            console.log("dibuka");
            togBtn[cI].classList.add(cardColor[29]);
            togBtn[cI].classList.remove(cardColor[28]);
            togBtn[cI].innerHTML = "Tutup kelas";
            togState[cI].innerHTML = "Aktif";
            stateCard[cI] = togState[cI].innerHTML;
            updateState(nameCard[cI], stateCard[cI]);
          } else if (stateCard[cI] == "Aktif") {
            console.log("ditutup");
            togBtn[cI].classList.add(cardColor[28]);
            togBtn[cI].classList.remove(cardColor[29]);
            togBtn[cI].innerHTML = "Buka kelas";
            togState[cI].innerHTML = "Tidak Aktif";
            stateCard[cI] = togState[cI].innerHTML;
            updateState(nameCard[cI], stateCard[cI]);
          }
        });
      }
    },
  });
}

function updateState(name, state) {
  let doType = "update_state";
  $.ajax({
    type: "POST",
    url: "dashboard_action.php",
    data: { classroom_name: name, jenis: doType, class_state: state },
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.code == 200) {
        Swal.fire({
          icon: response.status,
          title: "Sukses",
          text: response.message,
          customClass: "animate__animated animate__fadeInDown",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      } else {
        Swal.fire({
          icon: response.status,
          title: response.message,
          text: "",
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
    },
  });
}

let feedsTable = $("#feeds_table");
let iconDict = {
  newUser: "<i class='fa fa-user w3-text-blue w3-large'></i>",
  editedUser: "<i class='fa fa-user w3-text-yellow w3-large'></i>",
  deletedUser: "<i class='fa fa-user w3-text-red w3-large'></i>",
  openClass: "<i class='fa fa-address-book w3-text-green w3-large'></i>",
  recordedClass: "<i class='fa fa-video-camera w3-text-green w3-large'></i>",
  newClass: "<i class='fa fa-address-book w3-text-blue w3-large'></i>",
  editedClass: "<i class='fa fa-address-book w3-text-yellow w3-large'></i>",
  deletedClass: "<i class='fa fa-address-book w3-text-red w3-large'></i>",
  newStudent: "<i class='fa fa-users w3-text-blue w3-large'></i>",
  editedStudent: "<i class='fa fa-users w3-text-yellow w3-large'></i>",
  deletedStudent: "<i class='fa fa-users w3-text-red w3-large'></i>",
  editedScore: "<i class='fa fa-edit w3-text-yellow w3-large'></i>",
  enrollIn: "<i class='fa fa-chevron-circle-right w3-text-green w3-large'></i>",
  enrollOut: "<i class='fa fa-chevron-circle-left w3-text-red w3-large'></i>",
  error: "<i class='fa fa-exclamation-circle w3-text-red w3-large'></i>",
};

showFeeds();

function showFeeds() {
  $.ajax({
    type: "POST",
    url: "dashboard_action.php",
    data: { jenis: "feeds" },
    dataType: "json",
    success: function (response) {
      // console.log(response.length);
      // console.log(response[1].time);
      let activityLog;
      let iconPlot, activityPlot, timePlot;
      const d = new Date();
      const date = d.getDate();
      const hour = d.getHours();
      const min = d.getMinutes();
      const sec = d.getSeconds();
      // console.log("time: " + hour + ":" + min + ":" + sec);
      // console.log(d);

      for (let i = 0; i < 14; i++) {
        // for (let i = 0; i < 8; i++) {
        const data = response[i];

        if (data !== undefined) {
          let category = data.category;
          iconPlot = iconDict[category];

          activityPlot = data.activity + " - <b>" + data.user + "</b>";

          const dResp = new Date(response[i].waktu);
          const respYear = dResp.getFullYear();
          const respMon = dResp.getMonth() + 1;
          const respDate = dResp.getDate();
          const respHour = dResp.getHours();
          const respMin = dResp.getMinutes();
          const respSec = dResp.getSeconds();
          // console.log("respSec: " + respSec);
          // console.log(dResp);

          let outputTime;
          let calculate;
          if (respDate == date) {
            if (respHour == hour) {
              if (respMin == min) {
                if (respSec < sec || respSec > sec) {
                  calculate = "a few seconds ago";
                }
              } else if (respMin < min) {
                let calcMin = min - respMin;
                calculate = calcMin + " mins ago";
              }
            } else if (respHour < hour) {
              let calcHour = hour - respHour;
              calculate = calcHour + " hours ago";
              // console.log(calculate);
            }
            // console.log("timeResp: " + respHour + ":" + respMin + ":" + respSec);
            outputTime = calculate;
          } else {
            outputTime = respDate + "/" + respMon + "/" + respYear;
          }
          timePlot = "<i>" + outputTime + "</i>";

          activityLog = "<tr>";
          activityLog += "<td>" + iconPlot + "</td>";
          activityLog += "<td>" + activityPlot + "</td>";
          activityLog += "<td>" + timePlot + "</td>";
          activityLog += "</tr>";
          // console.log(activityLog);
          feedsTable.append(activityLog);
        }
      }
    },
  });
}

setTimeout(() => {
  recapDashboard();
  setChart();
  setCard();
}, 1000);

// let session = $("#session");
// console.log(session);
