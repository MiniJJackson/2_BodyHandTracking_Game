let handpose;
let video;
let predictions = [];
let modelLoaded = false;

let circle1;
let circle2;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // add handpose model
  handpose = ml5.handpose(video, modelReady);
  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
    console.log(predictions);
  });
  // Hide the video element, and just show the canvas
  video.hide();

  // Circles setup

  circ1 = new Circle();
  circ2 = new Circle();
  ellipseMode(CENTER);

}

function modelReady() {
  console.log("Model ready!");
  modelLoaded = true;
  select('#status').html('Model Loaded');
}

function draw() {
  frameRate(30);
  if (modelLoaded) {
    image(video, 0, 0, width, height);
    // We can call both functions to draw all keypoints and the skeletons
    // drawKeypoints();
    drawFingers();
    
    // DOTS FOR THE GAME
    circ1.display();
    circ2.display();
    
    // for collision detection, calc distance between two ellipses using radius
    // if distance is less than sum of radius, they are overlapping
    // first calc distance between two circles
    var d = dist(circ1.x, circ1.y, circ2.x, circ2.y);
    // now see if distance between two is less than sum of two radius'
    if (d < circ1.r + circ2.r) {
      // if they are overlapping, change color
      circ1.changeColor();
      circ2.changeColor();
    }

  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

function drawFingers() {
  console.log(predictions);
  push();
  rectMode(CORNERS);
  noStroke();
  fill(255, 0, 0);
  if (predictions[0] && predictions[0].hasOwnProperty('annotations')) {
    let index1 = predictions[0].annotations.indexFinger[0];
    let index2 = predictions[0].annotations.indexFinger[1];
    let index3 = predictions[0].annotations.indexFinger[2];
    let index4 = predictions[0].annotations.indexFinger[3];
    // circle(index1[0], index1[1], index1[2]);
    // circle(index2[0], index2[1], index2[2]);
    // circle(index3[0], index3[1], index3[2]);
    circle(index4[0], index4[1], 10);// index4[2]);
  }
  pop();
}

function Circle() {
  this.x = random(0, 480);
  this.y = random(0, 480);
  this.r = 25;
  this.col = color('red');
  
  this.display = function() {
    ellipse(this.x, this.y, this.r*2);
    fill(this.col);
  }
  
  this.changeColor = function() {
    this.col = color('red');
  }
}