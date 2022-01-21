class SmartSound {

    constructor(soundPath, length) {
        this.soundPath = soundPath;
        this.sound = loadSound(soundPath);
        this.length = 60*overrideParameter(length, this.sound.duration() + 1);
        this.startPlayTime = -Infinity;
        print(this.soundPath + this.length);
    }

    play() {
        if (soundEffectsOn) {
            this.startPlayTime = frameCount;
            this.sound.play();
        }
    }

    playOnce() {
        if (!this.isPlaying()) {
            this.play();
        }
    }

    isPlaying() {
        return frameCount - this.startPlayTime < this.length;
    }

    copy() {
        return new SmartSound(this.soundPath, this.length);
    }

    playMusic() {
        if (musicIsOn && !this.sound.isPlaying()) {
            this.startPlayTime = frameCount;
            this.sound.play();
        }
    }

    stop() {
        this.sound.stop();
    }

    setVolume(volume) {
        this.sound.setVolume(volume);
    }

}