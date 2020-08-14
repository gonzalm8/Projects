var canvas = document.getElementById("gameWindow");
var cntxt = canvas.getContext("2d");

//starting position of the bird
var startPositionX = canvas.width/2;
var startPositionY = canvas.height/2;
var birdHeight = 40;

//difference that the bird falls each frame draw
var fallingDeltaY = -4;
var risingDeltaY = fallingDeltaY * 1.5;
var deltaX = -2;

//array of pipes being rendered in window
const pipeOffset = 150;
var numPipes = 4;
var upperPipes = [];
var bottomPipes = [];
var pipeIndex = 0;


//pipes starting x position and offset
var pipeOneX = canvas.width; //+ pipeOffset;
var pipeTwoX = canvas.width + pipeOffset;
var pipeThreeX = canvas.width +  (pipeOffset * 2);
var pipeFourX = canvas.width + (pipeOffset * 3);

//boolean game controlers
var runGame = true;
var spacePressed = false;
var barTouched = false;

//keep score, each pipe crossed will be 10 points
var score = 0;
var highScore = 0;
var pipesPassed = 0;
var numPresses = 0;

//function to get all the values ready and in place at the start of each game
function setGame(){

    //initialize pipes
    for (var c = 0; c < numPipes; c++) {
        upperPipes[c] = { x: 0, status: 1, height: getPipeHeight(), status: 1 }
        bottomPipes[c] = { x: 0, status: 1, height: 0, status: 1 }
    }

    startPositionX = canvas.width / 2;
    startPositionY = canvas.height / 2;
    birdHeight = 40;

    score = 0;
    pipesPassed = 0;
    numPresses = 0;

    pipeOneX = canvas.width;
    pipeTwoX = canvas.width + pipeOffset;
    pipeThreeX = canvas.width + (pipeOffset * 2);
    pipeFourX = canvas.width + (pipeOffset * 3);

    spacePressed = false;
    barTouched = false;
}

//function in charge of drawing the bird
function drawBird(){
    cntxt.beginPath();
    // cntxt.arc(startPositionX, startPositionY, 15, 0, Math.PI*2);
    // //cntxt.rect(startPositionX-20, startPositionY,birdHeight-10,birdHeight-10);
    // cntxt.fillStyle = "gold";
    // cntxt.fill();
    cntxt.drawImage(image, startPositionX, startPositionY, 40,40);
    cntxt.closePath();
}

//function in charge of drawing the upper pipes
function drawUpperRectangles(){
    upperPipes[0].x = pipeOneX;
    upperPipes[1].x = pipeTwoX;
    upperPipes[2].x = pipeThreeX;
    upperPipes[3].x = pipeFourX;

    for(var i = 0; i < numPipes; i++){
        //console.log("in this loop");
        cntxt.beginPath();
        cntxt.fillStyle = "red";
        cntxt.fillRect(upperPipes[i].x, 0, 30, upperPipes[i].height);
        cntxt.fillStyle = "white";
        cntxt.font = "16pt sans-serif";
        var calcOffset = upperPipes[i].height / 4;
        cntxt.fillText("F", upperPipes[i].x + 7.5, calcOffset - 10);
        cntxt.fillText("A", upperPipes[i].x + 7.5, (calcOffset * 2) - 10);
        cntxt.fillText("C", upperPipes[i].x + 7.5, (calcOffset * 3) - 10);
        cntxt.fillText("T", upperPipes[i].x + 7.5, (calcOffset * 4) - 10);
        cntxt.fill();
        
        //check to see if the pipe has passed the bird and mark it as scored
        if(upperPipes[i].x < startPositionX - (birdHeight/2) && upperPipes[i].status == 1){
            score += 10;
            pipesPassed++;
            upperPipes[i].status = 0;
        }
        cntxt.fill();
        cntxt.closePath();
        

        // upperPipes[i].x - 15 < startPositionX < upperPipes[i].x + 15 
        if(upperPipes[i].x > startPositionX - 15
            && startPositionX + 15 > upperPipes[i].x
            && startPositionY < upperPipes[i].height
            && upperPipes[i].status == 1) {
            endGame(i);
        }
    }
}

function drawBorder(xPos, yPos, width, height, thickness = 1) {
    cntxt.fillStyle = '#ffff';
    cntxt.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 2), height + (thickness * 2));
}

//function in charge of drawing the bottom pipes
function drawBottomRectangles() {

    bottomPipes[0].x = pipeOneX;
    bottomPipes[1].x = pipeTwoX;
    bottomPipes[2].x = pipeThreeX;
    bottomPipes[3].x = pipeFourX;

    for (var i = 0; i < numPipes; i++) {
        //console.log("in this loop");
        cntxt.beginPath();
        bottomPipes[i].height = canvas.height - (upperPipes[i].height + birdHeight + 60);
        
        cntxt.fillStyle = "red";
        cntxt.fillRect(bottomPipes[i].x, canvas.height - bottomPipes[i].height, 30, bottomPipes[i].height);
        cntxt.fillStyle = "white";
        cntxt.font = "16pt sans-serif";
        var calcOffset = (bottomPipes[i].height) / 4;
        cntxt.fillText("F", bottomPipes[i].x + 7.5, (canvas.height - bottomPipes[i].height)  + (calcOffset) - 10);
        cntxt.fillText("A", bottomPipes[i].x + 7.5, (canvas.height - bottomPipes[i].height)  + (calcOffset * 2) - 10);
        cntxt.fillText("C", bottomPipes[i].x + 7.5, (canvas.height - bottomPipes[i].height)  + (calcOffset * 3) - 10);
        cntxt.fillText("T", bottomPipes[i].x + 7.5, (canvas.height - bottomPipes[i].height)  + (calcOffset * 4) - 10);
        cntxt.fill();
        
        //drawFacts(bottomPipes[i].x, bottomPipes[i].height);
        cntxt.closePath();
        

        if (bottomPipes[i].x > startPositionX - 15
            && startPositionX + 15 > bottomPipes[i].x
            && startPositionY >= canvas.height - bottomPipes[i].height - 35
            && bottomPipes[i].status == 1) {
            endGame(i);
        }
    }
}

function drawGame(){
    cntxt.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawUpperRectangles();
    drawBottomRectangles();

    //----------Game Functionality----------//
    pipeOneX += deltaX;
    pipeTwoX += deltaX;
    pipeThreeX += deltaX;
    pipeFourX += deltaX;

    //reset pipes locoation and in-play status
    if (upperPipes[0].x < -pipeOffset) {
        pipeOneX = canvas.width + pipeOffset;
        upperPipes[0].status = 1;
        bottomPipes[0].status = 1;
        upperPipes[0].height = getPipeHeight();
    }
    else if (upperPipes[1].x < -pipeOffset) {
        pipeTwoX = canvas.width + pipeOffset;// + pipeOffset;
        upperPipes[1].status = 1;
        bottomPipes[1].status = 1;
        upperPipes[1].height = getPipeHeight();
    }
    else if (upperPipes[2].x < -pipeOffset) {
        pipeThreeX = canvas.width + pipeOffset;// + (pipeOffset*2);
        upperPipes[2].status = 1;
        bottomPipes[2].status = 1;
        upperPipes[2].height = getPipeHeight();
    }
    else if (upperPipes[3].x < -pipeOffset) {
        pipeFourX = canvas.width + pipeOffset;// + (pipeOffset*3);
        upperPipes[3].status = 1;
        bottomPipes[3].status = 1;
        upperPipes[3].height = getPipeHeight();
    }

    // this allows the bird to rise and fall
    startPositionY -= fallingDeltaY;
    if(startPositionY > canvas.height - 15){
        endGame(5);
    }

    if(spacePressed == true){
        startPositionY += risingDeltaY * 1.5;
    }
    //----------Game Functionality----------//
    console.log("right before if statement");
    //request a frame and have draw call itself to render
    if(runGame){
        console.log("in the if statement")
        requestAnimationFrame(drawGame);
    }
}

function getPipeHeight() {
    return (canvas.height / 4) + Math.floor(Math.random() * Math.floor(150));
}

function drawFactsTop(x, y){
    cntxt.font = "16pt sans-serif";
    var calcOffset = y / 4;
    cntxt.fillText("F", x + 7.5, calcOffset - 10);
    cntxt.fillText("A", x + 7.5, (calcOffset * 2) - 10);
    cntxt.fillText("C", x + 7.5, (calcOffset * 3) - 10);
    cntxt.fillText("T", x + 7.5, (calcOffset * 4) - 10);
}



//change handlers to be for key click on canvas and finger touch on phone screen
document.addEventListener("keydown", keyDownHandler,false);
document.addEventListener("keyup", keyUpHandler, false);

//canvas.addEventListener("mousedown", keyDownHandler, false);
//canvas.addEventListener("mouseup", keyUpHandler, false);


function keyDownHandler(e){
    if(e.key == " " || e.key == "Space"){
        spacePressed = true;
        numPresses++;
        console.log("space pressed");
    }
}

function keyUpHandler(e){
    //if (e.key == " " || e.key == "Space") {
        spacePressed = false;
    //}
}

function endGame(index){
    runGame = false;
    
    if(index==5){
        alert("\tTouched the ground! "+ 
              "\n\n\tFinal Score: " + score);
        document.getElementById("highScore").innerHTML = highScore;
        canvas.style = "display:none";
        document.getElementById('startMenu').style = "display:block";
        //document.location.reload();
    }
    else{
        if(score > highScore){
            highScore = score;
        }
        alert("\tFacts! My Weakness!\n\n\tFinal Score: " + score +
            "\n\n\tFacts Ignored: " + pipesPassed +
            "\n\n\tLies Told: " + numPresses
            );
        //cntxt.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById("highScore").innerHTML = highScore;
        canvas.style = "display:none";
        document.getElementById('startMenu').style = "display:block";
        //document.location.reload();
    }
    setGame();
}

function startGame(){
    setGame();
    document.getElementById('startMenu').style = "display:none";
    canvas.style = "display:block";
    runGame = true;
    drawGame();
}


var image = new Image();

image.src = "Trump_Image.png"

