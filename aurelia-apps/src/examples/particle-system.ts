import { customElement, bindable } from 'aurelia';

@customElement('particle-system')
export class ParticleSystem {
  @bindable numParticles = 100;
  particles: { x: number, y: number, vx: number, vy: number, size: number }[] = [];

    private animationFrameId: number | null = null;

    attached(){
        this.initializeParticles();
        this.startAnimation();
    }

    detached() {
      if(this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
          this.animationFrameId = null;
      }
    }

  initializeParticles() {
    this.particles = Array.from({ length: this.numParticles }, () => ({
      x: Math.random() * 500,
      y: Math.random() * 300,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 5 + 2,
    }));
  }
  startAnimation() {
     const update = () => {
         this.updateParticles();
          this.animationFrameId = requestAnimationFrame(update);
    };
       this.animationFrameId = requestAnimationFrame(update)
  }

  updateParticles() {
      this.particles.forEach(p => {
       p.x += p.vx;
        p.y += p.vy;
      
        if (p.x > 500 || p.x < 0) p.vx *= -1;
        if (p.y > 300 || p.y < 0) p.vy *= -1;
      });
  }
}