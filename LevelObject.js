class LevelObject {
  
  constructor(img, left, top, right, bottom, tiled) {
    
    this.image = img;
    this.left = left;
    this.top = top;
    
    if (!hasValidInput(img)) {
       this.image = pureVoidImg;
    } else {
      this.imgWidth = img.width;
      this.imgHeight = img.height;
    }
    
    if (hasValidInput(tiled)) {
      
      this.tiled = true;
      this.tileX = right;
      this.tileY = bottom;
      this.width = this.imgWidth * this.tileX;
      this.height = this.imgHeight * this.tileY;
      this.right = this.left + this.width;
      this.bottom = this.top + this.height;
    } else if (!hasValidInput(right)) {
      
      this.tiled = false; 
      this.right = left + this.imgWidth;
      this.bottom = top + this.imgHeight;    
      this.width = this.imgWidth;
      this.height = this.imgHeight;
    } else {
      
      this.tiled = false; 
      this.right = right;
      this.bottom = bottom;
      this.width = (this.right - this.left);
      this.height = (this.bottom - this.top);
      
    }
    
  }
  
  draw() {
    
    if (this.isMoving) {
      this.move();
    }
    
    if (this.tiled) {
      this.tileImg();
    } else {
      image(this.image, this.left, this.top);
    }
    
  }
  
  move() {
    
    switch(this.movement) {
      
      case "float" :
        this.shiftBy(1*cos(this.moveTheta), 1*sin(this.moveTheta));
        if (random() > 0.995) {
          this.moveTheta = random(2*PI);
        }
        for (let i = 0; i < level.colliders.length; i++) {
          if (level.colliders[i].isInteractingBounds(this.left, this.top, this.right, this.bottom) && (this.centerX() != level.colliders[i].centerX() || this.centerY() != level.colliders[i].centerY())) {
            this.moveTheta += PI;
          }
        }
        break;
        
      case "horizontal" :
        this.shiftByX(this.moveSpeed);
        if (this.left < this.leftMovementBoundary) {
          this.moveSpeed = abs(this.moveSpeed);
          if (this.hasMovementImages) {
            this.image = this.rightImage;
          }
        } else if (this.right > this.rightMovementBoundary) {
          this.moveSpeed = -abs(this.moveSpeed);
          if (this.hasMovementImages) {
            this.image = this.leftImage;
          }
        }
        break;
      case "vertical" :
        if (this.moveSpeed > 0) {
          if (this.top >= this.movementBoundaryTop) {
            this.setStationary();
            this.shiftY(this.movementBoundaryTop + this.height * 0.5);
          }
        } else {
          // rising spikes
          createScreenShake(2, 0.5);
          spikeRiseSound.playOnce();
          if (this.top <= this.movementBoundaryTop) {
            spikeRiseSound.stop();
            this.setStationary();
            this.shiftY(this.movementBoundaryTop + this.height * 0.5);
          }
        }
        this.shiftByY(this.moveSpeed);
      case "falling" :
        if (this.isInteractingInclusive(player)) {
          this.setMovementVertical(this.moveSpeed, gameHeight * 1.7);
        }
        break;
        
    }
    
  }
  
  setMovementFloatAi() {
    this.movement = "float";
    this.moveTheta = random(2*PI);
    this.setMoving();
  }
  
  setMovementHorizontal(moveSpeed, leftMovementBoundary, rightMovementBoundary) {
    this.movement = "horizontal";
    this.moveSpeed = moveSpeed;
    this.leftMovementBoundary = leftMovementBoundary;
    this.rightMovementBoundary = rightMovementBoundary;
    this.setMoving();
  }
  
  setMovementVertical(moveSpeed, movementBoundaryTop) {
    this.movement = "vertical";
    this.moveSpeed = moveSpeed;
    this.movementBoundaryTop = movementBoundaryTop;
    this.setMoving();
  }
  
  setFallingAction(fallSpeed) {
    this.movement = "falling";
    this.moveSpeed = fallSpeed;
    this.setMoving();
    
  }
  
  setMoving() {
    this.isMoving = true;
  }
  
  setStationary() {
    this.movement = null;
    this.isMoving = false;
  }
  
  tileImg() {
    for (let i = 0; i < this.tileY; i++) {
      for (let j = 0; j < this.tileX; j++) {
        image(this.image, this.left + j * this.imgWidth, this.top + i * this.imgHeight);
      }
    }
  }
  
  drawShape() {
    rect(this.left,this.top,this.right,this.bottom);
    
  }
  
  drawOutline() {
    let border = 2;
    rect(this.left - border,this.top - border,this.right + border,this.bottom + border);
  }
  
  interact(pl) {
    
    if (this.isInteracting(pl)) {
      
      if (this.isBouncy) {
        boingSound.playOnce();
        pl.bounce(this.centerX(),this.centerY());
      }
      
    }
  }
    
  isInteracting(pl) {
    return this.isInteractingBounds(pl.hitBoxLeft(), pl.hitBoxTop(), pl.hitBoxRight(), pl.hitBoxBottom());
    
  }
  
  isInteractingBounds(objLeft, objTop, objRight, objBottom) {
    return ( this.inHorizontalBounds(objLeft, objRight) && this.inVerticalBounds(objTop, objBottom) );
  }
  
  inHorizontalBounds(objLeft, objRight) {
    
    return (objLeft < this.right && objRight > this.left);
    
  }
  
  inVerticalBounds(objTop, objBottom) {
    
    return (objTop < this.bottom && objBottom > this.top);
    
  }
  
  findHorizontalOverlap(pl) {
    
    if (this.right == constrain(this.right, pl.hitBoxLeft(), pl.hitBoxLeft() - pl.moveX)) {
      return "right";
      
    } else if (this.left == constrain(this.left, pl.hitBoxRight() - pl.moveX, pl.hitBoxRight() )) {
      return "left";
      
    }
    
  }
  
  findVerticalOverlap(pl) {
    
    if (this.top == constrain(this.top, pl.hitBoxBottom() - pl.moveY, pl.hitBoxBottom())) {
      return "top";
      
    } else if (this.bottom == constrain(this.bottom, pl.hitBoxTop(), pl.hitBoxTop() - pl.moveY )) {
      return "bottom";
      
    }
    
  }
  
  isInteractingInclusive(pl) {
    if (pl.hitBoxLeft() > this.right || pl.hitBoxRight() < this.left) {
      return false;
    }
    if (pl.hitBoxTop() > this.bottom || pl.hitBoxBottom() < this.top) {
      return false;
    }
    return true;
  }
  
  centerX() {
    return this.left + this.width*0.5;
  }
  
  centerY() {
    return this.top + this.height*0.5;
  }
  
  shiftBy(xMovement, yMovement) {
    this.shiftByX(xMovement);
    this.shiftByY(yMovement);
    
  }
  
  shiftByX(xMovement) {
    this.shiftX(this.centerX() + xMovement);
  }
  
  shiftByY(yMovement) {
    this.shiftY(this.centerY() + yMovement);
  }
  
  shift(x, y) {
    this.shiftX(x);
    this.shiftY(y);
    
  }
  
  shiftX(x) {
    this.left = x - this.width * 0.5;
    this.right = x + this.width * 0.5;
    
  }
  
  shiftY(y) {
    this.top = y - this.height * 0.5;
    this.bottom = y + this.height * 0.5;
    
  }
  
  setBouncy() {
    this.isBouncy = true;
  }
  
  setMovementImages(leftImg, rightImg) {
    this.hasMovementImages = true;
    this.leftImage = leftImg;
    this.rightImage = rightImg;
  }
  
}