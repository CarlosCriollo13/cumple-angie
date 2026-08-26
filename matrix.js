/**
 * Pink Matrix Rain Effect
 * Custom 60FPS Canvas Animation tailored for Angie's Birthday Surprise
 */

class PinkMatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Matrix character set: Katakana, Numbers, Letters & Hearts
    this.characters = 'アィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ♥✦♡💖ANGIE';
    
    this.fontSize = 16;
    this.columns = 0;
    this.drops = [];
    this.speeds = [];
    this.colors = [];
    
    this.isLowPerformance = false;
    this.animationFrameId = null;

    this.init();
    window.addEventListener('resize', () => this.handleResize());
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    this.speeds = [];
    this.colors = [];

    // Color variations for the pink matrix trails
    const pinkPalettes = [
      '#ff007f', // Pure Magenta / Electric Pink
      '#ff1493', // Deep Pink
      '#ff3399', // Bright Neon Pink
      '#ff66b2', // Pastel Pink
      '#e60073', // Crimson Magenta
      '#ff0055'  // Rose Red
    ];

    for (let i = 0; i < this.columns; i++) {
      // Random starting Y position above screen or randomly distributed
      this.drops[i] = Math.floor(Math.random() * -50);
      // Random fall speed for depth effect
      this.speeds[i] = Math.random() * 0.8 + 0.6;
      // Random pink hue for this column
      this.colors[i] = pinkPalettes[Math.floor(Math.random() * pinkPalettes.length)];
    }

    this.start();
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    
    // Adjust arrays if resized
    for (let i = 0; i < this.columns; i++) {
      if (this.drops[i] === undefined) {
        this.drops[i] = Math.floor(Math.random() * -50);
        this.speeds[i] = Math.random() * 0.8 + 0.6;
        this.colors[i] = '#ff007f';
      }
    }
  }

  draw() {
    // Translucent background fade to create trails
    this.ctx.fillStyle = 'rgba(3, 1, 8, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px 'Orbitron', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      // Pick a random character
      const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // 10% chance to draw the leading character in glowing white / ultra bright pink
      if (Math.random() > 0.88) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#ff007f';
        this.ctx.shadowBlur = 12;
      } else {
        this.ctx.fillStyle = this.colors[i];
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
      }

      this.ctx.fillText(char, x, y);

      // Reset drop to top if it reaches bottom
      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }

      // Move drop down according to its speed
      this.drops[i] += this.speeds[i];
    }
  }

  start() {
    const render = () => {
      this.draw();
      this.animationFrameId = requestAnimationFrame(render);
    };
    render();
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Initialize Matrix Rain when DOM is ready
let matrixEffect = null;
document.addEventListener('DOMContentLoaded', () => {
  matrixEffect = new PinkMatrixRain('matrix-canvas');
});
