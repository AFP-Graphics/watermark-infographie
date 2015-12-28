var width = 1014;
var height = 548;
var filename = "3col.jpeg";

var stage;
var layerImage = new Konva.Layer();
var layerLogo = new Konva.Layer();

var numLogo = 1;

init("assets/" + filename);

document.querySelector('#imageLoader').addEventListener('change', function(e) {
  handleImage(e);
});

document.querySelector('#addLogo').addEventListener('click', function(e) {
  e.preventDefault();
  if(numLogo<=4) {
    loadLogo("assets/logo-afp.png");
    numLogo++;
  }
});

document.querySelector('#save').addEventListener('click', function(e) {
  e.preventDefault();
  saveImage(filename);
});

function init(url) {
  stage = new Konva.Stage({
    container: 'canvas-container',
    width: width,
    height: height
  });
  loadImage(url);
  loadLogo("assets/logo-afp.png");
  setTimeout(function() {
    stage.add(layerImage);
    stage.add(layerLogo);
  }, 500);
}

var handleImage = function(e) {
  if (e.target.value !== "") {
    var reader = new FileReader();
    reader.onload = function(f) {
      stage.destroy();
      numLogo = 1;

      filename = e.target.files[0].name.match(/(.*)\./)[1] ? e.target.files[0].name.match(/(.*)\./)[1] : e.target.files[0].name;
      init(f.target.result);
    }
    reader.readAsDataURL(e.target.files[0]);
  }
}

function loadImage(url)  {
  var imageObj = new Image();
  imageObj.onload = function(d) {
    addImage(this);
  };
  imageObj.src = url;
}

function addImage(imageObj) {
  var widthImage = imageObj.width/2,
      heightImage = imageObj.height * widthImage / imageObj.width;

    // heightImage = imageObj.height * width / ;
    // widthImage = width;


  stage.setAttrs({
    width: widthImage,
    height: heightImage
  });

  var infographie = new Konva.Image({
    image: imageObj,
    x: 0,
    y: 0,
    width: widthImage,
    height: heightImage,
    draggable: false
  });

  layerImage.add(infographie);
}

function loadLogo(url) {
  var imageObj = new Image();
  imageObj.onload = function() {
    addLogo(this);
  };
  imageObj.src = url;
}

function addLogo(imageObj) {
  var logoImg = new Konva.Image({
    x: 100,
    y: 100,
    image: imageObj,
    width: imageObj.width/2,
    height: imageObj.height/2,
    draggable: true
  });

  logoImg.on("dragstart dragend", function() {
    this.moveToTop();
    layerLogo.draw();
  });

  logoImg.on("dragmove", function() {
    document.body.style.cursor = "pointer";
  });
  /*
   * dblclick to remove box for desktop app
   * and dbltap to remove box for mobile app
   */
  logoImg.on("dblclick dbltap", function() {
    this.destroy();
    layerLogo.draw();
  });

  logoImg.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
  });
  logoImg.on('mouseout', function() {
    document.body.style.cursor = 'default';
  });

  layerLogo.add(logoImg);
  stage.draw();
}

function saveImage(filename) {
  var image = stage.toDataURL({
    mimeType: "image/jpeg",
    quality: 1
  });

  var link = document.createElement('a');
  link.download = 'afp-' + filename + '.jpg';
  link.href = image; //Chrome crashes with large PNGs
  link.target = "_blank";
  if (document.createEvent) {
    e = document.createEvent("MouseEvents");
    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(e);
  } else if (link.fireEvent) {
    link.fireEvent("onclick");
  }
}

/************
  Google Analytics
  ************/

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-64253904-4', {
  'alwaysSendReferrer': true
});
ga('set', 'anonymizeIp', true);
ga('send', 'pageview');