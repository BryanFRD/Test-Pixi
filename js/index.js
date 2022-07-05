import * as PIXI from 'pixi.js';

PIXI.utils.skipHello();

let gameContainer = document.querySelector("#game-container");
let app = new PIXI.Application({backgroundColor: 0x123456, resizeTo: window});

gameContainer.appendChild(app.view);

let player = PIXI.Sprite.from('img/sample.png');
let bullets = new PIXI.Container();

{
  player.anchor.set(0.5);
  player.speed = 10;
  player.dirX = 0;
  player.dirY = 0;
  player.x = app.view.width / 2;
  player.y = app.view.height / 2;
  player.lookAt = new PIXI.Point(app.view.width / 2, 0);
};

app.stage.addChild(player);
app.stage.addChild(bullets);

app.ticker.add(gameLoop);

function gameLoop(delta) {
  player.x += player.dirX * player.speed * delta;
  player.y += player.dirY * player.speed * delta;
  
  let pointerPos = player.lookAt;
  let dir = -Math.atan2(player.x - pointerPos.x, player.y - pointerPos.y);
  player.rotation = dir;
}

app.ticker.add(updateBullets);

function updateBullets(delta) {
  for (let bullet of bullets.children) {
    bullet.x += Math.cos(bullet.direction) * bullet.speed * delta;
    bullet.y += Math.sin(bullet.direction) * bullet.speed * delta;
    
    if(Math.sqrt(Math.pow(bullet.x - bullet.startX, 2) + Math.pow(bullet.y - bullet.startY, 2)) >= bullet.maxRange){
      bullets.removeChild(bullet);
    }
  }
}

const left = keyboard('q'),
  right = keyboard('d'),
  up = keyboard('z'),
  down = keyboard('s'),
  test = keyboard('t');
  
test.press = () => {
  console.log(bullets.children);
};

left.press = () => {
  player.dirX = -1;
};
  
left.release = () => {
  player.dirX = right.isDown ? 1 : 0;
};
  
right.press = () => {
  player.dirX = 1;
};

right.release = () => {
  player.dirX = left.isDown ? -1 : 0;
};

up.press = () => {
  player.dirY = -1;
};

up.release = () => {
  player.dirY = down.isDown ? 1 : 0;
};

down.press = () => {
  player.dirY = 1;
};

down.release = () => {
  player.dirY = up.isDown ? -1 : 0;
};
  
function keyboard(value) {
  const key = {
    value: value,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined
  };
  key.downHandler = (event) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };
  key.upHandler = (event) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };
  
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener('keydown', downListener, false);
  window.addEventListener('keyup', upListener, false);
  
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };
  
  return key;
}

app.stage.interactive = true;
app.stage.on('pointermove', changePlayerDirection);

gameContainer.addEventListener('pointerdown', fire);

function changePlayerDirection(event) {
  player.lookAt = event.data.global;
}

function fire(event) {
  let bullet = createBullet(player.x, player.y, player.lookAt);
  
  bullets.addChild(bullet);
}

function createBullet(startX, startY, to){
  let bullet = PIXI.Sprite.from('img/sample.png');
  
  bullet.scale.set(0.15);
  bullet.anchor.set(0.5);
  bullet.speed = 10;
  bullet.maxRange = 1000;
  bullet.startX = startX;
  bullet.startY = startY;
  bullet.x = startX;
  bullet.y = startY;
  bullet.direction = Math.atan2(to.y - startY, to.x - startX);
  bullet.rotation = -Math.atan2(startX - to.x, startY - to.y);
  
  return bullet;
}