// src/lib/audioFX.ts
class WeatherAudioContext {
  audioCtx: AudioContext | null = null;
  rainNoise: AudioBufferSourceNode | null = null;
  rainFilter: BiquadFilterNode | null = null;
  rainGain: GainNode | null = null;
  
  windNoise: AudioBufferSourceNode | null = null;
  windFilter: BiquadFilterNode | null = null;
  windGain: GainNode | null = null;
  windLfo: OscillatorNode | null = null;

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  createNoiseBuffer(type: 'white' | 'pink' | 'brown') {
    if (!this.audioCtx) return null;
    const bufferSize = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'white') {
            data[i] = white;
        } else if (type === 'pink') {
            const b = [0, 0, 0, 0, 0, 0, 0];
            b[0] = 0.99886 * b[0] + white * 0.0555179;
            b[1] = 0.99332 * b[1] + white * 0.0750759;
            b[2] = 0.96900 * b[2] + white * 0.1538520;
            b[3] = 0.86650 * b[3] + white * 0.3104856;
            b[4] = 0.55000 * b[4] + white * 0.5329522;
            b[5] = -0.7616 * b[5] - white * 0.0168980;
            data[i] = b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + white * 0.5362;
            data[i] *= 0.11;
        } else if (type === 'brown') {
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }
    }
    return buffer;
  }

  playRain() {
    this.init();
    if (!this.audioCtx) return;
    
    // Resume context if stopped
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (!this.rainNoise) {
        this.rainNoise = this.audioCtx.createBufferSource();
        // Pink noise is crisper for rain drops
        const buffer = this.createNoiseBuffer('pink');
        if (buffer) this.rainNoise.buffer = buffer;
        this.rainNoise.loop = true;

        this.rainFilter = this.audioCtx.createBiquadFilter();
        this.rainFilter.type = 'lowpass';
        this.rainFilter.frequency.value = 1800; // Brighter for rain presence

        this.rainGain = this.audioCtx.createGain();
        this.rainGain.gain.value = 0; // start at 0 and fade in

        this.rainNoise.connect(this.rainFilter);
        this.rainFilter.connect(this.rainGain);
        this.rainGain.connect(this.audioCtx.destination);
        this.rainNoise.start();
    }
    // Fade in
    this.rainGain?.gain.setTargetAtTime(0.7, this.audioCtx.currentTime, 1);
    this.scheduleThunder();
  }

  thunderTimeouts: number[] = [];

  playThunder() {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    
    // Create a burst of low-frequency noise
    const thunderNoise = this.audioCtx.createBufferSource();
    const buffer = this.createNoiseBuffer('brown');
    if (buffer) thunderNoise.buffer = buffer;
    
    const boomFilter = this.audioCtx.createBiquadFilter();
    boomFilter.type = 'lowpass';
    boomFilter.frequency.value = 100 + Math.random() * 150;
    boomFilter.Q.value = 1.5;
    
    const crackleFilter = this.audioCtx.createBiquadFilter();
    crackleFilter.type = 'bandpass';
    crackleFilter.frequency.value = 800 + Math.random() * 500;
    
    const masterGain = this.audioCtx.createGain();
    masterGain.gain.value = 0;
    
    thunderNoise.connect(boomFilter);
    thunderNoise.connect(crackleFilter);
    boomFilter.connect(masterGain);
    crackleFilter.connect(masterGain);
    masterGain.connect(this.audioCtx.destination);
    
    thunderNoise.start();
    
    const now = this.audioCtx.currentTime;
    masterGain.gain.setValueAtTime(0, now);
    // Sudden attack for lightning strike
    masterGain.gain.linearRampToValueAtTime(1.5 + Math.random(), now + 0.05);
    // Long exponential decay for rumbling thunder
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 3 + Math.random() * 3);
    
    setTimeout(() => {
        try { thunderNoise.stop(); } catch(e){}
    }, 7000);
  }

  scheduleThunder() {
    // Schedule next thunder between 4 and 10 seconds
    const nextThunder = 4000 + Math.random() * 6000;
    const timeoutId = window.setTimeout(() => {
        this.playThunder();
        // Fire custom event for visual lightning
        window.dispatchEvent(new Event('lightning-flash'));
        this.scheduleThunder();
    }, nextThunder);
    this.thunderTimeouts.push(timeoutId);
  }

  stopRain() {
    this.thunderTimeouts.forEach(clearTimeout);
    this.thunderTimeouts = [];
    if (this.rainGain && this.audioCtx) {
      this.rainGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.5);
      setTimeout(() => {
        if (this.rainNoise) {
            try { this.rainNoise.stop(); } catch(e){}
            this.rainNoise.disconnect();
            this.rainNoise = null;
        }
      }, 1000);
    }
  }

  playWind(type: 'gentle' | 'storm' = 'gentle') {
    this.init();
    if (!this.audioCtx) return;
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (!this.windNoise) {
        this.windNoise = this.audioCtx.createBufferSource();
        // Airier pink noise for gentle sakura breeze, deeper brown noise for storm
        const buffer = this.createNoiseBuffer(type === 'storm' ? 'brown' : 'pink');
        if (buffer) this.windNoise.buffer = buffer;
        this.windNoise.loop = true;

        this.windFilter = this.audioCtx.createBiquadFilter();
        this.windFilter.type = 'lowpass';
        this.windFilter.frequency.value = type === 'storm' ? 500 : 900; 

        this.windGain = this.audioCtx.createGain();
        this.windGain.gain.value = 0;

        this.windLfo = this.audioCtx.createOscillator();
        this.windLfo.type = 'sine';
        this.windLfo.frequency.value = type === 'storm' ? 0.35 : 0.15; // Faster swaying for storm

        const lfoGain = this.audioCtx.createGain();
        lfoGain.gain.value = type === 'storm' ? 500 : 300; // Stronger pitch mod for storm

        this.windLfo.connect(lfoGain);
        lfoGain.connect(this.windFilter.frequency);
        this.windLfo.start();

        this.windNoise.connect(this.windFilter);
        this.windFilter.connect(this.windGain);
        this.windGain.connect(this.audioCtx.destination);
        this.windNoise.start();
    }

    // Fade in
    this.windGain?.gain.setTargetAtTime(type === 'storm' ? 0.9 : 0.15, this.audioCtx.currentTime, 2);
    
    if (type === 'gentle') {
      this.scheduleBirds();
    } else {
      this.stopBirds();
    }
  }

  birdTimeouts: number[] = [];

  playBirdChirp() {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    // Add an FM oscillator for realistic bird trills
    const fmOsc = this.audioCtx.createOscillator();
    fmOsc.type = 'sine';
    const fmGain = this.audioCtx.createGain();
    
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    fmOsc.connect(fmGain);
    fmGain.connect(osc.frequency);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    const now = this.audioCtx.currentTime;
    osc.type = 'sine';
    
    const chirpType = Math.floor(Math.random() * 3);
    let duration = 0.15;
    
    if (chirpType === 0) {
      // Short descending trill (classic chirp)
      const baseFreq = 3500 + Math.random() * 1000;
      fmOsc.frequency.value = 40 + Math.random() * 20; // 40-60Hz trill
      fmGain.gain.value = 300;
      
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.15);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      duration = 0.15;
    } else if (chirpType === 1) {
      // Quick rising swoop (peep)
      const baseFreq = 2200 + Math.random() * 800;
      fmOsc.frequency.value = 0; // smooth tone
      fmGain.gain.value = 0;
      
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      duration = 0.15;
    } else {
      // Double rapid peep
      const baseFreq = 4000 + Math.random() * 500;
      fmOsc.frequency.value = 15;
      fmGain.gain.value = 200;
      
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq - 300, now + 0.1);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      duration = 0.1;
    }
    
    fmOsc.start(now);
    fmOsc.stop(now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  playWindChime() {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    const now = this.audioCtx.currentTime;
    
    osc.type = 'sine'; // Sine wave is good for glass/metal chimes
    // Pentatonic scale frequencies for a dreamy aesthetic look
    const chimeFreqs = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00, 2349.32];
    const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)];
    
    osc.frequency.setValueAtTime(freq, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    // Long decay for a chime
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    
    osc.start(now);
    osc.stop(now + 3.0);
  }

  scheduleBirds() {
    const nextChirp = 2000 + Math.random() * 4000;
    const timeoutId = window.setTimeout(() => {
        // Birds
        if (Math.random() > 0.3) {
           this.playBirdChirp();
           if (Math.random() > 0.5) {
               setTimeout(() => this.playBirdChirp(), 150 + Math.random() * 150);
               if (Math.random() > 0.4) {
                   setTimeout(() => this.playBirdChirp(), 350 + Math.random() * 200);
               }
           }
        }
        // Occasional wind chime
        if (Math.random() > 0.6) {
           this.playWindChime();
        }
        
        this.scheduleBirds();
    }, nextChirp);
    this.birdTimeouts.push(timeoutId);
  }

  stopBirds() {
    this.birdTimeouts.forEach(clearTimeout);
    this.birdTimeouts = [];
  }

  stopWind() {
    this.stopBirds();
    if (this.windGain && this.audioCtx) {
      this.windGain.gain.setTargetAtTime(0, this.audioCtx.currentTime, 1.5);
      setTimeout(() => {
        if (this.windNoise) {
            try { this.windNoise.stop(); } catch(e){}
            this.windNoise.disconnect();
            this.windNoise = null;
        }
        if (this.windLfo) {
             try { this.windLfo.stop(); } catch(e){}
             this.windLfo.disconnect();
             this.windLfo = null;
        }
      }, 2000);
    }
  }
}

export const weatherAudio = new WeatherAudioContext();
