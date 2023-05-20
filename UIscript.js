const videoEl = document.querySelector("#videoBackground");
const sceneEl = document.querySelector("a-scene");
const cameraEl = document.querySelector("a-camera");
const theRug = document.querySelector("#therug");
const touchOverlay = document.querySelector("#touchoverlay");
const rugPointer = document.querySelector("#placementPointer");

const log = document.querySelector("#log");

let touchStartXY = [0,0];
let moveCoeff = 0.01;
let camYaw;

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
        
        // log.innerHTML = `${rad2Deg(camRotation.y)}`;
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
};

function retMax(...args){
    let retVal = -Infinity;
    for (let i=0; i<args.length; i++){
        if (args[i]<retVal) continue;
        retVal = args[i];
    }
    return retVal;
};

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
};

function setRugSize(width, depth){
    theRug.setAttribute("depth", `${depth}`);
    theRug.setAttribute("width", `${width}`);
    let overlocks = document.querySelectorAll("#therug a-cylinder");

    overlocks[0].setAttribute("height", `${depth + 0.007}`);
    overlocks[0].setAttribute("position", `${width/2} 0 0`);

    overlocks[1].setAttribute("height", `${depth + 0.007}`);
    overlocks[1].setAttribute("position", `${-width/2} 0 0`);

    overlocks[2].setAttribute("height", `${width + 0.007}`);
    overlocks[2].setAttribute("position", `0 0 ${depth/2}`);

    overlocks[3].setAttribute("height", `${width + 0.007}`);
    overlocks[3].setAttribute("position", `0 0 ${-depth/2}`);
};

window.notifySize = (sizeText)=>{
    let sizes = sizeText.split("x");
    for (i=0;i<2;i++) sizes[i] = +sizes[i];

    setRugSize(retMin(sizes[0], sizes[1])/100, retMax(sizes[0], sizes[1])/100);
};

window.notifyProduct = (productSrc)=>{
    theRug.setAttribute("src", "#loadingRug");

    fetch(productSrc)
    .then(response => {
        console.log(response);
      return response.blob();
    })
    .then(blob => {
      const reader = new FileReader();
  
      reader.onloadend = function() {
        const base64data = reader.result;
  
        // Create the Base64 object URL
        const objectURL = `${base64data}`;
  
        console.log(objectURL);
        theRug.setAttribute("src", objectURL);
        
        // Use the Base64 object URL as needed
        
      };
  
      reader.readAsDataURL(blob);
    })
    .catch(error => {
      console.log('Error:', error);
    });

    // theRug.setAttribute("src", productSrc);
};

touchOverlay.addEventListener("touchstart", (event) => {
    event.stopPropagation();
    let touch = event.touches[0];
    touchStartXY[0] = touch.clientX;
    touchStartXY[1] = touch.clientY;
    camYaw = 2*Math.PI - cameraEl.object3D.rotation.y;
});

touchOverlay.addEventListener("touchmove", (event) => {
    event.stopPropagation();
    let touch = event.touches[0];
    let rugPosition = theRug.getAttribute("position");
    let rotatedTouch = rotatePoint(
        touch.clientX - touchStartXY[0],
        touch.clientY - touchStartXY[1],
        0,
        0,
        camYaw
    );
    // log.innerHTML += `${moveCoeff*(touch.clientX - touchStartXY[0])} 0 ${moveCoeff*(touch.clientY - touchStartXY[1])}`;
    // theRug.setAttribute("position", `${moveCoeff*touch.clientX - touchStartXY[0]} 0 ${moveCoeff*touch.clientY - touchStartXY[1]}`);
    theRug.setAttribute("position", `${rugPosition.x + moveCoeff*(rotatedTouch.x)} 0 ${rugPosition.z + moveCoeff*(rotatedTouch.y)}`);
    log.innerHTML = `${rugPosition.x + moveCoeff*(rotatedTouch.x)} 0 ${rugPosition.z + moveCoeff*(rotatedTouch.y)}`;
    touchStartXY[0] = touch.clientX;
    touchStartXY[1] = touch.clientY;
});