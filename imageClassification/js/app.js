const video = document.querySelector('video')
const canvas = document.querySelector('#mosaic')
const context = canvas.getContext('2d')

//neural network for detecting trash
let model;

// how many pixels in rows and columns - 10 means 100 values.
const numpixels = 100

// dimensions of the video element
let width
let height

// remember the pixel values. use this as training data
let dataArray
let facingMode = "environment"

//body dimensions
let vh
let vw

function setup() {
    
    let options = {
      inputs: Math.pow(numpixels,2) * 3,
      outputs: ['label'],
      task: 'classification',
      debug: 'true'
    };

    //load in some dummy model
    const modelDetails = {
        model: './model/model.json',
        metadata: './model/model_meta.json',
        weights: './model/model.weights.bin'
      }
    

    model = ml5.neuralNetwork(options);

    model.load(modelDetails, modelLoaded)
}

function modelLoaded(){
    // continue on your neural network journey
}

//wait for the orientation to change
window.addEventListener("orientationchange", function(event) {
    orientationChanged().then(function() {
        // Profit
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

//prepare the canvas
function initSettings() {
    width = video.offsetWidth
    height = video.offsetHeight

    canvas.width = width
    canvas.height = height

    // we need pixelization
    context.mozImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.imageSmoothingEnabled = false

}

//take a snapshot of the webcam and draw it to the canvas
function webcamSnapshot() {
    context.drawImage(video, 0, 0, numpixels, numpixels)
    context.drawImage(canvas, 0, 0, numpixels, numpixels, 0, 0, width, height)
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
    console.log(dataArray)
    //prevent further interaction
    video.pause()

    document.querySelector("video").classList.add("flash")
    document.getElementById("ring").style.display = "none"
    document.getElementById("switchCamera").style.display = "none"
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

    document.getElementById("loading").style.display = "none"
    document.querySelector("video").style.filter = "brightness(100%)"
    console.log(results)

    let prediction = document.createElement("div")
    prediction.id = "prediction"
    prediction.innerHTML = results[0]['label']

    document.querySelector("body").appendChild(prediction)

    let retry = document.createElement("div")
    retry.id = "retry"
    retry.innerHTML = "Scan something else"
    retry.addEventListener("click",retryScan )
    document.querySelector("body").appendChild(retry)

}

//remove prediction and readd UI
function retryScan(){
    video.play()
    document.getElementById("retry").remove()
    document.getElementById("prediction").remove()
    document.getElementById("ring").style.display = "inline"
    document.getElementById("switchCamera").style.display = "inline"
}



document.getElementById("switchCamera").addEventListener("click",switchCamera)
//switch between camera's on mobile
function switchCamera(){

    webcam.getTracks().forEach(function(track) {
        track.stop();
    });

    if(facingMode == "environment"){
        facingMode = "user"
    }else{
        facingMode = "environment"
    }

    initializeWebcam(facingMode)
    
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
                video.addEventListener("playing", () => initSettings())
                webcam = stream
            })
            // permission denied:
            .catch(function (error) {
                let notification = document.createElement("div")
                notification.id = "notification"

                let text = document.createElement("p")
                text.innerHTML = "Please allow us to use your camera"
                notification.appendChild(text)

                document.querySelector("body").appendChild(notification) 
            })
        }
        
    
}

initializeWebcam(facingMode)
setSize();
