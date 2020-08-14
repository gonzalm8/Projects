var canvas = document.getElementById("gameCanvas"); //get the canvas element from the DOM
var cntxt = canvas.getContext("2d"); //rendering context; allows us to paint on the canvas

//brick definitions
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//game score and lives variables
var score = 0;
var lives = 3;

//create 2d array of bricks
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status:1};
    }
}



//varibles for user controlled paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;

//variables to control the ball bouces and boundaries
var x = canvas.width / 2;
var y = canvas.height - 30;

var keyPressLeft = false;
var keyPressRight = false;

//difference to be added to x and y positions
var dx = 2;
var dy = -2;

//radius of the drawn circle
var ballRad = 10;

var newColor = "#000000";

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            //check to see if brick is still active and draw them
            if (bricks[c][r].status == 1) {
                //variables to prevent bricks from being drawn on top of one another
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                cntxt.beginPath();
                cntxt.rect(brickX, brickY, brickWidth, brickHeight);
                cntxt.fillStyle = "#0095DD";
                cntxt.fill();
                cntxt.closePath();
            }
        }
    }
}

//function to draw object (use this one to draw the rectangle)
function drawBall(){
    cntxt.beginPath();
    cntxt.arc(x,y,ballRad,10,0,Math.PI*2);
    cntxt.fillStyle = newColor;
    cntxt.fill();
    cntxt.closePath();    
}

function drawPaddle(){
    cntxt.beginPath();
    //keep the paddle floating above the bottom of edge of the canvas   
    cntxt.rect(paddleX, canvas.height - (paddleHeight + 10), paddleWidth, paddleHeight); 
    cntxt.fillStyle = "gold";
    cntxt.fill();
    cntxt.closePath(); 
}

function drawScore() {
    cntxt.font = "16px Arial";
    cntxt.fillStyle = "#0095DD";
    cntxt.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    cntxt.font = "16px Arial";
    cntxt.fillStyle = "#0095DD";
    cntxt.fillText("Lives: " + lives, 94,20 );
}

//continuous function that runs the game
function draw(){
    cntxt.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawLives();
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    
    x += dx;
    y += dy;

    //canvas y values start from top left, so top is 0 and bottom is canvas.height
    //use the balls radius as canvas boundaries; prevents the ball from going past the edge of the canvas
    if (y + dy < ballRad) { //if the top or bottom of the canvas has been reached, change the ball direction
        dy = -dy;
    }
    else if (y + dy > canvas.height - (ballRad + paddleHeight + 10)){
        if (x > paddleX && x < paddleX + paddleWidth){ //&& y  canvas.height - paddleHeight) {
            dy = -dy;
        }
        else if(y+ dy> canvas.height-ballRad){
            lives--;
            if(lives == 0){
                alert("Out of lives, game over!");
                document.location.reload();
            }
            //reset coordinates to start game over without needing to redraw bricks
            else{
                alert("Oops, lost a life. " + lives +" lives remaining!");
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (x + dx < ballRad || x + dx > canvas.width-ballRad) { //if the top or bottom of the canvas has been reached, change the ball direction
        dx = -dx;
    }

    //check to see if the paddle has moved either left or right and update the draw
    if(keyPressLeft == true && paddleX > 0){
        paddleX -= 7;
    }
    if(keyPressRight == true && paddleX < canvas.width - paddleWidth){
        paddleX += 7;
    }
    //request a frame and have draw call itself to render
    requestAnimationFrame(draw);
}

//running of the game
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function mouseMoveHandler(e){
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}

//these functions take in an event as a parameter
function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        keyPressRight = true;
    }

    if(e.key == "Left" || e.key == "ArrowLeft"){
        keyPressLeft = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        keyPressRight = false;
    }

    if (e.key == "Left" || e.key == "ArrowLeft") {
        keyPressLeft = false;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 10;
                    if (score == brickColumnCount*brickRowCount * 10    ) {
                        alert("You Win, Congratulations! \n\nFinal Score: " + score);
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                }
            }
        }
    }
}

function drawScore() {
    cntxt.font = "16px Arial";
    cntxt.fillStyle = "#0095DD";
    cntxt.fillText("Score: " + score, 8, 20);
}

//var interval = setInterval(draw, 10);
draw();