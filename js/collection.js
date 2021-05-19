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
			"info": "lorem ipsum",
			"years": "years to degrade",
			"picture": result
		},
		{
			"info": "lorem ipsum 2",
			"years": "years to degrade 2",
			"picture": result
		}
	]
	}))
	
	collectionArray = JSON.parse(localStorage.getItem("collection"))

	displayCollection()
	navigator.webkitPersistentStorage.queryUsageAndQuota (
		function(usedBytes, grantedBytes) {
			console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes');
		},
		function(e) { console.log('Error', e);  }
	);
}


//loops through JSON from localstorage and displays every entry right now. Can be tailored to needs.
function displayCollection(){
    let wrapper = document.getElementById("collection-wrapper")

    for (i = 0; i < collectionArray.items.length; i++){
        let card = document.createElement("card")
        wrapper.appendChild(card)
        card.innerHTML = "<p>" + collectionArray.items[i].info + " " + collectionArray.items[i].years + "</p>";
		// uses the base64 stored in the json to make an image
		let image = document.createElement("img")
		image.src = collectionArray.items[i].picture
		card.appendChild(image)
    }

}
