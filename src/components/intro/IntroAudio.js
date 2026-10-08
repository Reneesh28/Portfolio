import introTrackUrl from '../../assets/audio/Intro.mp3';

class IntroAudioManager {
  constructor() {
    this.audio = null;
    this.fadeInterval = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.autoplayBlocked = false;
    this.volume = 0.85;
    this.hasUserInteracted = false;
    this.onStateChange = null;
  }

  init() {
    if (!this.audio && typeof window !== 'undefined') {
      this.audio = new Audio(introTrackUrl);
      this.audio.preload = 'auto';
      this.audio.loop = false;
      this.audio.volume = this.isMuted ? 0 : this.volume;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.autoplayBlocked = false;
        this.notifyState();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notifyState();
      });

      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.autoplayBlocked = false;
        this.notifyState();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Intro audio playback/loading error:', e);
      });
    }
    return this.audio;
  }

  notifyState() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        isMuted: this.isMuted,
        autoplayBlocked: this.autoplayBlocked,
      });
    }
  }

  async play(syncTime = null) {
    try {
      this.init();
      if (!this.audio) return false;

      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }

      this.audio.volume = this.isMuted ? 0 : this.volume;

      // Sync currentTime if provided and valid
      if (typeof syncTime === 'number' && !isNaN(syncTime) && syncTime > 0) {
        try {
          if (this.audio.duration && syncTime < this.audio.duration) {
            this.audio.currentTime = syncTime;
          } else if (!this.audio.duration) {
            this.audio.currentTime = syncTime;
          }
        } catch (e) {
          // ignore seek error if audio metadata hasn't loaded yet
        }
      }

      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }

      this.isPlaying = true;
      this.autoplayBlocked = false;
      this.hasUserInteracted = true;
      this.notifyState();
      return true;
    } catch (err) {
      // Browser autoplay restriction encountered
      this.autoplayBlocked = true;
      this.isPlaying = false;
      this.notifyState();
      return false;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notifyState();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.volume = muted ? 0 : this.volume;
    }
    this.notifyState();
  }

  toggleMute(syncTime = null) {
    if (this.isMuted) {
      // Unmute
      this.setMuted(false);
      if (this.audio && this.audio.paused) {
        this.play(syncTime);
      }
    } else {
      // If currently paused (e.g. autoplay blocked) and user clicks sound button, start playing!
      if (this.audio && this.audio.paused) {
        this.setMuted(false);
        this.play(syncTime);
      } else {
        this.setMuted(true);
      }
    }
    return this.isMuted;
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
          this.notifyState();
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
      this.notifyState();
    }
  }
}

export const introAudio = new IntroAudioManager();
