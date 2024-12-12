import { customElement } from 'aurelia';

@customElement('real-time-clock')
export class RealTimeClock {
  time: string = '00:00:00.000';
  
  private intervalId = null;

  attached() {
      this.updateTime();
      this.intervalId = setInterval(() => {
        this.updateTime()
      }, 10);
  }

  detached() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      this.time = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }
}