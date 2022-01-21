class BadObject extends LevelObject {
  
  constructor(img, left, top, right, bottom, tiled) {
    super(img, left, top, right, bottom, tiled);
  }
  
  interact(pl) {
    
    if (super.isInteracting(pl)) {
      createScreenShake();
      hitSound.playOnce();
      pl.hit(super.centerX(),super.centerY());
    }
  }
  
}