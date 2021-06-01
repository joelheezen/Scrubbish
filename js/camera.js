const video = document.querySelector('video')
const canvas = document.querySelector('#mosaic')
const context = canvas.getContext('2d')

const snapCanvas = document.querySelector('#snapCanvas')
const snapContext = snapCanvas.getContext('2d')

//neural network for detecting trash
let model;

// how many pixels in rows and columns - 10 means 100 values.
const numpixels = 100

// dimensions of the video element
let width;
let height;

// remember the pixel values. use this as training data
let dataArray;
let facingMode = "environment";

//body dimensions
let vh;
let vw;

let videoStatus = "unpaused";

function setup() {

    model = ml5.KNNClassifier();

    model.load("model/myKNN.json", modelLoaded)
}

function modelLoaded(){
    // continue on your neural network journey
}

//prepare the canvas
function initSettings() {
    width = video.offsetWidth
    height = video.offsetHeight

    canvas.width = width
    canvas.height = height

    snapCanvas.width = width
    snapCanvas.height = height

    // we need pixelization
    context.mozImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.imageSmoothingEnabled = false

}

//take a snapshot of the webcam and draw it to the canvas
function webcamSnapshot() {
    context.drawImage(video, 0, 0, numpixels, numpixels)
    context.drawImage(canvas, 0, 0, numpixels, numpixels, 0, 0, width, height)

    snapContext.drawImage(video, 0, 0, numpixels, numpixels)
    snapContext.drawImage(snapCanvas, 0, 0, numpixels, numpixels, 0, 0, width, height)
}


document.querySelector("#ring").addEventListener("click",generatePixelValues)

// generate an array with a color value for each pixel in the webcam feed
function generatePixelValues() {

    webcamSnapshot()

    dataArray = [];
    for (let pos = 0; pos < numpixels * numpixels; pos++) {
        let col = pos % numpixels
        let row = Math.floor(pos / numpixels)

        let x = col * (width / numpixels)
        let y = row * (height / numpixels)

        // sample locatie niet linksboven rect maar in het midden
        let p = context.getImageData(x + width / 20, y + height / 20, 1, 1).data

        let r = Math.round(((p[0] / 255) + Number.EPSILON) * 100) / 100
        let g = Math.round(((p[1] / 255) + Number.EPSILON) * 100) / 100
        let b = Math.round(((p[2] / 255) + Number.EPSILON) * 100) / 100

        dataArray.push(r)
        dataArray.push(g)
        dataArray.push(b)

    }
    //prevent further interaction
    video.pause()
    videoStatus = "paused"

    document.querySelector("video").classList.add("flash")
    document.getElementById("ring").style.display = "none"
    document.getElementById("switchCamera").style.display = "none"
    document.getElementById("fullscreen").style.display = "none"
    document.querySelector("video").style.filter = "brightness(30%)"

    setTimeout(() => {
        document.getElementById("loading").style.display = "inline"
    }, 500);

    //classify
    setTimeout(() => {
        model.classify(dataArray,setupRetry)
    }, 1000);

}

//show scan result and setup to scan again, removing scan button and switchcamera
function setupRetry(error,results){
   
    document.getElementById("loading").style.display = "none";
    
    document.querySelector("video").style.filter = "brightness(100%)";

    let prediction = document.createElement("div");
    prediction.id = "prediction";

    console.log(results)

    label = results['label']
    type = Object.keys(results["confidencesByLabel"])

    if(results["confidences"][results['label']] > 0.3){
        prediction.innerHTML = type[label];
        saveTrash(type[label])
    }else{
        prediction.innerHTML = "No trash detected";
    }

    document.querySelector("body").appendChild(prediction);

    let retry = document.createElement("div");
    retry.id = "retry";
    retry.innerHTML = "Scan something else";
    retry.addEventListener("click",retryScan);

    document.querySelector("body").appendChild(retry);
    
}

function saveTrash(trash){

    let img = snapCanvas.toDataURL();   


    var http = new XMLHttpRequest();
    var url = 'php/save.php';
    var params = `img=${img}&trash=${trash}`;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
        }
    }
    http.send(params);
    
}

//remove prediction and re-add UI
function retryScan(){

    initializeWebcam(facingMode);

    video.play();
    videoStatus = "unpaused";

    document.getElementById("retry").remove();
    document.getElementById("prediction").remove();
    document.getElementById("ring").style.display = "inline";
    document.getElementById("switchCamera").style.display = "inline";
    document.getElementById("fullscreen").style.display = "inline";
}

document.getElementById("switchCamera").addEventListener("click",switchCamera);
//switch between camera's on mobile
function switchCamera(){

    webcam.getTracks().forEach(function(track) {
        track.stop();
    });

    if(facingMode == "environment"){
        facingMode = "user";
    }else{
        facingMode = "environment";
    }

    initializeWebcam(facingMode);
    
}

//startup the camera
function initializeWebcam(facingMode) {

    if (navigator.mediaDevices) {

        let options = {
            video: {
                "facingMode": facingMode
            }
        }

        webcam = navigator.mediaDevices.getUserMedia(options)
            // permission granted:
            .then(function (stream) { 
                video.srcObject = stream;
                video.addEventListener("playing",initSettings)
                webcam = stream
            })
            // permission denied:
            .catch(function (error) {

                if(!document.querySelector("#notification")){

                    let notification = document.createElement("div")
                    notification.id = "notification"

                    let text = document.createElement("p")
                    text.innerHTML = "Please allow us to use your camera"
                    notification.appendChild(text)

                    document.querySelector("body").appendChild(notification) 
            }
        })
    }

}

document.addEventListener('visibilitychange', function(){

    if(!document.hidden && videoStatus === "unpaused"){
        initializeWebcam(facingMode)
    }else if(document.hidden) {
        try{webcam.getTracks().forEach(function(track) {
            track.stop();
        })}catch(error){
            
        }
    }

});

initializeWebcam(facingMode);
