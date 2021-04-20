localStorage.setItem("collection", JSON.stringify({
	"items": [
        {
		"info": "lorem ipsum",
		"years": "years to degrade",
		"picture": "base64 maybe here? hard to save picture in json without external link."
	},
	{
		"info": "lorem ipsum 2",
		"years": "years to degrade 2",
		"picture": "base64 maybe here? hard to save picture in json without external link. 2"
	}
]
}))

let collectionArray = JSON.parse(localStorage.getItem("collection"))


console.log(collectionArray.items[0].info)

function displayCollection(){
    let wrapper = document.getElementById("collection-wrapper")
    console.log(wrapper)

    for (i = 0; i < collectionArray.items.length; i++){
        let card = document.createElement("div")
        wrapper.appendChild(card)
        card.innerHTML = collectionArray.items[i].info + " " + collectionArray.items[i].years + " " + collectionArray.items[i].picture
    }

}

displayCollection()