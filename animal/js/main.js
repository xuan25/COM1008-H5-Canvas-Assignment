/*
  Author: Boxuan Shan (ace18bs)
  Modified date: 07/12/2018
  Description: main function of webpage
*/

//Basic attributes
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
const catStatuses = {standUp:0, sitDown:1, stretch:2};
var currentCatStatus = catStatuses.standUp;
var catBone = {
    body: {
        imageFile: "img/body.png",
        loaded: false,
        image: null,
        anchor: {x: 290, y: 110},
        offset: {x: 0, y: 0},
        size: {width: 370,height: 170},
        parent: null,
        position: {x: 0, y: 0},
        rotate:0,
        clickArea:null
    },
    head: {
        imageFile: "img/head.png",
        loaded: false,
        image: null,
        anchor: {x: 38, y: 155},
        offset: {x: -23, y: -100},
        size: {width: 240,height: 200},
        parent: null,
        position: {x: 0, y: 0},
        rotate:0,
        clickArea:null
    },
    frontLegA: {
        imageFile: "img/frontLeg.png",
        loaded: false,
        image: null,
        anchor: {x: 30, y: 0},
        offset: {x: -26, y: 0},
        size: {width: 109,height: 162},
        parent: null,
        position: {x: 0, y: 0},
        rotate:0,
        clickArea:null
    },
    frontLegB: {
        imageFile: "img/frontLeg.png",
        loaded: false,
        image: null,
        anchor: {x: 30, y: 0},
        offset: {x: -26, y: 0},
        size: {width: 109,height: 162},
        parent: null,
        position: {x: 0, y: 0},
        rotate:0,
        clickArea:null
    },
    backLegA: {
        imageFile: "img/backLeg.png",
        loaded: false,
        image: null,
        anchor: {x: 50, y: 0},
        offset: {x: -240, y: -35},
        size: {width: 120,height: 200},
        parent: null,
        position: {x: 0, y: 0},
        rotate:0,
        clickArea:null
    },
    backLegB: {
        imageFile: "img/backLeg.png",
        loaded: false,
        image: null,
        anchor: {x: 50, y: 0},
        offset: {x: -240, y: -35},
        size: {width: 120,height: 200},
        parent: null,
        position: {x: 0, y: 0},
        rotate:0,
        clickArea:null
    },
    tail: {
        imageFile: "img/tail.png",
        loaded: false,
        image: null,
        anchor: {x: 108, y: 127},
        offset: {x: -255, y: -45},
        size: {width: 110,height: 150},
        parent: null,
        position: {x: 0, y: 0},
        rotate:0,
        clickArea:null
    }
};

catBone.head.parent = catBone.body;
catBone.frontLegA.parent = catBone.body;
catBone.frontLegB.parent = catBone.body;
catBone.backLegA.parent = catBone.body;
catBone.backLegB.parent = catBone.body;
catBone.tail.parent = catBone.body;
//End of attributes initialize

//Draw an element on canvas
//x,y: Position in the canvas
//cx,cy: Anchor in the picture
//degree: Rotate in degree
function drawElement(element, x, y, cx, cy, degree) {
    //Calculate the new position in rotated canvas
    var angle = degree*Math.PI/180;
    var newX = x*Math.cos(-angle) - y*Math.sin(-angle);
    var newY = x*Math.sin(-angle) + y*Math.cos(-angle);
    //Draw
    context.rotate(angle);
    context.drawImage(element, newX-cx, newY-cy);
    context.rotate(-angle);
}

//Get the position of a point after rotating a certain angle around another point
//oX,oY: Rotation center
//xOffset,yOffset: Point position related to rotation center before rotate
//degree: Rotate in degree
function getRotatedXY(oX, oY, xOffset, yOffset, degree){
    var angle = degree*Math.PI/180;
    var newXOffset = xOffset*Math.cos(angle) - yOffset*Math.sin(angle);
    var newYOffset = xOffset*Math.sin(angle) + yOffset*Math.cos(angle);
    return {x: oX+newXOffset, y: oY+newYOffset};
}

//Get click Area of the element
function getArea(element) {
    //The position of the four corners of the picture
    var topLeft = getRotatedXY(element.position.x, element.position.y, -element.anchor.x, -element.anchor.y, element.rotate);
    var topRight = getRotatedXY(element.position.x, element.position.y, -element.anchor.x+element.size.width, -element.anchor.y, element.rotate);
    var bottomRight = getRotatedXY(element.position.x, element.position.y, -element.anchor.x+element.size.width, -element.anchor.y+element.size.height, element.rotate);
    var bottomLeft = getRotatedXY(element.position.x, element.position.y, -element.anchor.x, -element.anchor.y+element.size.height, element.rotate);
    //A square area fit the picture
    var x1 = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    var x2 = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
    var y1 = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
    var y2 = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);

    return {x1: x1, y1: y1, x2: x2, y2: y2};
}

//Draw a cat on canvas with body position and joint angles
function drawCat(x, y, rBody, rHead, rFrontLegA, rFrontLegB, rBackLegA, rBackLegB, rTail) {
    //calculate attributes
    var bodyX = x;
    var bodyY = y;
    var headXY = getRotatedXY(bodyX, bodyY, catBone.head.offset.x, catBone.head.offset.y, rBody);
    var frontLegAXY = getRotatedXY(bodyX, bodyY, catBone.frontLegA.offset.x, catBone.frontLegA.offset.y, rBody);
    var frontLegBXY = getRotatedXY(bodyX, bodyY, catBone.frontLegB.offset.x, catBone.frontLegB.offset.y, rBody);
    var backLegAXY = getRotatedXY(bodyX, bodyY, catBone.backLegA.offset.x, catBone.backLegA.offset.y, rBody);
    var backLegBXY = getRotatedXY(bodyX, bodyY, catBone.backLegB.offset.x, catBone.backLegB.offset.y, rBody);
    var tailXY = getRotatedXY(bodyX, bodyY, catBone.tail.offset.x, catBone.tail.offset.y, rBody);

    //set attributes
    catBone.body.position.x = x;
    catBone.body.position.y = y;
    catBone.body.rotate = rBody;
    catBone.head.rotate = rHead;
    catBone.frontLegA.rotate = rFrontLegA;
    catBone.frontLegB.rotate = rFrontLegB;
    catBone.backLegA.rotate = rBackLegA;
    catBone.backLegB.rotate = rBackLegB;
    catBone.tail.rotate = rTail;

    catBone.head.position = headXY;
    catBone.frontLegA.position = frontLegAXY;
    catBone.frontLegB.position = frontLegBXY;
    catBone.backLegA.position = backLegAXY;
    catBone.backLegB.position = backLegBXY;
    catBone.tail.position = tailXY;

    catBone.body.clickArea = getArea(catBone.body);
    catBone.head.clickArea = getArea(catBone.head);
    catBone.frontLegA.clickArea = getArea(catBone.frontLegA);
    catBone.frontLegB.clickArea = getArea(catBone.frontLegB);
    catBone.backLegA.clickArea = getArea(catBone.backLegA);
    catBone.backLegB.clickArea = getArea(catBone.backLegB);
    catBone.tail.clickArea = getArea(catBone.tail);

    //clear
    context.clearRect(0, 0, canvas.width, canvas.height);

    //draw
    drawElement(catBone.frontLegB.image, frontLegBXY.x, frontLegBXY.y, catBone.frontLegB.anchor.x, catBone.frontLegB.anchor.x, rFrontLegB);
    drawElement(catBone.backLegB.image, backLegBXY.x, backLegBXY.y, catBone.backLegB.anchor.x, catBone.backLegB.anchor.y, rBackLegB);
    drawElement(catBone.tail.image, tailXY.x, tailXY.y, catBone.tail.anchor.x, catBone.tail.anchor.y, rTail);
    drawElement(catBone.body.image, bodyX, bodyY, catBone.body.anchor.x, catBone.body.anchor.y, rBody);
    drawElement(catBone.head.image, headXY.x, headXY.y, catBone.head.anchor.x, catBone.head.anchor.y, rHead);
    drawElement(catBone.frontLegA.image, frontLegAXY.x, frontLegAXY.y, catBone.frontLegA.anchor.x, catBone.frontLegA.anchor.y, rFrontLegA);
    drawElement(catBone.backLegA.image, backLegAXY.x, backLegAXY.y, catBone.backLegA.anchor.x, catBone.backLegA.anchor.y, rBackLegA);

    //Debug
    if(this.drawDebug)
        drawDebug();
}

//Easing calculation
function easeRatio(x) {
    return (1-Math.cos(x*Math.PI))/2;
}
function easeStep(x) {
    return (1-Math.cos(x*Math.PI*2))/2;
}

//Bone animation
var boneAnimationDuration = 60*0.5;
var boneAnimationFrame = 0;
var boneAnimationId;
var boneAnimationFrom, boneAnimationTo;
function boneAnimationNext() {
    //Init next frame
    boneAnimationId = requestAnimationFrame(boneAnimationNext);
    if(boneAnimationFrame == 0){
        //Init attribute
    }
    else if (boneAnimationFrame<=boneAnimationDuration){
        //Step change attribute
        var ratio = easeRatio(boneAnimationFrame/boneAnimationDuration);
        var x = catBone.body.position.x;
        var y = catBone.body.position.y;
        var rBody = ratio*(boneAnimationTo.rBody-boneAnimationFrom.rBody)+boneAnimationFrom.rBody;
        var rHead = ratio*(boneAnimationTo.rHead-boneAnimationFrom.rHead)+boneAnimationFrom.rHead;
        var rFrontLegA = ratio*(boneAnimationTo.rFrontLegA-boneAnimationFrom.rFrontLegA)+boneAnimationFrom.rFrontLegA;
        var rFrontLegB = ratio*(boneAnimationTo.rFrontLegB-boneAnimationFrom.rFrontLegB)+boneAnimationFrom.rFrontLegB;
        var rBackLegA = ratio*(boneAnimationTo.rBackLegA-boneAnimationFrom.rBackLegA)+boneAnimationFrom.rBackLegA;
        var rBackLegB = ratio*(boneAnimationTo.rBackLegB-boneAnimationFrom.rBackLegB)+boneAnimationFrom.rBackLegB;
        var rTail = ratio*(boneAnimationTo.rTail-boneAnimationFrom.rTail)+boneAnimationFrom.rTail;
        drawCat(x, y, rBody, rHead, rFrontLegA, rFrontLegB, rBackLegA, rBackLegB, rTail);
    }
    else {
        //Finished
        cancelAnimationFrame(boneAnimationId);
        boneAnimationFrame = 0;
        return;
    }
    boneAnimationFrame++;
}
//Start
function boneAnimation(x, y, rBody, rHead, rFrontLegA, rFrontLegB, rBackLegA, rBackLegB, rTail) {
    cancelAnimationFrame(boneAnimationId);

    boneAnimationFrom = {
        rBody: catBone.body.rotate,
        rHead: catBone.head.rotate,
        rFrontLegA: catBone.frontLegA.rotate,
        rFrontLegB: catBone.frontLegB.rotate,
        rBackLegA: catBone.backLegA.rotate,
        rBackLegB: catBone.backLegB.rotate,
        rTail: catBone.tail.rotate};
    boneAnimationTo = {
        rBody: rBody,
        rHead: rHead,
        rFrontLegA: rFrontLegA,
        rFrontLegB: rFrontLegB,
        rBackLegA: rBackLegA,
        rBackLegB: rBackLegB,
        rTail: rTail};

    boneAnimationFrame = 0;
    boneAnimationNext();
}

//Move Animation
var moveDuration = 60*1.5;
var moveFrame = 0;
var moveFromXY, moveToXY;
var moveToId;
var lastCatStatus;
function moveToNext() {
    //Init next frame
    moveToId = requestAnimationFrame(moveToNext);
    if (moveFrame == 0){
        //Init attribute
        lastCatStatus = currentCatStatus;
        doStretch();
    }
    if (moveFrame<=moveDuration){
        //Step change attribute
        var ratio = easeRatio(moveFrame/moveDuration);
        var x = ratio*(moveToXY.x-moveFromXY.x)+moveFromXY.x;
        var y = ratio*(moveToXY.y-moveFromXY.y)+moveFromXY.y;
        var rBody = catBone.body.rotate;
        var rHead = catBone.head.rotate;
        var rFrontLegA = catBone.frontLegA.rotate;
        var rFrontLegB = catBone.frontLegB.rotate;
        var rBackLegA = catBone.backLegA.rotate;
        var rBackLegB = catBone.backLegB.rotate;
        var rTail = catBone.tail.rotate;
        drawCat(x, y, rBody, rHead, rFrontLegA, rFrontLegB, rBackLegA, rBackLegB, rTail);
    }
    else {
        //Finished
        if(lastCatStatus == catStatuses.sitDown)
            doSitDown();
        else
            doStandUp();
        cancelAnimationFrame(moveToId);
        moveFrame = 0;
        return;
    }
    moveFrame++
}
//Start
function moveTo(x, y){
    moveFromXY = {x: catBone.body.position.x, y: catBone.body.position.y};
    moveToXY = {x: x, y: y};
    cancelAnimationFrame(moveToId);
    moveFrame = 0;
    moveToNext();
}

//Emotion
var emotionDuration = 60*1.5;
var emotionFrame = 0;
var emotionId;
function doEmotionNext() {
    //Init next frame
    emotionId = requestAnimationFrame(doEmotionNext);
    if(emotionFrame == 0){
        //Init attribute
        catBone.head.imageFile = "img/head1.png";
        catBone.head.image.src = catBone.head.imageFile;
    }
    else if (emotionFrame<=emotionDuration){
        //Step change attribute
    }
    else {
        //Finished
        catBone.head.imageFile = "img/head.png";
        catBone.head.image.src = catBone.head.imageFile;
        cancelAnimationFrame(emotionId);
        emotionFrame = 0;
        return;
    }
    emotionFrame++;
}
//Start
function doEmotion(){
    cancelAnimationFrame(emotionId);
    emotionFrame = 0;
    doEmotionNext();
}

//Sway animation
var doSwayPeriod = 60*4;
var doSwayAmplitude = 0.05;
var doSwayFrame = 0;
var doSwayId;
function doSwayNext() {
    //Init next frame
    doSwayId = requestAnimationFrame(doSwayNext);
    if(doSwayFrame < doSwayPeriod/2){
        //Init attribute
        step = easeStep((doSwayFrame+1)/(doSwayPeriod/2)) * doSwayAmplitude;
        catBone.head.rotate = catBone.head.rotate+step;
        catBone.tail.rotate = catBone.tail.rotate-step;
        catBone.frontLegB.rotate = catBone.frontLegB.rotate-step;
        catBone.backLegB.rotate = catBone.backLegB.rotate+step;
    }
    else if(doSwayFrame < doSwayPeriod){
        //Step change attribute
        step = easeStep((doSwayFrame-doSwayPeriod/2+1)/(doSwayPeriod/2)) * doSwayAmplitude;
        catBone.head.rotate = catBone.head.rotate-step;
        catBone.tail.rotate = catBone.tail.rotate+step;
        catBone.frontLegB.rotate = catBone.frontLegB.rotate+step;
        catBone.backLegB.rotate = catBone.backLegB.rotate-step;
    }
    else{
        //Finished
        doSwayFrame = 0;
        return;
    }
    //Draw
    refresh();
    doSwayFrame++;

}
//Start
function doSway() {
    cancelAnimationFrame(doSwayId);
    doSwayFrame = 0;
    doSwayNext();
}
//Stop
function stopDoSway() {
    cancelAnimationFrame(doSwayId);
    doSwayFrame = 0;
}

//Wag animation
var doWagPeriod = 60;
var doWagAmplitude = 2;
var doWagTimes = 4;
var doWagCount = 0;
var doWagFrame = 0;
var doWagId;
var doWagRunning = false;
function doWagNext() {
    //Init next frame
    doWagId = requestAnimationFrame(doWagNext);
    if(doWagFrame < doWagPeriod/2){
        //Init attribute
        step = easeStep((doWagFrame+1)/(doWagPeriod/2)) * doWagAmplitude;
        catBone.tail.rotate = catBone.tail.rotate-step;
    }
    else if(doWagFrame < doWagPeriod){
        //Step change attribute
        step = easeStep((doWagFrame-doWagPeriod/2+1)/(doWagPeriod/2)) * doWagAmplitude;
        catBone.tail.rotate = catBone.tail.rotate+step;
    }
    else{
        //Finished
        doWagFrame = 0;
        doWagCount++;
        if(doWagCount >= doWagTimes){
            doWagRunning = false;
            cancelAnimationFrame(doWagId);
        }
        return;
    }
    //Draw
    refresh();
    doWagFrame++;

}
//Start
function doWag() {
    if(doWagRunning){
        return;
    }
    doWagRunning = true;
    doWagFrame = 0;
    doWagCount = 0;
    doWagNext();
}
//Stop
function stopDoWag() {
    doWagRunning = false;
    cancelAnimationFrame(doWagId);
    doWagFrame = 0;
    doWagCount = 0;
}

//Redraw the cat
function refresh() {
    //Get current states
    var x = catBone.body.position.x;
    var y = catBone.body.position.y;
    var rBody = catBone.body.rotate;
    var rHead = catBone.head.rotate;
    var rFrontLegA = catBone.frontLegA.rotate;
    var rFrontLegB = catBone.frontLegB.rotate;
    var rBackLegA = catBone.backLegA.rotate;
    var rBackLegB = catBone.backLegB.rotate;
    var rTail = catBone.tail.rotate;
    //draw
    drawCat(x, y, rBody, rHead, rFrontLegA, rFrontLegB, rBackLegA, rBackLegB, rTail);
}

//Do some actions
function doStandUp() {
    doSway();
    stopDoWag();
    currentCatStatus = catStatuses.standUp;
    boneAnimation(catBone.body.position.x,catBone.body.position.y, 0,0, 0,30, 0,-15, 0);
}
function doSitDown() {
    stopDoSway();
    stopDoWag();
    currentCatStatus = catStatuses.sitDown;
    boneAnimation(catBone.body.position.x,catBone.body.position.y, -40,-20, 0,30, -90,-90, -35);
}
function doStretch() {
    stopDoSway();
    stopDoWag();
    currentCatStatus = catStatuses.stretch;
    boneAnimation(catBone.body.position.x,catBone.body.position.y, 0,0, -70,-40, 60,45, 40);
}

//Get mouse position relative to the canvas
function getMouseXY(e) {
    var boundingRect = canvas.getBoundingClientRect();
    var offsetX = boundingRect.left;
    var offsetY = boundingRect.top;
    var w = (boundingRect.width-canvas.width)/2;
    var h = (boundingRect.height-canvas.height)/2;
    offsetX += w;
    offsetY += h;
    // use clientX and clientY as getBoundingClientRect is used above
    var mx = Math.round(e.clientX-offsetX);
    var my = Math.round(e.clientY-offsetY);
    return {x: mx, y: my}; // return as an object
}

//Check if the element is clicked
function checkInArea(cursor, area) {
    if(cursor.x<area.x1 || cursor.x>area.x2 || cursor.y<area.y1 || cursor.y>area.y2)
        return false;
    return true;
}

//When canvas has been clicked
function canvasClicked(evt) {
    //Get click position
    var cursor = getMouseXY(evt);
    //Check if it is click on components
    if(checkInArea(cursor, catBone.frontLegA.clickArea)){
        if(currentCatStatus == catStatuses.stretch)
            doStandUp();
        else
            doStretch();
        return;
    }
    if(checkInArea(cursor, catBone.backLegA.clickArea)){
        if(currentCatStatus == catStatuses.stretch)
            doStandUp();
        else
            doStretch();
        return;
    }
    if(checkInArea(cursor, catBone.head.clickArea)){
        doEmotion();
        return;
    }
    if(checkInArea(cursor, catBone.tail.clickArea)){
        doWag();
        return;
    }
    if(checkInArea(cursor, catBone.body.clickArea)){
        if (currentCatStatus == catStatuses.sitDown)
            doStandUp();
        else
            doSitDown();
        return;
    }
    if(checkInArea(cursor, catBone.frontLegB.clickArea)){
        if(currentCatStatus == catStatuses.stretch)
            doStandUp();
        else
            doStretch();
        return;
    }
    if(checkInArea(cursor, catBone.backLegB.clickArea)){
        if(currentCatStatus == catStatuses.stretch)
            doStandUp();
        else
            doStretch();
        return;
    }
    //Away from the animal
    moveTo(cursor.x, cursor.y);
}

//Draw a cat on the cntre of the canvas whih default status
function initialDraw() {
    //Change it position
    catBone.body.position.x = canvas.width/2+90;
    catBone.body.position.y = canvas.height/2;
    //Stand up for initial
    doStandUp();
}

//Add event listener to button
function addListener2Btn(id, to) {
    var btn = document.getElementById(id);
    btn.addEventListener('click', to, false);
}

//Initialize events
function initialEvents() {
    addListener2Btn("standUpBtn", doStandUp);
    addListener2Btn("sitDownBtn", doSitDown);
    addListener2Btn("stretchBtn", doStretch);
    addListener2Btn("resetBtn", initialDraw);
    canvas.addEventListener('click', canvasClicked);
}

//Check load and initialization
function start() {
    //Check for Load
    Object.keys(catBone).forEach(function(key){
        if(catBone[key].loaded == false)
            return;
        else
            catBone[key].image.onload = function () {
                refresh();
            };
    });

    //Add event listeners
    initialEvents();
    //Draw initial image
    initialDraw();
}

//Initial image
function loadImg(element) {
    var img = new Image();
    img.onload = function () {
        element.loaded = true;
        start();
    }
    img.src = element.imageFile;
    element.image = img;
}

//load Images (Enter point)
Object.keys(catBone).forEach(function(key){
    loadImg(catBone[key]);
});

//Debug
function initDebug() {
    var debugScript= document.createElement("script");
    debugScript.type = "text/javascript";
    debugScript.src="js/debug.js";
    document.body.appendChild(debugScript);
}
addListener2Btn("debugBtn", initDebug);
