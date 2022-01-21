class Poof {
  
  constructor(x, y, size) {
    
    this.size = random(size*.7);
    this.x = random(-this.size / 2, this.size / 2) + x;
    this.y = random(-this.size / 2, this.size / 2) + y;
    this.maxSize = random(size*.7, size);
    this.growthRate = random(size*.01,size*.04);
    this.color = color(random(100, 200));
    this.alpha = 255;
    this.changeAlph();
    this.isRespawnable = true;
  }
  
  draw() {
    this.size += this.growthRate;
    this.changeAlph();
    fill(this.color);
    circle(this.x, this.y, this.size)
  }
  
  changeAlph() {
    this.alpha = constrain(255 - 255 * (this.size / this.maxSize), 0, 255);
    this.color.setAlpha(this.alpha);
  }
  
  requestRespawn() {
    return this.isDead() && this.isRespawnable;
  }
  
  isDead() {
    return (this.alpha <= 0)
  }
  
  setNoRespawn() {
    this.isRespawnable = false;
  }
  
}