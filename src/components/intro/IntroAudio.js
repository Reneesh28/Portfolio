import introTrackUrl from '../../assets/audio/Intro.mp3';

class IntroAudioManager {
  constructor() {
    this.audio = null;
    this.fadeInterval = null;
    this.isMuted = false;
    this.volume = 0.85;
    this.hasUserInteracted = false;
  }

  init() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio(introTrackUrl);
      this.audio.preload = 'auto';
      this.audio.loop = false;
      this.audio.volume = this.volume;
    }
    return this.audio;
  }

  async play() {
    try {
      this.init();
      if (!this.audio) return false;
      this.hasUserInteracted = true;
      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }
      this.audio.volume = this.isMuted ? 0 : this.volume;
      this.audio.currentTime = 0;
      await this.audio.play();
      return true;
    } catch (err) {
      console.warn('Autoplay restricted or audio playback error:', err);
      return false;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.volume = muted ? 0 : this.volume;
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  fadeAndStop(durationMs = 600) {
    if (!this.audio) return;
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
          this.audio.currentTime = 0;
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
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.audio.remove();
      this.audio = null;
    }
  }
}

export const introAudio = new IntroAudioManager();
