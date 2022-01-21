class StateObject extends LevelObject {
    
  constructor(trueImg, falseImg, left, top, state) {
    super(falseImg, left, top);
    this.trueImg = trueImg;
    this.falseImg = falseImg;
    this.state = state;
    if (this.state) {
      this.image = this.trueImg;
    }
    this.drawX = left;
    this.drawY = top;
  }
  
  draw() {
    this.interact();
    image(this.image, this.drawX, this.drawY);
  }
  
  interact() {
    
    let interaction = super.isInteracting(player);
    if (this.trueOnHit) {
      if (interaction) {
        this.setTrue();
      }
    } else if (this.trueWhileHit) {
      if (interaction) {
        this.setTrue();
      } else {
        this.setFalse();
      }
    } else if (this.doorProperties) {
      if (level.button.state) {
        this.setTrue();
        if (interaction) {
          if (!world.isScreenWiping) {
            victorySound.playOnce();
          }
          player.jump();
          world.wipeScreen("levelUp");
        }
      } else {
        this.setFalse();
      }
    }
    
  }
  
  setTrue() {
    if (!this.state) {
      if (this === level.button) {
        victorySound.playOnce();
      }
      this.state = true;
      this.image = this.trueImg;
      if (this.hasAction) {
        this.act();
      }
    }
  }
  
  setFalse() {
    if (this.state) {
      this.state = false;
      this.image = this.falseImg;
    }
  }
  
  setTrueOnHit() {
    this.trueOnHit = true;
  }
  
  setTrueWhileHit() {
    this.trueWhileHit = true;
  }
  
  setDoorProperties() {
    this.doorProperties = true;
  }
  
  setBounds(width, height) {
    let centX = this.centerX();
    let centY = this.centerY();
    
    this.left = centX - width * 0.5;
    this.right = centX + width * 0.5;
    
    this.top = centY - height * 0.5;
    this.bottom = centY + height * 0.5;
    
    this.width = width;
    this.height = height;
  }
  
  shift(x, y) {
    this.shiftX(x);
    this.shiftY(y);
    
  }
  
  shiftX(x) {
    this.left = x - this.width * 0.5;
    this.right = x + this.width * 0.5;
    this.drawX = x - this.imgWidth * 0.5;
    
  }
  
  shiftY(y) {
    this.top = y - this.height * 0.5;
    this.bottom = y + this.height * 0.5;
    this.drawY = y - this.imgHeight * 0.5;
    
  }
  
  addAction(action) {
    this.action = action;
    this.hasAction = true;
  }
  
  reset() {
    this.setFalse();
    this.action = null;
    this.hasAction = false;
  }
  
  addSpikeRiseAction() {
    this.addAction("spikeRise")
  }
  
  act() {
    switch (this.action) {
        
      case "spikeRise" :
        level.addSpikeVerticalMover(spikes[12], world.leftWall, world.floor, -7, 220);
        break;
        
    }
  }
  
}