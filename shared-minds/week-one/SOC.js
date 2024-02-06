//code adapted from Dano "https://github.com/dano1234/SharedMindsS24/tree/master/Week%2001%20%20Vanilla%20Javascript/Distributed%20in%20HTML%20and%20CSS"

// Get the input box and the canvas element
const inputBox = document.getElementById('inputBox');
const canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
alert("Move your cursor to where your thoughts lead you!")
//canvas.color = 'black';
//canvas.backgroundColor = 'black';

// Add event listener to the input box
inputBox.addEventListener('keydown', function (event) {
    // Check if the Enter key is pressed
    if (event.key === 'Enter') {
        const inputValue = inputBox.value;
        const ctx = canvas.getContext('2d');
        ctx.font = '45px Georgia';
        const inputBoxRect = inputBox.getBoundingClientRect();
        const x = inputBoxRect.left;
        const y = inputBoxRect.top;
        ctx.fillStyle = 'blue';
        ctx.fillText(inputValue, x, y);
        inputBox.value = '';
    }
});

// Add event listener to the document for mouse down event
document.addEventListener('mousedown', (event) => {
    // Set the location of the input box to the mouse location
    inputBox.style.left = event.clientX + 'px';
    inputBox.style.top = event.clientY + 'px';
});