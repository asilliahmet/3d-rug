const videoEl = document.querySelector("#videoBackground");
const sceneEl = document.querySelector("a-scene");
const cameraEl = document.querySelector("a-camera");
const theRug = document.querySelector("#therug");
const touchOverlay = document.querySelector("#touchoverlay");
const rugPointer = document.querySelector("#placementPointer");

const log = document.querySelector("#log");

let pastTouches;
let moveCoeff = 0.01;
let camYaw;
let secondHelpDisplayed = 0;

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
    if(!secondHelpDisplayed){
        displaySecondHelp();
        secondHelpDisplayed++;
    }
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
        camYaw = cameraEl.object3D.rotation.y;
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

function retunRayDegrees(point1, point2){
    let deltax = point2.x-point1.x;
    let deltay = point2.y-point1.y;
    // let posNegCoef = (deltax/Math.abs(deltax)) * (deltay/Math.abs(deltay));
    // return Math.atan(deltay,deltax);
    return ((Math.atan(deltay/deltax) * -180) / Math.PI);
};

touchOverlay.addEventListener("touchstart", (event) => {
     event.stopPropagation();
     pastTouches = event.touches;
 });

touchOverlay.addEventListener("touchmove", (event) => {
    event.stopPropagation();

    let totalX = 0;
    let totalY = 0;

    for (i=0; i<event.touches.length; i++){
        totalX += event.touches[i].clientX;
        totalY += event.touches[i].clientY;
    };

    let currentAvgTouch = {
        x: totalX / event.touches.length,
        y: totalY / event.touches.length,
    };

    totalX = 0;
    totalY = 0;

    for (i=0; i<pastTouches.length; i++){
        totalX += pastTouches[i].clientX;
        totalY += pastTouches[i].clientY;
    };

    let pastAvgTouch = {
        x: totalX / pastTouches.length,
        y: totalY / pastTouches.length,
    };

    let delta = rotatePoint(
        (currentAvgTouch.x - pastAvgTouch.x),
        (currentAvgTouch.y - pastAvgTouch.y),
        0,
        0,
        -camYaw,
    );

    theRug.object3D.position.x += moveCoeff*delta.x;
    theRug.object3D.position.z += moveCoeff*delta.y;

    if (event.touches.length<2 || pastTouches.length<2){
        pastTouches = event.touches;
        return;
    }

    let currentAlpha = retunRayDegrees({x: event.touches[1].clientX, y: event.touches[1].clientY}, {x: event.touches[0].clientX, y: event.touches[0].clientY});

    theRug.setAttribute("rotation", `0 ${currentAlpha + rad2Deg(camYaw)} 0`);

    pastTouches = event.touches;
}); 