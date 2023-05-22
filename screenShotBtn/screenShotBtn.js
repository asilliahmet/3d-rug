document.querySelector("#screenShotButton").addEventListener("click", (event)=>{
    let ssButton = document.querySelector("#screenShotButton")
    takeScreenShot();
    ssButton.addEventListener("transitionend", scaleSsButton = ()=>{
        ssButton.removeEventListener("transitionend", scaleSsButton);
        ssButton.style.transform = "scale(1)";
    })
    ssButton.style.transform = "scale(0.8)";
})