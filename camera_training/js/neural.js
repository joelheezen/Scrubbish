const video = document.querySelector('video')
const canvas = document.querySelector('#mosaic')
const context = canvas.getContext('2d')

let model;

let img = document.createElement("img")

// how many pixels in rows and columns - 10 means 100 values.
const numpixels = 100

let width
let height
let intervalid
let dataArray // remember the pixel values. use this as training data

function setup() {
    
    let options = {
      inputs: Math.pow(numpixels,2) * 3,
      outputs: ['label'],
      task: 'classification',
      debug: 'true'
    };

    model = ml5.neuralNetwork(options);

}
  
function initSettings() {
    width = video.offsetWidth
    height = video.offsetHeight

    canvas.width = width
    canvas.height = height

    // we need pixelization
    context.mozImageSmoothingEnabled = false
    context.webkitImageSmoothingEnabled = false
    context.imageSmoothingEnabled = false

    // draw the webcam 60 times per second
}

//
// drawing the video very small causes pixelation. we need this to keep the array small.
// draw 60 times / second
//
function webcamSnapshot() {
    context.drawImage(video, 0, 0, numpixels, numpixels)
    context.drawImage(canvas, 0, 0, numpixels, numpixels, 0, 0, width, height)
}

function imageSnapshot() {
    context.drawImage(img, 0, 0, numpixels, numpixels)
    context.drawImage(canvas, 0, 0, numpixels, numpixels, 0, 0, width, height)
}

//
// generate an array with a color value for each pixel in the webcam feed
//

document.getElementById("add").addEventListener("click",addExamples)

function addExamples(){

    let index = 2;
    let garbage = ['cardboard','metal','glass','paper','plastic','trash'];
    let examples = document.getElementById("amount").value
    let type = 0;

    img.src=`examples/${garbage[0]}/${garbage[0]}1.jpg`

    setTimeout(() => {

        let interval = setInterval(() => {

            let data = generatePixelValues("img",`${type+1}/${garbage.length}`,index);
        
            let target = {
                label: garbage[type]
            };

            model.addData(data, target);

            img.src=`examples/${garbage[type]}/${garbage[type] + index}.jpg`;
        
            index++;
        
            if(index > examples && type !== garbage.length){

                index = 1;
                type++;

            }
        
            if(type == garbage.length){
                clearInterval(interval);
            }

        
        }, 500);

    }, 500);

}
  
  //Indicate that the training has finished
function finishedTraining(){
    console.log("traning finished")
}

document.getElementById("train").addEventListener("click",train)

function train(){
    let options = {
        epochs: document.getElementById("epoch").value
    };
    //model.normalizeData();
    model.train(options,finishedTraining);
}

document.getElementById("classify").addEventListener("click",classify)

function classify(){
    let points = generatePixelValues("video")

    model.classify(points, gotResults)

}

//log the results of the classification
function gotResults(error,results){
    if(error){
      alert(error)
      return
    }
    alert(results[0]["label"] + " " + results[0]["confidence"])
    
}

document.getElementById("save").addEventListener("click",saveModel)

function saveModel(){
    model.save();
}

function generatePixelValues(from,type,index) {

    if(from == "img"){
        imageSnapshot()
    }else if(from == "video"){
        webcamSnapshot()
    }
    
    

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



    document.getElementById("data").innerHTML = `<p>type = ${type} </p><p>index = ${index}</p><p>${dataArray}</p>`

    return dataArray

}


function initializeWebcam() {

    if (navigator.mediaDevices) {

        let options = {
            video: true
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

initializeWebcam()
