const rotateBtn = document.querySelector(".rotateBtn i");
let midpoint = {x:0,y:0};
let mouseDown = {x:0,y:0};
let angle = 0;

/*
window.btnOnRotate = (btnAngle) => {
    document.querySelector("#log").innerHTML = `${btnAngle}`;
};*/
//comment out this thing and set window.btnOnRotate on main function

rotateBtn.addEventListener("touchstart", (event)=>{
    midpoint.x = rotateBtn.offsetLeft + rotateBtn.offsetParent.offsetLeft+ (rotateBtn.offsetWidth/2);
    midpoint.y = rotateBtn.offsetTop + rotateBtn.offsetParent.offsetTop + (rotateBtn.offsetHeight/2);
    mouseDown.x = event.touches[0].clientX;
    mouseDown.y = event.touches[0].clientY;

    window.addEventListener("touchmove",rotateEvent = (event)=>{
        angle = calculateAngle(
            mouseDown,
            midpoint,
            {x:event.touches[0].clientX, y:event.touches[0].clientY},
        );
        let startRotation = +rotateBtn.getAttribute("data-firstRotate");
        rotateBtn.style.transform=`rotateZ(${startRotation+angle}deg)`;
        rotateBtn.setAttribute("data-lastRotate", `${startRotation+angle}`);
        window.btnOnRotate(startRotation+angle);
    });

    window.addEventListener("touchend", ()=>{
        window.removeEventListener("touchmove", rotateEvent);
        rotateBtn.setAttribute("data-firstRotate", `${
            mod360(+rotateBtn.getAttribute("data-lastRotate"))
        }`);
    });
});

mod360 = (x) => {
    for(;x>360;x-=360);
    return x;
};


// ChatGPT geometry black magic
// i have no idea what this does
// DO NOT TOUCH IT!!
function calculateAngle(A, B, C) {
    // Points(A,B,C) -> object{x:float,y:float}
    // B is vertex
    const AB = { x: B.x - A.x, y: B.y - A.y };
    const BC = { x: C.x - B.x, y: C.y - B.y };
  
    const dotProduct = AB.x * BC.x + AB.y * BC.y;
    const magnitudeAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y);
    const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);
  
    const cosineAngle = dotProduct / (magnitudeAB * magnitudeBC);
    const angleRadians = Math.acos(cosineAngle);
    const angleDegrees = angleRadians * (180 / Math.PI);
  
    // Determine the sign of the angle based on the order of points A and C
    const crossProduct = AB.x * BC.y - AB.y * BC.x;
    const signedAngleDegrees = Math.sign(crossProduct) * angleDegrees;
  
    return signedAngleDegrees + 180;
  }