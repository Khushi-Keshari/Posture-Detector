let capture;
let posenet;
let people = [];

function setup() {
  // Create canvas that fills the window
  createCanvas(windowWidth, windowHeight);

  // Capture video and hide default HTML video element
  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();

  // Initialize PoseNet
  posenet = ml5.poseNet(capture, modelLoaded);
  posenet.on('pose', receivePoses);
}

function modelLoaded() {
  console.log("✅ PoseNet model loaded.");
}

function receivePoses(poses) {
  people = poses;
}

function draw() {
  // Mirror the video for a selfie view
  translate(width, 0);
  scale(-1, 1);

  // Draw video
  image(capture, 0, 0, width, height);

  fill(255, 0, 0);
  stroke(255);
  strokeWeight(2);

  for (let j = 0; j < people.length; j++) {
    let singlepose = people[j].pose;
    let skeleton = people[j].skeleton;

    if (singlepose) {
      // Scale keypoints according to current canvas size
      let scaleX = width / capture.width;
      let scaleY = height / capture.height;

      // Draw keypoints
      for (let i = 0; i < singlepose.keypoints.length; i++) {
        let x = singlepose.keypoints[i].position.x * scaleX;
        let y = singlepose.keypoints[i].position.y * scaleY;
        ellipse(x, y, 10, 10);
      }

      // Draw skeleton lines
      for (let i = 0; i < skeleton.length; i++) {
        let partA = skeleton[i][0];
        let partB = skeleton[i][1];
        line(
          partA.position.x * scaleX,
          partA.position.y * scaleY,
          partB.position.x * scaleX,
          partB.position.y * scaleY
        );
      }
    }
  }
}

// Make canvas and video responsive when window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  capture.size(windowWidth, windowHeight);
}
