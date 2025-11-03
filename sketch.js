let capture;
let posenet;
let noseX,noseY;
let people=[];
function setup() {
    createCanvas(windowWidth, windowHeight);
    capture=createCapture(VIDEO);
    capture.size(windowWidth, windowHeight);
    capture.hide();
    posenet=ml5.poseNet(capture,modelLoaded);
    posenet.on('pose',receivePoses);
}
function receivePoses(poses){
    console.log(poses);
    // if(poses.length>0){
    //     singlepose=poses[0].pose;
    // }
    people=poses;
    
    console.log(noseX+" "+noseY);
}
function modelLoaded(){
    console.log("Model has loaded.");
}
function draw() {
    //background(220);
    image(capture,0,0,width,height);
    
    fill(255, 0, 0);
    for(let j=0;j<people.length;j++){
        let singlepose=people[j].pose;
        if(singlepose){
        for(let i=0;i<singlepose.keypoints.length;i++){
            
            let X=singlepose.keypoints[i].position.x;
            let Y=singlepose.keypoints[i].position.y;
            
            ellipse(X, Y, 10, 10);
            
        }
        let skeleton=people[j].skeleton;
        for(let i=0;i<skeleton.length;i++){
            stroke(255,255,255);
            strokeWeight(5);
            line(skeleton[i][0].position.x,skeleton[i][0].position.y,skeleton[i][1].position.x,skeleton[i][1].position.y);
        }
    }
    }
    
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  capture.size(windowWidth, windowHeight);
}

