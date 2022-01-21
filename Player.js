class Player  {
  
  constructor() {
    
    this.characterWidth = 50;
    this.characterHeight = 64;
    
    this.hitBoxLeftOffset = 16;
    this.hitBoxRightOffset = 16;
    this.hitBoxTopOffset = 16;
    this.hitBoxBottomOffset = 32;
    
    this.horizontalSpeed = 7;
    this.hitJumpSp = 12;
    
    this.jumpSpeed = 7;
    this.jumpGravityOffset = 0.4;
    
    this.assignAnimations();
    
    this.characterX = gameWidth*0.5;
    
    this.resetMechanics();
    
    this.ground(world.floor);
    
  }
  
  assignAnimations() {
    
    this.animFilePath = "zassets/sprites/playerSprites/";
    
    this.idleAnim = [];
    this.IDLE_ANIM_LENGTH = 59;
    this.IDLE_ANIM_TIME_DILATION = 4;
    
    this.runningLeftAnim = [];
    this.runningRightAnim = [];
    this.RUNNING_ANIM_LENGTH = 8;
    this.RUNNING_ANIM_TIME_DILATION = 2;
    
    this.jumpingStraightUpAnim = [];
    this.JUMPING_STRAIGHT_UP_ANIM_LENGTH = 7;
    
    this.jumpingLeftAnim = [];
    this.jumpingRightAnim = [];
    this.JUMPING_SIDE_ANIM_LENGTH = 8;
    
    this.hitLeftAnim = [];
    this.hitRightAnim = [];
    this.HIT_ANIM_LENGTH = 4;
    this.HIT_ANIM_TIME_DILATION = 5.5;
    
    this.animIndex = 0;
    this.assignIdleAnim();
    
    this.animTimeDilation = this.IDLE_ANIM_TIME_DILATION;
    
    for (let i = 0; i < this.IDLE_ANIM_LENGTH; i++) {
      
      this.idleAnim[i] = loadImage(this.animFilePath + "birfdayKidIdle" + (i + 1) + ".png");
    }

    for (let i = 0; i < this.RUNNING_ANIM_LENGTH; i++) {
      this.runningLeftAnim[i] = loadImage(this.animFilePath + "birfdayKidLeft" + (i + 1) + ".png");
      this.runningRightAnim[i] = loadImage(this.animFilePath + "birfdayKidRight" + (i + 1) + ".png");
    }
    
    for (let i = 0; i < this.JUMPING_STRAIGHT_UP_ANIM_LENGTH; i++) {
      this.jumpingStraightUpAnim[i] = loadImage(this.animFilePath + "birfdayKidJumpingStraightUp" + (i + 1) + ".png");
    }
    
    for (let i = 0; i < this.JUMPING_SIDE_ANIM_LENGTH; i++) {
      this.jumpingLeftAnim[i] = loadImage(this.animFilePath + "birfdayKidJumpingLeft" + (i + 1) + ".png");
      this.jumpingRightAnim[i] = loadImage(this.animFilePath + "birfdayKidJumpingRight" + (i + 1) + ".png");
    }
    
    for (let i = 0; i < this.HIT_ANIM_LENGTH; i++) {
      this.hitLeftAnim[i] = loadImage(this.animFilePath + "birfdayKidHitLeft" + (i + 1) + ".png");
      this.hitRightAnim[i] = loadImage(this.animFilePath + "birfdayKidHitRight" + (i + 1) + ".png");
    }
    
  }
  
  move() {
    
    if (this.isLaunching && this.moveY >= 0) {
      this.stopJump();
    }

    if (this.isLaunching) {
      this.moveY += physics.gravity*this.jumpGravityOffset;
    } else {
      this.moveY += physics.gravity;
    }
    if (this.moveY != 0) {
      this.isGrounded = false;
    }
    
    this.characterX += this.moveX;    
    this.characterY += this.moveY;
    
    level.checkCollisions(this);
    level.checkSpikes(this);
    level.checkBounces(this);
    
  }
  
  ground(floorY) {
    if (this.moveY > physics.gravity) {
      playStepSound();
    }
    this.characterY = floorY - this.hitBoxBottomOffset;
    this.moveY = 0;
    this.isGrounded = true;
    if (this.isBouncing) {
      this.checkUnmove();
      this.isBouncing = false;
    }
  }
  
  feetY() {
    return this.characterY + this.characterHeight / 2;
  }
  
  draw() {
    this.move();
    image(this.stateMachineImage(), this.characterX-this.characterWidth*0.5, this.characterY-this.characterHeight*0.5);
  }
  
  stateMachineImage() {
    
    if (this.isHit) {
      
      this.assignHitAnim();
      this.animIndex += 1 / this.animTimeDilation;
      if (this.animIndex >= this.animLength) {
        this.createCloud();
        level.reset();
        this.animIndex = this.animLength - 1;
      }
      
    } else if (this.moveY != 0) {
      
      if (this.moveX != 0) {
        
        if (this.moveX < 0) {
          this.assignLeftJumpAnim();
        } else {
          this.assignRightJumpAnim();
        }
        
        this.assignFlyingIndex(8, 4);
        
      } else {
        
        this.assignStraightJumpAnim();
        this.assignFlyingIndex(7, 4);
        
      }
      
    } else {
      
      if (this.moveX != 0) {
        
        if (this.moveX < 0) {
          this.assignLeftRunAnim();
        } else {
          this.assignRightRunAnim();
        }
        
      } else {
        
        this.assignIdleAnim();
        
      }
      
      this.animIndex += 1 / this.animTimeDilation;
      if (this.animIndex >= this.animLength) {
        this.animIndex = 0;
      }
      
    }
    
    if ( this.isGrounded && this.moveX != 0 ) {
      playStepSound();
      world.runPoof(this.characterX, this.characterY);
    }
    
    return this.anim[floor(this.animIndex)];
    
  }
  
  assignFlyingIndex(frames, peak) {
    
    if (this.isLaunching) {
      this.animIndex = 0;
    } else {

      if (this.moveY > 0) {
        let eq = (peak) + (frames - peak) * (this.moveY / 12) - 0.5;
        this.animIndex = ceil(eq);
        
      } else {
        let eq = (peak + 1) + (peak - 0.5) * (this.moveY / 12) - 0.5;
        this.animIndex = floor(eq);
        
      }
      
      this.animIndex = constrain(this.animIndex, 1, frames - 1);
      
    }    
    
  }
  
  assignHitAnim() {
    
    if (this.moveX < 0) {
      this.anim = this.hitLeftAnim;
    } else {
      this.anim = this.hitRightAnim;
    }
    this.animLength = this.HIT_ANIM_LENGTH;
    this.animTimeDilation = this.HIT_ANIM_TIME_DILATION;
    
  }
  
  assignLeftJumpAnim() {
    
    this.anim = this.jumpingLeftAnim;
    this.animLength = this.JUMPING_SIDE_ANIM_LENGTH;
    this.animTimeDilation = this.JUMPING_SIDE_ANIM_TIME_DILATION;
    
  }
  
  assignRightJumpAnim() {
    
    this.anim = this.jumpingRightAnim;
    this.animLength = this.JUMPING_SIDE_ANIM_LENGTH;
    this.animTimeDilation = this.JUMPING_SIDE_ANIM_TIME_DILATION;
    
  }
  
  assignStraightJumpAnim() {
    
    this.anim = this.jumpingStraightUpAnim;
    this.animLength = this.JUMPING_STRAIGHT_UP_ANIM_LENGTH;
    this.animTimeDilation = this.JUMPING_SIDE_ANIM_TIME_DILATION;
    
  }
  
  assignLeftRunAnim() {
    
    this.anim = this.runningLeftAnim;
    this.animLength = this.RUNNING_ANIM_LENGTH;
    this.animTimeDilation = this.RUNNING_ANIM_TIME_DILATION;
    
  }
  
  assignRightRunAnim() {
    
    this.anim = this.runningRightAnim;
    this.animLength = this.RUNNING_ANIM_LENGTH;
    this.animTimeDilation = this.RUNNING_ANIM_TIME_DILATION;
    
  }
  
  assignIdleAnim() {
    
    this.anim = this.idleAnim;
    this.animLength = this.IDLE_ANIM_LENGTH;
    this.animTimeDilation = this.IDLE_ANIM_TIME_DILATION;
    
  }
  
  assignHitAnim() {
    
    if (this.moveX < 0) {
      this.anim = this.hitLeftAnim;
    } else {
      this.anim = this.hitRightAnim;
    }
    this.animLength = this.HIT_ANIM_LENGTH;
    this.animTimeDilation = this.HIT_ANIM_TIME_DILATION;
    
  }
  
  moveLeft() {
    this.moveX = -this.horizontalSpeed;
    
  }
  
  moveRight() {
    this.moveX = this.horizontalSpeed;
    
  }
  
  checkUnmove() {
    if (keyIsDown(rightKey)) {
      this.moveRight()
    } else if (keyIsDown(leftKey)) {
      this.moveLeft();
    } else {
      this.unmove();
    }
  }
  
  unmove() {
    this.moveX = 0;
    
  }
  
  unMoveLeft() {
    if (keyIsDown(rightKey)) {
      this.moveRight()
    } else {
      this.unmove();
    }
  }
  
  unMoveRight() {
    if (keyIsDown(leftKey)) {
      this.moveLeft();
    } else {
      this.unmove();
    }
  }
  
  jump() {
    if (this.isGrounded) {
      jumpSound.playOnce();
      this.isLaunching = true;
      this.moveY = -this.jumpSpeed;
    }
  }
  
  stopJump() {
    this.isLaunching = false;
  }
  
  hit(collisionX, collisionY) {
    
    if (!this.isHit) {
      this.animIndex = 0;
    }
    
    this.isHit = true;
    
    this.bounce(collisionX, collisionY);
    
  }
  
  bounce(collisionX, collisionY) {
    let theta;
    if (dist(this.characterX, this.characterY, collisionX, collisionY) < 75) {
      theta = atan((this.characterY-collisionY)/(this.characterX-collisionX));
    } else {
      theta = atan((this.characterY-collisionY)/random(-70,70));
    }
    if (this.characterX < collisionX) {
      theta -= PI;
    }
    this.isBouncing = true;
    this.moveX = this.hitJumpSp*cos(theta);
    this.moveY = this.hitJumpSp*sin(theta);
  }
  
  hitBoxLeft() { 
    return this.characterX - this.hitBoxLeftOffset;
  }

  hitBoxRight() { 
    return this.characterX + this.hitBoxRightOffset;
  } 

  hitBoxTop() { 
    return this.characterY - this.hitBoxTopOffset;
  }

  hitBoxBottom() { 
    return this.characterY + this.hitBoxBottomOffset;
  }
  
  
  setLeft(left) {
    this.characterX = left + this.hitBoxLeftOffset;
  }
  
  setRight(right) {
    this.characterX = right - this.hitBoxRightOffset;
  }
  
  setTop(top) {
    this.characterY = top + this.hitBoxTopOffset;
  }
  
  setBottom(bottom) {
    this.characterY = bottom - this.hitBoxBottomOffset;
  }
  
  isMoving() {
    return  this.moveX != 0 || !this.isGrounded;
  }
  
  reset() {
    this.animIndex = 0;
    this.assignIdleAnim();
    this.resetMechanics();
  }
  
  resetMechanics() {
    this.moveX = 0;
    this.moveY = 0;
    
    this.isLaunching = false;
    this.isGrounded = true;
    this.isBouncing = false;
    
    this.isHit = false;
  }
  
  createCloud() {
    world.characterCloud(this.characterX, this.characterY);
  }
  
}
