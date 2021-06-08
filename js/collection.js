let button = document.getElementById("upload")
let result
let collectionArray


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


setUpPage()

	
function setUpPage(){
	
	collectionArray = JSON.parse(localStorage.getItem("collection"))

	displayCollection()
}

//loops through JSON from localstorage and displays every entry right now. Can be tailored to needs.
function displayCollection(){


	let wrapper = document.getElementById("collection-wrapper")
	let garbage = ['cardboard','metal','glass','paper','plastic','trash'];

	for (let index = 0; index < garbage.length; index++) {

		let card = document.createElement("card")
		card.innerHTML += "<p>" + "you have collected: " + "<b>" + collectionArray[garbage[index]][0].collected + "</b>" +" carboard pieces" + "</p>"
		
		let image = document.createElement("img")
		if(collectionArray[garbage[index]][0].picture == "dummy"){
			image.src = ""
		}else{
			image.src = collectionArray[garbage[index]][0].picture
		}
		card.appendChild(image)
		
		wrapper.appendChild(card)

	}

}
