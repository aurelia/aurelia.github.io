interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

const WIDTH = 500;
const HEIGHT = 300;

export class MyApp {
  count = 100;
  particles: Particle[] = [];
  private frame = 0;

  attached() {
    this.reset();
    const tick = () => {
      this.move();
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  detaching() {
    cancelAnimationFrame(this.frame);
  }

  reset() {
    this.particles = Array.from({ length: this.count }, () => ({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 5 + 2,
    }));
  }

  move() {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x > WIDTH || p.x < 0) p.vx *= -1;
      if (p.y > HEIGHT || p.y < 0) p.vy *= -1;
    }
  }
}
