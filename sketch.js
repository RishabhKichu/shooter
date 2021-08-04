var player, playerImgr, playerImgl;
var player_bullet, pbulletImg, bulletState;
var enemy, enemyImgr, enemyImgl;
var enemy_bullet, enemybulletImg, enemybulletState;
var bg, bgImage1;
var s, jumplimit1;
var playerDirection;
let ground, redEnemies, redEnemyBullets;
let pixelFont;
let level;
let m = true;
let explosionGif;
let count, count2, val;
let battleState = false;
let w1, w2;
let plat1, plat2, plat3, platImg;
let plat1C, plat2C, plat3C;

function preload() {
  pixelFont = loadFont("Fonts/pixel.otf");
  playerImgr = loadImage("Images/player_right0.png");
  playerImgl = loadImage("Images/player_left0.png");
  pbulletImg = loadImage("Images/player_bullet0.png");
  enemyImgl = loadImage("Images/enemy_left0.png");
  enemyImgr = loadImage("Images/enemy_right0.png");
  enemybulletImg = loadImage("Images/enemy_bullet0.png");
  bg = loadImage("Images/bg2.jpg");
  explosionGif = loadGif("Images/explosion.gif");
  platImg = loadImage("Images/floating_platform.png");
}

function drawBG(val) {
  image(bg, val, -25, 1700, 600);
}

function setup() {
  createCanvas(1250, 570);

  plat1 = createSprite(2650, 220, 1, 1);
  plat1C = createSprite(2650, 200, 100, 10);
  // plat1.debug = true;
  plat1.addImage(platImg);
  plat1.setCollider("rectangle", 10, 20);
  plat1.visible = false;

  plat2 = createSprite(2900, 400, 150, 15);
  plat2C = createSprite(2900, 380, 100, 10);
  // plat2.debug = true;
  plat2.setCollider("rectangle", 100, 50);
  plat2.addImage(platImg);
  plat2.visible = false;

  plat3 = createSprite(2350, 400, 150, 15);
  plat3C = createSprite(2350, 380, 100, 10);
  // plat3.debug = true;
  plat3.setCollider("rectangle", 100, 50);
  plat3.visible = false;
  plat3.addImage(platImg);

  plat1C.visible = false;
  plat2C.visible = false;
  plat3C.visible = false;

  //states
  s = "true";
  redEnemies = [];
  redEnemyBullets = [];
  level = "tutorial";
  jumplimit1 = 0;

  bulletState = "false";

  count = 0;
  val = 0;

  player = createSprite(80, 300, 20, 20);
  // player.debug = true;
  player.addImage(playerImgr);
  player.scale = 1.3;
  player.setCollider("rectangle", 0, 4, 21, 25);

  //player bullet
  player_bullet = createSprite(200, 200, 15, 15);
  player_bullet.addImage("player bullet", pbulletImg);
  player_bullet.setCollider("rectangle", 0, 0, 15, 15);
  player_bullet.visible = false;
  player_bullet.scale = 0.6;

  ground = createSprite(0, 500, 100000, 10);
  // ground.addImage("bg", bg);
  ground.visible = false;
}

function draw() {
  console.log(player.x);
  console.log();
  player.debug = true;
  background("green");
  image(bg, 0, -25, 1700, 600);

  drawBG(val);
  if (battleState === false) {
    camera.position.x = player.x;
  }

  //gravity
  player.velocityY = player.velocityY + 0.4;

  if (redEnemies[0]) {
    redEnemies.forEach((enemy) => {
      enemy.velocityY = enemy.velocityY + 0.4;
      enemy.collide(ground);
      player.collide(enemy);
      if (player_bullet.isTouching(enemy)) {
        // explosionGif.position(enemy.x, enemy.y);
        let x = enemy.x;
        let y = enemy.y;
        enemy.visible = false;
        image(explosionGif, x - 30, y - 50, 70, 70);
        ``;
        setTimeout(() => {
          enemy.destroy();
          player_bullet.x = 200;
          player_bullet.y = 200;
        }, 790);

        player_bullet.velocityX = 0;
        player_bullet.visible = false;
        bulletState = "false";
      }

      if (player.x + 50 > enemy.x) {
        enemy.x = enemy.x + 8;
      }
      if (player.x - 50 < enemy.x) {
        enemy.x = enemy.x - 8;
      }

      if (player.x + 50 < enemy.x && player.x - 50 > enemy.x) {
        bullet = createSprite(enemy.x, enemy.y, 10, 10);
        bullet.addImage(enemybulletImg);
        bullet.setCollider("rectangle", 0, 0, 15, 15);
        bullet.scale = 0.6;

        if (bullet.x > player.x) {
          bullet.velocityX = -10;
        }
        if (bullet.x < player.x) {
          bullet.velocityX = 10;
        }

        setTimeout(bullet.destroy(), 3200);
      }
    });
  }

  if (battleState === true) {
    player.collide(plat1C);
    player.collide(plat2C);
    player.collide(plat3C);
    plat1.visible = true;
    plat2.visible = true;
    plat3.visible = true;
  } else if (battleState === false) {
    plat1.visible = false;
    plat2.visible = false;
    plat3.visible = false;
  }

  //calling functions
  playermovement_and_shoot();
  tutorialLevel();
  drawSprites();
}

function playermovement_and_shoot() {
  player.collide(ground);
  if (w1 && w2) {
    player.collide(w1);
    player.collide(w2);
  }
  //right
  if (keyDown("d")) {
    player.addImage(playerImgr);
    playerDirection = "right";
    player.x = player.x + 5;

    count++;
    if (count >= 150) {
      val = player.x - 300;
      count = 0;
    }
  }
  //left
  if (keyDown("a")) {
    player.addImage(playerImgl);
    playerDirection = "left";
    player.x = player.x - 5;
  }

  //jump
  if (keyDown("space") && jumplimit1 < 10) {
    player.velocityY = -11;
    s = "true";
  }

  //shoot

  if (keyDown("w") && bulletState === "false") {
    player_bullet.x = player.x;
    player_bullet.y = player.y;
    if (playerDirection === "right") {
      // player.addImage(playerImgr);
      player_bullet.velocityX = 7;
      setTimeout(() => {
        player_bullet.x = 200;
        player_bullet.y = 200;
        player_bullet.velocityX = 0;
        player_bullet.visible = false;
        bulletState = "false";
      }, 3200);
    }
    if (playerDirection === "left") {
      // player.addImage(playerImgl);
      player_bullet.velocityX = -7;
      setTimeout(() => {
        player_bullet.x = 200;
        player_bullet.y = 200;
        player_bullet.velocityX = 0;
        player_bullet.visible = false;
        bulletState = "false";
      }, 3200);
    }

    player_bullet.visible = true;
    bulletState = "true";
  }

  //other jump stuff
  if (s === "true" && jumplimit1 < 40) {
    jumplimit1 = jumplimit1 + 1;
  }
  if (jumplimit1 === 40) {
    s = "false";
  }
  if (s === "false" && jumplimit1 != 0) {
    jumplimit1 = jumplimit1 - 1;
  }
}

function addRedEnemy(amount) {
  amount.forEach((a) => {
    let enemy = createSprite(a.x, a.y, 20, 20);
    enemy.addImage(enemyImgl);
    enemy.setCollider("rectangle", 0, 4, 21, 25);

    let enemy_bullet = createSprite(200, 200, 15, 15);
    enemy_bullet.addImage(enemybulletImg);
    enemy_bullet.setCollider("rectangle", 0, 0, 15, 15);
    enemy_bullet.scale = 0.6;
    enemy_bullet.visible = false;

    redEnemies.push(enemy);
    redEnemyBullets.push(enemy_bullet);
  });
}

function battleScene(x) {
  w1 = createSprite(x - 620, 0, 10, 10000);
  w2 = createSprite(x + 620, 0, 10, 10000);
  w1.visible = false;
  w2.visible = false;

  if (camera.position.x <= x) {
    camera.position.x = camera.position.x + 7;
    battleState = true;
  }
  // let plat1;
  if (camera.position.x === x || camera.position.x > x) {
  }
}

function tutorialLevel() {
  if (level === "tutorial") {
    let wall = createSprite(0, 300, 10, 1000);
    wall.visible = false;
    player.collide(wall);

    push();
    textFont(pixelFont);
    textSize(50);
    fill(11, 162, 23);
    text("USE AD TO MOVE AND SPACE TO JUMP!", 200, 300);
    pop();

    if (player.x > 1137) {
      if (m === true) {
        addRedEnemy([{ x: 1500, y: 300 }]);
        m = false;
      }
      push();
      textFont(pixelFont);
      textSize(50);
      fill(11, 162, 23);
      text("PRESS W TO SHOOT!", 1300, 300);
      pop();

      push();
      textFont(pixelFont);
      textSize(100);
      fill(11, 162, 23);
      text("==>", 1800, 300);
      pop();
    }

    if (player.x > 2227) {
      battleScene(2627);
    }
  }
}
