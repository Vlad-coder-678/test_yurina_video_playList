const videos = [
  {
    id: 0,
    name: "Electronics",
    src: "./assets/video/Electronics",
    time: "0.06",
  },
  {
    id: 1,
    name: "News",
    src: "./assets/video/news",
    time: "0.15",
  },
  {
    id: 2,
    name: "Ocean",
    src: "./assets/video/Ocean",
    time: "0.10",
  },
  {
    id: 3,
    name: "Office - 1",
    src: "./assets/video/Office - 1",
    time: "0.06",
  },
  {
    id: 4,
    name: "Office - 2",
    src: "./assets/video/Office - 2",
    time: "0.06",
  },
  {
    id: 5,
    name: "Plexus",
    src: "./assets/video/Plexus",
    time: "0.06",
  },
];
var id = 0;
var effectFunction = null;

window.onload = () => {
  var video = document.getElementById("video");
  video.name = id;
  video.src = videos[id].src + getFormatExtension();
  video.load();
  setVideoInDom();

  // вешаем обработчики на кнопки управления
  var controlLinks = document.querySelectorAll("a.control");
  for (var i = 0; i < controlLinks.length; i++) {
    controlLinks[i].onclick = handeControl;
  }
  // вешаем обработчики на кнопки с эффектами
  var effectLinks = document.querySelectorAll("a.effect");
  for (var i = 0; i < effectLinks.length; i++) {
    effectLinks[i].onclick = setEffect;
  }
  // вешаем обработчики на кнопки с видео
  var videoLinks = document.querySelectorAll("a.videoSelection");
  for (var i = 0; i < videoLinks.length; i++) {
    videoLinks[i].onclick = setVideo;
  }

  video.addEventListener("ended", nextVideo, false);

  pushUnpushButtons("normal", ["western", "noir", "scifi"]);
  pushUnpushButtons("video0", []);
};

// определяем поддерживаемый формат видео браузером и предагаем использовать видео в данном формате
function getFormatExtension() {
  if (video.canPlayType("video/mp4") != "") {
    return ".mp4";
  } else if (video.canPlayType("video/webm") != "") {
    return ".webm";
  } else if (video.canPlayType("video/ogg") != "") {
    return ".ogg";
  } else {
    return "Your browser doesn't support HTML5 video tag.";
  }
}

// событие при окончании видео
function nextVideo() {
  // video.name++;
  // if (video.name >= videos.length) {
  //   video.name = 0;
  // }
  // video.src = videos[video.name].src + getFormatExtension();
  // video.load();
  // video.play();
  setVideo();
}

// добавляем обработчики событий нажатия клавиш на панели управления
function handeControl(event) {
  var id = event.target.getAttribute("id");
  // console.log("выводит id: " + id);
  var video = document.getElementById("video");
  if (id == "play") {
    pushUnpushButtons("play", ["pause"]);
    // console.log("play");
    if (video.ended) {
      video.load();
    }
    video.play();
  } else if (id == "pause") {
    pushUnpushButtons("pause", ["play"]);
    video.pause();
    // console.log("pause");
  } else if (id == "loop") {
    if (!isButtonPushed("loop")) {
      pushUnpushButtons("loop", []);
      // console.log("loop");
      video.loop = true;
    } else {
      pushUnpushButtons("", ["loop"]);
      // console.log("no loop");
      video.loop = false;
    }
  } else if (id == "mute") {
    if (!isButtonPushed("mute")) {
      pushUnpushButtons("mute", []);
      // console.log("muted");
      video.muted = true;
    } else {
      pushUnpushButtons("", ["mute"]);
      // console.log("no muted");
      video.muted = false;
    }
  }
}

function pushUnpushButtons(idToPush, idArrayToUnpush) {
  // console.log("вход в функцию присваивания класса selected " + idToPush.typeof);
  if (idToPush != "") {
    // console.log("если класса актив нет то...");
    var anchor = document.getElementById(idToPush);
    var theClass = anchor.getAttribute("class");
    if (theClass.indexOf("selected") === -1) {
      // console.log("...присваиваем класс актив");
      theClass = theClass.replace("unSelected", "selected");
      anchor.setAttribute("class", theClass);
    }
  }
  // в остальных элементах находим класс "selected" и убираем его
  for (var i = 0; i < idArrayToUnpush.length; i++) {
    anchor = document.getElementById(idArrayToUnpush[i]);
    theClass = anchor.getAttribute("class");
    if (theClass.indexOf("selected") !== -1) {
      // console.log("убираем класс актив");
      theClass = theClass.replace("selected", "unSelected");
      anchor.setAttribute("class", theClass);
    }
  }
}

function isButtonPushed(id) {
  // console.log("выясняем присутствует ли класс selected " + id);
  var anchor = document.getElementById(id);
  var theClass = anchor.getAttribute("class");
  // console.log("theClass: " + theClass);

  if (theClass.indexOf("selected") !== -1) {
    // console.log("selected присутствует");
    return true;
  } else {
    // console.log("selected отсутствует");
    return false;
  }
}

// функция обработки выбора видео
function setVideo(event) {
  var video = document.getElementById("video");
  if (event) {
    var idEvent = event.target.getAttribute("id");
    id = idEvent.replace("video", "");
    video.name = id;
  } else {
    video.name++;
    if (video.name >= videos.length) {
      video.name = 0;
    }
    id = video.name;
    idEvent = "video" + id;
  }
  video.src = videos[id].src + getFormatExtension();
  var arrayId = [];
  for (var i = 0; i < videos.length; i++) {
    if (idEvent != "video" + i) {
      arrayId.push("video" + i);
    }
  }
  pushUnpushButtons(idEvent, arrayId);
  video.load();
  video.play();
}

// создаём плейлист в виде DOM элементов
function setVideoInDom() {
  var boxVideo = document.getElementById("videoSelection");
  for (var i = 0; i < videos.length; i++) {
    var aElement = document.createElement("a");
    aElement.className = "videoSelection unSelectedVideo";
    aElement.setAttribute("id", "video" + i);
    aElement.innerText = videos[i].name;
    var spanTime = document.createElement("span");
    spanTime.innerText = videos[i].time;
    spanTime.style.float = "right";
    aElement.append(spanTime);
    boxVideo.append(aElement);
  }
}

function endedHandler() {
  pushUnpushButtons("", ["play"]);
}

// функция обработки выбора эфектов
function setEffect(event) {
  var id = event.target.getAttribute("id");
  if (id == "normal") {
    pushUnpushButtons("normal", ["western", "noir", "scifi"]);
    effectFunction = null;
    processFrame();
  } else if (id == "western") {
    pushUnpushButtons("western", ["normal", "noir", "scifi"]);
    effectFunction = western;
    processFrame();
  } else if (id == "noir") {
    pushUnpushButtons("noir", ["normal", "western", "scifi"]);
    effectFunction = noir;
    processFrame();
  } else if (id == "scifi") {
    pushUnpushButtons("scifi", ["normal", "western", "noir"]);
    effectFunction = scifi;
    processFrame();
  }
}

function processFrame() {
  console.log("processFrame");
  var video = document.getElementById("video");
  if (video.paused || video.ended) {
    return;
  }

  var bufferCanvas = document.getElementById("buffer");
  var displayCanvas = document.getElementById("display");
  var buffer = bufferCanvas.getContext("2d");
  var display = displayCanvas.getContext("2d");
  // img.crossOrigin = "Anonymous";
  // video.setAttribute("crossOrigin", "");
  // var imgObj = new Image();
  // imgObj.setAttribute("crossOrigin", "");
  // imgObj.drawImage(video, 0, 0);
  console.log("video: " + video + " buffer: " + buffer);
  buffer.drawImage(video, 0, 0, bufferCanvas.width, bufferCanvas.height);
  // buffer.setAttribute("crossOrigin", "");
  var frame = buffer.getImageData(
    0,
    0,
    bufferCanvas.width,
    bufferCanvas.height
  );
  var length = frame.data.length / 4;

  for (var i = 0; i < length; i++) {
    var r = frame.data[i * 4 + 0];
    var g = frame.data[i * 4 + 1];
    var b = frame.data[i * 4 + 2];
    if (effectFunction) {
      effectFunction(i, r, g, b, frame.data);
    }
  }
  display.putImageData(frame, 0, 0);

  setTimeout(processFrame, 29);
}

/*
 * filters
 */

function bwcartoon(pos, r, g, b, outputData) {
  var offset = pos * 4;
  if (outputData[offset] < 120) {
    outputData[offset] = 80;
    outputData[++offset] = 80;
    outputData[++offset] = 80;
  } else {
    outputData[offset] = 255;
    outputData[++offset] = 255;
    outputData[++offset] = 255;
  }
  outputData[++offset] = 255;
  ++offset;
}

function noir(pos, r, g, b, data) {
  var brightness = (3 * r + 4 * g + b) >>> 3;
  if (brightness < 0) brightness = 0;
  data[pos * 4 + 0] = brightness;
  data[pos * 4 + 1] = brightness;
  data[pos * 4 + 2] = brightness;
}

function western(pos, r, g, b, data) {
  var brightness = (3 * r + 4 * g + b) >>> 3;
  data[pos * 4 + 0] = brightness + 40;
  data[pos * 4 + 1] = brightness + 20;
  data[pos * 4 + 2] = brightness - 20;
  data[pos * 4 + 3] = 255; //220;
}

function scifi(pos, r, g, b, data) {
  var offset = pos * 4;
  data[offset] = Math.round(255 - r);
  data[offset + 1] = Math.round(255 - g);
  data[offset + 2] = Math.round(255 - b);
}

// if (video.duration.typeOf == undefined) {
//   spanTime.innerText = "не удалось извлечь время трека";
// } else {
//   // var duration = videoNode.duration.toFixed(1);
//   var m = video.duration % 60;
//   spanTime.innerText =
//     Math.floor(video.duration / 60) + ":" + (m < 10 ? "0" : "") + m;
// }

// video.addEventListener("ended", endedHandler, false);
// video.addEventListener("play", processFrame, false);
// video.addEventListener("error", errorHandler, false);

// function errorHandler() {
//   var video = document.getElementByld("video");
//   if (video.error) {
//     video.poster = " images /technical difficulties . jpg";
//     alert(video.error.code);
//   }
// }
