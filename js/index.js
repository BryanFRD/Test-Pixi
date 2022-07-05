import * as PIXI from '../node_modules/pixi.js/dist/browser/pixi.mjs';

PIXI.utils.skipHello();

let app = new PIXI.Application({backgroundColor: 0x123456, resizeTo: window});

let gameContainer = document.querySelector("#game-container");

gameContainer.appendChild(app.view);

let player = PIXI.Sprite.from('img/sample.png');

{
  player.anchor.set(0.5);
  player.speed = 5;
  player.dirX = 0;
  player.dirY = 0;
  player.x = app.view.width / 2;
  player.y = app.view.height / 2;
};

app.stage.addChild(player);

app.ticker.add((delta) => {
  player.x += player.dirX * player.speed * delta;
  player.y += player.dirY * player.speed * delta;
});

const left = keyboard('q'),
  right = keyboard('d'),
  up = keyboard('z'),
  down = keyboard('s');

left.press = () => {
  player.dirX = -1;
};
  
left.release = () => {
  if(right.isUp){
    player.dirX = 0;
  }
};
  
right.press = () => {
  player.dirX = 1;
};

right.release = () => {
  if(left.isUp){
    player.dirX = 0;
  }
};

up.press = () => {
  player.dirY = -1;
};

up.release = () => {
  if(down.isUp){
    player.dirY = 0;
  }
};

down.press = () => {
  player.dirY = 1;
};

down.release = () => {
  if(up.isUp){
    player.dirY = 0;
  }
};
  
function keyboard(value) {
  const key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
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

app.stage.on('click', fire);

function changePlayerDirection(event) {
  let pointerPos = event.data.global;
  let dir = -Math.atan2(player.x - pointerPos.x, player.y - pointerPos.y);
  player.rotation = dir;
}

function fire(event) {
  let pointerPos = event.data.global;
  let dir = -Math.atan2(player.x - pointerPos.x, player.y - pointerPos.y);
  
  let bullet = PIXI.Sprite.from('img/sample.png');
}