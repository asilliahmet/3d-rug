let productList;
let firstHelpDisplayed = 0;
let productQueried = 0;

function getXlsxData (filePath, callBack){
    fetch(filePath)
        .then((response)=>{
            return response.arrayBuffer();
        })
        .then((data)=>{
            let workBook = XLSX.read(data, { type: 'array' });
            
            let sheetName = workBook.SheetNames[0];
            let workSheet = workBook.Sheets[sheetName];

            let rows = XLSX.utils.sheet_to_json(workSheet, {header: 1});

            for (let i=1; i<rows.length; i++){
                if(typeof rows[i][3] == "undefined" || !rows[i][8] || !rows[i][9]){
                    rows.splice(i,1);
                    i--;
                    continue;
                }
                rows[i][3] = rows[i][3].split(";")[0];
            };

            callBack(rows);
        });
};

function buildCollections (products){
    let selectorDiv = document.querySelector("#rugSelector");
    let collectionSelect = document.createElement("select");
    collectionSelect.setAttribute("id", "collectionSelect");
    let collections = [];
    
    for (let i=1; i<products.length; i++){
        let collectionName = products[i][2].split(` `)[0];
        if (collections.includes(collectionName)) continue;
        collections.push(collectionName);
    };

    for (let i=0; i<collections.length; i++){
        let option = document.createElement("option");
        option.innerHTML = collections[i];
        collectionSelect.appendChild(option);
    };

    selectorDiv.appendChild(collectionSelect);

    let sizeSelector = document.createElement("select");
    sizeSelector.setAttribute("id", "sizeSelector");
    selectorDiv.appendChild(sizeSelector);

    let productSelector = document.createElement("div");
    productSelector.setAttribute("id", "productSelector");
    selectorDiv.appendChild(productSelector);

    collectionSelect.addEventListener("change",()=>{
        buildSizes();
        getProducts();
    });
    buildSizes();
    getProducts();
};

function buildSizes(){
    let activeCollection = document.querySelector("#collectionSelect")
        .selectedOptions[0].innerText;
    let availibleSizes = [];
    for (let i=0; i<productList.length; i++){
        let collectionName = productList[i][2].split(` `)[0];
        if (activeCollection == collectionName){
            for (let j=i, productName=productList[i][2]; productList[j][2] == productName; j++){
                availibleSizes.push(productList[j][5]);
            }
            break;
        }
    };
    let sizeSelector = document.querySelector("#sizeSelector");
    if(typeof sizeNotification != "undefined") sizeSelector.removeEventListener("change",sizeNotification);
    sizeSelector.innerHTML = ``;
    for (let i=0; i<availibleSizes.length; i++){
        let option = document.createElement("option");
        option.innerHTML = availibleSizes[i];
        sizeSelector.appendChild(option);
    };
    sizeSelector.addEventListener("change",sizeNotification = ()=>{
        window.notifySize(sizeSelector.selectedOptions[0].innerText);
    });
    window.notifySize(sizeSelector.selectedOptions[0].innerText);
};

function getProducts(){
    let activeCollection = document.querySelector("#collectionSelect")
        .selectedOptions[0].innerText;
    let productSelector = document.querySelector("#productSelector");
    productSelector.innerHTML = ``;
    let availibleProducts = [];
    for (let i=0; i<productList.length; i++){
        let collectionName = productList[i][2].split(` `)[0];
        if (collectionName != activeCollection) continue;
        if (availibleProducts.includes(productList[i][2])) continue;
        availibleProducts.push(productList[i][2]);
        let productBox = document.createElement("div");
        productBox.classList.add("product");
        let productImg = document.createElement("img");
        productImg.setAttribute("decoding", "async");
        productImg.setAttribute("src", productList[i][3]);
        productBox.appendChild(productImg);
        let productTitle = document.createElement("p");
        productTitle.innerHTML = productList[i][2];
        productBox.appendChild(productTitle);
        productSelector.appendChild(productBox);
        productBox.addEventListener("click", ()=>{
            window.notifyProduct(productList[i][3]);
            console.log(productBox.textContent);
            let productSlug = productBox.textContent.toLowerCase();
            productSlug = productSlug.split(` `);
            if (productSlug[0] == "ikonplus") productSlug[0] == "ikon-plus";
            productSlug = productSlug.join("-");
            document.querySelector("#goToProduct")
                .setAttribute("href", `https://majolika.com.tr/${productSlug}`);
            let selectedProduct = document.querySelector(".selectedProduct");
            if (selectedProduct) selectedProduct.classList.remove("selectedProduct");
            productBox.classList.add("selectedProduct");
        });
    };
    document.querySelector(".product").click();
    console.log("productselection");
    if (!firstHelpDisplayed){
        displayFirstHelp();
        firstHelpDisplayed++;
    }
    if (!productQueried){
        productQueried++;
        setQueryProduct();
    }
};

function setQueryProduct(){
    let search = window.location.search;
    search = search.slice(1);
    console.log(search);
    if (!search) return;
    let productName = search.toUpperCase().split("-");
    if (productName.length == 3) productName = [productName[0]+productName[1],productName[2]];
    let collections = document.querySelectorAll("#collectionSelect option");
    console.log(collections);
    for (let i=0; i<collections.length; i++){
        if (collections[i].textContent == productName[0]){
            document.querySelector("#collectionSelect").selectedIndex = i;
            break;
        }
    };
    buildSizes();
    getProducts();
    let productNames = document.querySelectorAll(".product p");
    
    for (let i=0; i<productNames.length; i++){
        if (productNames[i].textContent == `${productName[0]} ${productName[1]}`){
            productNames[i].click();
            break;
        }
    }
}

getXlsxData("./ikas-urunler.xlsx",(file)=>{
    productList = file;
    buildCollections(file)
});

/*window.notifySize = (sizeText)=>{
    console.log(sizeText);
};*/

/*window.notifyProduct = (productSrc)=>{
    console.log(productSrc);
};*/