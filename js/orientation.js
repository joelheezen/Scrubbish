let fsActive = false

//wait for the orientation to change
window.addEventListener("resize", function(event) {
    orientationChanged().then(function(){
        setSize();
        checkForKeyboard();
    });
});

// Wait until innerheight changes, for max 120 frames
function orientationChanged() {
    const timeout = 120;
    return new window.Promise(function(resolve) {
        const go = (i, height0) => {
            window.innerHeight != height0 || i >= timeout ?
                resolve() :
                window.requestAnimationFrame(() => go(i + 1, height0));
        };
        go(0, window.innerHeight);
    });
}

//set the size of the body accoaring to innerheight and innerwidth
function setSize(){

    if(window.innerHeight > window.innerWidth){
        vh = window.innerHeight * 0.01;
        vw = window.innerWidth * 0.01;
    }else{
        vh = window.innerWidth * 0.01;
        vw = window.innerHeight * 0.01;
    }

    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);

}

function removeMenu(){
    document.querySelector(".menu").style.visibility = "hidden"
}

function addMenu(){
    document.querySelector(".menu").style.visibility = "visible"
}

function checkForKeyboard(){

    let toTop = getPosition(document.querySelector(".menu")).y

    let menuHeight = document.querySelector(".menu").offsetHeight

    if((toTop / menuHeight) < 5){
        removeMenu()
    }else{
        addMenu()
    }
 
}

function getPosition(element) {

    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return {x: xPosition, y: yPosition};
}

setSize();