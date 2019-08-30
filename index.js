var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var list = document.getElementsByTagName("TITLE")[0];
//list.innerHTML = "width: " + width + " height: " + height

var canvas = document.querySelector('#glcanvas');

// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
        canvas.width = window.innerWidth - 0;
        canvas.height = window.innerHeight -0;

        /**
         * Your drawings need to be inside this function otherwise they will be reset when 
         * you resize the browser window and the canvas goes will be cleared.
         */
        drawStuff(); 
}
resizeCanvas();

function drawStuff() {
        // do your drawing stuff here
}