class World {
  
  constructor() {
    
    this.floor = gameHeight-20;
    this.ceil = 70;
    this.leftWall = 20;
    this.rightWall = gameWidth-20;
    
    this.boxWidth = this.rightWall - this.leftWall;
    this.boxHeight = this.floor - this.ceil;
    
    this.clouds = [];
    
    this.wipeTime = -1;
    
  }
  
  
  inBoundaries(x, y) {
    return ( x == constrain(x, this.leftBoundary, this.rightBoundary) && y == constrain(y, this.lowerBoundary, this.upperBoundary));
  }
  
  draw() {
    for (let i = 0; i < this.clouds.length; i++) {
      this.clouds[i].draw();
    }
    if (this.isScreenWiping) {
      this.screenWipe();
    }
    image(frame, 0, 0);
  }
  
  characterCloud(x, y) {
    poofSound.playOnce();
    this.addCloud(x, y, 32 + player.moveX + player.moveY, 30, 5);
  }
  
  runPoof(x, y) {
    this.addCloud(x, y + 30, 12, 10, 2);
  }
  
  addCloud(x, y, width, duration, amt) {
    this.clouds[this.clouds.length] = new Cloud(x, y, width, duration, amt, this.clouds.length);
  }
  
  removeCloud(index) {
    this.clouds.splice(index, 1);
    for (let i = index; i < this.clouds.length; i++) {
      this.clouds[i].id = i;
    }
  }
  
  wipeScreen(action) {
    this.isScreenWiping = true;
    if (this.wipeTime == -1) {
      this.wipeTime = frameCount;
    }
    this.screenWipeAction = action;
  }
  
  screenWipe() {
    
    fill(85,76,128);
    let totalTime = 90;
    let sideDecider = noise(this.wipeTime * 2000);
    let size = 2 * (totalTime * 0.5 - abs(frameCount - this.wipeTime - totalTime * 0.5 ) ) / totalTime;
    if (sideDecider > 0.75) {
      rect(this.leftWall - 1, this.ceil - 1, size * this.boxWidth + this.leftWall + 1, this.floor + 1);
    } else if (sideDecider > 0.5) {
      rect(this.rightWall - size * this.boxWidth - 1, this.ceil - 1, this.rightWall + 1, this.floor + 1);
    } else if (sideDecider > 0.25) {
      rect(this.leftWall - 1, this.ceil - 1, this.rightWall + 1, this.ceil + size * this.boxHeight + 1);
    } else {
      rect(this.leftWall - 1, this.floor - size * this.boxHeight - 1, this.rightWall + 1, this.floor + 1);
    }
    
    if (size == 1) {
      switch (this.screenWipeAction) {
          
        case "levelUp" :
          level.levelUp();
          break;
          
      }
    } else if (frameCount - this.wipeTime >= totalTime) {
      this.stopWipe();
    }
    
  }
  
  stopWipe() {
    this.wipeTime = -1;
    this.isScreenWiping = false;
  }
  
}