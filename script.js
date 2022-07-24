const fileInput = document.querySelector(".file-input"),
previewImg = document.querySelector(".preview-img img"),
filterOptions = document.querySelectorAll(".filter button"),
filterValue = document.querySelector(".filter-info .value")
filterName = document.querySelector(".filter-info .name"),
filterSlider = document.querySelector(".slider input"),
chooseImgBtn = document.querySelector(".choose-img"),
rotateOptions = document.querySelectorAll(".rotate button"),
resetFilterBtn = document.querySelector(".reset-filters"),
saveImgBtn = document.querySelector(".save-img");

let brightness = "100", saturation = "100", inversion ="0", grayscale = "0";
let rotate = 0, flipHorizontal =1, flipVertical = 1;


const loadImage = () => {
    let file = fileInput.files[0]; //Getting user selected file
    if(!file) return; //return if user hasn't selected file
    previewImg.src = URL.createObjectURL(file); //Passing file url as preview img src
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click(); //Clicling reset button so the filter value reset if the user select new image
        document.querySelector(".container").classList.remove("disable");
    });
}


const applyFilter  = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}



filterOptions.forEach(option =>{
    option.addEventListener("click", ()=> { //adding click event listener to all filter buttons
        document.querySelector(".active").classList.remove("active");
        option.classList.add("active");
        //Chnaging Filter names
        filterName.innerText = option.innerText;

        if(option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;

        }
        else if(option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        }
        else if(option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        }
        else{
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }

    });

});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    }
    else if(selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    }
    else if(selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    }
    else {
        grayscale = filterSlider.value;
    }
    applyFilter();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90; //If clicked button is left rotate, decrement rotate value by 90
        }
        else if(option.id === "right") {
            rotate += 90;
        }
        //If flip horizontal value is 1 set this value to -1 else 1
        else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        else {
            flipVertical = flipVertical === 1? -1 : 1;
        }
        applyFilter();
    });
});

const resetFilter = () => {
    //resetting all variable to its default value
    brightness = "100"; saturation = "100"; inversion = "0"; grayscale = "0";
    rotate = 0; flipHorizontal = 1; flipVertical=1;
    filterOptions[0].click(); //Clicking brightness btn, so the brightness selected by default
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    //canvas.getContext return a drawing context on the canvas
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    //applying user selected filters to canvas filter
    ctx.filter = `brightness(${brightness}%)  saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    //Translating canvas from center
    ctx.translate(canvas.width / 2, canvas.height /2);
    //If rotate value isn't zero rotate the canvas
    if(rotate!==0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    //flip canvas vertically/ horizontally
    ctx.scale(flipHorizontal, flipVertical);
    //drawImage(image to draw, dx, dy, dWidth, dHeight)
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height/ 2, canvas.width, canvas.height);

    const link = document.createElement("a"); //creating <a> element
    link.download = 'image.jpg'; //Passing <a> tag download value to "image.jpg"
    link.href = canvas.toDataURL(); //passing <a> tag href value to canvas data url
    link.click(); //Clicking <a> tag to download the image
}



filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click" , () => fileInput.click());
