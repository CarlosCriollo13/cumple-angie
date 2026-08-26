/**
 * Space Background Effect with Stars, Shooting Stars & Nebula
 * Smooth transition from Matrix to Space for Angie's Birthday
 */

class SpaceEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    this.stars = [];
    this.shootingStars = [];
    this.nebulae = [];
    this.maxStars = 300;
    this.maxShootingStars = 3;
    this.isRunning = false;
    this.animationFrameId = null;
    this.time = 0;

    this.init();
    window.addEventListener('resize', () => this.handleResize());
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.stars = [];
    this.shootingStars = [];
    this.nebulae = [];

    // Create stars with different sizes and brightness
    for (let i = 0; i < this.maxStars; i++) {
      this.stars.push(this.createStar());
    }

    // Create nebula clouds
    for (let i = 0; i < 5; i++) {
      this.nebulae.push(this.createNebula());
    }

    this.start();
  }

  createStar() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 2 + 0.5,
      brightness: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: this.getStarColor()
    };
  }

  getStarColor() {
    const colors = [
      '#ffffff', '#ffffff', '#ffffff',
      '#ffe4e1', '#ffe4e1',
      '#e6e6fa', '#e6e6fa',
      '#fff0f5',
      '#ffd1dc',
      '#ffb6c1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createNebula() {
    const nebulaColors = [
      'rgba(255, 0, 127, 0.03)', // Pink
      'rgba(138, 43, 226, 0.03)', // Purple
      'rgba(0, 191, 255, 0.02)', // Blue
      'rgba(255, 105, 180, 0.03)', // Hot pink
      'rgba(147, 112, 219, 0.02)' // Purple
    ];

    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: Math.random() * 200 + 150,
      color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.15
    };
  }

  createShootingStar() {
    return {
      x: Math.random() * this.canvas.width * 0.5,
      y: Math.random() * this.canvas.height * 0.3,
      length: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: 1,
      trail: []
    };
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Recreate stars for new dimensions
    this.stars = [];
    for (let i = 0; i < this.maxStars; i++) {
      this.stars.push(this.createStar());
    }
  }

  drawBackground() {
    // Deep space gradient
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.8
    );
    
    gradient.addColorStop(0, '#0a0015');
    gradient.addColorStop(0.5, '#050010');
    gradient.addColorStop(1, '#000005');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawNebulae() {
    this.nebulae.forEach(nebula => {
      // Drift slowly
      nebula.x += nebula.driftX;
      nebula.y += nebula.driftY;

      // Wrap around
      if (nebula.x < -nebula.radius) nebula.x = this.canvas.width + nebula.radius;
      if (nebula.x > this.canvas.width + nebula.radius) nebula.x = -nebula.radius;
      if (nebula.y < -nebula.radius) nebula.y = this.canvas.height + nebula.radius;
      if (nebula.y > this.canvas.height + nebula.radius) nebula.y = -nebula.radius;

      const gradient = this.ctx.createRadialGradient(
        nebula.x, nebula.y, 0,
        nebula.x, nebula.y, nebula.radius
      );
      
      gradient.addColorStop(0, nebula.color);
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        nebula.x - nebula.radius,
        nebula.y - nebula.radius,
        nebula.radius * 2,
        nebula.radius * 2
      );
    });
  }

  drawStars() {
    this.time += 0.016;

    this.stars.forEach(star => {
      // Twinkle effect
      const twinkle = Math.sin(this.time * star.twinkleSpeed * 60 + star.twinkleOffset);
      const currentBrightness = star.brightness * (0.6 + twinkle * 0.4);

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.globalAlpha = currentBrightness;
      this.ctx.fill();

      // Glow effect for larger stars
      if (star.size > 1.2) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        const glowGradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        glowGradient.addColorStop(0, star.color);
        glowGradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glowGradient;
        this.ctx.globalAlpha = currentBrightness * 0.3;
        this.ctx.fill();
      }
    });

    this.ctx.globalAlpha = 1;
  }

  drawShootingStars() {
    // Randomly spawn shooting stars
    if (Math.random() < 0.005 && this.shootingStars.length < this.maxShootingStars) {
      this.shootingStars.push(this.createShootingStar());
    }

    this.shootingStars = this.shootingStars.filter(ss => {
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.opacity -= 0.01;

      if (ss.opacity <= 0) return false;

      // Draw trail
      this.ctx.beginPath();
      this.ctx.moveTo(ss.x, ss.y);
      this.ctx.lineTo(
        ss.x - Math.cos(ss.angle) * ss.length,
        ss.y - Math.sin(ss.angle) * ss.length
      );
      
      const gradient = this.ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - Math.cos(ss.angle) * ss.length,
        ss.y - Math.sin(ss.angle) * ss.length
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
      gradient.addColorStop(1, 'transparent');

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Bright head
      this.ctx.beginPath();
      this.ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
      this.ctx.fill();

      return ss.x < this.canvas.width + 100 && ss.y < this.canvas.height + 100;
    });
  }

  draw() {
    this.drawBackground();
    this.drawNebulae();
    this.drawStars();
    this.drawShootingStars();
  }

  start() {
    this.isRunning = true;
    const render = () => {
      if (!this.isRunning) return;
      this.draw();
      this.animationFrameId = requestAnimationFrame(render);
    };
    render();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  // Transition from matrix to space
  fadeIn(duration = 2000) {
    this.canvas.style.transition = `opacity ${duration}ms ease`;
    this.canvas.style.opacity = '0';
    
    setTimeout(() => {
      this.canvas.style.opacity = '1';
    }, 50);
  }
}

// Global instance
let spaceEffect = null;
