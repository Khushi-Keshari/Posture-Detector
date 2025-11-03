let capture;
let posenet;
let people = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Capture video at fixed resolution for PoseNet
  capture = createCapture(VIDEO);
  capture.size(640, 480); // PoseNet works well at this resolution
  capture.hide();

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
  background(0);

  // Maintain video aspect ratio
  let videoAspect = capture.width / capture.height;
  let canvasAspect = width / height;
  let displayWidth, displayHeight;

  if (canvasAspect > videoAspect) {
    displayHeight = height;
    displayWidth = videoAspect * height;
  } else {
    displayWidth = width;
    displayHeight = width / videoAspect;
  }

  let offsetX = (width - displayWidth) / 2;
  let offsetY = (height - displayHeight) / 2;

  // Draw the video
  image(capture, offsetX, offsetY, displayWidth, displayHeight);

  // Scale factors for keypoints
  let scaleX = displayWidth / capture.width;
  let scaleY = displayHeight / capture.height;

  fill(255, 0, 0);
  stroke(255);
  strokeWeight(2);

  for (let j = 0; j < people.length; j++) {
    let singlepose = people[j].pose;
    let skeleton = people[j].skeleton;

    if (singlepose) {
      // Draw keypoints without mirroring
      for (let i = 0; i < singlepose.keypoints.length; i++) {
        let x = offsetX + singlepose.keypoints[i].position.x * scaleX;
        let y = offsetY + singlepose.keypoints[i].position.y * scaleY;
        ellipse(x, y, 10, 10);
      }

      // Draw skeleton lines without mirroring
      for (let i = 0; i < skeleton.length; i++) {
        let partA = skeleton[i][0];
        let partB = skeleton[i][1];
        line(
          offsetX + partA.position.x * scaleX,
          offsetY + partA.position.y * scaleY,
          offsetX + partB.position.x * scaleX,
          offsetY + partB.position.y * scaleY
        );
      }
    }
  }
}

// Make canvas responsive when window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
