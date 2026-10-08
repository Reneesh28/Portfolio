import heroTrackUrl from '../../assets/audio/Hero.mp3';

class HeroAudioManager {
  constructor() {
    this.audio = null;
    this.fadeInterval = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.hasAutoPlayed = false;
    this.hasFinishedPlaying = false;
    this.volume = 0.30;
    this.onStateChange = null;
  }

  init() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio(heroTrackUrl);
      this.audio.preload = 'auto';
      this.audio.loop = false; // Plays once
      this.audio.volume = this.isMuted ? 0 : this.volume;

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.hasFinishedPlaying = true;
        if (this.onStateChange) {
          this.onStateChange(false);
        }
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        if (this.onStateChange) {
          this.onStateChange(false);
        }
      });

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        if (this.onStateChange) {
          this.onStateChange(true);
        }
      });
    }
    return this.audio;
  }

  async playOnceOnFirstLanding() {
    if (this.hasAutoPlayed || this.hasFinishedPlaying || this.isPlaying) {
      return this.isPlaying;
    }

    try {
      this.init();
      if (!this.audio) return false;

      this.audio.volume = this.isMuted ? 0 : this.volume;
      await this.audio.play();
      this.isPlaying = true;
      this.hasAutoPlayed = true;
      if (this.onStateChange) this.onStateChange(true);
      return true;
    } catch (err) {
      return false;
    }
  }

  async play() {
    try {
      this.init();
      if (!this.audio) return false;

      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }

      this.isMuted = false;
      this.audio.volume = this.volume;

      if (this.hasFinishedPlaying) {
        this.audio.currentTime = 0;
        this.hasFinishedPlaying = false;
      }

      await this.audio.play();
      this.isPlaying = true;
      this.hasAutoPlayed = true;
      if (this.onStateChange) this.onStateChange(true);
      return true;
    } catch (err) {
      console.warn('Hero audio play error:', err);
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
      return false;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.volume = muted ? 0 : this.volume;
    }
  }

  fadeAndStop(durationMs = 600) {
    if (!this.audio || !this.isPlaying) return;
    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const startVolume = this.audio.volume;
    const steps = 20;
    const stepTime = durationMs / steps;
    let currentStep = 0;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      const nextVol = Math.max(0, startVolume * (1 - currentStep / steps));
      if (this.audio) {
        this.audio.volume = this.isMuted ? 0 : nextVol;
      }

      if (currentStep >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (this.audio) {
          this.audio.pause();
          this.isPlaying = false;
          if (this.onStateChange) this.onStateChange(false);
        }
      }
    }, stepTime);
  }

  cleanup() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.remove();
      this.audio = null;
      this.isPlaying = false;
    }
  }
}

export const heroAudio = new HeroAudioManager();
