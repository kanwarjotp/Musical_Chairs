// making the chair
class Chair {
  constructor(game) {
    // creating chair object
    this.size = 20;

    this.maxSpeed = 20;
    this.xSpeed = 0;
    this.ySpeed = 0;

    //setting the position of the chair at bottom left
    this.position = {
      x: 10,
      y: 130
    };
  }

  draw(ctx) {
    ctx.fillStyle= "#c4ff57";
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    ctx.drawImage(
      imgChair,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  moveLeft() {
;
    this.xSpeed = -this.maxSpeed;
  }

  moveRight() {
    this.xSpeed = this.maxSpeed;
  }

  moveUp() {
    this.ySpeed = -this.maxSpeed;
  }

  moveDown() {
    this.ySpeed = this.maxSpeed;
  }

  update() {
    this.position.x += this.xSpeed; // horizontal movement
    this.position.y += this.ySpeed; // vertical movement
    this.xSpeed = 0; // reseting the speed for the next input
    this.ySpeed = 0;

    if (this.position.x < 10) {
      //when the chair hits the left
      this.position.x = 10;
    }
    if (this.position.y < 10) {
      // when chair hits the top
      this.position.y = 10;
    }
    if (this.position.x > 270) {
      // when chair hits the right
      this.position.x = 270;
    }
    if (this.position.y > 130) {
      //when chair hits the bottom
      this.position.y = 130;
    }
  }
}

// addding input functionality
class InputHandler {
  constructor(chair, game) {
    document.addEventListener("keydown", event => {
      //spacebar is key code 32
      switch (event.keyCode) {
        case 37:
          chair.moveLeft();
          break;
        case 39:
          chair.moveRight();
          break;
        case 38:
          chair.moveUp();
          break;
        case 40:
          chair.moveDown();
          break;
        case 27:
          game.togglePause();
          break;
      }
    });
  }
}

//creating the music element
class Music {
  constructor(game) {
    this.width = 20;
    this.height = 20;
    this.image = document.getElementById("music-img");
    this.position = { x: 270, y: 130 };
    this.size = 20;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update() {
    //collission with goal
    let frontOfMusic = this.position.x;
    let bottomOfMusic = this.position.y + this.size / 2;
    let frontOfChair = game.chair.position.x;
    let bottomOfChair = game.chair.position.y + game.chair.size / 2;

    if (frontOfMusic == frontOfChair) {
      if (bottomOfMusic == bottomOfChair) {
        console.log("Success- S/S"); // success
        game.gameState = GAMESTATE.SUCCESS;
      }
    }
  }
}

//creating fire class
class Fire {
  constructor(pos_x, pos_y, dir, speed, game) {
    this.position = { x: pos_x, y: pos_y };
    this.size = 20;
    this.maxSpeed = 10;
    this.speed = speed;
    this.dir = dir;
  }

  draw(ctx) {
    ctx.drawImage(
      imgFire,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }

  update() {
    //detetcting direction
    if (this.dir == "x") {
      this.position.x -= this.speed;
    }
    if (this.dir == "y") {
      this.position.y += this.speed;
    }
    //collision with walls
    if (this.position.x == -10) {
      //the fire hits the left margin
      this.speed = -this.speed;
    }
    if (this.position.x == 280) {
      //the fire hits the right margin
      this.speed = -this.speed;
    }
    if (this.position.y == -10) {
      //top
      this.speed = -this.speed;
    }
    if (this.position.y == 140) {
      //bottom
      this.speed = -this.speed;
    }

    //collisions with chair
    let frontOfFire = this.position.x;
    let bottomOfFire = this.position.y + this.size / 2;
    let frontOfChair = game.chair.position.x;
    let bottomOfChair = game.chair.position.y + game.chair.size / 2;
    if (frontOfFire == frontOfChair) {
      if (bottomOfFire == bottomOfChair) {
        console.log("Collision F/F"); // collision
        game.gameState = GAMESTATE.GAMEOVER;
      }
    }
  }
}
//insatiating game Class
class Game {
  //managing the game.
  constructor(gameHeight, gameWidth) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
  }

  start() {
    //SETTING THE GAMESTATE
    this.gameState = GAMESTATE.RUNNING;

    //instantiating chair
    this.chair = new Chair(this);

    //instantiating inputhandler
    new InputHandler(this.chair, this);

    //instantiating music
    this.music = new Music();

    //instantiating fire
    //horizontal
    this.fire = new Fire(90, 10, "x", 1, this);
    this.fire2 = new Fire(20, 50, "x", 2, this);
    this.fire3 = new Fire(10, 90, "x", 5, this);
    this.fire8 = new Fire(250, 130, "x", 1, this);
    //verticla fire
    this.fire4 = new Fire(30, 10, "y", 1, this);
    this.fire5 = new Fire(70, 90, "y", 5, this);
    this.fire6 = new Fire(110, 30, "y", 2, this);
    this.fire7 = new Fire(190, 50, "y", 1, this);

    //this.testFire = new Fire(10, 90, "x", 0, this);
  }

  update() {
    //checking gamestate
    if (this.gameState == GAMESTATE.PAUSED) {
      return;
      //nothing is updated;
    }

    //COLLISION
    if (this.gameState == GAMESTATE.GAMEOVER) {
      pause();
      return;
    }

    //SUCCESS
    if (this.gameState == GAMESTATE.SUCCESS) {
      pause();
      return;
    }

    this.chair.update();
    this.music.update();

    //horizontal fire
    this.fire.update();
    this.fire2.update();
    this.fire3.update();
    this.fire8.update();

    //vertical fire
    this.fire4.update();
    this.fire5.update();
    this.fire6.update();
    this.fire7.update();

    // this.testFire.update();
  }

  draw(ctx) {
    ctx.fillStyle = "#c4ff57";
    ctx.fillRect(0, 0, game.gameWidth, game.gameHeight);
    
    this.chair.draw(ctx);
    this.music.draw(ctx);

    //horizontal fire
    this.fire.draw(ctx);
    this.fire2.draw(ctx);
    this.fire3.draw(ctx);
    this.fire8.draw(ctx);

    //vertical fire
    this.fire4.draw(ctx);
    this.fire5.draw(ctx);
    this.fire6.draw(ctx);
    this.fire7.draw(ctx);

    // this.testFire.draw(ctx);

    //PAUSE SCREEN
    if (this.gameState == GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,100,0,0.5)";
      ctx.fill();

      ctx.font = "15px Papyrus";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Paused", 150, 70);
    }

    //GAMEOVER
    if (this.gameState == GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(100,0,0,0.5)";
      ctx.fill();

      ctx.font = "15px Papyrus";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Game\nOver", 150, 70);
    }

    //SUCCESS
    if (this.gameState == GAMESTATE.SUCCESS) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,100,0.5)";
      ctx.fill();

      ctx.font = "15px Papyrus";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Congratulations,", 150, 70);
      ctx.fillText("Alice made it to the music Successfully.", 150, 90);
    }
  }

  togglePause() {
    if (this.gameState == GAMESTATE.PAUSED) {
      play();
      this.gameState = GAMESTATE.RUNNING;
    } else {
      pause();
      this.gameState = GAMESTATE.PAUSED;
    }
  }
}

//main js
//game states
const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  SUCCESS: 4
};

//preventing scrolling through arrow keys, so you don't start cursin at the screen while controlling the chair!!
window.addEventListener(
  "keydown",
  function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  },
  false
);

let canvas = document.getElementById("gameScreen"); //creating the canvas
let ctx = canvas.getContext("2d"); //using a 2d context for drawing on the canvas

//creating the chair
let imgChair = document.getElementById("chair-img");
let imgFire = document.getElementById("fire-img");

const CANVAS_HEIGHT = 450;
const CANVAS_WIDTH = 800;

// ctx.fillStyle = "#f00"; //filling the rectangles with red color
// ctx.fillRect(10, 10, 15, 15); //creating a rect

//instatntiaitng game
let game = new Game(CANVAS_HEIGHT, CANVAS_WIDTH);
game.start();

let lastTime = 0; // setting the start time

function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  ctx.clearRect(0, 0, CANVAS_HEIGHT, CANVAS_WIDTH);

  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

//footer
function copy() {
  var copyText = document.getElementById("share");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied to Clipboard " + copyText.value);
}

var myMusic = document.getElementById("back-music");
function play() {
  myMusic.play();
}

function pause() {
  myMusic.pause();
}

//controls code for button
function downButton(){
  game.chair.moveDown();
}

function upButton(){
  game.chair.moveUp();
}

function rightButton(){
  game.chair.moveRight();
}

function leftButton(){
  game.chair.moveLeft();
}