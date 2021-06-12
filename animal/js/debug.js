/*
  Author: Boxuan Shan (ace18bs)
  Modified date: 06/12/2018
  Description: debug of webpage
               Need load after main.js
*/

//Init buttons
var control = document.getElementById('control');

var debugBtn=document.getElementById("debugBtn");
control.removeChild(debugBtn);

var label=document.createElement("span");
label.innerHTML="Debug: ";
control.appendChild(label);

var btn1=document.createElement("button");
btn1.innerHTML="Show Click Box";
btn1.id = "showClickBoxBtn";
control.appendChild(btn1);

var btn2=document.createElement("button");
btn2.innerHTML="Fill Click Box";
btn2.id = "fillClickBoxBtn";
control.appendChild(btn2);

var btn3=document.createElement("button");
btn3.innerHTML="Show Bone";
btn3.id = "showBoneBtn";
control.appendChild(btn3);

var btn4=document.createElement("button");
btn4.innerHTML="Print States";
btn4.id = "printStatesBtn";
control.appendChild(btn4);

//Draw Click box
var isShowClickBox = false;
function showArea(area, r,g,b) {
    context.strokeStyle = "rgb("+r+","+g+","+b+")";
    context.lineWidth = "1";
    context.strokeRect(area.x1, area.y1, area.x2-area.x1, area.y2-area.y1);
    context.beginPath();
    context.moveTo(area.x1, area.y1);
    context.lineTo(area.x2, area.y2);
    context.stroke();
}
function showClickBox() {
    showArea(catBone.backLegB.clickArea, 0,0,255);
    showArea(catBone.frontLegB.clickArea, 0,255,0);
    showArea(catBone.body.clickArea, 255,0,0);
    showArea(catBone.tail.clickArea, 255,0,255);
    showArea(catBone.head.clickArea, 255,125,0);
    showArea(catBone.backLegA.clickArea, 0,255,255);
    showArea(catBone.frontLegA.clickArea, 255,255,0);
}

//Fill Click box
var isFillClickBox = false;
function fillArea(area, r,g,b) {
    context.fillStyle = "rgba("+r+","+g+","+b+",0.8)";
    context.beginPath();
    context.rect(area.x1, area.y1, area.x2-area.x1, area.y2-area.y1);
    context.fill();
}
function fillClickBox() {
    fillArea(catBone.backLegB.clickArea, 0,0,255);
    fillArea(catBone.frontLegB.clickArea, 0,255,0);
    fillArea(catBone.body.clickArea, 255,0,0);
    fillArea(catBone.tail.clickArea, 255,0,255);
    fillArea(catBone.head.clickArea, 255,125,0);
    fillArea(catBone.backLegA.clickArea, 0,255,255);
    fillArea(catBone.frontLegA.clickArea, 255,255,0);
}

//Draw Bone
var isShowBone = false;
function showBone() {
    Object.keys(catBone).forEach(function(key){
        if(catBone[key].parent != null){
            context.strokeStyle = "rgb(0,0,255)";
            context.lineWidth = "1";
            context.beginPath();
            context.moveTo(catBone[key].position.x, catBone[key].position.y);
            context.lineTo(catBone[key].parent.position.x, catBone[key].parent.position.y);
            context.stroke();

            context.strokeStyle = "rgb(0,255,0)";
            context.lineWidth = "1";
            context.beginPath();
            context.moveTo(catBone[key].position.x, catBone[key].position.y);
            normal = getRotatedXY(catBone[key].position.x, catBone[key].position.y, 0, 50, catBone[key].rotate);
            context.lineTo(normal.x, normal.y);
            context.stroke();
        }
    });
}

//For open and close debug view
function showClickBoxBtn() {
    isShowClickBox = !isShowClickBox;
    refresh();
}
function fillClickBoxBtn() {
    isFillClickBox = !isFillClickBox;
    refresh();
}
function showBoneBtn() {
    isShowBone = !isShowBone;
    refresh();
}
function printStatesBtn() {
    console.log(catBone);
}

//Add event listener
addListener2Btn("showClickBoxBtn", showClickBoxBtn);
addListener2Btn("fillClickBoxBtn", fillClickBoxBtn);
addListener2Btn("showBoneBtn", showBoneBtn);
addListener2Btn("printStatesBtn", printStatesBtn);

//Draw debug
function drawDebug() {
    if(isFillClickBox)
        fillClickBox();
    if(isShowClickBox)
        showClickBox();
    if(isShowBone)
        showBone();
}
