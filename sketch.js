/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

let windowIsFullscreen = false;

let titleScreen, titleText, pauseScreen, pauseScreenWasd, pauseScreenArrows, levelScreen, bgImg, frame;
let finishScreen;
let levelOneInstructions, movementImg, wasdImg, arrowImg;
let buttonOnImg, buttonOffImg;
let doorUnlockedImg, doorLockedImg;
let homeIcon, resetIcon, skipIcon, soundIcon, musicIcon, largeSoundIcon, largeMusicIcon;
let soundOnIcon, soundOffIcon, musicOnIcon, musicOffIcon, largeSoundOnIcon, largeSoundOffIcon, largeMusicOnIcon, largeMusicOffIcon;
let homeButton, levelsButton;
let onTitleScreen = true, onFinishScreen = false; paused = false, onLevelsScreen = false, arrowKeyMovement = false;
let player, level, world, physics;
let leftKey, rightKey, jumpKey1, jumpKey2, resetKey, fullscreenKey, muteKey;

let screenShakeIntensity = 0, stopScreenShakeTime = -1;

let colliderImg, pureVoidImg;
let tiles = [];
let tileTypes = [ 1, 2, 4, 8, 16, "4vertical"];
let spikes = [];
let spikeTypes = [ 1, 2, 4, 8, 760, "1inverted", "8inverted", "760inverted", "1left", "1right", "0.5left", "0.5right", "floor", "angryleft", "angryright", "bigangryleft", "bigangryright"];
let bouncePad;

let standardLoadPath = "zassets/sprites/";
let soundPath = "zassets/sounds/";

let soundEffectsOn = true, musicIsOn = true;
var boingSound, stepSound, hitSound, victorySound, jumpSound, spikeRiseSound, winPageSound, poofSound, buttonPressSound;
var stepSounds = [];

var scl;
var gameWidth = 800, gameHeight = 550;
var canvasWidth, canvasHeight;

function preload() {
  loadSprites();
  loadSounds();
}

function loadSprites() {
  titleScreen = loadImage(standardLoadPath + "TitleScreen.png");
  titleText = loadImage(standardLoadPath + "BirfdayBash.png");
  pauseScreenWasd = loadImage(standardLoadPath + "pauseScreenWasd.png");
  finishScreen = loadImage(standardLoadPath + "FinishFrame.png");
  homeButton = loadImage(standardLoadPath + "homeButtonIcon.png");
  backButton = loadImage(standardLoadPath + "backButton.png");
  levelsButton = loadImage(standardLoadPath + "lvlsButtonIcon.png");
  pauseScreenArrows = loadImage(standardLoadPath + "pauseScreenArrows.png");
  pauseScreen = pauseScreenWasd;
  levelScreen = loadImage(standardLoadPath + "levelsScreen.png");
  
  wasdImg = loadImage(standardLoadPath + "wasdMovement.png");
  arrowImg = loadImage(standardLoadPath + "arrowMovement.png");
  movementImg = wasdImg;

  levelOneInstructions = loadImage(standardLoadPath + "levelOneInstructions.png");
  
  birfdayBashText = loadImage(standardLoadPath + "BirfdayBash.png");
  
  bgImg = loadImage(standardLoadPath + "OneButtonBackgound2.png");
  frame = loadImage(standardLoadPath + "OneButtonBackgroundFrame.png");
  
  homeIcon = loadImage(standardLoadPath + "homeicon.png");
  resetIcon = loadImage(standardLoadPath + "reseticon.png");
  skipIcon = loadImage(standardLoadPath + "skipicon.png");

  soundOnIcon = loadImage(standardLoadPath + "soundOnIcon.png");
  soundOffIcon = loadImage(standardLoadPath + "soundOffIcon.png");
  musicOnIcon = loadImage(standardLoadPath + "musicOnIcon.png");
  musicOffIcon = loadImage(standardLoadPath + "musicOffIcon.png");
  soundIcon = soundOnIcon;
  musicIcon = musicOnIcon;

  largeSoundOnIcon = loadImage(standardLoadPath + "largeSoundOnIcon.png");
  largeSoundOffIcon = loadImage(standardLoadPath + "largeSoundOffIcon.png");
  largeMusicOnIcon = loadImage(standardLoadPath + "largeMusicOnIcon.png");
  largeMusicOffIcon = loadImage(standardLoadPath + "largeMusicOffIcon.png");
  largeSoundIcon = largeSoundOnIcon;
  largeMusicIcon = largeMusicOnIcon;
  
  pureVoidImg = loadImage(standardLoadPath + "pureVoid.png");
  
  buttonOnImg = loadImage(standardLoadPath + "/button/buttonOn.png");
  buttonOffImg = loadImage(standardLoadPath + "/button/buttonOff.png");
  
  doorUnlockedImg =  loadImage(standardLoadPath + "unlockedDoor.png");
  doorLockedImg =  loadImage(standardLoadPath + "lockedDoor.png");
  
  for(let i = 0; i < tileTypes.length; i++) {
    tiles[i] = loadImage(standardLoadPath + "tiles/" + tileTypes[i] + "tile.png");
  }
  
  for(let i = 0; i < spikeTypes.length; i++) {
    spikes[i] = loadImage(standardLoadPath + "tiles/" + spikeTypes[i] + "spike.png");
  }
  
  bouncePad = loadImage(standardLoadPath + "bouncePad.png");
  
  world = new World();
  physics = new Physics();
  player = new Player();  
  
}

function loadSounds() {
  boingSound = new SmartSound(soundPath + "boingSound.wav", 0.2);

  let numberOfStepSounds = 4;
  for (let i = 0; i < numberOfStepSounds; i++) {
    stepSounds[i] = new SmartSound(soundPath + "step" + (i+1) + ".wav", 0.1);
  }
  stepSound = stepSounds[0];

  hitSound = new SmartSound(soundPath + "hitSound.wav", 0.1);
  victorySound = new SmartSound(soundPath + "victorySound.wav", 0);
  victorySound.setVolume(1.5);

  jumpSound = new SmartSound(soundPath + "jumpSound.wav", 0.1);
  jumpSound.setVolume(0.75);

  spikeRiseSound = new SmartSound(soundPath + "spikeRiseSound.wav", 0.1);

  winPageSound = new SmartSound(soundPath + "winPageSound.wav");

  poofSound = new SmartSound(soundPath + "poofSound.wav", 0.05);
  poofSound.setVolume(0.5);

  buttonPressSound = new SmartSound(soundPath + "buttonPressSound.wav", 0.05);

  music = new SmartSound(soundPath + "birfdayBashMusic.wav", 90);

}

function setup() {
  
  findScaleDimensions();
  createCanvas(canvasWidth, canvasHeight);
  
  noStroke();
  rectMode(CORNERS);
  
  world = new World();
  physics = new Physics();
  level = new Level();
  assignKeys();
  
}

function draw() {
  music.playMusic();

  background(76, 40, 47);

  scale(scl);

  controlScreenShake();

  if (onFinishScreen) {
    drawFinishScreen();
  } else if (onTitleScreen) {
    drawTitleScreen();
  } else {
    level.draw();
  }
  if (paused) {
    drawPauseScreen();
  }
  if (onLevelsScreen) {
    drawLevelScreen();
  }
  
}

function windowResized() {
  findScaleDimensions();
  resizeCanvas(canvasWidth, canvasHeight);
}

function findScaleDimensions() {
  let dimensionRatio = gameWidth/gameHeight;
  canvasWidth = min(windowWidth, windowHeight*dimensionRatio);
  canvasHeight = canvasWidth / dimensionRatio;
  scl = canvasWidth / gameWidth;
}

function mouseClicked() {

  let clickX = mouseX / scl;
  let clickY = mouseY / scl;
  if (onLevelsScreen) {
    levelScreenMouseClicked(clickX, clickY);
  } else if (paused) {
    gamePausedMouseClicked(clickX, clickY);
  } else if (onTitleScreen) {
    titleScreenMouseClicked(clickX, clickY);
  } else if (onFinishScreen) {
    finishScreenMouseClicked(clickX, clickY);
  } else {
    notPausedMouseClicked(clickX, clickY);
  }
  
}

function buttonClicked() {
  buttonPressSound.play();
}

function gamePausedMouseClicked(x, y) {
  if (inRangeOfPlay(x, y)) {
    buttonClicked();
    unpause();
    onTitleScreen = false;
    level.reset();
  } 
  else if (inRangeOfLevels(x, y)) {
    buttonClicked();
    openLevels();
  } 
  else if (inRangeOfHome(x, y)) {
    buttonClicked();
    unpause();
  } 
  else if (inRangeOfControlToggle(x, y)) {
    buttonClicked();
    toggleMovement();
    drawPauseScreen();
  }
  else if (inRangeOfMusic(x, y)) {
    buttonClicked();
    toggleMusic();
  }
  else if (inRangeOfSoundEffects(x, y)) {
    toggleSoundEffects();
    buttonClicked();
  }
}

function levelScreenMouseClicked(x, y) {
  
  if (inRangeOfBack(x, y)) {
    buttonClicked();
    onLevelsScreen = false;
  }
  
  if (x == constrain(x, 150, 255)) {
    if (inRangeOfTopLevelButton(y)) {
      buttonClicked();
      level.setLevel(0);
      clearPopUps();
    } else if (inRangeOfBottomLevelButton(y)) {
      buttonClicked();
      level.setLevel(4);
      clearPopUps();
    }
  } else if (x == constrain(x, 278, 383)) {
    if (inRangeOfTopLevelButton(y)) {
      buttonClicked();
      level.setLevel(1);
      clearPopUps();
    } else if (inRangeOfBottomLevelButton(y)) {
      buttonClicked();
      level.setLevel(5);
      clearPopUps();
    }
  } else if (x == constrain(x, 415, 520)) {
    if (inRangeOfTopLevelButton(y)) {
      buttonClicked();
      level.setLevel(2);
      clearPopUps();
    } else if (inRangeOfBottomLevelButton(y)) {
      buttonClicked();
      level.setLevel(6);
      clearPopUps();
    }
  } else if (x == constrain(x, 542, 647)) {
    if (inRangeOfTopLevelButton(y)) {
      buttonClicked();
      level.setLevel(3);
      clearPopUps();
    } else if (inRangeOfBottomLevelButton(y)) {
      buttonClicked();
      level.setLevel(7);
      clearPopUps();
    }
  }
  
}

function notPausedMouseClicked(x, y) {
  if (inRangeOfPause(x, y)) {
    buttonClicked();
    pause();
  } 
  else if (inRangeOfReset(x, y)) {
    buttonClicked();
    world.characterCloud(player.characterX, player.characterY);
    level.reset();
  } 
  else if (inRangeOfHome(x, y)) {
    buttonClicked();
    onTitleScreen = true;
  } 
  else if (inRangeOfMusic(x, y)) {
    buttonClicked();
    toggleMusic();
  } 
  else if (inRangeOfSoundEffects(x, y)) {
    toggleSoundEffects();
    buttonClicked();
  } 
  else if (inRangeOfSkip(x, y)) {
    buttonClicked();
    world.wipeScreen("levelUp");
  } 
  else if (level.id == 0 && inRangeOfControlToggle(x, y)) {
    buttonClicked();
    toggleMovement();
    level.colliders[0].image = movementImg;
  }
}

function titleScreenMouseClicked(x, y) {
  if (inRangeOfPlay(x, y)) {
    buttonClicked();
    level.reset();
    onTitleScreen = false;
  } 
  else if (inRangeOfOptions(x, y)) {
    buttonClicked();
    pause();
  } 
  else if (inRangeOfLevels(x, y)) {
    buttonClicked();
    openLevels();
  }
  else if (inRangeOfMusic(x, y)) {
    buttonClicked();
    toggleMusic();
  }
  else if (inRangeOfSoundEffects(x, y)) {
    toggleSoundEffects();
    buttonClicked();
  }
}

function finishScreenMouseClicked(x, y) {
  if (inRangeOfHome(x, y)) {
    buttonClicked();
    onFinishScreen = false;
    onTitleScreen = true;
  } 
  else if (inRangeOfLevels(x, y)) {
    buttonClicked();
    openLevels();
  }
}

function keyPressed() {
  
  if (movable()) {
    switch (keyCode) {

      case leftKey :
        player.moveLeft();
        break;

      case rightKey :
        player.moveRight();
        break;

      case jumpKey1 :

      case jumpKey2 :
        player.jump();
        break;

      case resetKey :
        player.createCloud();
        level.reset();
        break;

      case fullscreenKey :
        toggleFullscreen();
        break;

      case muteKey :
        toggleMute();
        break;

      default :
        print("KEYCODE : " + keyCode);
        break;

    }
  }
  
}

function keyReleased() {
  
  switch (keyCode) {
      
    case leftKey :
      player.unMoveLeft();
      break;
      
    case rightKey :
      player.unMoveRight();
      break;
      
    case jumpKey1 :
      
    case jumpKey2 :
      player.stopJump();
      break;
      
  }
  
}

function inRangeOfPause(x, y) {
  if (dist(x,y,45,31) < 20) {
    return true;
  }
  return false;
}

function inRangeOfPlay(x, y) {
  if (paused) {
    if (x != constrain(x, 158, 376)) {
      return false;
    }
    if (y != constrain(y, 132, 210)) {
      return false;
    }
    return true;
  }
  if (x != constrain(x, 216, 584)) {
    return false;
  }
  if (y != constrain(y, 332, 448)) {
    return false;
  }
  return true;
  
}

function inRangeOfReset(x, y) {
  if (dist(x, y, 93, 33) > 16) {
    return false;
  }
  return true;
  
}

function inRangeOfHome(x, y) {
  
  if (paused) {
    if (x != constrain(x, 422, 638)) {
      return false;
    }
    if (y != constrain(y, 134, 214)) {
      return false;
    }
    return true;
  }
  
  if (onFinishScreen) {
    if (x != constrain(x, 112, 328)) {
      return false;
    }
    if (y != constrain(y, 402, 478)) {
      return false;
    }
    return true;
  }
  
  // in game
  if (x != constrain(x, 132, 164)) {
    return false;
  }
  if (y != constrain(y, 14, 50)) {
    return false;
  }
  return true;
  
}

function inRangeOfTopLevelButton(y) {
  return (y == constrain(y, 158, 260));
}

function inRangeOfBottomLevelButton(y) {
  return (y == constrain(y, 284, 390));
}

function inRangeOfBack(x, y) {
  
  if (x != constrain(x, 284, 502)) {
    return false;
  }
  if (y != constrain(y, 410, 482)) {
    return false;
  }
  return true;
  
}

function inRangeOfMusic(x, y) {
  let leftMusicX, topMusicY, musicSize;
  if (paused) {
    leftMusicX = 462;
    topMusicY = 230;
    musicSize = 48;
  } else if (onTitleScreen) {
    leftMusicX = 68;
    topMusicY = 370;
    musicSize = 48;
  } else {
    // in game
    leftMusicX = 615;
    topMusicY = 22;
    musicSize = 24;
  }
  if (x != constrain(x, leftMusicX, leftMusicX + musicSize)) {
    return false;
  }
  if (y != constrain(y, topMusicY, topMusicY + musicSize)) {
    return false;
  }
  return true;
  
}

function inRangeOfSoundEffects(x, y) {
  let leftSoundX, topSoundY, soundSize;
  if (paused) {
    leftSoundX = 554;
    topSoundY = 223;
    soundSize = 64;
  } else if (onTitleScreen) {
    leftSoundX = 120;
    topSoundY = 438;
    soundSize = 64;
  } else {
    // in game
    leftSoundX = 654;
    topSoundY = 18;
    soundSize = 32;
  }
  if (x != constrain(x, leftSoundX, leftSoundX + soundSize)) {
    return false;
  }
  if (y != constrain(y, topSoundY, topSoundY + soundSize)) {
    return false;
  }
  return true;
}

function inRangeOfSkip(x, y) {
  let leftSkipX, topSkipY, skipLength, skipHeight;
  leftSkipX = 700;
  topSkipY = 17;
  skipLength = 53;
  skipHeight = 29;
  if (x != constrain(x, leftSkipX, leftSkipX + skipLength)) {
    return false;
  }
  if (y != constrain(y, topSkipY, topSkipY + skipHeight)) {
    return false;
  }
  return true;
}

function inRangeOfOptions(x, y) {
  if (x != constrain(x, 216, 584)) {
    return false;
  }
  if (y != constrain(y, 458, 530)) {
    return false;
  }
  return true;
  
}


function inRangeOfLevels(x, y) {
  
  if (paused) {
    if (x != constrain(x, 158, 374)) {
      return false;
    }
    if (y != constrain(y, 218, 298)) {
      return false;
    }
    return true;
  }
  
  if (onFinishScreen) {
    if (x != constrain(x, 472, 688)) {
      return false;
    }
    if (y != constrain(y, 402, 478)) {
      return false;
    }
    return true;
  }
  
  if (x != constrain(x, 620, 780)) {
    return false;
  }
  if (y != constrain(y, 330, 532)) {
    return false;
  }
  return true;
  
}

function inRangeOfControlToggle(x, y) {
  if (paused) {
    if (x != constrain(x, 216, 582)) {
      return false;
    }
    if (y != constrain(y, 366, 442)) {
      return false;
    }
    return true;
  }
  if (level.id == 0) {
    if (x != constrain(x, 218, 574)) {
      return false;
    }
    if (y != constrain(y, 384, 450)) {
      return false;
    }
  }
  return true;
}

function pause() {
  paused = true;
  drawPauseScreen();
}

function unpause() {
  paused = false;
}

function drawPauseScreen() {
  image(pauseScreen, 72, 42);
  image(largeMusicIcon, 462, 230);
  image(largeSoundIcon, 554, 223);
}

function mute() {
  muteMusic();
  muteSoundEffects();
}

function unmute() {
  unmuteMusic();
  unmuteSoundEffects();
}

function muteMusic() {
  musicIsOn = false;
  musicIcon = musicOffIcon;
  largeMusicIcon = largeMusicOffIcon;
  stopMusic();
}

function unmuteMusic() {
  musicIsOn = true;
  musicIcon = musicOnIcon;
  largeMusicIcon = largeMusicOnIcon;
}

function toggleMusic() {
  if (musicIsOn) {
    muteMusic();
  } else {
    unmuteMusic();
  }
}

function muteSoundEffects() {
  soundEffectsOn = false;
  soundIcon = soundOffIcon;
  largeSoundIcon = largeSoundOffIcon;
  stopSoundEffects();
}

function unmuteSoundEffects() {
  soundEffectsOn = true;
  soundIcon = soundOnIcon;
  largeSoundIcon = largeSoundOnIcon;
}

function toggleSoundEffects() {
  if (soundEffectsOn) {
    muteSoundEffects();
  } else {
    unmuteSoundEffects();
  }
}

function toggleMute() {
  if (soundEffectsOn || musicIsOn) {
    mute();
  } else {
    unmute();
  }
}

function stopSounds() {
  stopSoundEffects();
  stopMusic();
}

function stopSoundEffects() {
  boingSound.stop();
  stepSound.stop();
  hitSound.stop();
  victorySound.stop();
  jumpSound.stop();
  spikeRiseSound.stop();
  winPageSound.stop();
}

function stopMusic() {
  music.stop();
}

function assignKeys() {
  leftKey = 65;
  rightKey = 68;
  jumpKey1 = 87;
  jumpKey2 = 32;
  resetKey = 82;
  fullscreenKey = 70;
  muteKey = 77;
}

function movable() {
  
  if (player.isHit) {
    return false;
  }
  
  return true;
  
}

function hasValidInput(parameter) {
  return (parameter != null || parameter != undefined);
}

function overrideParameter(parameter, defaultParameter) {
  return hasValidInput(parameter) ? parameter : defaultParameter;
}

function drawTitleScreen() {
  image(titleScreen, 0, 0);
  push();
  imageMode(CENTER);
  translate(400, 204);
  rotate(0.12*sin(frameCount/60) - 0.15);
  image(titleText, 0, 0);
  pop();
  image(largeMusicIcon, 68, 370);
  image(largeSoundIcon, 120, 438);
}

function drawLevelScreen() {
  image(levelScreen, 72, 42);
  image(backButton, 286, 408);
}

function drawFinishScreen() {
  if (level.finishTime > frameCount - 60) {
    fill(85, 76, 128);
    image(finishScreen, 0, -gameHeight + gameHeight*(frameCount-level.finishTime)/60);
    rect(10, -10 + gameHeight*(frameCount-level.finishTime)/60, 790, 540);
    fill(76, 40, 47);
    rect(0, 0, gameWidth, 10);
  } else {
    image(finishScreen, 0, 0);
  }
  
  let playerTheta = frameCount/60;
  let leftPlayerX = gameWidth/2*cos(playerTheta);
  let leftPlayerY = gameHeight-gameWidth/2*sin(playerTheta);
  image(player.jumpingLeftAnim[0], leftPlayerX, leftPlayerY);
  
  let rightPlayerX = 750-gameWidth/2*cos(playerTheta + PI);
  let rightPlayerY = gameHeight-gameWidth/2*sin(playerTheta + PI);
  image(player.jumpingRightAnim[0], rightPlayerX, rightPlayerY);
  
  image(homeButton, 112, 402);
  image(levelsButton, 472, 402);
  // frame overlaps (so player animation doesn't go in front of frame)
  fill(76, 40, 47);
  // left side 
  rect(0, 100, 10, 300);
  // right side
  rect(gameWidth - 10, 100, gameWidth, 300);
  // bottom
  rect(0, gameHeight-10, gameWidth, gameHeight);
}

function setMovementWasd() {
  leftKey = 65;
  rightKey = 68;
  jumpKey1 = 87;
  arrowKeyMovement = false;
  pauseScreen = pauseScreenWasd;
  movementImg = wasdImg;
}

function setMovementArrows() {
  leftKey = 37;
  rightKey = 39;
  jumpKey1 = 38;
  arrowKeyMovement = true;
  pauseScreen = pauseScreenArrows;
  movementImg = arrowImg;
}

function toggleMovement() {
  if (arrowKeyMovement) {
    setMovementWasd();
  } else {
    setMovementArrows();
  }
}

function openLevels() {
  onLevelsScreen = true;
}

function finishGame() {
  winPageSound.playOnce();
  onFinishScreen = true;
}

function clearPopUps() {
  onFinishScreen = false;
  onLevelsScreen = false;
  onTitleScreen = false;
  paused = false;
}

function toggleFullscreen() {

  if (windowIsFullscreen) {
    closeFullscreen();
  } else {
    openFullscreen();
  }

}
      
/* View in fullscreen */
function openFullscreen() {
  windowIsFullscreen = true;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  windowIsFullscreen = false;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function controlScreenShake() {
  if (screenIsShaking()) {
    shakeScreen();
  }
}

function screenIsShaking() {
  return frameCount < stopScreenShakeTime;
}

function shakeScreen() {
  let rotationTimeValue = frameCount/5;
  let rotationLimit = PI*0.01;
  let rotationNoiseOffset = 200;
  let shakeRotation = screenShakeIntensity*rotationLimit*2*(noise(rotationTimeValue + rotationNoiseOffset)-0.5);
  rotate(shakeRotation);

  let translationTimeValue = frameCount/5;
  let translationLimit = 12;
  let xTranslationNoiseOffset = 400;
  let xTranslation = screenShakeIntensity*translationLimit*2*(noise(translationTimeValue + xTranslationNoiseOffset)-0.5);
  let yTranslationNoiseOffset = 700;
  let yTranslation = screenShakeIntensity*translationLimit*2*(noise(translationTimeValue + yTranslationNoiseOffset)-0.5);
  translate(xTranslation, yTranslation, 0);
}

function createScreenShake(duration, intensity) {
  duration = overrideParameter(duration, 10);
  intensity = overrideParameter(intensity, 1);
  stopScreenShakeTime = frameCount + duration;
  screenShakeIntensity = intensity;
}

function stopScreenShake() {
  stopScreenShakeTime = -1;
}

function playStepSound() {
  if (soundEffectsOn) {
    if (!stepSound.isPlaying()) {
      stepSound = stepSounds[floor(random(stepSounds.length))];
      stepSound.play();
    }
  }
}