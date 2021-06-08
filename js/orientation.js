let fsActive = false

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

if(document.getElementById("fullscreen")){
    document.getElementById("fullscreen").addEventListener("click", openFullscreen)
    check_fullscreen();
}

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
        document.getElementById("fullscreen").src = "assets/fullscreen1.png"
    }else{
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        document.getElementById("fullscreen").src = "assets/fullscreen2.png"
    } 

    setTimeout(() => {
        setSize();
    }, 200);
}

function check_fullscreen(){

    if(document.fullscreenElement || document.webkitFullscreenElement ||
        document.mozFullScreenElement){
        fsActive = true
        document.getElementById("fullscreen").src = "assets/fullscreen2.png"
    }else{
        document.getElementById("fullscreen").src = "assets/fullscreen1.png"
    } 
}

document.addEventListener('visibilitychange', function(){

    if(!document.hidden && fsActive){
        openFullscreen();
    }

});

setSize();