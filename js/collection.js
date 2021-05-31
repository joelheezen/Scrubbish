let button = document.getElementById("upload")
let result
let collectionArray

//puts the file through filereader and calls back the response
function getBase64(file, onLoadCallback) {
	var reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = onLoadCallback
	reader.onerror = function (error) {
	  console.log('Error: ', error);
	};	
}

/* 
	Used some sizes to see what the perfect foto size is to save in localstorage.
	localstorage is 5MB max
	2048*1536	1.5MB per picture		5/1.5		=3.33		3 	pics max
	1920*1440	1.4MB per picture		5/1.4		=3.57		3 	pics max
	1600*1200	1.0MB per picture		5/1			=5			5 	pics max
	1440*1080	908KB per picture		5/0.908 	=5.51		5 	pics max
	960*720		447KB per picture		5/0.447		=11.19		11 	pics max
	640*480		214Kb per picture		5/0.214		=23.36		23	pics max

	depending on amount of categories we have we can choose the resolution to save here.
*/

// button fires the function so it doesnt fire without file
button.addEventListener("click", async function(){
	let file = document.getElementById("input").files[0]
	getBase64(file, function(e) {
		//awaits result to be in the variable before moving on
		result = e.target.result
		setUpPage()
	})
	
})
// makes dummy json for testing purposes
function setUpPage(){

	localStorage.setItem("collection", JSON.stringify({
		"items": [
			{
			"info": "Blikje",
			"years": "2",
			"picture": result
		}
	]
	}))
	
	collectionArray = JSON.parse(localStorage.getItem("collection"))

	displayCollection()

	if (localStorage && !localStorage.getItem('size')) {
		var i = 0;
		try {
			// Test up to 10 MB
			for (i = 250; i <= 10000; i += 250) {
				localStorage.setItem('test', new Array((i * 1024) + 1).join('a'));
			}
		} catch (e) {
			localStorage.removeItem('test');
			localStorage.setItem('size', i - 250);            
		}
	}
}
//loops through JSON from localstorage and displays every entry right now. Can be tailored to needs.
function displayCollection(){
    let wrapper = document.getElementById("collection-wrapper")

    for (i = 0; i < collectionArray.items.length; i++){
        let card = document.createElement("card")
        wrapper.appendChild(card)

        let image = document.createElement("img")
        image.src = collectionArray.items[i].picture
        card.appendChild(image)

        card.innerHTML += "<p>" + collectionArray.items[i].info + " " + collectionArray.items[i].years + "</p>"
		// uses the base64 stored in the json to make an image

    }

}
