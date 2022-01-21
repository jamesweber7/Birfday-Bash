class CollisionObject extends LevelObject {
  
  constructor(img, left, top, right, bottom, tiled) {
    super(img, left, top, right, bottom, tiled);
  }
  
  interact(pl) {
    
    if (super.isInteracting(pl)) {
      
      if (super.findVerticalOverlap(pl) == "top") {
        pl.ground(this.top);

      } else if (super.findVerticalOverlap(pl) == "bottom") {
        pl.setTop(this.bottom);

        pl.moveY = 0;
        playStepSound();

      } else if (super.findHorizontalOverlap(pl) == "left") {
        pl.setRight(this.left);

      } else if (super.findHorizontalOverlap(pl) == "right") {
        pl.setLeft(this.right);
        
      }
      
    }
    
  }
  
}