const ROUND_SECONDS = 30;

export class MyApp {
  holes = Array.from({ length: 9 }, (_, index) => ({ index, up: false }));
  score = 0;
  best = 0;
  timeLeft = ROUND_SECONDS;
  playing = false;

  private popTimer = 0;
  private clockTimer = 0;

  start() {
    this.score = 0;
    this.timeLeft = ROUND_SECONDS;
    this.playing = true;
    this.clockTimer = window.setInterval(() => {
      if (--this.timeLeft <= 0) this.stop();
    }, 1000);
    this.pop();
  }

  stop() {
    this.playing = false;
    window.clearInterval(this.clockTimer);
    window.clearTimeout(this.popTimer);
    this.holes.forEach(hole => (hole.up = false));
    this.best = Math.max(this.best, this.score);
  }

  pop() {
    if (!this.playing) return;
    this.holes.forEach(hole => (hole.up = false));
    const hole = this.holes[Math.floor(Math.random() * this.holes.length)];
    hole.up = true;
    this.popTimer = window.setTimeout(() => this.pop(), 500 + Math.random() * 600);
  }

  whack(hole: { up: boolean }) {
    if (!hole.up) return;
    hole.up = false;
    this.score++;
  }

  detaching() {
    this.stop();
  }
}
