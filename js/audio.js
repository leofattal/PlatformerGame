// Audio System with Web Audio API
class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3; // Master volume
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Create a simple beep/tone
    playTone(frequency, duration, volumeMultiplier = 1) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'square';

        const volume = this.volume * volumeMultiplier;
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Sound Effects
    playJump() {
        this.playTone(400, 0.1, 0.3);
    }

    playLand() {
        this.playTone(200, 0.05, 0.2);
    }

    playCoinCollect() {
        // Ascending chime
        this.playTone(523, 0.05, 0.4); // C
        setTimeout(() => this.playTone(659, 0.05, 0.4), 50); // E
        setTimeout(() => this.playTone(784, 0.1, 0.4), 100); // G
    }

    playEnemyDefeat() {
        this.playTone(800, 0.05, 0.3);
        setTimeout(() => this.playTone(600, 0.05, 0.3), 50);
        setTimeout(() => this.playTone(400, 0.1, 0.3), 100);
    }

    playDamage() {
        this.playTone(150, 0.2, 0.5);
    }

    playDeath() {
        // Descending tone
        this.playTone(400, 0.1, 0.4);
        setTimeout(() => this.playTone(350, 0.1, 0.4), 100);
        setTimeout(() => this.playTone(300, 0.1, 0.4), 200);
        setTimeout(() => this.playTone(250, 0.2, 0.4), 300);
    }

    play1Up() {
        // Victory jingle
        this.playTone(659, 0.1, 0.4);
        setTimeout(() => this.playTone(784, 0.1, 0.4), 100);
        setTimeout(() => this.playTone(988, 0.1, 0.4), 200);
        setTimeout(() => this.playTone(1047, 0.3, 0.4), 300);
    }

    playPause() {
        this.playTone(500, 0.1, 0.2);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    toggleMute() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}
