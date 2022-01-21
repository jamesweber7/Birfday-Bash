class Level {
  
  constructor() {
  
    this.constructButton();
    this.constructDoor();
    this.generate(0);
  }
  
  constructButton() {
    this.button = new StateObject(buttonOnImg, buttonOffImg, 100, 100, false);
    this.button.setTrueOnHit();
    this.button.setBounds(32, 32);
  }
  
  constructDoor() {
    this.door = new StateObject(doorUnlockedImg, doorLockedImg, 100, 100, false);
    this.door.setDoorProperties(this.button);
  }
  
  draw() {
    image(bgImg, 0, 0);
    
    for (let i = 0; i < this.colliders.length; i++) {
      this.colliders[i].draw();
    }
    for (let i = 0; i < this.spikes.length; i++) {
      this.spikes[i].draw();
    }
    for (let i = 0; i < this.bounces.length; i++) {
      this.bounces[i].draw();
    }
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i].draw();
    }
    
    this.button.draw();
    this.door.draw();
    
    player.draw();
    world.draw();
    image(resetIcon, 78, 16);
    image(homeIcon, 134, 16);
    image(musicIcon, 615, 22);
    image(soundIcon, 654, 18);
    image(skipIcon, 700, 17);
  }
  
  numColliders() {
    return colliders.length;
  }
  
  generate(id) {
    
    this.id = id;
    this.colliders = [];
    this.spikes = [];
    this.clouds = [];
    this.bounces = [];
    this.button.reset();
    
    switch (this.id) {
        
      case 0 :
        
        player.characterX = 70;
        player.ground(250);
        
        this.colliders[0] = new LevelObject(movementImg, 215, 340);
        this.colliders[1] = new LevelObject(levelOneInstructions, 565, 113);
        
        this.addCollider(tiles[4], world.leftWall, 250, 1, 3, true);
        this.addCollider(tiles[4], world.rightWall - 256, 250, 1, 3, true);
        
        this.addSpike(spikes[4], world.leftWall, 514);
        this.setButton(750, 248);
        this.button.setFalse();
        this.setDoor(560,220);
        
        break;
        
      case 1 :
        
        this.addCollider(tiles[4], world.leftWall, world.floor - 16, 3, 1, true);
        this.addCollider(tiles[2], 150, 420);
        this.addCollider(tiles[2], 260, 360);
        this.addCollider(tiles[2], world.leftWall, 270, 3, 1, true);
        this.addCollider(tiles[0], 148, 222, 1, 3, true);
        this.addCollider(tiles[0], 52, 156, 7, 1, true);
        this.addBounce(25,250);
        
        this.addCollider(tiles[5], 340, 258, 1, 4, true);
        
        this.setDoor(755, 480);
        this.setButton(100, 154);
        player.characterX = 70;
        player.ground(world.floor - 16);
        
        break;
        
      case 2 :
        
        this.addCollider(tiles[2], world.leftWall,130);
        this.addSpike(spikes[4],world.leftWall,world.floor - 16);
        for (let i = 1; i < 10; i++) {
          this.addFallingCollider(tiles[2], world.leftWall + 64 * i,130 + 16*i, 8);
        }
        this.addCollider(tiles[3], 660, 290);
        
        this.addCollider(tiles[2], world.leftWall, 286);
        this.addMovingCollider(tiles[3], world.leftWall + 64, 286, -2, world.leftWall + 64, 372);
        this.addSpike(spikes[0], 372, 286);
        this.addCollider(tiles[1], 372, 302);
        
        player.characterX = 50;
        player.ground(130);
        
        this.setButton(692,286);
        this.setDoor(50,258);
        
        break;
          
      case 3 :
        
        this.addCollider(tiles[2], world.leftWall,162, 1, 14, true);
        this.addCollider(tiles[3], world.leftWall + 128,162, 3, 3, true);
        this.addCollider(tiles[4], world.leftWall + 256,210, 1, 4, true);
        this.addCollider(tiles[3], world.leftWall + 128,274, 3, 3, true);
        this.addAngrySpike(world.leftWall + 64, 226, 5, world.leftWall + 64, world.leftWall + 256);
        this.addCollider(tiles[4], world.leftWall,386, 1, 3, true);
        this.addCollider(tiles[0], 180, 370);
        this.addCollider(tiles[0], 484, 370);
        this.addAngrySpike(484, 354, 5, 196, 484);
        this.addCollider(tiles[4], 340, 386, 2, 3, true);
        this.addCollider(tiles[4], world.leftWall,434, 3, 6, true);
        this.addCollider(tiles[4], 596, 338, 1, 3, true);
        this.addSpike(spikes[5], 532, 258, 2, 1, true);
        this.addCollider(tiles[2], 532, 242);
        this.addCollider(tiles[3], 596, 242, 1, 2, true);
        this.addCollider(tiles[4], 596, 66, 1, 7, true);
        this.addCollider(tiles[5],708, 178);
        this.addSpike(spikes[0], 276, 146);
        this.addSpike(spikes[0], 404, 146);
        this.addAngrySpike(532, 194, 5, 532, 708);
        
        this.setDoor(752,222);
        this.setButton(562,238);
        
        player.characterX = 50;
        player.ground(162);
        
        break;
        
      case 4 :
        
        this.addCollider(tiles[4], world.leftWall, world.floor - 16, 3, 1, true);
        
        this.addMovingCollider(tiles[2], gameWidth/2 - 48, 430, 2, world.leftWall, world.rightWall);
        
        this.addMovingCollider(tiles[3], gameWidth/2 - 96, 340, -2, world.leftWall, world.rightWall);
        
        this.addMovingCollider(tiles[3], gameWidth/2 - 96, 250, 2, world.leftWall, world.rightWall);
        
        this.addMovingCollider(tiles[2], gameWidth/2 - 48, 160, -1.65, world.leftWall + 64, world.rightWall - 64);
        
        this.addCollider(tiles[2], world.leftWall, 160);
        this.addCollider(tiles[2], world.rightWall-64, 160);
        
        player.characterX = 70;
        player.ground(world.floor - 16);
        
        this.setButton(750,156);
        this.setDoor(50, 130);
        
        this.button.addSpikeRiseAction();
        
        break;
        
      case 5 :
        
        this.addCollider(tiles[4], world.leftWall, world.ceil, 3, 1, true);
        this.addCollider(tiles[0], 30, 208, 7, 1, true);
        for (let i = 1; i < 5; i++) {
          this.addCollider(tiles[2], 52 + 164 * i, 208);
        }
        this.addCollider(tiles[3], 644, world.floor - 16);
        
        this.addBounce(652, world.floor - 32);
        this.addBouncePlatform(570, 460);
        this.addBouncePlatform(470, 415);
        this.addBouncePlatform(360, 370);
        this.addBouncePlatform(250, 325);
        this.addBouncePlatform(140, 350);
        this.addCollider(tiles[0],47,312,3,1,true);
        
        this.addSpike(spikes[7], world.leftWall, 86);

        this.setButton(738,204);
        this.setDoor(70, 280);
        
        player.characterX = 70;
        player.ground(200);
        
        break;
        
      case 6 :
        
        this.addCollider(tiles[3], world.leftWall, world.floor - 16, 3, 1, true);
        this.addCollider(tiles[3], world.rightWall - 16*8, 156);
        this.addBounce(310, world.floor - 32);
        this.addCollider(tiles[4], world.leftWall, 400);
        this.addCollider(tiles[1], 340, 320);
        this.addCollider(tiles[1], 410, 240);
        this.addCollider(tiles[3], 212, 160);
        this.addCollider(tiles[0], 196, 160, 1, 15, true);
        this.addSpike(spikes[6], world.leftWall, 416);
        this.addSpike(spikes[1], 132, 160);
        this.addSpike(spikes[1], world.leftWall, 280);
        
        this.setDoor(154, 360);
        this.setButton(750, 154);
        
        player.characterX = 70;
        player.ground(world.floor - 16);
        
        break;
        
      case 7 :
        
        this.addCollider(tiles[4], world.leftWall, world.floor - 16, 3, 1, true);
        this.addCollider(tiles[2], world.rightWall-64, 222, 1, 3, true);
        
        this.addCollider(tiles[3], 140, 430);
        this.addCollider(tiles[5], 268, 126, 1, 5, true);
        this.addCollider(tiles[0], world.leftWall, 334, 7, 1, true);
        
        this.addAngrySpike(132, 318, 2.5, 132, 268);
        
        this.addCollider(tiles[3], 140, 238);
        this.addAngrySpike(world.leftWall, 222, 2.5, world.leftWall, 140);
        this.addBounce(235, 220);
        this.addSpike(spikes[9], 204, world.ceil);
        this.addCollider(tiles[0], 188, world.ceil, 1, 2, true);
        
        this.addCollider(tiles[3], 284, 126);
        this.addCollider(tiles[2], 428, 174);
        this.addCollider(tiles[2], 508, 126, 3, 1, true);
        
        this.addCollider(tiles[5], 412, 126);
        this.addCollider(tiles[5], 492, 126);
        
        this.addAngrySpike(236, 78, 5, 236, world.rightWall);
        
        this.addCollider( tiles[4], 348, 270, 2, 1, true);
        
        this.addCollider( tiles[2], 268, 350, 6, 1, true);
        this.addCollider( tiles[2], world.rightWall - 64, 350);
        
        this.addCollider( tiles[2], 284, 430);
        this.addCollider( tiles[3], 412, 430, 3, 1, true);
        
        this.addCollider(tiles[0], 348, 334);
        this.addCollider(tiles[0], 636, 414);
        
        this.addAngrySpike(348, 238, 3, 284, world.rightWall - 64);
        this.addAngrySpike(348, 318, -3, 364, world.rightWall);
        this.addAngrySpike(348, 398, 3, 284, 636);
        
        player.characterX = 70;
        player.ground(world.floor - 16);
        
        this.setButton(750,219);
        this.setDoor(64,304);
        
        break;
        
      default :
        finishGame();
        this.setLevel(0);
        this.finishTime = frameCount;
        break;
        
    }
    this.addBoundaryColliders();
  }
  
  addCollider(img, left, top, right, bottom, tiled) {
    
    this.colliders[this.colliders.length] = new CollisionObject(img, left, top, right, bottom, tiled);
    
  }
  
  addSpike(img, left, top, right, bottom, tiled) {
    
    this.spikes[this.spikes.length] = new BadObject(img, left, top, right, bottom, tiled);
    
  }
  
  addBounce(left, top) {
    let index = this.bounces.length;
    this.bounces[index] = new LevelObject(bouncePad, left, top);
    this.bounces[index].setBouncy();
  }
  
  addBouncePlatform(bounceLeft, bounceTop) {
    this.addBounce(bounceLeft,bounceTop);
    this.addCollider(tiles[0], bounceLeft - 8,bounceTop + 16,3,1,true);
  }
  
  addMovingCollider(img, left, top, speed, leftBoundary, rightBoundary) {
    this.addCollider(img, left, top);
    this.colliders[this.colliders.length - 1].setMovementHorizontal(speed, leftBoundary, rightBoundary);
    
  }
  
  addMovingSpike(img, left, top, speed, leftBoundary, rightBoundary) {
    this.addSpike(img, left, top);
    this.spikes[this.spikes.length - 1].setMovementHorizontal(speed, leftBoundary, rightBoundary);
    
  }
  
  addAngrySpike(left, top, speed, leftBoundary, rightBoundary) {
    let imgIndex = speed < 0 ? 15 : 16;
    this.addSpike(spikes[imgIndex], left, top);
    this.spikes[this.spikes.length - 1].setMovementHorizontal(speed, leftBoundary, rightBoundary);
    this.spikes[this.spikes.length - 1].setMovementImages(spikes[15], spikes[16]);
  }
  
  addMovingSpikeyCollider(speed, left, top) {
    
    this.addMovingCollider(tiles[2], left + 16, top, speed, world.leftWall + 16, world.rightWall - 16);
    
    this.addMovingSpike(spikes[10], left, top, speed, world.leftWall, world.rightWall - 80);
    
    this.addMovingSpike(spikes[11], left + 80, top, speed, world.leftWall + 80, world.rightWall);
    
  }
  
  addSpikeVerticalMover(img, left, startTop, speed, topEnd) {
    this.addSpike(img, left, startTop);
    this.spikes[this.spikes.length - 1].setMovementVertical(speed, topEnd);
  }
  
  addFallingCollider(img, left, top, speed) {
    this.addCollider(img, left, top);
    this.colliders[this.colliders.length - 1].setFallingAction(speed);
  }
  
  addBoundaryColliders() {
    
    this.addCollider(null, 0, 0, world.leftWall, gameHeight);
    this.addCollider(null, 0, 0, gameWidth, world.ceil);
    this.addCollider(null, world.rightWall, 0, gameWidth, gameHeight);
    this.addSpike(null, -gameWidth*0.2, gameHeight*1.4, gameWidth*1.3, gameHeight*1.6);
  }
  
  checkCollisions(pl) {
    
    for (let i = 0; i < this.colliders.length; i++) {
      
      this.colliders[i].interact(pl);
      
    }
    
  }
  
  checkSpikes(pl) {
    
    for (let i = 0; i < this.spikes.length; i++) {
      
      this.spikes[i].interact(pl);
      
    }
    
  }
  
  checkBounces(pl) {
    
    for (let i = 0; i < this.bounces.length; i++) {
      
      this.bounces[i].interact(pl);
      
    }
    
  }
  
  setButton(x, y) {
    this.button.shift(x, y);
  }
  
  setDoor(x, y) {
    this.door.shift(x, y);
  }
  
  reset() {
    stopSoundEffects();
    stopScreenShake();
    this.setLevel(this.id);
  }
  
  levelUp() {
    this.setLevel(this.id + 1);
  }
  
  setLevel(levelId) {
    this.generate(levelId);
    player.reset();
  }
  
}