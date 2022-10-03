let game;

  function myCanvas() {
    let c = document.getElementById("gameArea");
    let context = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    game = new Game({context, width: c.width, height: c.height});
    game.startGame();
  }

  //alegem o valoare aleatoare dintre doua nr date
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

class Game {
    context;
    width;
    height;
    player;
    images = [];
    gameSpeed = 30;
    score = 0;

    constructor({context,width,height}) {
        this.context = context;
        this.width = width;
        this.height = height;
    }

    startGame() {
        this.spawnPlayer();
        this.spawnGifts();

        setInterval(() => {
            this.context.clearRect(0,0,window.innerWidth,window.innerHeight);
            this.moveGifts();
            this.player.draw();
            this.updateScore();

        }, this.gameSpeed);
    }

    spawnPlayer() {
        this.player = new Player({context : this.context, imgPath : "sac.png"});
        this.player.setY = window.innerHeight - this.player.getHeight;
        this.player.setSpeed = 50;
    }

    spawnGifts() {
        for (let index = 0; index < getRandomInt(1,15); index++) {
          let random = getRandomInt(5,15);
          let t = new Gifts({
              context : this.context, 
              speed : (Math.round(random / 10) * 10) / 2,
              imgPath : getRandomInt(1,5)+".png"
          });
  
          t.setX = Math.round(getRandomInt(0,window.innerWidth - t.getWidth)/50)*50;
          t.setY = getRandomInt(-300,0);
          this.images.push(t);
        }
    }
  
 
    moveGifts() {
        if(this.images.length === 0) {
          this.spawnGifts();
        }
        
        this.images.forEach((element) => {
            element.moveY(1);
  
            if(element.getY > window.innerHeight + element.getHeight) {
              this.images.splice(this.images.indexOf(element),1);
            }
  
            if (this.player.collides(element)) {
              this.images.splice(this.images.indexOf(element),1);
              this.score++;
            }
        });
      }
  
    checkKey(e) {
        if (e.key === 'ArrowLeft') {
          this.player.moveX(-1);
        }
        else if (e.key === 'ArrowRight') {
          this.player.moveX(1);
        }

        if(this.player.getX > window.innerWidth - this.player.getWidth) {
          this.player.moveX(-1);
        } else if(this.player.getX < 0) {
          this.player.moveX(1);
        }
     }

     updateScore() {
         this.context.font = "100px myFirstFont1";
         let txt ="Ai prins " + this.score + " cadouri!";
         this.context.fillStyle = "#fff";

         this.context.fillText(txt, (this.width / 2) - (this.context.measureText(txt).width / 2), 90);
     }
}

class MoveableObject {
    context;
    x;
    y;
    w;
    h;
    imgPath;
    speed;
    img;

    constructor({context, x = 0, y = 0, w = 100, h = 100, speed = 1, imgPath}) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.imgPath = imgPath;
        this.w = w;
        this.h = h;
        this.speed = speed;
        this.loadImage();
    }
    
    set setX(x) {
        this.x = x;
    }

    set setY(y) {
        this.y = y;
    }

    get getX() {
        return this.x;
    }

    get getY() {
        return this.y;
    }

    set setSpeed(speed) {
        this.speed = speed;
    }

    get getHeight() {
        return this.h;
    }

    get getWidth() {
        return this.w;
    }

    loadImage() {
        let img = new Image();
        img.src = this.imgPath;
        this.img = img;
    }

    draw() {
        this.context.drawImage(this.img,this.x,this.y,this.w,this.h);
    }

    moveX(x) {
        this.x += this.speed * x;
        this.draw();
    }

    moveY(y) {
        this.y += this.speed * y;
        this.draw();
    }

    collides(obj) {
       if(((this.getWidth + this.getX) === (obj.getWidth + obj.getX)) 
       && (this.getHeight + this.getY) >= (obj.getHeight - obj.getY) 
       && this.getY <= (obj.getY + obj.getHeight)) {
            return true;
       }
       return false;
   }
}

class Gifts extends MoveableObject {

}


class Player extends MoveableObject {
  
}


window.onload = () => {
    myCanvas();
    window.addEventListener("keydown", function(event) {
        game.checkKey(event);
    }, true);
};