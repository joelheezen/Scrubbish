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
	let cardCardboard = document.createElement("card")
	let cardPlastic = document.createElement("card")
	let cardGlass = document.createElement("card")
	let cardTrash = document.createElement("card")
	let cardPaper = document.createElement("card")
	let cardMetal = document.createElement("card")

	wrapper.appendChild(cardCardboard)
	wrapper.appendChild(cardPlastic)
	wrapper.appendChild(cardGlass)
	wrapper.appendChild(cardTrash)
	wrapper.appendChild(cardPaper)
	wrapper.appendChild(cardMetal)

	cardCardboard.innerHTML += "<p>" + "you have collected: " + "<b>" + collectionArray.cardboard[0].collected + "</b>" +" carboard pieces" + "</p>"
	cardPlastic.innerHTML += "<p>" + "you have collected: " + "<b>" + collectionArray.plastic[0].collected + "</b>" + " plastic pieces" + "</p>"
	cardGlass.innerHTML += "<p>" + "you have collected: " + "<b>" + collectionArray.glass[0].collected + "</b>" + " glass pieces" + "</p>"
	cardTrash.innerHTML += "<p>" + "you have collected: " + "<b>" + collectionArray.trash[0].collected + "</b>" + " trash" + "</p>"
	cardPaper.innerHTML += "<p>" + "you have collected: " + "<b>" + collectionArray.paper[0].collected + "</b>" + " paper pieces" + "</p>"
	cardMetal.innerHTML += "<p>" + "you have collected: " + "<b>" + collectionArray.metal[0].collected + "</b>" + " metal pieces" + "</p>"

	let imageCardboard = document.createElement("img")
	let imagePlastic = document.createElement("img")
	let imageGlass = document.createElement("img")
	let imageTrash = document.createElement("img")
	let imagePaper = document.createElement("img")
	let imageMetal = document.createElement("img")


    imageCardboard.src = collectionArray.cardboard[0].picture
	imagePlastic.src = collectionArray.plastic[0].picture
	imageGlass.src = collectionArray.glass[0].picture
	imageTrash.src = collectionArray.trash[0].picture
	imagePaper.src = collectionArray.paper[0].picture
	imageMetal.src = collectionArray.metal[0].picture

    cardCardboard.appendChild(imageCardboard)
	cardPlastic.appendChild(imagePlastic)
	cardGlass.appendChild(imageGlass)
	cardTrash.appendChild(imageTrash)
	cardPaper.appendChild(imagePaper)
	cardMetal.appendChild(imageMetal)
	

}
