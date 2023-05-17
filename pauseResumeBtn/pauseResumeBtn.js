const pauseResumeBtn = document.querySelector("div.pause-resume-btn i");

// window.pauseResumeEvent = (order) => {console.log(order)};
//for use in the main script

pauseResumeBtn.addEventListener("click", ()=>{
    let order = "";
    if (pauseResumeBtn.classList.contains("click-to-pause")){
        order = "pauseOrder";
    }
    else if (pauseResumeBtn.classList.contains("click-to-resume")){
        order = "resumeOrder";
    };
    window.pauseResumeEvent(order);

    pauseResumeBtn.addEventListener("transitionend", pauseResumeTransition = ()=>{
        if (order == "resumeOrder"){
            pauseResumeBtn.classList.remove("click-to-resume");
            pauseResumeBtn.classList.add("click-to-pause");
        };
        if (order == "pauseOrder"){
            pauseResumeBtn.classList.remove("click-to-pause");
            pauseResumeBtn.classList.add("click-to-resume");
        };
        pauseResumeBtn.removeEventListener("transitionend", pauseResumeTransition);
        pauseResumeBtn.style.transform = "scale(1)";
    });
    pauseResumeBtn.style.transform = "scale(0.8)";
});