export class MyApp {
  now = new Date();
  private timer = 0;

  attached() {
    this.timer = window.setInterval(() => (this.now = new Date()), 10);
  }

  detaching() {
    window.clearInterval(this.timer);
  }

  get time() {
    const pad = (n: number, size = 2) => String(n).padStart(size, '0');
    const d = this.now;
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
  }
}
