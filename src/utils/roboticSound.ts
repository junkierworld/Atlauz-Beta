// Synthetic Web Audio API Sound Generator for Robotic Card Reorganization
// Generates playful, clean mechanical servos, digital thinking bleeps, and pneumatic locks.

class RoboticSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Phase 1: Thinking bleeps (playful digital robot calculating sequence)
  playThinkingBeep() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [587.33, 783.99, 880.0, 1174.66]; // D5, G5, A5, D6

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.08);
      });
    } catch {
      // Audio context blocked or unsupported
    }
  }

  // Phase 2: Mechanical Servo Whir (Retracting / Shrinking)
  playServoShrink() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      // Pitch sweeps downward simulating a retracting gear/actuator
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.55);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {}
  }

  // Phase 3: Conveyor Rail Ticks & Swapping Motion
  playConveyorSlide() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Subtle motor hum
      const motor = this.ctx.createOscillator();
      const motorGain = this.ctx.createGain();
      motor.type = 'sawtooth';
      motor.frequency.setValueAtTime(110, now);
      motor.frequency.linearRampToValueAtTime(160, now + 0.35);
      motor.frequency.linearRampToValueAtTime(100, now + 0.7);

      motorGain.gain.setValueAtTime(0, now);
      motorGain.gain.linearRampToValueAtTime(0.04, now + 0.08);
      motorGain.gain.linearRampToValueAtTime(0.03, now + 0.6);
      motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      motor.connect(motorGain);
      motorGain.connect(this.ctx.destination);
      motor.start(now);
      motor.stop(now + 0.75);

      // 4 rhythmic rail ticks as the robots swap slots
      [0.1, 0.25, 0.45, 0.6].forEach(timeOffset => {
        if (!this.ctx) return;
        const tickOsc = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tickOsc.type = 'sine';
        tickOsc.frequency.setValueAtTime(800 + Math.random() * 200, now + timeOffset);

        tickGain.gain.setValueAtTime(0.05, now + timeOffset);
        tickGain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + 0.04);

        tickOsc.connect(tickGain);
        tickGain.connect(this.ctx.destination);
        tickOsc.start(now + timeOffset);
        tickOsc.stop(now + timeOffset + 0.045);
      });
    } catch {}
  }

  // Phase 4: Hydraulic Expansion & Lock (Pneumatic "chhk-thud")
  playHydraulicExpansion() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Rising hydraulic whoosh
      const hydraulic = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();
      hydraulic.type = 'sine';
      hydraulic.frequency.setValueAtTime(130, now);
      hydraulic.frequency.exponentialRampToValueAtTime(420, now + 0.5);

      hGain.gain.setValueAtTime(0, now);
      hGain.gain.linearRampToValueAtTime(0.07, now + 0.1);
      hGain.gain.linearRampToValueAtTime(0.05, now + 0.45);
      hGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      hydraulic.connect(hGain);
      hGain.connect(this.ctx.destination);
      hydraulic.start(now);
      hydraulic.stop(now + 0.55);

      // Lock latch (clack) at end
      const latchTime = now + 0.55;
      const latchOsc = this.ctx.createOscillator();
      const latchGain = this.ctx.createGain();
      latchOsc.type = 'triangle';
      latchOsc.frequency.setValueAtTime(220, latchTime);
      latchOsc.frequency.exponentialRampToValueAtTime(60, latchTime + 0.12);

      latchGain.gain.setValueAtTime(0.12, latchTime);
      latchGain.gain.exponentialRampToValueAtTime(0.001, latchTime + 0.12);

      latchOsc.connect(latchGain);
      latchGain.connect(this.ctx.destination);
      latchOsc.start(latchTime);
      latchOsc.stop(latchTime + 0.15);
    } catch {}
  }

  // Focus Mode Entrance Sequence: Resonant harmonic activation chord & orbit chime
  playFocusTransitionSound() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft deep bass sweep into focus
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(80, now);
      sub.frequency.exponentialRampToValueAtTime(160, now + 1.2);
      subGain.gain.setValueAtTime(0, now);
      subGain.gain.linearRampToValueAtTime(0.08, now + 0.2);
      subGain.gain.linearRampToValueAtTime(0.04, now + 1.8);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 2.5);

      // Four orbit chime tones as icons settle (t=1.4s, 1.6s, 1.8s, 2.0s)
      const chimes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      chimes.forEach((freq, i) => {
        if (!this.ctx) return;
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const t = now + 1.4 + i * 0.16;
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, t);
        chimeGain.gain.setValueAtTime(0, t);
        chimeGain.gain.linearRampToValueAtTime(0.06, t + 0.02);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);
        chimeOsc.start(t);
        chimeOsc.stop(t + 0.4);
      });
    } catch {}
  }

  play(effect: 'unclamp' | 'slide' | 'dockClick' | 'thinking' | 'transition') {
    switch (effect) {
      case 'unclamp': return this.playServoShrink();
      case 'slide': return this.playConveyorSlide();
      case 'dockClick': return this.playHydraulicExpansion();
      case 'thinking': return this.playThinkingBeep();
      case 'transition': return this.playFocusTransitionSound();
    }
  }
}

export const roboticSound = new RoboticSoundEngine();
