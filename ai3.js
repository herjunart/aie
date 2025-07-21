// Video and PoseNet
let video;
let poseNet;
let poses = [];
// let poses_60 = [];
let poseNetOption;
let collectOption = {
  architecture: "MobileNetV1",
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 1,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "single",
  inputResolution: 513,
  multiplier: 1,
  quantBytes: 2,
};
let classifyOption = {
  architecture: "MobileNetV1",
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 3,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "multiple",
  inputResolution: 513,
  multiplier: 0.75,
  quantBytes: 2,
};

// Neural Network
let brain;
let brainOptions;

// State
let dS, rS, fS, uS;
let drawState = ["collecting", "classifying"];
let readyState = ["collected", "trained"];
let fileState = ["dataset", "model"];
let uploadState = ["upload", "update"];

// Id html declaration
let btnCollect = $("#btn-collect");
let btnTrain = $("#btn-train");
let btnClassify = $("#btn-classify");
let btnDoTrain = $("#btn-do_train");
let btnDoClassify = $("#btn-do_classify");
let btnUpdate = $("#btn-update");
let btnAdd = $("#btn-add");
let btnStopProcess = $("#btn-stop");
let btnStartRec = $("#btn-start_rec");
let btnStopRec = $("#btn-stop_rec");
let btnConfirmVid = $("#btn-confirmVid");
let btnDownloadVid = $("#btn-downloadVid");
let btnModalRec = $("#btn-modal_rec");
// let btnCam = $("#btn-camera");
let btnTest = $("#btn-test");

let editorTool = $("#container_editorTool");
let pState = $("#stateP");
let pCondition = $("#conditionP");

let sDataLabel = $("#s_dataLabel");
let inEpochTrain = $("#in_epochTrain");
let inLoadModel = $("#in_loadModel");
let inLoadDataset = $("#in_loadDataset");
let inNClass = $("#in_nclass");

let detectorHolder = $("#detector-holder");
let videoRecHolder = $("#videorec-holder");
let videoRec = $("#videorec");
// let videoRecTitle = $("#h-titlevideorec");
// let videoRecModal = $("#m_videoRec");
// let emotionClass = $("#s_dataLabel option");
let langSwitch = $("#sw_lang");
// console.log(emotionClass);
// let datasetEl = document.getElementById("in_loadDataset");
// let modelEl = document.getElementById("in_loadModel");

let sysModel;
let emotionClass;

// etc
let blinkTime;
let classifyTime;
let classifyInter;
// let recording = false;
let recorder;
let chunks = [];
let cS = false;
// let blob;
const fR = 30;
let startTime;

let cA = [];
let cB = [];
let cC = [];
let cD = [];
let cE = [];
let cU = [];
let emoTotal, sA, sB, sC, sD, sE, sU;

let clsId = [];
let confId = [];

let loadedDataset;
let enhancedDataset = [];

function keyPressed() {
  let time = timeNow();
  let y = time.year;
  let ys = y.toString();
  let ysl = ys.slice(2, 4);
  let dt = " " + time.date + "-" + time.month + "-" + ysl;
  if (key == "d") {
    Swal.fire({
      title: "Masukkan keterangan",
      input: "text",
      inputPlaceholder: "keterangan",
      showCancelButton: true,
      inputValidator: (value) => {
        if (value == "") {
          return "minimal diisi jumlah classnya";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        brain.saveData("BL-dataset " + "(" + result.value + ")" + dt);
      }
    });
  } else if (key == "m") {
    Swal.fire({
      title: "Masukkan keterangan",
      input: "text",
      inputPlaceholder: "keterangan",
      showCancelButton: true,
      inputValidator: (value) => {
        if (value == "") {
          return "minimal diisi jumlah epochnya";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        brain.save("BL-model " + "(" + result.value + ")" + dt);
      }
    });
  }
}

function setup() {
  video = createCapture(VIDEO);
  // video.size(width, height);
  // Hide the video element, and just show the canvas
  video.size(640, 480);
  // video.size(800, 600);
  // video.size(1024, 768);
  video.hide();
  let widthV = video.elt.attributes.getNamedItem("width").value;
  let heightV = video.elt.attributes.getNamedItem("height").value;

  let canvas = createCanvas(widthV, heightV);
  canvas.parent("detector-holder");
  frameRate(fR);

  // console.log(canvas);
  // console.log(video);
  // console.log(height);
  // record();

  // cobaAsync();
  // btnCam.click(() => {
  //   createCapture(VIDEO);
  //   // video.size(720, AUTO);
  //   // video.hide();
  // });

  btnTest.click(() => {
    btnStopProcess.show();
    poseNetOption = collectOption;
    loadPosenet();
    brain.load("/baseml/model/model.json", () => {
      console.log("model loaded");
      dS = drawState[1]; //classifying
      // classifySingle();
      classifyInter = setInterval(() => {
        // Classify again
        if (poses.length == 1) {
          classifySingle();
        } else {
          classifyMulti();
        }
      }, 1000);
    });

    // setTimeout(() => {
    // }, 5000);
  });

  // videoRecModal.modal("show");
  editorTool.show();
  videoRecHolder.hide();
  // Setup for each button
  btnCollect.on("click", () => {
    btnUpdate.hide();
    btnDoTrain.hide();
    btnDoClassify.hide();
    inLoadModel.hide();
    inEpochTrain.hide();

    editorTool.show();
    pState.show();
    inNClass.show();
    sDataLabel.show();
    inLoadDataset.show();
    btnAdd.show();
    btnStopProcess.show();

    pState.html("Collect the Dataset");
    poseNetOption = collectOption;
    loadPosenet();
    // loadAsyncPosenet();
    dS = drawState[0]; //collecting
  });

  btnAdd.on("click", () => {
    pState.html("Adding dataset...");
    addDataset();
  });

  btnTrain.on("click", () => {
    if (poseNet) {
      stopPosenet();
    }
    stopBlink();
    inNClass.hide();
    sDataLabel.hide();
    btnAdd.hide();
    btnDoClassify.hide();
    btnUpdate.hide();
    inLoadModel.hide();

    pState.show();
    editorTool.show();
    btnStopProcess.show();

    if (rS == "collected") {
      stopBlink();
      inEpochTrain.hide();
      pState.html("Training the Model...");
      // console.log("dataset:", brain.neuralNetworkData.data.raw);
      trainModel();
    } else {
      fS = fileState[0]; //dataset
      pState.html("Load the dataset to be trained");
      inLoadDataset.show();
      inEpochTrain.show();
      btnDoTrain.show();
      btnDoTrain.attr("disabled", "true");
    }
  });

  btnDoTrain.on("click", () => {
    stopBlink();
    trainModel();
  });

  btnClassify.on("click", () => {
    stopBlink();
    btnDoTrain.hide();
    btnAdd.hide();
    inEpochTrain.hide();
    inLoadDataset.hide();

    editorTool.show();
    btnStopProcess.show();

    if (rS == "trained") {
      poseNetOption = classifyOption;
      loadPosenet();
      setTimeout(() => {
        dS = drawState[1]; //classifying
        pState.html("Classifying poses...");
        classifyInter = setInterval(() => {
          // Classify again
          if (poses.length == 1) {
            classifySingle();
          } else {
            classifyMulti();
          }
        }, 1000);
      }, 5000);
    } else {
      fS = fileState[1]; //model
      pState.html("Load the model to do classifying");
      inLoadModel.show();
      btnDoClassify.show();
      btnDoClassify.attr("disabled", "true");
      poseNetOption = classifyOption;
      loadPosenet();
      dS = drawState[1]; //classifying
    }
  });

  btnDoClassify.on("click", () => {
    // btnUpdate.hide();
    stopBlink();

    // pCondition.show();
    pState.html("preparing classify system...");
    // poseNetOption = collectOption;
    // loadPosenet();
    // loadAsyncPosenet();
    // poseNet = ml5.poseNet(video, option, () => {
    //   pState.html("poseNet loaded");
    //   console.log("poseNet loaded");
    //   brain.load("upload/model/body-language-model.json", () => {
    //     console.log("Model ready to work");
    //     pState.html("Model loaded");
    //     pCondition.show();
    //     dS = drawState[1]; //classifying
    //     classify();
    //   });
    // });

    // poseNet.on("pose", (results) => {
    //   poses = results;
    // });

    // brain.load("upload/model/body-language-model.json", () => {
    //   console.log("Model ready to work");
    //   pState.html("Model loaded");
    //   pCondition.show();

    //   dS = drawState[1]; //classifying
    //   pState.html("Classifying poses...");
    //   console.log("Classifying poses...");
    //   classifySingle();
    // });

    // let s = pState.html();
    // if (s == "poseNet loaded") {

    pState.html("Classifying poses...");
    classifyInter = setInterval(() => {
      // Classify again
      if (poses.length == 1) {
        classifySingle();
      } else {
        classifyMulti();
      }
    }, 1000);
    // }
    // let modelInfo = {
    //   model: "upload/model/body-language-model.json",
    //   metadata: "upload/model/body-language-model_meta.json",
    //   weights: "upload/model/body-language-model.weights.bin",
    // };
  });

  btnStartRec.on("click", () => {
    poseNetOption = classifyOption;
    loadPosenet();
    inNClass.hide();
    sDataLabel.hide();
    btnAdd.hide();
    inLoadModel.hide();
    btnDoTrain.hide();
    inEpochTrain.hide();
    btnDoClassify.hide();
    btnUpdate.hide();
    videoRecHolder.hide();

    detectorHolder.show();
    editorTool.show();
    pCondition.show();
    btnStopProcess.show();

    // pState.html("loading poseNet...");
    // if (poses) {
    // let modelInfo = {
    //   model: "/baseml/model/model.json",
    //   metadata: "/baseml/model/model_meta.json",
    //   weights: "/baseml/model/model.weights.bin",
    // };
    // let modelPath = "/baseml/model/" + modelInfo["model"];
    // pState.html("Load model");
    if (sysModel == "no") {
      dS = drawState[1]; //drawposes - classifying
      console.log("Detecting...");
      classifyInter = setInterval(() => {
        // Classify again
        if (poses.length == 1) {
          classifySingle();
        } else {
          classifyMulti();
        }
      }, 1000);
    } else {
      brain.load("/baseml/model/model.json", () => {
        // console.log(brain);
        console.log("Model loaded");
        dS = drawState[1]; //drawposes
        console.log("Detecting...");
        classifyInter = setInterval(() => {
          // Classify again
          if (poses.length == 1) {
            classifySingle();
          } else {
            classifyMulti();
          }
        }, 1000);
      });
    }

    setTimeout(() => {
      pState.html("start recording");
      startRecording();
      // recorder.start();
      pState.html("recording...");
      console.log(recorder.state);
      console.log("recording...");
    }, 5000);

    // let modelInfo = {
    //   model: "baseml/model/body-languages-model.json",
    //   metadata: "baseml/model/body-languages-model_meta.json",
    //   weights: "baseml/model/body-languages-model.weights",
    // };
    // let modelPath = "../../../../baseml/model/body-languages-model.json";
    // brain.load(modelPath, () => {
    //   console.log("Model ready to work");
    //   pState.html("Start recording...");
    //   setTimeout(() => {
    //     pState.html("Recording...");
    //   }, 2000);
    // });
    // dS = drawState[0]; //not classifying
    // classifySingle();
    // setTimeout(() => {
    // pState.html("recorder started");
    // startRecording();
    // pState.html("recording...");
    // recorder.start();
    // console.log(recorder.state);
    // console.log("recorder started");
    // }, 2000);
    // }
  });

  btnStopRec.on("click", () => {
    inNClass.hide();
    sDataLabel.hide();
    btnAdd.hide();
    inLoadModel.hide();
    btnDoTrain.hide();
    inEpochTrain.hide();
    btnDoClassify.hide();
    btnUpdate.hide();
    btnStopProcess.hide();

    editorTool.show();

    dS = "";
    stopClassify();
    pState.html("Stop recording...");
    stopRecording();
    // recorder.stop();
    // console.log(recorder.state);
    // console.log("recorder stopped");
    setTimeout(() => {
      pCondition.hide();
    }, 2000);
    pState.html("Recorder stopped");
    setTimeout(() => {
      detectorHolder.hide();
      exportVideo("preview");
      // btnModalRec.show();
    }, 2000);
  });

  btnStopProcess.on("click", () => {
    editorTool.show();

    inEpochTrain.hide();
    inNClass.hide();
    sDataLabel.hide();
    inLoadModel.hide();
    btnAdd.hide();
    btnDoTrain.hide();
    btnDoClassify.hide();
    btnUpdate.hide();
    btnStopProcess.hide();
    pCondition.hide();
    inLoadDataset.hide();

    clearInterval(addNewTimer);
    clearInterval(addAppendTimer);

    // if (poseNet) {
    //   stopPosenet();
    // }
    dS = "";
    stopBlink();
    stopClassify();
    pState.show();
    pState.html("Ready for other process");
  });

  let loadModel = select("#in_loadModel");
  loadModel.changed(function () {
    brain.load(this.elt.files, function () {
      // console.log(brain);
      let mod = brain.neuralNetwork.model;
      console.log("loaded model: ", mod);
      console.log("Model Loaded!");
      pState.html("Model Loaded!");
      pCondition.show();
      emotionClass = mod.outputShape[1];
      console.log(emotionClass);
      // brain = ml5.neuralNetwork(brainOptions);
      // console.log("brainOptions loadmodel: ", brainOptions);
      // console.log("brain loadmodel: ", brain);
    });

    brainOptions = {
      inputs: 34,
      outputs: emotionClass,
      task: "classification",
      debug: true,
    };

    btnUpdate.show();
    if (fS == "dataset") {
      btnDoTrain.removeAttr("disabled");
      startBlink(btnDoTrain);
    } else if (fS == "model") {
      btnDoClassify.removeAttr("disabled");
      startBlink(btnDoClassify);
    } else {
      stopBlink();
    }
  });
  // inLoadModel.on("change", () => {
  //   // uS = uploadState[0]; //upload
  //   // uploadFile();
  // });

  let loadDataset = select("#in_loadDataset");
  loadDataset.changed(function () {
    brain.loadData(this.elt.files, function () {
      loadedDataset = brain.neuralNetworkData.data.raw;
      enhancedDataset = loadedDataset;
      console.log("loadedDataset: ", loadedDataset);
      console.log("enhancedDataset: ", enhancedDataset);
      console.log("Dataset Loaded!");
      pState.html("Dataset Loaded!");
      pCondition.show();
    });

    // brainOptions = {
    //   dataUrl: this.elt.files,
    //   inputs: 34,
    //   outputs: emotionClass,
    //   task: "classification",
    //   debug: true,
    // };

    inEpochTrain.show();
    btnUpdate.show();
    if (fS == "dataset") {
      btnDoTrain.removeAttr("disabled");
      startBlink(btnDoTrain);
    } else if (fS == "model") {
      btnDoClassify.removeAttr("disabled");
      startBlink(btnDoClassify);
    }
  });
  // inLoadDataset.on("change", (x) => {
  //   // uS = uploadState[0]; //upload
  //   // uploadFile();
  // });

  let chkSysModel = select("#check-sel_model");
  // console.log("val: ", chkSysModelVal);

  chkSysModel.changed(function () {
    let chkSysModelVal = $("input[name=sel_model]:checked").val();
    sysModel = chkSysModelVal;
    console.log("sysModel: ", sysModel);
    if (sysModel == "no") {
      inLoadModel.show();
    } else {
      inLoadModel.hide();
    }
  });

  let iNClass = select("#in_nclass");
  iNClass.changed(function () {
    let classE = ["A", "B", "C", "D", "E", "F"];

    $(".opt").remove();

    let nClass = inNClass.val();
    for (let i = 0; i < nClass; i++) {
      sDataLabel.append(
        "<option class='opt' value=" + classE[i] + ">" + classE[i] + "</option>"
      );
    }
    emotionClass = Number(nClass);
    // console.log("emotionClass: ", typeof emotionClass);
    brainOptions = {
      inputs: 34,
      outputs: emotionClass,
      task: "classification",
      debug: true,
    };
    brain = ml5.neuralNetwork(brainOptions);

    // console.log("brainOptions inclass: ", brainOptions);
    // console.log("brain inclass: ", brain);
  });

  let selDatLabel = select("#s_dataLabel");
  selDatLabel.changed(function () {
    console.log("sel: ", sDataLabel.val());
  });

  btnUpdate.on("click", () => {
    uS = uploadState[1]; //update
    uploadFile();
  });

  btnConfirmVid.on("click", () => {
    //save to system -- database
    exportVideo("upload");
  });

  btnDownloadVid.on("click", () => {
    exportVideo("download");
  });

  // langSwitch.on("click", () => {
  //   checked = true;
  //   changeLang();
  // });

  // Create the base model
  brainOptions = {
    inputs: 34,
    outputs: 3,
    task: "classification",
    debug: true,
    learningRate: 0.2,
    layers: [
      {
        type: "dense",
        units: 16,
        activation: "relu",
      },
      {
        type: "dense",
        activation: "softmax",
      },
    ],
  };
  brain = ml5.neuralNetwork(brainOptions);

  // console.log("brainOptions setup: ", brainOptions);
  // console.log("brain setup: ", brain);
}

// Load the posenet method
function loadPosenet() {
  // let option = {
  //   maxPoseDetections: 40,
  // };
  pState.html("loading poseNet...");
  console.log("loading poseNet...");
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, poseNetOption, () => {
    pState.html("poseNet loaded");
    console.log("poseNet loaded");
  });
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", (results) => {
    // let poses = [];
    poses = results;
    // console.log(poses);
    // if (poses.length > 0) {
    //   for (let i = 0; i < poses.length; i++) {
    //     let score = poses[i].pose.score;
    //     if (score > 0.6) {
    //       poses_60 = poses[i];
    //     }
    //   }
    // }
  });
}

async function loadAsyncPosenet() {
  let posenetPromise = new Promise((resolve, reject) => {
    let options = {
      maxPoseDetections: 40,
    };
    poseNet = ml5.poseNet(video, options, () => {
      pState.html("poseNet loaded");
      console.log("poseNet loaded");
      if (poseNet) {
        resolve("loadAsync success");
      } else {
        reject("loadAsync unsuccess");
      }
    });
    poseNet.on("pose", (results) => {
      poses = results;
    });
  });
  console.log(await posenetPromise);
}

// async function loadAsyncPosenet() {
//   try {
//     const coba = await posenetPromise();
//     console.log(coba);
//   } catch (err) {
//     console.log(err);
//   }
// }

function delay(time) {
  return new Promise((resolve, reject) => {
    if (isNaN(time)) {
      reject(new Error("delay requires a valid number."));
    } else {
      setTimeout(resolve, time);
    }
  });
}

function stopPosenet() {
  poseNet.removeListener("pose", () => {
    return;
  });
  // poseNet.removeListener("pose", () => {
  //   console.log("poseNet stopped");
  //   pState.html("poseNet stopped");
  // });
}

function getInput() {
  let keypoints = poses[0].pose.keypoints;
  let inputs = [];
  for (let i = 0; i < keypoints.length; i++) {
    let kpScore = keypoints[i].score;
    // console.log("kpScore: ", kpScore);
    // if (kpScore > 0.2) {
    inputs.push(keypoints[i].position.x);
    inputs.push(keypoints[i].position.y);
    // }
  }
  return inputs;
}

function getInputs() {
  if (poses.length < 1) {
    let keypoints = poses[0].pose.keypoints;
    let inputs = [];
    for (let i = 0; i < keypoints.length; i++) {
      let kpScore = keypoints[i].score;
      // console.log("kpScore: ", kpScore);
      // if (kpScore > 0.2) {
      inputs.push(keypoints[i].position.x);
      inputs.push(keypoints[i].position.y);
      // }
    }
    return inputs;
  } else {
    let inputs = [];
    for (let i = 0; i < poses.length; i++) {
      let input = []; //ini penyebab hasil klasifikasi sama semua, soalnya arraynya belum dikosongkan
      let keypoints = poses[i].pose.keypoints;
      let score = poses[i].pose.score;
      console.log("keypoints: ", keypoints);
      // if (score) {
      for (let j = 0; j < keypoints.length; j++) {
        input.push(keypoints[j].position.x);
        input.push(keypoints[j].position.y);
        // inputs.push([keypoints[j].position.x, keypoints[j].position.y]);
      }
      inputs.push(input);
      // }
    }
    console.log("inputs: ", inputs);
    return inputs;
  }
}
// inputs[0][0] = x;
// inputs[0][1] = x;
// inputs[1][0] = y;
// inputs[1][1] = y;

let addNewTimer, addAppendTimer;
//  Add poses for dataset
function addDataset() {
  stopBlink();
  if (poses.length > 0) {
    console.log("waiting");
    pState.html("Waiting for collecting data...");
    setTimeout(function () {
      console.log("collecting");
      pState.html("Collecting data...");

      if (loadedDataset) {
        addAppendTimer = setInterval(() => {
          let inputs = getInput();
          let target = sDataLabel.val();
          // console.log("inputs: ", inputs);
          // console.log("target: ", [target]);
          // brain.addData(inputs, [target]);
          enhanceData(inputs, [target]);
          // console.log("dataset: ", enhancedDataset);
          console.log(".");
        }, 500); //looping to add more data
      } else {
        addNewTimer = setInterval(() => {
          let inputs = getInput();
          let target = sDataLabel.val();
          // console.log("inputs: ", inputs);
          // console.log("target: ", target);
          brain.addData(inputs, [target]);
          // console.log("dataset: ", brain.neuralNetworkData.data.raw);
          console.log(".");
        }, 500); //looping to add more data
      }

      setTimeout(() => {
        console.log("not collecting / done");
        pState.html("Done collecting data");
        rS = readyState[0]; //collected
        startBlink(btnTrain);
        inEpochTrain.show();
        if (loadedDataset) {
          clearInterval(addAppendTimer);
          console.log("n dataset: ", enhancedDataset.length);
          brain.neuralNetworkData.data.raw = enhancedDataset; //append to brain legally
          console.log("enhancedDataset: ", enhancedDataset);
          console.log("brainDataset: ", brain.neuralNetworkData.data.raw);
        } else {
          clearInterval(addNewTimer);
          console.log("n dataset: ", brain.neuralNetworkData.data.raw.length);
        }
        // startBlink(inEpochTrain);
      }, 20000); //duration to collect data
    }, 5000); //waiting to collect data
  }
}

function enhanceData(x, y) {
  let objX, objY;
  objX = Object.assign({}, x);
  objY = Object.assign({}, y);

  enhancedDataset.push({
    xs: objX,
    ys: objY,
  });
}

function whileTraining(epoch, loss) {
  console.log("epoch: ", epoch);
  console.log("loss: ", loss);
}

function finishTraining() {
  rS = readyState[1]; //trained
  console.log("The model has been trained");
  pState.html("The model has been trained");

  stopBlink();
  startBlink(btnClassify);
  console.log(brain);
}

// Train the model
function trainModel() {
  stopBlink();

  // brainOptions = {
  //   inputs: 34,
  //   outputs: 3,
  //   task: "classification",
  //   debug: true,
  //   learningRate: 0.2,
  //   layers: [
  //     {
  //       type: "dense",
  //       units: 16,
  //       activation: "relu",
  //     },
  //     {
  //       type: "dense",
  //       units: 16,
  //       activation: "sigmoid",
  //     },
  //     {
  //       type: "dense",
  //       activation: "sigmoid",
  //     },
  //   ],
  // };
  // brain = ml5.neuralNetwork(brainOptions);

  brain.normalizeData();
  let epochs = inEpochTrain.val();
  let trainOptions = {
    epochs: epochs,
    batchSize: 32,
  };

  brain.train(trainOptions, whileTraining, finishTraining);
}

function evalModel() {
  let tp, tn, fp, fn;
}

// Classify single person
function classifySingle() {
  // console.log(poses);
  if (poses.length > 0) {
    let inputs = getInput();
    // console.log(inputs);
    brain.classify(inputs, gotSingleResults);
  }
}

let labelResult, scoreResult;
function gotSingleResults(error, results) {
  if (error) {
    console.log(error);
  }
  let resL;
  let resC;
  resL = results[0].label;
  labelResult = resL;
  resC = floor(results[0].confidence * 100);
  scoreResult = resC;

  clsId = [];
  confId = [];

  let cAL = cA.length;
  let cBL = cB.length;
  let cCL = cC.length;
  let cDL = cD.length;
  let cEL = cE.length;
  let tsA, tsB, tsC, tsD, tsE;

  if (resL == "A") {
    if (resC > 60) {
      cA.push(resC);
    }
    clsId.push(resL);
    confId.push(resC);
  } else if (resL == "B") {
    if (resC > 60) {
      cB.push(resC);
    }
    clsId.push(resL);
    confId.push(resC);
  } else if (resL == "C") {
    if (resC > 60) {
      cC.push(resC);
    }
    clsId.push(resL);
    confId.push(resC);
  } else if (resL == "D") {
    if (resC > 60) {
      cD.push(resC);
    }
    clsId.push(resL);
    confId.push(resC);
  } else if (resL == "E") {
    if (resC > 60) {
      cE.push(resC);
    }
    clsId.push(resL);
    confId.push(resC);
  }

  // console.log(
  //   "A: " + cAL + " |B: " + cBL + " |C: " + cCL + " |D: " + cDL + " |E: " + cEL
  // );
  console.log("results: " + resL + " " + resC + "%");

  pCondition.html("results: " + resL + " " + resC + "%");

  emoTotal = cAL + cBL + cCL + cDL + cEL;
  // tofixed saat upload aja
  // tsA = (cAL / emoTotal) * 100;
  // tsB = (cBL / emoTotal) * 100;
  // tsC = (cCL / emoTotal) * 100;
  // tsD = (cDL / emoTotal) * 100;
  // tsE = (cEL / emoTotal) * 100;
  // sA = tsA.toFixed(2);
  // sB = tsB.toFixed(2);
  // sC = tsC.toFixed(2);
  // sD = tsD.toFixed(2);
  // sE = tsE.toFixed(2);

  sA = (cAL / emoTotal) * 100;
  sB = (cBL / emoTotal) * 100;
  sC = (cCL / emoTotal) * 100;
  sD = (cDL / emoTotal) * 100;
  sE = (cEL / emoTotal) * 100;

  console.log(
    "% A: " + sA + " |B: " + sB + " |C: " + sC + " |D: " + sD + " |E: " + sE
  );

  // classifyTime = setTimeout(() => {
  //   // Classify again
  //   classifySingle();
  // }, 1000);
}

// Classify multiple person
function classifyMulti() {
  if (poses.length > 0) {
    let inputs_multi = getInputs();
    // console.log(inputs_multi);
    brain.classifyMultiple(inputs_multi, gotMultiResults);
  }
}

function gotMultiResults(error, results) {
  if (error) {
    console.log("error: ", error);
  }
  console.log("results: ", results);

  let cAL = cA.length;
  let cBL = cB.length;
  let cCL = cC.length;
  let cDL = cD.length;
  let cEL = cE.length;
  let cUL = cU.length;

  // console.log("clsId: ", clsId);
  clsId = [];
  confId = [];

  if (results == undefined) {
    let resUL = "un";
    let resUC = "defined";
    for (let i = 0; i < poses.length; i++) {
      cU.push("undefined");
      clsId.push(resUL);
      // console.log("clsId: ", clsId);
      confId.push(resUC);
    }
    console.log("results: " + resUL + " " + resUC + "%");
    pCondition.html("results: " + resUL + " " + resUC + "%");
  } else {
    let resL = [];
    let resC = [];

    for (let i = 0; i < results.length; i++) {
      resL[i] = results[i][0].label;
      resC[i] = floor(results[i][0].confidence * 100);

      console.log("resL:", resL[i]);
      console.log("resC:", resC[i]);

      if (resL[i] == "A") {
        if (resC[i] > 60) {
          cA.push(resC[i]);
        }
        clsId.push(resL[i]);
        // console.log("clsId: ", clsId);
        confId.push(resC[i]);
      } else if (resL[i] == "B") {
        if (resC[i] > 60) {
          cB.push(resC[i]);
        }
        clsId.push(resL[i]);
        // console.log("clsId: ", clsId);
        confId.push(resC[i]);
      } else if (resL[i] == "C") {
        if (resC[i] > 60) {
          cC.push(resC[i]);
        }
        clsId.push(resL[i]);
        // console.log("clsId: ", clsId);
        confId.push(resC[i]);
      } else if (resL[i] == "D") {
        if (resC[i] > 60) {
          cD.push(resC[i]);
        }
        clsId.push(resC[i]);
        // console.log("clsId: ", clsId);
        confId.push(resC[i]);
      } else if (resL[i] == "E") {
        if (resC[i] > 60) {
          cE.push(resC[i]);
        }
        clsId.push(resC[i]);
        // console.log("clsId: ", clsId);
        confId.push(resC[i]);
      }
    }
    console.log("results: " + resL + " " + resC + "%");
    pCondition.html("results: " + resL + " " + resC + "%");
  }

  // i untuk penanda jumlah dan id siswanya

  // console.log(
  //   "A: " + cAL + " |B: " + cBL + " |C: " + cCL + " |D: " + cDL + " |E: " + cEL
  // );

  emoTotal = cAL + cBL + cCL + cDL + cEL + cUL;
  // emoTotal = cAL + cBL + cCL;

  sA = (cAL / emoTotal) * 100;
  sB = (cBL / emoTotal) * 100;
  sC = (cCL / emoTotal) * 100;
  sD = (cDL / emoTotal) * 100;
  sE = (cEL / emoTotal) * 100;
  sU = (cUL / emoTotal) * 100;

  sA = sA.toFixed(4);
  sB = sB.toFixed(4);
  sC = sC.toFixed(4);
  sD = sD.toFixed(4);
  sE = sE.toFixed(4);
  sU = sU.toFixed(4);

  console.log(
    "% A: " +
      sA +
      " |B: " +
      sB +
      " |C: " +
      sC +
      " |D: " +
      sD +
      " |E: " +
      sE +
      " |U: " +
      sU
  );
  // console.log("% A: " + sA + " |B: " + sB + " |C: " + sC);/
  // console.log("clsId: ", clsId);
}

function uploadFile() {
  let type = uS;
  var formData = new FormData();

  formData.append("type", type);
  // Read selected files
  var totalFiles = document.getElementById("in_upFile").files.length;
  for (var index = 0; index < totalFiles; index++) {
    formData.append(
      "files[]",
      document.getElementById("in_upFile").files[index]
    );
  }

  // AJAX request
  $.ajax({
    url: "upload.php",
    type: "post",
    data: formData,
    dataType: "json",
    contentType: false,
    processData: false,
    success: function (response) {
      for (var index = 0; index < response.length; index++) {
        var rslt = response[index];
        console.log(rslt);
      }
      btnUpdate.show();
      if (fS == "dataset") {
        btnDoTrain.attr("disabled", "false");
        startBlink(btnDoTrain);
      } else if (fS == "model") {
        btnDoClassify.attr("disabled", "false");
        startBlink(btnDoClassify);
      }
    },
  });
}

// Draw to canvas
// Draw single pose person
function drawPose() {
  // need to be checked later
  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    let pose = poses[0].pose;
    let pkp = pose.keypoints;
    let skeleton = poses[0].skeleton;
    for (let i = 0; i < pkp.length; i++) {
      let kp = pkp[i];
      let kpScore = pkp[i].score;
      if (kpScore > 0.2) {
        fill(213, 0, 143);
        strokeWeight(1);
        stroke("white");
        ellipse(kp.position.x, kp.position.y, 5);

        for (let j = 0; j < skeleton.length; j++) {
          // console.log("skeleton", skeleton);
          let skeaScore = skeleton[j][0].score;
          let skebScore = skeleton[j][1].score;
          let a = skeleton[j][0].position;
          let b = skeleton[j][1].position;
          if (skeaScore && skebScore > 0.6) {
            strokeWeight(1);
            stroke("white");
            line(a.x, a.y, b.x, b.y);
          }
        }
      }
    }

    // if (pose) {
    //   for (let i = 0; i < pkp.length; i++) {
    //     fill(213, 0, 143);
    //     strokeWeight(2);
    //     stroke("white");
    //     ellipse(pkp[i].position.x, pkp[i].position.y, 8);
    //   }
    //   for (let i = 0; i < skeleton.length; i++) {
    //     let a = skeleton[i][0].position;
    //     let b = skeleton[i][1].position;
    //     strokeWeight(2);
    //     stroke("white");
    //     line(a.x, a.y, b.x, b.y);
    //   }
    // }

    // if (dS == "classifying") {
    //   fill(213, 0, 143);
    //   strokeWeight(1);
    //   stroke("white");
    //   textSize(30);
    //   text("%|A:" + sA + "|B:" + sB + "|B:" + sC, 40, 20);
    // }
  }
}

// Draw multi poses person
function drawPoses() {
  // need to be checked later
  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i].pose;
      let pkp = pose.keypoints;
      let skeleton = poses[i].skeleton;
      let score = poses[i].pose.score;
      if (score) {
        count = poses.length;
        for (let i = 0; i < pkp.length; i++) {
          fill(213, 0, 143);
          strokeWeight(1);
          stroke("white");
          ellipse(pkp[i].position.x, pkp[i].position.y, 5);
        }
        for (let i = 0; i < skeleton.length; i++) {
          let a = skeleton[i][0].position;
          let b = skeleton[i][1].position;
          strokeWeight(1);
          stroke("white");
          line(a.x, a.y, b.x, b.y);
        }
        let noseX = pose.nose.x;
        let noseY = pose.nose.y;
        // let id = i + 1;
        fill("red");
        stroke("white");
        textSize(10);
        text(clsId[i], noseX, noseY + 50);

        fill("red");
        stroke("white");
        textSize(10);
        text(confId[i], noseX + 10, noseY + 50);
      }
      fill("red");
      stroke("white");
      textSize(20);
      text("N: " + count, 580, 20);
    }

    // if (dS == "classifying") {
    //   fill(213, 0, 143);
    //   strokeWeight(1);
    //   stroke("white");
    //   textSize(30);
    //   text(labelResult + ": " + scoreResult + "%", 40, 40);
    // }
  }
}

// function drawId() {
//   let count;
//   if (poses.length > 0) {
//     count = poses.length;
//     for (let i = 0; i < poses.length; i++) {
//       // For each pose detected, loop through all the keypoints
//       let pose = poses[i].pose;
//       let score = poses[i].pose.score;
//       // if (score > 0.6) {
//       // console.log(score);
//       let noseX = pose.nose.x;
//       let noseY = pose.nose.y;
//       let id = i + 1;
//       fill("red");
//       stroke("white");
//       textSize(20);
//       text(id, noseX, noseY + 50);
//       // }
//     }
//     fill("red");
//     stroke("white");
//     textSize(20);
//     text("N: " + count, 550, 20);
//   }
// }

// function drawKeypoints() {
//   // Loop through all the poses detected
//   for (let i = 0; i < poses.length; i++) {
//     // For each pose detected, loop through all the keypoints
//     let pose = poses[i].pose;
//     for (let j = 0; j < pose.keypoints.length; j++) {
//       // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//       let keypoint = pose.keypoints[j];
//       // Only draw an ellipse is the pose probability is bigger than 0.2
//       if (keypoint.score > 0.2) {
//         fill(255, 0, 0);
//         noStroke();
//         ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
//       }
//     }
//   }
// }

// // A function to draw the skeletons
// function drawSkeleton() {
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i++) {
//     let skeleton = poses[i].skeleton;
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j++) {
//       let partA = skeleton[j][0];
//       let partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       line(
//         partA.position.x,
//         partA.position.y,
//         partB.position.x,
//         partB.position.y
//       );
//     }
//   }
// }

function draw() {
  push();
  image(video, 0, 0, width, height);

  // drawPoses();
  //drawId();
  if (dS == "collecting") {
    drawPose();
  } else if (dS == "classifying") {
    drawPoses();
    // drawId();
    // if (poses.length > 0) {
    fill(255, 204, 0);
    stroke("white");
    textSize(10);
    if (emotionClass == 5) {
      // text("%|A:" + sA + "|B:" + sB + "|C:" + sC, 0, 40);
      // text("%|D:" + sD + "|E:" + sE, 0, 60);
      text("%|A:" + sA, 0, 40);
      text("%|B:" + sB, 0, 50);
      text("%|C:" + sC, 0, 60);
      text("%|D:" + sD, 0, 70);
      text("%|E:" + sE, 0, 80);
      text("%|U:" + sU, 0, 90);
    } else if (emotionClass == 4) {
      text("%|A:" + sA, 0, 40);
      text("%|B:" + sB, 0, 50);
      text("%|C:" + sC, 0, 60);
      text("%|D:" + sD, 0, 70);
      text("%|U:" + sU, 0, 80);
    } else if (emotionClass == 3) {
      text("%|A:" + sA, 0, 40);
      text("%|B:" + sB, 0, 50);
      text("%|C:" + sC, 0, 60);
      text("%|U:" + sU, 0, 70);
    } else if (emotionClass == 2) {
      text("%|A:" + sA, 0, 40);
      text("%|B:" + sB, 0, 50);
      text("%|U:" + sU, 0, 60);
    }
    // }
  } else {
  }

  pop();
}

function startBlink(id) {
  blinkTime = setInterval(() => {
    id.addClass("w3-opacity");
    setTimeout(() => {
      id.removeClass("w3-opacity");
    }, 500);
  }, 1000);
}

function stopBlink() {
  clearInterval(blinkTime);
}

function stopClassify() {
  clearTimeout(classifyTime);
  clearInterval(classifyInter);
}

function startRecording() {
  chunks.length = 0;

  let stream = document.querySelector("canvas").captureStream(fR);
  let options = { mimeType: "video/webm;codecs=vp8,opus" };
  // console.log(stream, options);
  recorder = new MediaRecorder(stream);

  console.log("Created MediaRecorder: ", recorder, "with options: ", options);

  recorder.onstop = (event) => {
    let duration = Date.now() - startTime;
    let buggyBlob = new Blob(chunks, { type: "video/webm" });
    console.log("duration: ", duration);

    ysFixWebmDuration(buggyBlob, duration, function (fixedBlob) {
      displayResult(fixedBlob);
    });

    ysFixWebmDuration(buggyBlob, duration, { logger: false }).then(function (
      fixedBlob
    ) {
      displayResult(fixedBlob);
    });

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
  startTime = Date.now();
  console.log("Recorder started", recorder);
  console.log("startTime: ", startTime);
}

function displayResult(blob) {
  console.log(blob);
}

function stopRecording() {
  recorder.stop();
}

let urlVideo, titleVideo, fileVideo, blobGlob;
function exportVideo(vS) {
  if (vS == "preview") {
    // Draw video to screen
    const superBuffer = new Blob(chunks, { type: "video/webm" });
    videoRec.attr("src", null);
    videoRec.attr("srcObject", null);
    let urlPreview = window.URL.createObjectURL(superBuffer);
    titleVideo = vidTitle();
    videoRec.attr("title", titleVideo);
    pState.html(titleVideo);
    console.log(urlPreview);
    videoRec.attr("src", urlPreview);
    videoRecHolder.show();
    btnDownloadVid.show();
    btnConfirmVid.show();
    // videoRecModal.modal("show");
    blobGlob = new Blob(chunks, { type: "video/mp4" });
    urlVideo = window.URL.createObjectURL(blobGlob);
    console.log(blobGlob);
    console.log(urlVideo);

    videoRec.append(
      "<a href='" + urlVideo + "' download='" + titleVideo + ".mp4'></a>"
    );

    // fileVideo = createFile();
    // console.log(fileVideo);
  } else if (vS == "download") {
    // Download the video
    console.log(urlVideo);
    const a = document.createElement("a");
    a.style = "display: none";
    a.href = urlVideo;
    a.download = titleVideo + ".mp4";
    document.body.appendChild(a);
    a.click();
    // setTimeout(() => {
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(urlVideo);
    // }, 100);
  } else if ("upload") {
    // fileVideo = new File([blobGlob], titleVideo + ".mp4");
    // // fileVideo = createFile();
    // console.log(fileVideo);

    let form = new FormData();
    form.append("title", titleVideo);
    form.append("file", blobGlob);

    $.ajax({
      url: "uploadvid.php",
      type: "POST",
      data: form,
      cache: false,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(response);
      },
    });
  }
}

async function createFile() {
  let resp = await fetch(urlVideo);
  let data = await resp.blob();
  let metadata = {
    type: "video/mp4",
  };
  let file = new File([data], titleVideo + ".mp4", metadata);
  return file;
}

function vidTitle() {
  let time = timeNow();
  let y = time.year;
  let ys = y.toString();
  let ysl = ys.slice(2, 4);
  title =
    "Affective_Assesment_Video(" +
    time.date +
    time.month +
    ysl +
    "_" +
    time.hour +
    time.min +
    ")";

  return title;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function timeNow() {
  let time, date, d, month, year, hour, min;

  d = new Date();
  date = d.getDate();
  month = d.getMonth() + 1; //to get the correct month you must add 1
  year = d.getFullYear();
  hour = addZero(d.getHours());
  min = addZero(d.getMinutes());

  time = { date: date, month: month, year: year, hour: hour, min: min };

  return time;
}

// req classroom state
// let inter = calcMs(0, 15, 0);
// let checkState = setInterval(() => {
//   alert("Sudah 15' - DATA BERHASIL DISIMPAN");
//   // $.ajax({
//   //   url: "dashboard-action.php",
//   //   type: "POST",
//   //   data: { type: "checkCState" },
//   //   success: function (res) {
//   //     if (res == "Tidak Aktif") {
//   //       stopClassify();
//   //       clearInterval(checkState);
//   //       // UPDATE TB PENILAIAN
//   //       $.ajax({
//   //         url: "dashboard-action.php",
//   //         type: "POST",
//   //         data: { type: "update", sA: sA, sB: sB, sC: sC, sD: sD, sE: sE },
//   //         success: function () {
//   //           alert("DATA BERHASIL DISIMPAN");
//   //           // PAKAI SWEETALERT
//   //         },
//   //       });
//   //     }
//   //   },
//   // });
// }, inter);
// // dalam miliseconds, 1 seconds = 1000 ms
// // jika 1' = 60", maka 15' = 900", maka 900" = 900.000 ms (kalau mau check tiap 15')
// function calcMs(h, m, s) {
//   let ms;
//   let msQ = 1000;

//   if (h) {
//     ms = h * 3600 * msQ;
//   } else if (m) {
//     ms = m * 60 * msQ;
//   } else if (s) {
//     ms = s * msQ;
//   }

//   return ms;
// }

// console.log(calcMs(0, 15, 0));
