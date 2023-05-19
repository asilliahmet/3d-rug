const videoEl = document.querySelector("#videoBackground");
const sceneEl = document.querySelector("a-scene");
const cameraEl = document.querySelector("a-camera");
const theRug = document.querySelector("#therug");
const touchOverlay = document.querySelector("#touchoverlay");
const rugPointer = document.querySelector("#placementPointer");

const log = document.querySelector("#log");

let touchStartXY = [0,0];
let moveCoeff = 0.01;

AFRAME.registerComponent("camera-movement", {
    tick: ()=>{
        let camRotation = cameraEl.object3D.rotation;
        let camPosition = cameraEl.object3D.position;

        let pointerPos = rotatePoint(
            0,
            camPosition.y / Math.tan(camRotation.x),
            camPosition.x,
            camPosition.z,
            2*3.141592 - camRotation.y
        );

        rugPointer.setAttribute("position", `${pointerPos.x} 0 ${pointerPos.y}`);

        rugPointer.setAttribute("rotation", `${rad2Deg(camRotation.x/2) -180} ${rad2Deg(camRotation.y)} 180`);
        
        // log.innerHTML = `${rugPointerPos.x} ${rugPointerPos.x} ${rugPointerPos.x}`;
    },
});

window.btnOnRotate = (btnAngle) => {
    theRug.setAttribute("rotation", `0 ${360 - btnAngle} 0`);
};

async function downloadCanvas(targetCanvas){
    let pngURL = await targetCanvas.toDataURL();
    let fakeATag = document.createElement("a");
    document.querySelector("body").appendChild(fakeATag);
    fakeATag.href = pngURL;
    fakeATag.download = "ekrangoruntusu.png";
    document.querySelector("body").appendChild(fakeATag);
    fakeATag.click();
    document.querySelector("body").removeChild(fakeATag);
    delete fakeATag;
};

function takeScreenShot(){
    let ssCanvas = document.createElement("canvas");
    ssCanvas.classList.add("screenShotCanvas");
    document.querySelector("body").appendChild(ssCanvas);
    ssCanvas.width = sceneEl.renderer.domElement.width;
    ssCanvas.height = sceneEl.renderer.domElement.height;
    let ssContext = ssCanvas.getContext("2d");

    ssContext.drawImage(
        videoEl, 
        (videoEl.videoWidth-retMin(videoEl.videoWidth, videoEl.videoHeight))/2, 
        (videoEl.videoHeight-retMin(videoEl.videoWidth, videoEl.videoHeight))/2, 
        retMin(videoEl.videoWidth, videoEl.videoHeight),
        retMin(videoEl.videoWidth, videoEl.videoHeight),
        0,
        0, 
        ssCanvas.width, 
        ssCanvas.height
    );

    function captureAFrame(){
        ssContext.drawImage(
            sceneEl.renderer.domElement,
            0,
            0,
            sceneEl.renderer.domElement.width,
            sceneEl.renderer.domElement.height,
            0,
            0,
            ssCanvas.width,
            ssCanvas.height
        );
    };

    function scheduleCapture() {
        requestAnimationFrame(async ()=>{
            await captureAFrame();
            await downloadCanvas(ssCanvas);
            console.log(ssCanvas);
            await document.querySelector("body").removeChild(ssCanvas);
            delete ssCanvas;
        });
    };

    scheduleCapture();
}

window.pauseResumeEvent = (order) => {
    toggleTracking(order);
};

function toggleTracking(order){
    if (order == "pauseOrder"){
        cameraEl.removeAttribute("look-controls");
        videoEl.pause();
        rugPointer.setAttribute("visible", "false");
        theRug.setAttribute("visible","true");
        let rugPointerPos = rugPointer.object3D.position;
        let camRotation = cameraEl.object3D.rotation;
        putRugPosition(rugPointerPos.x, rad2Deg(camRotation.y), rugPointerPos.z);
        return;
    }
    cameraEl.setAttribute("look-controls","");
    rugPointer.setAttribute("visible", "true");
    theRug.setAttribute("visible","false");
    videoEl.play();
};

function putRugPosition(posx, roty, posz){
    theRug.setAttribute("position", `${posx} ${0} ${posz}`);
    theRug.setAttribute("rotation", `${0} ${roty} ${0}`);
};

function retMin(...args){
    let retVal = Infinity;
    for (let i=0; i<args.length; i++){
        if (args[i]>retVal) continue;
        retVal = args[i];
    }
    return retVal;
}

function rad2Deg(rad){
    let deg = rad*(180/3.141592) + 360;
    for(;deg>360;deg-=360);
    return deg;
}

//another chatGPT dark magic
//NO TOUCHIES
function rotatePoint(x, y, centerX, centerY, angleRadians) {
    // Convert angle from degrees to radians
    // var angleRadians = angleDegrees * Math.PI / 180;
  
    // Translate the point to the origin
    var translatedX = x - centerX;
    var translatedY = y - centerY;
  
    // Perform the rotation
    var rotatedX = translatedX * Math.cos(angleRadians) - translatedY * Math.sin(angleRadians);
    var rotatedY = translatedX * Math.sin(angleRadians) + translatedY * Math.cos(angleRadians);
  
    // Translate the point back to its original position
    var finalX = rotatedX + centerX;
    var finalY = rotatedY + centerY;
  
    // Return the new x and y values
    return { x: finalX, y: finalY };
  }

touchOverlay.addEventListener("touchstart", (event) => {
    event.stopPropagation();
    let touch = event.touches[0];
    touchStartXY[0] = touch.clientX;
    touchStartXY[1] = touch.clientY;
});

touchOverlay.addEventListener("touchmove", (event) => {
    event.stopPropagation();
    let touch = event.touches[0];
    let rugPosition = theRug.getAttribute("position");
    // log.innerHTML += `${moveCoeff*(touch.clientX - touchStartXY[0])} 0 ${moveCoeff*(touch.clientY - touchStartXY[1])}`;
    // theRug.setAttribute("position", `${moveCoeff*touch.clientX - touchStartXY[0]} 0 ${moveCoeff*touch.clientY - touchStartXY[1]}`);
    theRug.setAttribute("position", `${rugPosition.x + moveCoeff*(touch.clientX - touchStartXY[0])} 0 ${rugPosition.z + moveCoeff*(touch.clientY - touchStartXY[1])}`);
    log.innerHTML = `${rugPosition.x + moveCoeff*(touch.clientX - touchStartXY[0])} 0 ${rugPosition.z + moveCoeff.y*(touch.clientY - touchStartXY[1])}`;
    touchStartXY[0] = touch.clientX;
    touchStartXY[1] = touch.clientY;
});