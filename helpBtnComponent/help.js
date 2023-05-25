function displayFirstHelp(){
    let productSelector = document.querySelector("#productSelector");
    let ssBtn = document.querySelector("#screenShotButton");
    let pauseResumeBtn = document.querySelector(".pause-resume-btn");
    let helpBtn = document.querySelector("#helpBtn");
    let buttonsWrapper = document.querySelector("#bottomui");
    let borgir = document.querySelector("#borgirWrapper");
    let appContainer = document.querySelector("#appcontainer");

    let deviceWidth = window.innerWidth;
    let deviceHeight = window.innerHeight;
    let svgNS = "http://www.w3.org/2000/svg";

    let helpSvg = document.createElementNS(svgNS, "svg");
    helpSvg.setAttributeNS(svgNS, "viewBox", `0 0 ${deviceWidth} ${deviceHeight}`);
    // helpSvg.setAttribute("id", "helpSvgFirst");
    helpSvg.classList.add("helpSvg");
    helpSvg.setAttribute("fill", `#ffffff`);
    helpSvg.setAttribute("stroke", `#ffffff`);
    helpSvg.setAttribute("stroke-linecap", `round`);
    helpSvg.setAttribute("stroke-width", `4`);
    document.querySelector("body").appendChild(helpSvg);

    let helpPath = document.createElementNS(svgNS, "path");
    let helpPathData = 
    // borgir
    `M ${borgir.offsetLeft + 10},${borgir.offsetTop + borgir.offsetHeight - 5} `
    +`V ${appContainer.offsetTop+15} `
    // product selector
    +`M ${deviceWidth/10},${productSelector.offsetTop + productSelector.offsetTop/2} `
    +`V ${appContainer.offsetTop+30} `
    // clict to pause
    +`M ${pauseResumeBtn.offsetLeft + pauseResumeBtn.offsetWidth},${buttonsWrapper.offsetTop} `
    +`V ${buttonsWrapper.offsetTop - 30} `
    // help button
    +`M ${helpBtn.offsetLeft + helpBtn.offsetWidth},${buttonsWrapper.offsetTop} `
    +`V ${buttonsWrapper.offsetTop - 45} `
    // screenshot button
    +`M ${ssBtn.offsetLeft},${buttonsWrapper.offsetTop} `
    +`V ${buttonsWrapper.offsetTop - 60} `;
    helpPath.setAttribute("d",helpPathData);
    document.querySelector(".helpSvg").appendChild(helpPath);

    for (let i=0; i<helpPathData.length; i++){
        if(helpPathData[i] == "M"){
            let startCoords = eatLineStart(helpPathData, i);
            let circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", startCoords[0]);
            circle.setAttribute("cy", startCoords[1]);
            circle.setAttribute("r", "5");
            document.querySelector(".helpSvg").appendChild(circle);
        };
    };

    let helpText = [
        ["Menü","end",-1],
        ["Halını ve ebatını seç","start",+1],
        ["Halını yerleştir","end",-1],
        ["Yardım","end", -1],
        ["Ekran görüntüsü","start",+1],
    ];

    let helpTextLayer = document.createElementNS(svgNS, "g");
    document.querySelector(".helpSvg").appendChild(helpTextLayer);
    helpTextLayer.setAttribute("fill", `#ffffff`);
    helpTextLayer.setAttribute("stroke", `none`);

    for(let i=0,j=0; i<helpPathData.length; i++){
        if (helpPathData[i] != "M") continue;
        let endCoords = eatLineEnd(helpPathData, i);
        let textEl = document.createElementNS(svgNS, "text");
        textEl.textContent = helpText[j][0];
        textEl.setAttribute("x", endCoords[0] + helpText[j][2]*5);
        textEl.setAttribute("y", endCoords[1]);
        textEl.setAttribute("text-anchor", helpText[j][1]);
        textEl.setAttribute("dominant-baseline", "central");
        helpTextLayer.appendChild(textEl);
        j++;
    };

    makeIUnderstandButton();
    document.querySelector(".helpSvg").classList.add("showHelp");
    document.querySelector("#helpIUnderstand").classList.add("showIUnderstand");
};

function displaySecondHelp(){
    let pauseResumeBtn = document.querySelector(".pause-resume-btn");
    let buttonsWrapper = document.querySelector("#bottomui");
    let appContainer = document.querySelector("#appcontainer");

    let deviceWidth = window.innerWidth;
    let deviceHeight = window.innerHeight;
    let svgNS = "http://www.w3.org/2000/svg";

    let helpSvg = document.createElementNS(svgNS, "svg");
    helpSvg.setAttributeNS(svgNS, "viewBox", `0 0 ${deviceWidth} ${deviceHeight}`);
    // helpSvg.setAttribute("id", "helpSvgFirst");
    helpSvg.classList.add("helpSvg");
    helpSvg.setAttribute("fill", `#ffffff`);
    helpSvg.setAttribute("stroke", `#ffffff`);
    helpSvg.setAttribute("stroke-linecap", `round`);
    helpSvg.setAttribute("stroke-width", `4`);
    document.querySelector("body").appendChild(helpSvg);

    let helpPath = document.createElementNS(svgNS, "path");
    let helpPathData = 
    // click to resume
    `M ${pauseResumeBtn.offsetLeft + pauseResumeBtn.offsetWidth},${buttonsWrapper.offsetTop} `
    +`V ${buttonsWrapper.offsetTop - 30} `
    // one finger
    +`M ${20},${appContainer.offsetTop + 20}`
    +`V ${appContainer.offsetTop + 80}`
    // two finger
    +`M ${deviceWidth - 20},${appContainer.offsetTop + appContainer.offsetHeight - 80}`
    +`V ${appContainer.offsetTop + 20}`;

    helpPath.setAttribute("d",helpPathData);
    document.querySelector(".helpSvg").appendChild(helpPath);

    for (let i=0; i<helpPathData.length; i++){
        if(helpPathData[i] == "M"){
            let startCoords = eatLineStart(helpPathData, i);
            let circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", startCoords[0]);
            circle.setAttribute("cy", startCoords[1]);
            circle.setAttribute("r", "5");
            document.querySelector(".helpSvg").appendChild(circle);
        };
    };

    let helpText = [
        ["Kameraya geç","end",-1],
        ["İki parmakla halınızı döndürün","start",+1],
        ["Tek parmakla halınızı yerleştirin","end",-1],
    ];

    let helpTextLayer = document.createElementNS(svgNS, "g");
    document.querySelector(".helpSvg").appendChild(helpTextLayer);
    helpTextLayer.setAttribute("fill", `#ffffff`);
    helpTextLayer.setAttribute("stroke", `none`);

    for(let i=0,j=0; i<helpPathData.length; i++){
        if (helpPathData[i] != "M") continue;
        let endCoords = eatLineEnd(helpPathData, i);
        let textEl = document.createElementNS(svgNS, "text");
        textEl.textContent = helpText[j][0];
        textEl.setAttribute("x", endCoords[0] + helpText[j][2]*5);
        textEl.setAttribute("y", endCoords[1]);
        textEl.setAttribute("text-anchor", helpText[j][1]);
        textEl.setAttribute("dominant-baseline", "central");
        helpTextLayer.appendChild(textEl);
        j++;
    };

    makeIUnderstandButton();
    document.querySelector(".helpSvg").classList.add("showHelp");
    document.querySelector("#helpIUnderstand").classList.add("showIUnderstand");
};

function makeIUnderstandButton(){
    let myBtn = document.createElement("button");
    myBtn.setAttribute("id", "helpIUnderstand");
    myBtn.textContent = "Anladım";
    myBtn.style.top = `${document.querySelector("#bottomui").offsetTop-100}px`;
    document.querySelector("body").appendChild(myBtn);
    myBtn.addEventListener("click", (event)=>{
        event.stopPropagation();
        document.querySelector(".helpSvg")
            .addEventListener("transitionend", ()=>{
                document.querySelector(".helpSvg")?.remove();
        });
        document.querySelector("#helpIUnderstand")
            .addEventListener("transitionend", ()=>{
                document.querySelector("#helpIUnderstand")?.remove();
        });
        document.querySelector(".helpSvg").classList.remove("showHelp");
        document.querySelector("#helpIUnderstand").classList.remove("showIUnderstand");
    });
    document.querySelector("body").appendChild(myBtn);
}

function eatLineStart(pathSt, index){
    let returnObjXY = ["",""];
    let coIndex = 0;
    for (let i=index+1; i<pathSt.length; i++){
        if (pathSt[i] == "V") break;
        if (pathSt[i] == ","){
            coIndex++;
            continue;
        }
        returnObjXY[coIndex] += pathSt[i];
    }
    returnObjXY = returnObjXY.map(x => +x);
    return returnObjXY;
};

function eatLineEnd(pathSt, index){
    let returnObjXY = ["","",""];
    let coIndex = 0;
    for (let i=index+1; i<pathSt.length; i++){
        if (pathSt[i] == "M") break;
        if (pathSt[i] == "," || pathSt[i] == "V"){
            coIndex++;
            continue;
        }
        returnObjXY[coIndex] += pathSt[i];
    }
    returnObjXY = returnObjXY.map(x => +x);
    return [returnObjXY[0], returnObjXY[2]];
};

function helpEvent(ifbtn){
    let pauseResumei = document.querySelector(".pause-resume-btn i");
    if (pauseResumei.classList.contains("click-to-resume")){
        displaySecondHelp();
    }else{
        displayFirstHelp();
    };
    document.querySelector('#toolBox').blur();
    if (ifbtn){
        document.querySelector("#helpBtn i").addEventListener("transitionend",()=>{
            document.querySelector("#helpBtn i").style.transform = "scale(1)";
        });
        document.querySelector("#helpBtn i").style.transform = "scale(0.8)";
    }
};

document.querySelector("#helpBtn i").addEventListener("click",()=>{helpEvent(1)});
document.querySelector("#helpToolBox").addEventListener("click",()=>{helpEvent(0)});