//
// HELPER FUNCTIONS 
// reduce r,g,b values to a single number
// decimal = 32 bit integer (signed), use bit shift to convert from rgb to int and back
//
function rgbToDecimal(red, green, blue) {
    var rgbTotal = red * 65536 + green * 256 + blue;

    return rgbTotal // alpha = 1
}

function decimalToRgb(decNumber) {
    let red = decNumber >> 24 & 0xFF;
    let green = decNumber >> 16 & 0xFF;
    let blue = decNumber >> 8 & 0xFF;
    let alpha = decNumber & 0xFF;
    console.log("rvs is " + red + "," + green + "," + blue)
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}