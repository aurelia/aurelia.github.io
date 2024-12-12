import { customElement, bindable } from 'aurelia';

@customElement('reactive-grid')
export class ReactiveGrid {
  @bindable rows: number = 10;
  @bindable cols: number = 10;
  gridData: number[][] = [];
  fps: number = 0;

  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;

  attached() {
    this.initGrid();
    this.startAnimation();
  }

  detached() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private initGrid() {
    this.gridData = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => Math.floor(Math.random() * 100))
    );
  }

  private updateGridValues() {
    this.gridData = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => Math.floor(Math.random() * 100))
    );
  }

  startAnimation() {
    const update = (timestamp: number) => {
      if (this.lastFrameTime) {
        const delta = timestamp - this.lastFrameTime;
        this.fps = Math.round(1000 / delta);
      }
      this.lastFrameTime = timestamp;

      this.updateGridValues();

      this.animationFrameId = requestAnimationFrame(update);
    };

    this.animationFrameId = requestAnimationFrame(update);
  }
}
