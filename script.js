/**
 * Main Application Logic for Angie's Birthday Surprise
 * Countdown Controller and Space Transition
 */

let audioContext = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  startCountdownSequence();
});

const sequenceSteps = [
  { text: "5", cssClass: "", freq: 440, delay: 1000 },
  { text: "4", cssClass: "", freq: 520, delay: 1000 },
  { text: "3", cssClass: "", freq: 600, delay: 1000 },
  { text: "2", cssClass: "", freq: 680, delay: 1000 },
  { text: "1", cssClass: "", freq: 760, delay: 1000 },
  { text: "FELIZ", cssClass: "word-feliz", freq: 880, delay: 1100 },
  { text: "CUMPLEAÑOS", cssClass: "word-cumpleanos", freq: 980, delay: 1200 },
  { text: "GUAPA", cssClass: "word-name", freq: 1100, delay: 1600 }
];

let stepTimeout = null;
let currentStepIndex = 0;

function startCountdownSequence() {
  currentStepIndex = 0;
  clearTimeout(stepTimeout);
  runNextStep();
}

function runNextStep() {
  const numberDisplay = document.getElementById('countdown-number');
  if (!numberDisplay) return;

  if (currentStepIndex >= sequenceSteps.length) {
    playCelebrationSound();
    triggerSurpriseReveal();
    return;
  }

  const step = sequenceSteps[currentStepIndex];
  
  // Set content & CSS class
  numberDisplay.textContent = step.text;
  numberDisplay.className = 'pixel-countdown ' + step.cssClass;
  
  // Trigger zoom animation
  triggerTickAnimation(numberDisplay);
  
  // Sound effect per word/number
  playBeepSound(step.freq);

  // Advance to next step after step.delay
  currentStepIndex++;
  stepTimeout = setTimeout(runNextStep, step.delay);
}

function triggerTickAnimation(element) {
  element.style.animation = 'none';
  // Trigger reflow
  void element.offsetWidth;
  element.style.animation = 'wordZoom 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
}

function triggerSurpriseReveal() {
  const countdownStage = document.getElementById('countdown-stage');
  const spaceStage = document.getElementById('space-stage');
  const matrixCanvas = document.getElementById('matrix-canvas');

  // Launch celebratory heart particle burst
  createHeartExplosion();

  // Transition from matrix to space
  if (matrixCanvas) {
    matrixCanvas.style.transition = 'opacity 1.5s ease';
    matrixCanvas.style.opacity = '0';
  }

  if (countdownStage) {
    countdownStage.classList.remove('stage-active');
    countdownStage.classList.add('stage-hidden');
  }

  // Show space stage after matrix fades
  setTimeout(() => {
    if (spaceStage) {
      spaceStage.classList.remove('stage-hidden');
      spaceStage.classList.add('stage-active');
      
      // Initialize space effect
      if (!spaceEffect) {
        spaceEffect = new SpaceEffect('space-canvas');
      }
    }
  }, 1500);
}

/* ==========================================
   Web Audio Synthesizer (FX only)
   ========================================== */
function getAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function playBeepSound(freq = 440) {
  try {
    const ctx = getAudioContext();
    
    // Main beep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
    
    // Echo
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 0.5, ctx.currentTime + 0.1);
    gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.log('Audio playback prevented or unsupported');
  }
}

function playCelebrationSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }, idx * 120);
    });
  } catch (e) {}
}

/* ==========================================
   Event Listeners & Interactive Controls
   ========================================== */
function setupEventListeners() {
  // Skip Countdown
  const skipBtn = document.getElementById('skip-countdown-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearTimeout(stepTimeout);
      triggerSurpriseReveal();
    });
  }

  // Heart Button
  const heartBtn = document.getElementById('heart-btn');
  if (heartBtn) {
    heartBtn.addEventListener('click', () => {
      triggerVideoReveal();
    });
  }
}

function triggerVideoReveal() {
  const spaceStage = document.getElementById('space-stage');
  const videoStage = document.getElementById('video-stage');
  const video = document.getElementById('surprise-video');

  // Fade out space stage
  if (spaceStage) {
    spaceStage.style.transition = 'opacity 2s ease';
    spaceStage.style.opacity = '0';
  }

  // Show video stage after fade
  setTimeout(() => {
    if (spaceStage) {
      spaceStage.classList.remove('stage-active');
      spaceStage.classList.add('stage-hidden');
    }

    if (videoStage) {
      videoStage.classList.remove('stage-hidden');
      videoStage.classList.add('stage-active');

      // Start floating phrases
      startFloatingPhrases();

      // Play video once
      if (video) {
        video.muted = false;
        video.currentTime = 0;

        video.addEventListener('ended', () => {
          triggerCardReveal();
        }, { once: true });

        video.play().catch(() => {
          video.muted = true;
          video.play();
        });
      }
    }
  }, 2000);
}

const funPhrases = [
  'ñiñiñi 🥺',
  'te amo 3 millones',
  'te voy a esperar...',
  'eres mi persona favorita',
  'te mereces todo',
  'nunca cambies',
  'mi persona favorita',
  'la mejor del mundo'
];

let phraseInterval = null;
let phraseCount = 0;

function startFloatingPhrases() {
  const container = document.getElementById('floating-phrases');
  if (!container) return;

  phraseCount = 0;
  if (phraseInterval) clearInterval(phraseInterval);

  phraseInterval = setInterval(() => {
    if (phraseCount >= 15) {
      clearInterval(phraseInterval);
      return;
    }

    const phrase = document.createElement('div');
    phrase.className = 'floating-phrase';
    phrase.textContent = funPhrases[Math.floor(Math.random() * funPhrases.length)];

    // Random position
    const positions = [
      { left: '5%', top: '20%' },
      { right: '5%', top: '30%' },
      { left: '10%', top: '60%' },
      { right: '10%', top: '70%' },
      { left: '50%', top: '15%', transform: 'translateX(-50%)' },
      { left: '50%', top: '80%', transform: 'translateX(-50%)' }
    ];

    const pos = positions[Math.floor(Math.random() * positions.length)];
    Object.assign(phrase.style, pos);

    container.appendChild(phrase);

    setTimeout(() => {
      phrase.remove();
    }, 4000);

    phraseCount++;
  }, 3000);
}

function triggerCardReveal() {
  if (document.getElementById('card-stage').classList.contains('stage-active')) return;

  const videoStage = document.getElementById('video-stage');
  const cardStage = document.getElementById('card-stage');
  const video = document.getElementById('surprise-video');

  if (phraseInterval) clearInterval(phraseInterval);

  if (video) {
    video.pause();
  }

  // Fade out video
  if (videoStage) {
    videoStage.style.transition = 'opacity 2s ease';
    videoStage.style.opacity = '0';
  }

  // Show card after fade
  setTimeout(() => {
    if (videoStage) {
      videoStage.classList.remove('stage-active');
      videoStage.classList.add('stage-hidden');
    }

    if (cardStage) {
      cardStage.classList.remove('stage-hidden');
      cardStage.classList.add('stage-active');
      createConfetti();
      createFloatingHearts();
    }
  }, 2000);
}

function createConfetti() {
  // Card is now simpler, no confetti needed
}

function createFloatingHearts() {
  // Card is now simpler, no floating hearts needed
}

/* ==========================================
   Heart Particle Explosion Effect
   ========================================== */
function createHeartExplosion() {
  const container = document.body;
  const heartCount = 35;

  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    heart.textContent = Math.random() > 0.5 ? '💖' : (Math.random() > 0.5 ? '✨' : '💕');
    heart.style.position = 'fixed';
    heart.style.left = '50vw';
    heart.style.top = '50vh';
    heart.style.fontSize = `${Math.random() * 20 + 18}px`;
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '999';
    heart.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';

    container.appendChild(heart);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 300 + 100;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    requestAnimationFrame(() => {
      heart.style.transform = `translate(${x}px, ${y}px) scale(${Math.random() * 0.8 + 0.5})`;
      heart.style.opacity = '0';
    });

    setTimeout(() => {
      heart.remove();
    }, 1600);
  }
}
