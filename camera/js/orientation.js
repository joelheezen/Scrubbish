//wait for the orientation to change
window.addEventListener("resize", function(event) {
    orientationChanged().then(function(){
        setSize();
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

document.getElementById("fullscreen").addEventListener("click", openFullscreen)

function openFullscreen() {

    let elem = document.querySelector('html')

    if(document.fullscreenElement != null){

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        document.getElementById("fullscreen").src = "camera/assets/fullscreen1.png"
    }else{
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        document.getElementById("fullscreen").src = "camera/assets/fullscreen2.png"
    } 

    setSize();

}

function check_fullscreen(){
    console.log(document.fullscreenElement)

    if(document.fullscreenElement || document.webkitFullscreenElement ||
        document.mozFullScreenElement){
        document.getElementById("fullscreen").src = "camera/assets/fullscreen2.png"
    }else{
        document.getElementById("fullscreen").src = "camera/assets/fullscreen1.png"
    } 
}

check_fullscreen();
setSize();