class Cloud {
  
  constructor(x, y, width, duration, amt, id) {
    
    this.x = x;
    this.y = y;
    this.width = width;
    this.id = id;
    
    if (duration == undefined || duration == null) {
      this.duration = 10000;
    } else {
      this.duration = duration;
    }
    
    if (amt == undefined) {
      this.numPoofs = 5;
    } else {
      this.numPoofs = amt;
    }
    this.startTime = frameCount;
    
    this.poofs = [];
    for (let i = 0; i < this.numPoofs; i++) {
      this.poofs[i] = new Poof(this.x, this.y, this.width);
    }
    
  }
  
  draw() {
    
    if (this.isDying()) {
      
      if (this.isDead()) {
        world.removeCloud(this.id);
        
      } else {
        for (let i = 0; i < this.poofs.length; i++) {
          this.poofs[i].setNoRespawn();
        }
      }
    }
    
    for (let i = 0; i < this.numPoofs; i++) {
      if (this.poofs[i].requestRespawn()) {
        this.poofs[i] = new Poof(this.x, this.y, this.width);
      }
      this.poofs[i].draw();
    }
    
  }
  
  isDying() {
    return this.startTime + this.duration - 8 < frameCount;
  }
  
  isDead() {
    return this.startTime + this.duration < frameCount;
  }
  
}