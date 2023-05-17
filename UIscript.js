const videoEl = document.querySelector("#videoBackground");
const sceneEl = document.querySelector("a-scene");
const cameraEl = document.querySelector("a-camera");
const theRug = document.querySelector("#therug");
const touchOverlay = document.querySelector("#touchoverlay");

const log = document.querySelector("#log");

let touchStartXY = [0,0];
let moveCoeff = 0.01;

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
        return;
    }
    cameraEl.setAttribute("look-controls","");
    videoEl.play();
};

function retMin(...args){
    let retVal = Infinity;
    for (let i=0; i<args.length; i++){
        if (args[i]>retVal) continue;
        retVal = args[i];
    }
    return retVal;
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
    touchStartXY[0] = touch.clientX;
    touchStartXY[1] = touch.clientY;
    log.innerHTML = `${rugPosition.x} ${rugPosition.y} ${rugPosition.z}`;
});