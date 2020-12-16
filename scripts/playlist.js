let videos = [
  {
    id: 0,
    name: "Electronics",
    src: "./assets/video/Electronics",
    duration: null,
  },
  {
    id: 1,
    name: "News",
    src: "./assets/video/news",
    duration: null,
  },
  {
    id: 2,
    name: "Ocean",
    src: "./assets/video/Ocean",
    duration: null,
  },
  {
    id: 3,
    name: "Office - 1",
    src: "./assets/video/Office - 1",
    duration: null,
  },
  {
    id: 4,
    name: "Office - 2",
    src: "./assets/video/Office - 2",
    duration: null,
  },
  {
    id: 5,
    name: "Plexus",
    src: "./assets/video/Plexus",
    duration: null,
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

  video.addEventListener(
    "loadedmetadata",
    () => {
      if (videos[id].duration == null) {
        setMetadata();
      }
    },
    false
  );
  video.addEventListener("ended", setVideo, false);
  // video.addEventListener("play", processFrame, false);
  video.addEventListener("error", errorHandler, false);

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

// добавляем обработчики событий нажатия клавиш на панели управления
function handeControl(event) {
  var id = event.target.getAttribute("id");
  var video = document.getElementById("video");
  if (id == "play") {
    pushUnpushButtons("play", ["pause"]);
    if (video.ended) {
      video.load();
    }
    video.play();
  } else if (id == "pause") {
    pushUnpushButtons("pause", ["play"]);
    video.pause();
  } else if (id == "loop") {
    if (!isButtonPushed("loop")) {
      pushUnpushButtons("loop", []);
      video.loop = true;
    } else {
      pushUnpushButtons("", ["loop"]);
      video.loop = false;
    }
  } else if (id == "mute") {
    if (!isButtonPushed("mute")) {
      pushUnpushButtons("mute", []);
      video.muted = true;
    } else {
      pushUnpushButtons("", ["mute"]);
      video.muted = false;
    }
  }
}

// визуальная обработка нажатия кнопок
function pushUnpushButtons(idToPush, idArrayToUnpush) {
  if (idToPush != "") {
    var anchor = document.getElementById(idToPush);
    var theClass = anchor.getAttribute("class");
    if (theClass.indexOf("selected") === -1) {
      theClass = theClass.replace("unSelected", "selected");
      anchor.setAttribute("class", theClass);
    }
  }
  // в остальных элементах находим класс "selected" и убираем его
  for (var i = 0; i < idArrayToUnpush.length; i++) {
    anchor = document.getElementById(idArrayToUnpush[i]);
    theClass = anchor.getAttribute("class");
    if (theClass.indexOf("selected") !== -1) {
      theClass = theClass.replace("selected", "unSelected");
      anchor.setAttribute("class", theClass);
    }
  }
}

function isButtonPushed(id) {
  var anchor = document.getElementById(id);
  var theClass = anchor.getAttribute("class");

  if (theClass.indexOf("selected") !== -1) {
    return true;
  } else {
    return false;
  }
}

// функция обработки выбора видео
function setVideo(event) {
  var video = document.getElementById("video");
  var idEvent;
  if (event.type == "click") {
    idEvent = event.target.getAttribute("id");
    id = idEvent.replace("video", "");
  } else if (event.type == "ended") {
    id = Number(video.name) + 1;
    if (id >= videos.length) {
      id = 0;
    }
    idEvent = "video" + id;
  }
  video.name = id;
  video.src = videos[id].src + getFormatExtension();
  var arrayId = [];
  for (var i = 0; i < videos.length; i++) {
    if (idEvent != "video" + i) {
      arrayId.push("video" + i);
    }
  }
  pushUnpushButtons(idEvent, arrayId);
  pushUnpushButtons("play", ["pause"]);
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
    boxVideo.append(aElement);
  }
}

// при загрузке метаданных, выводим duration в дом
function setMetadata() {
  videos[id].duration = video.duration;
  var spanTime = document.createElement("span");
  var m = videos[id].duration % 60;
  spanTime.innerText =
    Math.floor(videos[id].duration / 60) +
    ":" +
    (m < 10 ? "0" : "") +
    Math.floor(m);
  spanTime.style.float = "right";
  document.getElementById("video" + id).append(spanTime);
}

// функция обработки выбора эфектов
function setEffect(event) {
  var id = event.target.getAttribute("id");
  if (id == "normal") {
    pushUnpushButtons("normal", ["western", "noir", "scifi"]);
    effectFunction = null;
  } else if (id == "western") {
    pushUnpushButtons("western", ["normal", "noir", "scifi"]);
    effectFunction = western;
  } else if (id == "noir") {
    pushUnpushButtons("noir", ["normal", "western", "scifi"]);
    effectFunction = noir;
  } else if (id == "scifi") {
    pushUnpushButtons("scifi", ["normal", "western", "noir"]);
    effectFunction = scifi;
  }
}

// обработчик видео
function processFrame() {
  var video = document.getElementById("video");
  if (video.paused || video.ended) {
    return;
  }
  var bufferCanvas = document.getElementById("buffer");
  var displayCanvas = document.getElementById("display");
  var buffer = bufferCanvas.getContext("2d");
  var display = displayCanvas.getContext("2d");
  buffer.drawImage(video, 0, 0, bufferCanvas.width, bufferCanvas.height);
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

  setTimeout(processFrame, 0);
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

function endedHandler() {
  pushUnpushButtons("", ["play"]);
}

function errorHandler() {
  var video = document.getElementByld("video");
  if (video.error) {
    video.poster = "./assets/image/technicaldifficulties.jpg";
    alert(video.error.code);
  }
}
