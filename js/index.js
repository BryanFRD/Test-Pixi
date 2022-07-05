import * as PIXI from '../node_modules/pixi.js/index';

let app = new PIXI.Application({width: 1080, height: 720});
let gameContainer = document.querySelector("#game-container");

gameContainer.appendChild(app.view);

let player =  PIXI.Sprite.from('img/sample.png');

app.stage.addChild(player);