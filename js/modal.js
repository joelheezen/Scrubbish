// Get the model
var model = document.getElementById("myModal");

// Get the button that opens the model
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the model
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the model 
btn.onclick = function() {
  model.style.display = "block";
}

// When the user clicks on <span> (x), close the model
span.onclick = function() {
  model.style.display = "none";
}

// When the user clicks anywhere outside of the model, close it
window.onclick = function(event) {
  if (event.target == model) {
    model.style.display = "none";
  }
}
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}