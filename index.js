// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    query,
    orderBy,
  } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPEtgHouNR-gPyah3vyBBoagKVXziqjbI",
  authDomain: "hoops-154d2.firebaseapp.com",
  projectId: "hoops-154d2",
  storageBucket: "hoops-154d2.appspot.com",
  messagingSenderId: "941396410543",
  appId: "1:941396410543:web:b41e2ada74e99b7263545a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 //Initialize Firebase database
 const db = getFirestore(app);
 
 // Variables for firebase
let hiScores = [];
const dbRef = collection(db, "scores");

// Vairables for game
let ball, floor, lwall, rwall, topper;
let cW, cH;
let clickx1, clicky1, clickx2, clicky2;
let hoopl, hoopr;
let velCalmer = 18;
let shots = 0;
let fshots = 0;
let score = 0;
let fscore = 0;
let ended = false;
let playerName = "Max";
let ballimg1, ballimg2, ballimg3, ballTired, ballAngry, ballScared;
let ballAni = 0;
let countStart;

//gameStates:
// 0 : Startup
// 1 : Countdown
// 2 : Playing
// 3 : Endgame
let gameState = 0;

let startTime = 0;

let input, button, greeting;

window.preload = () => {
  ballimg1 = loadImage("ball2.png");
  ballimg2 = loadImage("theBall.png");
  ballimg3 = loadImage('ball3.png');
  ballAngry = loadImage('angry.png');
  ballTired = loadImage('tired.png');
  ballScared = loadImage('tooFast.png');
}

window.setup = () => {
  /*
  cW = windowWidth;
  cH = windowHeight;
  */
 cW = 600;
 cH = 800;
  new Canvas(cW, cH);
  world.gravity.y = 10;

  ball = new Sprite();
  ball.diameter = 50;
  ball.y =  cH - 60;
  ball.bounciness = 0.7;
  ball.addAni('distressed', ballimg1);
  ball.addAni('baseline', ballimg2);
  ball.addAni('done', ballimg3);
  ball.addAni('tired', ballTired);
  ball.addAni('scared', ballScared);
  ball.addAni('angry', ballAngry);
  
  floor = new Sprite();
  floor.y = cH-5;
  floor.w = cW;
  floor.h = 10;
  floor.color = color(255, 203, 19);
  floor.stroke = color(255, 240, 60);
  floor.collider = 'static';

  lwall = new Sprite();
  lwall.y = cH/2;
  lwall.x = 5;
  lwall.w = 10;
  lwall.h = cH;
  lwall.color = color(255, 203, 19);
  lwall.stroke = color(255, 240, 60);
  lwall.collider = 'static';

  rwall = new Sprite();
  rwall.y = cH/2;
  rwall.x = cW - 5;
  rwall.w = 10;
  rwall.h = cH;
  rwall.color = color(255, 203, 19);
  rwall.stroke = color(255, 240, 60);
  rwall.collider = 'static';

  topper = new Sprite();
  topper.y = 5;
  topper.h = 10;
  topper.x = cW/2;
  topper.w = cW;
  topper.color = color(255, 203, 19);
  topper.stroke = color(255, 240, 60);
  topper.collider = 'static';
  newHoop();

  setupGame();
}

window.draw = () => {
  clear();
  background(20);

  let secs = (millis() - startTime) / 1000;
  secs = int(secs);

  //backdrop for the start screen
  if(gameState == 0){
    fill(245);
    rectMode(CENTER);
    rect(cW/2, cH/2 + 50, 500, 600, 0,0,8,8);
  }
  if(gameState == 1){
    if((millis() - countStart)/1000 < 3){
      let countdownSizeMod = ((4-(millis() - countStart)/1000)) % 1;
      textAlign(CENTER);
      textSize(111 * countdownSizeMod);
      strokeWeight(0);
      fill(255);
      text(int(4 - ((millis() - countStart)/1000)), cW/2, cH/2 - 30);
    } else {
      startGame();
    }
  }

  if(mouse.pressing()) {
    let power = dist(clickx1, clicky1, mouse.x, mouse.y);
    strokeWeight(3);
    if(power > 450){
      stroke(227, 19, 102);
    } else {
      if(power > 325){
        stroke(255, 65, 77);
      } else {
        if(power > 150){
          stroke(255, 134, 48);
        } else {
          stroke(255, 203, 19);
        }
      }
    }

    line(clickx1, clicky1, mouse.x, mouse.y);

    ball.changeAni('distressed');
  } else {
    switch (ballAni) {
      case 0:
        ball.changeAni('baseline');
        break;
      case 1:
        ball.changeAni('angry');
        break;
      case 2:
        ball.changeAni('tired');
        break;
      }
    }
  
  if((ball.colliding(hoopl) > 5) && (ball.colliding(hoopr) > 5)){
    ball.changeAni('done');
  }

  //if ball velocity is fast enough, do scared face
  if (ball.velocity.mag() > 10) {
    ball.changeAni('scared');
  }

  //score condition
  if((ball.colliding(hoopl) > 50) && (ball.colliding(hoopr) > 50)){
    ball.y = cH - 60;
    ball.x = random(100, cW - 100);
    score += 1;
    if (secs < 60){
      fscore += 1;
    }
    hoopl.remove();
    hoopr.remove();
    newHoop();
  }
  textAlign(LEFT);
  textSize(40);
  strokeWeight(0);
  text('Score: ' + score, 20, 55);
  textSize(32);
  text('Shots: ' + shots, 20, 90);

  //end condition!
  if (secs >= 60){
    textAlign(CENTER);
    textSize(44);
    if (!ended){
        fshots = shots;
        sendScore();
        ended = true;
        getScores();
        
    }
    displayScores();
    if (fscore === 1){
      text('You scored just ' + fscore + " basket\n in 60 seconds!", cW/2, cH/2);
    } else {
      text('You scored ' + fscore + " baskets\n in 60 seconds!", cW/2, cH/2);
    }
  } else {
    if(gameState == 2){
      textSize(32);
      text('Time left: ' + (60 - secs), cW - 200, 55);
    }
  }
}

//onmousedown
window.mousePressed = () => {
  clickx1 = mouseX;
  clicky1 = mouseY;
  //shots += 1;
}

//onmouseup
window.mouseReleased = () => {
  //if game is playing, shoot the ball and increment shots
  if(gameState == 2){
    clickx2 = mouseX;
    clicky2 = mouseY;
    ball.vel.x += (clickx1 - clickx2) / velCalmer;
    ball.vel.y += (clicky1 - clicky2) / velCalmer;
    shots += 1;
  }
  let randAni = random(3);
  ballAni = int(randAni);
}

window.keyPressed = () => {
  if(key == "Escape"){
    console.log("R PRESSED");
    location.reload();
  }
}


function newHoop() {
  let hx = random(100, cW - 100);
  let hy = random(150, 350);
  hoopl = new Sprite(hx, hy, 8, 38);
  hoopl.rotation = -13;
  hoopl.collider = 'static';

  hoopr = new Sprite(hx+57, hy, 8, 38);
  hoopr.rotation = 13;
  hoopr.collider = 'static';

  hoopl.color = color(227, 19, 102);
  hoopl.stroke = color(255, 220, 250);
  hoopr.color = color(227, 19, 102);
  hoopr.stroke = color(255,220,250);

}

async function sendScore() {
    try {
        const docRef = await addDoc(dbRef, {
          uname: playerName,
          score: fscore,
          shots: fshots
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

async function getScores() {
    hiScores = [];
  
    const querySnapshot = await getDocs(
      query(dbRef, orderBy("score", "desc"))
    );
    querySnapshot.forEach((doc) => {
      let msgData = doc.data();
      hiScores.push(msgData);
    });
  
    console.log(hiScores);
    //render(view(), document.body);
  }
  
function displayScores(){
  textAlign(RIGHT);
  textSize(20);
  text("HIGH SCORES", cW - 20, 30);
  text("Name\tScore\tShots", cW - 20, 50);
  let yVal = 55;
  hiScores.forEach(ele => {
    text(ele.uname + '\t\t\t\t' + ele.score + '\t\t\t\t' + ele.shots, cW - 30, yVal += 20);
    
  });
}

function startGame(){
  
  startTime = millis();
  gameState = 2;

}

function setupGame(){
  // INPUT START SCREEN
  shots = 0;
  score = 0;
  ended = false;
  gameState = 0;

  input = createInput();
  input.position(cW/2 - 135, cH - 200);
  input.style('height', '60px');

  button = createButton('start');
  button.position(input.x + input.width, cH - 200);
  button.style('height', '60px');
  button.style('width','100px');
  button.style('font-size', '20px');
  button.mousePressed(countdown);

  greeting = createElement('h2', 'what is your name?');
  greeting.style('text-align','center');
  greeting.style('display', 'block');
  greeting.style('font-family','Verdana, Arial, sans-serif');
  greeting.position(cW/2 - 130, cH/2 + 100);
  noLoop();
}

function countdown() {
  gameState = 1;

  //save player name
  console.log(input.value());
  playerName = input.value();

  //remove start screen overlay
  input.remove();
  greeting.remove();
  button.remove();

  countStart = millis();
  loop();

}